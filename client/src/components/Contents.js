import { useState, useEffect } from "react";
import { ResponsiveLine  } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveCalendar } from '@nivo/calendar'
import axios from "axios";

//* 1. 확진자 수 추이 캘린더
//* 2. 확진자 수, 격리해제 수, 검사진행 수, 사망자 수, 치료진행 수 비교표
//* 3. 

const confirmedTheme = {
    fontFamily: "BMHANNAPro",
    fontSize: 10,
    textColor: "#a61e4d",
};

const confirmedOption = (start, end) => {
    return {
        from: start,
        to: end,
        emptyColor: "#eeeeee",
        colors: [ "#ffa8a8", "#ff8787", "#ff6b6b", "#fa5252", "#f03e3e", "#e03131", "#c92a2a" ],
        margin: { top: 40, right: 40, bottom: 40, left: 40 },
        yearSpacing: 40,
        monthBorderColor: "#ffffff",
        dayBorderWidth: 2,
        dayBorderColor: "#ffffff",
        legends: [
            {
                anchor: 'bottom-right',
                direction: 'row',
                translateY: 36,
                itemCount: 4,
                itemWidth: 42,
                itemHeight: 36,
                itemsSpacing: 14,
                itemDirection: 'right-to-left'
            }
        ]
    }
};

const comparedTheme = {
    fontFamily: "BMHANNAPro",
    fontSize: 13,
}

const comparedOptions = {
    margin: { top: 40, right: 80, bottom: 80, left: 80 },
    innerRadius: 0.5,
    padAngle: 0.7,
    cornerRadius: 3,
    activeOuterRadiusOffset: 8,
    borderWidth: 1,
    borderColor: { from: 'color', modifiers: [ [ 'darker', 0.2 ] ] },
    arcLinkLabelsSkipAngle: 10,
    arcLinkLabelsTextColor: { from: 'color' },
    arcLinkLabelsThickness: 2,
    arcLinkLabelsColor: { from: 'color' },
    arcLabelsSkipAngle: 10,
    arcLabelsTextColor: { from: 'color', modifiers: [ [ 'darker', 2 ] ] },
    defs: [
        {
            id: 'lines',
            type: 'patternLines',
            background: 'inherit',
            color: 'rgba(255, 255, 255, 0.3)',
            rotation: -45,
            lineWidth: 6,
            spacing: 10
        }
    ],
    fill: [
        {
            match: {
                id: "확진자"
            },
            id: 'lines',
        },
        {
            match: {
                id: "격리 해제자"
            },
            id: 'lines'
        },
        {
            match: {
                id: "검사 진행자"
            },
            id: 'lines'
        },
        {
            match: {
                id: "사망자"
            },
            id: 'lines'
        },
        {
            match: {
                id: "치료 진행자"
            },
            id: 'lines'
        },
    ],
};

//~ decideCnt: 확진자 수
//~ clearCnt: 격리해제 수
//~ examCnt: 검사진행 수
//~ deathCnt: 사망자 수
//~ careCnt: 치료 중 환자 수
const Contents = () => {
    const [checkStartDate, setCheckStartDate] = useState("");
    const [checkEndDate, setCheckEndDate] = useState("");
    const [confirmedData, setConfirmedData] = useState({});
    const [comparedData, setComparedData] = useState({});

    useEffect(() => {
        const fetchEvents = async () => {
            const response = await axios.get("/api/covid");
            const response_data = (response.data.items).item.sort((a, b) => a.stateDt - b.stateDt);
            createDataForm(response_data);
        };

        const createDataForm = items => {
            const setDataForm1 = items.reduce((acc, cur) => {
                const createDate = new Date(cur.createDt);
                const formDate = `${createDate.getFullYear()}-${(createDate.getMonth() + 1).toString().padStart(2, "0")}`;
                const decideCount = cur.decideCnt;
                const clearCount = cur.clearCnt;
                const examCount = cur.examCnt;
                const deathCount = cur.deathCnt;
                const careCount = cur.careCnt;
                const findItem = acc.find(el => el.formDate === formDate);
            
                if (!findItem) {
                    acc.push({ formDate, decideCount, clearCount, examCount, deathCount, careCount });
                } else {
                    findItem.formDate = formDate;
                    findItem.decideCount = decideCount;
                    findItem.clearCount = clearCount;
                    findItem.examCount = examCount;
                    findItem.deathCount = deathCount;
                    findItem.careCount = careCount;
                }
            
                return acc;
            }, []);

            const setDataForm2 = items.reduce((acc, cur) => {
                const createDate = new Date(cur.createDt);
                const formDate = `${createDate.getFullYear()}-${(createDate.getMonth() + 1).toString().padStart(2, "0")}-${(createDate.getDate()).toString().padStart(2, "0")}`;
                const decideCount = cur.decideCnt;
                const findItem = acc.find(el => el.formDate === formDate);

                if (!findItem) {
                    acc.push({ formDate, decideCount });
                } else {
                    findItem.formDate = formDate;
                    findItem.decideCount += decideCount;
                }

                return acc;
            }, []);

            const totDecideCount = setDataForm1.map(val => val.decideCount).filter(val => val !== undefined).reduce((a, b) => a + b);
            const totClearCount = setDataForm1.map(val => val.clearCount).filter(val => val !== undefined).reduce((a, b) => a + b);
            const totExamCount = setDataForm1.map(val => val.examCount).filter(val => val !== undefined).reduce((a, b) => a + b);
            const totDeathCount = setDataForm1.map(val => val.deathCount).filter(val => val !== undefined).reduce((a, b) => a + b);
            const totCareCount = setDataForm1.map(val => val.careCount).filter(val => val !== undefined).reduce((a, b) => a + b);

            setConfirmedData(
                setDataForm2.map(el => {
                    return {
                        day: el.formDate,
                        value: el.decideCount,
                    }
                })
            )

            setComparedData([
                {
                    id: "확진자",
                    label: "확진자",
                    value: totDecideCount,
                },
                {
                    id: "격리 해제자",
                    label: "격리 해제자",
                    value: totClearCount,
                },
                {
                    id: "검사 진행자",
                    label: "검사 진행자",
                    value: totExamCount,
                },
                {
                    id: "사망자",
                    label: "사망자",
                    value: totDeathCount,
                }
                ,{
                    id: "치료 진행자",
                    label: "치료 진행자",
                    value: totCareCount,
                }
            ])
        }

        fetchEvents();

        const startDate = "2020-02-01";
        const now = new Date();
        const endDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;

        setCheckStartDate(startDate);
        setCheckEndDate(endDate);
    }, [])

    return (
        <div className="App-contents">
            <h2>국내 코로나 현황</h2>
            <div className="App-chart">
                <div className="App-chart-confirmed">
                    {
                        Object.keys(confirmedData).length !== 0 ?
                            <ResponsiveCalendar
                                data={confirmedData}
                                theme={confirmedTheme}
                                {...confirmedOption(checkStartDate, checkEndDate)}
                            />
                        :
                            <div>Loading...</div>
                    }
                </div>
                <div className="App-chart-compared">
                    {
                        Object.keys(comparedData).length !== 0 ?
                            <ResponsivePie
                                data={comparedData}
                                theme={comparedTheme}
                                {...comparedOptions}                                
                            />
                        :
                            <div>Loading...</div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Contents;