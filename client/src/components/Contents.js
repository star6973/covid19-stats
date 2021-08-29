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

//~ 국내발생 현황
//~ decideCnt: 확진자 수
//~ clearCnt: 격리해제 수
//~ examCnt: 검사진행 수
//~ deathCnt: 사망자 수
//~ careCnt: 치료 중 환자 수


//! 해외발생 현황
//! areaNm: 지역명(한글)
//! areaNmEn: 지역명(영문)
//! natDeathCnt: 국가별 사망자 수
//! natDeathRate: 확진률 대비 사망률
//! natDefCnt: 국가별 확진자 수
//! nationNm: 국가명(한글)
//! nationNmEn: 국가명(영문)
//! seq: 게시글 번호(고윳값)


//? gubun: 시도명(한글)
//? gubunEn: 시도명(영어)
//? incDec: 전일대비 증감수
//? deathCnt: 사망자 수
//? defCnt: 확진자 수
//? isolClearCnt: 격리해제수
//? isolIngCnt: 격리중 환자수
//? localOccCnt: 지역발생수
//? overFlowCnt: 해외유입수
//? qurRate: 10만명당 발생률
//? seq: 고윳값


//& confCase: 확진자
//& confCaseRate: 확진률
//& criticalRate: 치명률
//& death: 사망자
//& deathRate: 사망률
//& gubun: 구분(성별, 연령별) -> 8/21일 날짜에 대해 남성/여성/0-9/10-19/.../80이상
//& seq: 고윳값


//^ content: 내용
//^ contentHtml: html 내용
//^ countryEnName: 국가명(영문)
//^ countryName: 국가명(한글)
//^ fileUrl: 첨부파일 경로
//^ id: 교윳값
//^ title: 제목
//^ wrDt: 작성일

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

            const response2 = await axios.get("/api/covid2");
            console.log(response2);

            const response3 = await axios.get("/api/covid3");
            console.log(response3);

            const response4 = await axios.get("/api/covid4");
            console.log(response4);

            const response5 = await axios.get("/api/covid5");
            console.log(response5);
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