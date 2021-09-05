import { useState, useEffect } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import axios from 'axios';

const barTheme = {
    fontFamily: 'BMHANNAPro',
    fontSize: 13,
    textColor: '#a61e4d',
};

const barOption = {
    keys: ['확진자수', '사망자수', '격리해제수', '격리진행수'],
    indexBy: 'area',
    margin: { top: 0, right: 130, bottom: 150, left: 100 },
    padding: 0.3,
    valueScale: { type: 'linear' },
    indexScale: { type: 'band', round: true },
    valueFormat: { format: '', enabled: false },
    colors: { scheme: 'pastel2' },
    borderColor: { from: 'color', modifiers: [['darker', 1.6]] },
    axisBottom: {
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: '행정구역',
        legendPosition: 'middle',
        legendOffset: 42,
    },
    axisLeft: {
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: '현황',
        legendPosition: 'middle',
        legendOffset: -70,
    },
    labelSkipHeight: 10,
    labelTextColor: { from: 'color', modifiers: [['darker', 1.6]] },
    legends: [
        {
            dataFrom: 'keys',
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: 'left-to-right',
            itemOpacity: 0.85,
            symbolSize: 20,
            effects: [
                {
                    on: 'hover',
                    style: {
                        itemOpacity: 1,
                    },
                },
            ],
        },
    ],
};

const Bar = () => {
    const [provinceData, setProvinceData] = useState({});

    useEffect(() => {
        const fetchURL = async () => {
            let response = await axios.get('/covid19/province-info');
            response = response.data.items.item.sort(
                (a, b) => new Date(a.createDt) - new Date(b.createDt),
            );

            createDataForm(response);
        };

        const createDataForm = (items) => {
            const areaName = [
                '서울',
                '경기',
                '경남',
                '경북',
                '전남',
                '전북',
                '충남',
                '충북',
                '강원',
                '세종',
                '울산',
                '대전',
                '광주',
                '인천',
                '대구',
                '부산',
                '제주',
            ];

            const dataForm = areaName.map((el) => {
                const lastData = items
                    .filter((item) => item.gubun === el)
                    .pop();
                return {
                    area: el,
                    확진자수: lastData.defCnt,
                    사망자수: lastData.deathCnt,
                    격리해제수: lastData.isolClearCnt,
                    격리진행수: lastData.isolIngCnt,
                };
            });

            setProvinceData(dataForm);
        };

        fetchURL();
    }, []);

    return (
        <>
            {Object.keys(provinceData).length !== 0 ? (
                <div className="App-chart-bar">
                    <p>국내 행정구역별 코로나 현황</p>
                    <ResponsiveBar
                        data={provinceData}
                        theme={barTheme}
                        {...barOption}
                    />
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </>
    );
};

export default Bar;
