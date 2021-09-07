import { useState, useEffect } from 'react';
import { ResponsiveBump } from '@nivo/bump';
import { ResponsivePie } from '@nivo/pie';
import axios from 'axios';
import './Bump.scss';

const bumpTheme = {
    fontFamily: 'BMHANNAPro',
    fontSize: 10,
    textColor: 'black',
};
const bumpOption = {
    margin: { top: 40, right: 100, bottom: 150, left: 60 },
    colors: { scheme: 'dark2' },
    lineWidth: 3,
    activeLineWidth: 6,
    inactiveLineWidth: 3,
    inactiveOpacity: 0.15,
    pointSize: 3,
    activePointSize: 6,
    inactivePointSize: 0,
    pointColor: { theme: 'background' },
    pointBorderWidth: 3,
    activePointBorderWidth: 3,
    pointBorderColor: { from: 'serie.color' },
    enableGridY: false,
    axisTop: null,
    axisRight: null,
    axisLeft: null,
    axisBottom: {
        tickSize: 5,
        tickPadding: 55,
        tickRotation: 270,
        legend: '',
        legendPosition: 'middle',
        legendOffset: 32,
    },
};

const pieTheme = {
    fontFamily: 'BMHANNAPro',
    fontSize: 15,
    textColor: 'black',
};
const pieOption = {
    margin: { top: 40, right: 80, bottom: 150, left: 80 },
    innerRadius: 0.5,
    padAngle: 0.7,
    colors: { scheme: 'set3' },
    cornerRadius: 3,
    activeOuterRadiusOffset: 8,
    borderWidth: 1,
    borderColor: { from: 'color', modifiers: [['darker', 0.2]] },
    enableArcLinkLabels: false,
    arcLabelsSkipAngle: 10,
    arcLabelsTextColor: { from: 'color', modifiers: [['darker', 2]] },
    legends: [
        {
            anchor: 'bottom',
            direction: 'row',
            justify: false,
            translateX: 30,
            translateY: 56,
            itemsSpacing: 0,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: '#999',
            itemDirection: 'left-to-right',
            itemOpacity: 1,
            symbolSize: 18,
            symbolShape: 'circle',
            effects: [
                {
                    on: 'hover',
                    style: {
                        itemTextColor: '#000',
                    },
                },
            ],
        },
    ],
};

const Bump = () => {
    const [ageConfData, setAgeConfData] = useState({});
    const [ageCriticalData, setAgeCriticalData] = useState({});
    const [ageDeathData, setAgeDeathData] = useState({});
    const [genderConfData, setGenderConfData] = useState({});
    const [genderCriticalData, setGenderCriticalData] = useState({});
    const [genderDeathData, setGenderDeathData] = useState({});

    useEffect(() => {
        const fetchURL = async () => {
            let response = await axios.get('/covid19/age-gender-info');
            response = response.data.items.item.sort(
                (a, b) => new Date(a.createDt) - new Date(b.createDt),
            );
            createDataForm(response);
        };

        const createDataForm = (items) => {
            const dataForm = items.reduce((acc, cur) => {
                const createDate = new Date(cur.createDt);
                const formDate = `${createDate.getFullYear()}-${(
                    createDate.getMonth() + 1
                )
                    .toString()
                    .padStart(2, '0')}`;
                const gubun = cur.gubun;
                const confRate = cur.confCaseRate;
                const criticalRate = cur.criticalRate;
                const deathRate = cur.deathRate;
                const findItem = acc.find(
                    (el) => el.formDate === formDate && el.gubun === gubun,
                );

                if (!findItem) {
                    acc.push({
                        formDate,
                        gubun,
                        confRate,
                        criticalRate,
                        deathRate,
                    });
                } else {
                    findItem.formDate = formDate;
                    findItem.gubun = gubun;
                    findItem.confRate = confRate;
                    findItem.criticalRate = criticalRate;
                    findItem.deathRate = deathRate;
                }

                return acc;
            }, []);

            let refineAgeData = dataForm.filter(
                (val) => val.gubun !== '여성' && val.gubun !== '남성',
            );
            let refineGenderData = dataForm.filter(
                (val) => (val.gubun === '여성') | (val.gubun === '남성'),
            );

            //! 연령별 확진률, 치명률, 사망률 그래프
            const ageList = [
                '0-9',
                '10-19',
                '20-29',
                '30-39',
                '40-49',
                '50-59',
                '60-69',
                '70-79',
                '80 이상',
            ];
            const refineAgeConfirmedData = ageList
                .map((item) => refineAgeData.filter((el) => item === el.gubun))
                .map((data) => {
                    let temp = [];
                    for (let i = 0; i < data.length; i++) {
                        let x = data[i].formDate;
                        let y = data[i].confRate;

                        temp.push({ x, y });
                    }
                    let bumpForm = {
                        id: data[0].gubun,
                        data: temp,
                    };

                    return bumpForm;
                });

            const refineAgeCriticaldData = ageList
                .map((item) => refineAgeData.filter((el) => item === el.gubun))
                .map((data) => {
                    let temp = [];
                    for (let i = 0; i < data.length; i++) {
                        let x = data[i].formDate;
                        let y = data[i].criticalRate;

                        temp.push({ x, y });
                    }
                    let bumpForm = {
                        id: data[0].gubun,
                        data: temp,
                    };

                    return bumpForm;
                });

            const refineAgeDeathData = ageList
                .map((item) => refineAgeData.filter((el) => item === el.gubun))
                .map((data) => {
                    let temp = [];
                    for (let i = 0; i < data.length; i++) {
                        let x = data[i].formDate;
                        let y = data[i].deathRate;

                        temp.push({ x, y });
                    }
                    let bumpForm = {
                        id: data[0].gubun,
                        data: temp,
                    };

                    return bumpForm;
                });

            setAgeConfData(refineAgeConfirmedData);
            setAgeCriticalData(refineAgeCriticaldData);
            setAgeDeathData(refineAgeDeathData);

            //~ 성별 확진률, 치명률, 사망률 그래프
            const manConfirmedData = refineGenderData
                .filter((el) => el.gubun === '남성')
                .pop();
            const womanConfirmedData = refineGenderData
                .filter((el) => el.gubun === '여성')
                .pop();

            setGenderConfData([
                {
                    id: '남성',
                    label: '남성',
                    value: manConfirmedData.confRate,
                },
                {
                    id: '여성',
                    label: '여성',
                    value: womanConfirmedData.confRate,
                },
            ]);
            setGenderCriticalData([
                {
                    id: '남성',
                    label: '남성',
                    value: manConfirmedData.criticalRate,
                },
                {
                    id: '여성',
                    label: '여성',
                    value: womanConfirmedData.criticalRate,
                },
            ]);
            setGenderDeathData([
                {
                    id: '남성',
                    label: '남성',
                    value: manConfirmedData.deathRate,
                },
                {
                    id: '여성',
                    label: '여성',
                    value: womanConfirmedData.deathRate,
                },
            ]);
        };

        fetchURL();
    }, []);

    return (
        <div className="App-Bump">
            {Object.keys(ageConfData).length !== 0 &&
            Object.keys(ageCriticalData).length !== 0 &&
            Object.keys(ageDeathData).length !== 0 ? (
                <div className="App-Bump-container">
                    <div className="App-chart-bump">
                        <div className="bump-conf">
                            <p>연령별 확진률</p>
                            <ResponsiveBump
                                data={ageConfData}
                                theme={bumpTheme}
                                {...bumpOption}
                            />
                        </div>
                        <div className="bump-critical">
                            <p>연령별 치명률</p>
                            <ResponsiveBump
                                data={ageCriticalData}
                                theme={bumpTheme}
                                {...bumpOption}
                            />
                        </div>
                        <div className="bump-death">
                            <p>연령별 사망률</p>
                            <ResponsiveBump
                                data={ageDeathData}
                                theme={bumpTheme}
                                {...bumpOption}
                            />
                        </div>
                    </div>
                    <div className="App-chart-pie">
                        <div className="pie-conf">
                            <p>성별 확진률</p>
                            <ResponsivePie
                                data={genderConfData}
                                theme={pieTheme}
                                {...pieOption}
                            />
                        </div>
                        <div className="pie-critical">
                            <p>성별 치명률</p>
                            <ResponsivePie
                                data={genderCriticalData}
                                theme={pieTheme}
                                {...pieOption}
                            />
                        </div>
                        <div className="pie-death">
                            <p>성별 사망률</p>
                            <ResponsivePie
                                data={genderDeathData}
                                theme={pieTheme}
                                {...pieOption}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
};

export default Bump;
