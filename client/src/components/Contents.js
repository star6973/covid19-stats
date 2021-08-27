import { useState, useEffect } from "react";
import { ResponsiveLine  } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";
import axios from "axios";

const confirmedTheme = {
    fontFamily: "BMHANNAPro",
    fontSize: 6,
    textColor: "salmon",
    labelTextColor: "salmon",
    curve: "linear",
    scheme: "nivo",
};

const confirmedOption = {
    margin: { top: 50, right: 80, bottom: 50, left: 60 },
    xScale: { type: 'point' },
    yScale: { type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false },
    yFormat: " >-.2f",
    axisBottom: {
        legend: 'Confirmed',
        legendOffset: 36,
        legendPosition: 'middle'
    },
    axisLeft: {
        legend: 'Count',
        legendOffset: -45,
        legendPosition: 'middle'
    },
    pointSize: 8,
    pointBorderWidth: 2,
    pointBorderColor: { from: 'serieColor' },
    pointLabelYOffset: -12,
    useMesh: true,
}

const quarantinedOptions = {
    title: { display: true, text: "월별 격리자 현황", fontSize: 16 },
    legend: { display: true, position: "bottom" },
};

const comparedOptions = {
    title: { display: true, text: `누적 확진, 해제, 사망 (${new Date().getMonth() + 1}월)`, fontSize: 16 },
    legend: { display: true, position: "bottom" },
};

const Contents = () => {
    const [confirmedData, setConfirmedData] = useState({});

    useEffect(() => {
        const fetchEvents = async () => {
            const response = await axios.get("/api/covid");

            //* 1. 확진자 추이 그래프
            //* 2. 확진자 수, 격리해제 수, 검사진행 수, 사망자 수, 치료진행 수 정보표
            //* 3. 

            //~ decideCnt: 확진자 수
            //~ clearCnt: 격리해제 수
            //~ examCnt: 검사진행 수
            //~ deathCnt: 사망자 수
            //~ careCnt: 치료 중 환자 수
            
            const response_data = (response.data.items).item.sort((a, b) => a.stateDt - b.stateDt);
            console.log(response_data);
            createDataForm(response_data);
        };

        const createDataForm = items => {
            const dataList = items.reduce((acc, cur) => {
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
                }
            
                if (findItem) {
                    findItem.formDate = formDate;
                    findItem.decideCount = decideCount;
                    findItem.clearCount = clearCount;
                    findItem.examCount = examCount;
                    findItem.deathCount = deathCount;
                    findItem.careCount = careCount;
                }
            
                return acc;
            }, []);

            setConfirmedData([{
                "id": "Count",
                "data":
                    dataList.map((val, idx) => {
                        return {
                            "x": val.formDate,
                            "y": val.decideCount,
                        }
                    })
            }])

        }
        fetchEvents();

    }, [setConfirmedData])

    return (
        <div className="App-contents">
            <h2>국내 코로나 현황</h2>
            <div className="App-chart-confirmed">
                {
                    Object.keys(confirmedData).length !== 0 ?
                        <div>
                            <ResponsiveLine
                                data={confirmedData}
                                theme={confirmedTheme}
                                {...confirmedOption}
                            />
                            <ResponsivePie />
                        </div>
                    :
                        <div>Loading...</div>
                }
            </div>
        </div>
    )
}

export default Contents;