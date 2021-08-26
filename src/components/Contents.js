import { useState, useEffect } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import Axios from 'axios';

const confirmedOptions = {
    title: { display: true, text: "누적 확진자 추이", fontSize: 16 },
    legend: { display: true, position: "bottom" },
};

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
    const [quarantinedData, setQuarantinedData] = useState({});
    const [comparedData, setComparedData] = useState({});

    useEffect(() => {
        const fetchEvents = async () => {
            const authKey = "e7QkPUk1he6L9GLScg5wEP8iyZ3zMORh%2FTx46J3PWMEz8rxfx6If%2FWoO7IJ398v0SJsk2krxkh0lm0B4Ks0ayw%3D%3D";
            const res = await Axios.get("https://api.covid19api.com/total/dayone/country/kr");
            const response = await Axios.get("/api/openapi/service/rest/Covid19/getCovid19InfStateJson", {
                params: {
                    "serviceKey": authKey,
                    "numOfRows": 10,
                    "pageNo": 1,
                    "startCreateDt": "20200201",
                    "endCreateDt": "20210826",
                }
            });

            console.log(response);


            makeData(res.data);
        };
        const makeData = (items) => {
            const dataList = items.reduce((acc, cur) => {
                const nowDate = new Date(cur.Date);
                const year = nowDate.getFullYear();
                const month = nowDate.getMonth() + 1;
                const date = nowDate.getDate();
                const confirmed = cur.Confirmed;
                const active = cur.Active;
                const deaths = cur.Deaths;
                const recovered = cur.Recovered;

                const findItem = acc.find(el => el.year === year && el.month === month);
                if (!findItem) {
                    acc.push({ year, month, date, confirmed, active, deaths, recovered });
                }
                if (findItem && findItem.date < date) {
                    findItem.year = year;
                    findItem.month = month;
                    findItem.date = date;
                    findItem.confirmed = confirmed;
                    findItem.active = active;
                    findItem.deaths = deaths;
                    findItem.recovered = recovered;
                }
                return acc;
            }, []);

            setConfirmedData({                
                labels: dataList.map(el => `${el.month}월`),
                datasets: [
                    {
                        label: "국내 누적 확진자",
                        backgroundColor: "salmon",
                        fill: true,
                        data: dataList.map(el => el.confirmed)
                    }
                ]
            })

            setQuarantinedData({
                labels: dataList.map(el => `${el.month}월`),
                datasets: [
                    {
                        label: "월별 격리자 현황",
                        borderColor: "salmon",
                        fill: false,
                        data: dataList.map(el => el.active)
                    }
                ]
            })

            const lastData = dataList[dataList.length - 1];
            setComparedData({
                labels: ["확진", "해제", "사망"],
                datasets: [
                    {
                        label: "누적 확진, 해제, 사망",
                        backgroundColor: ["#ff3d67", "#058bff", "#ffc233"],
                        borderColor: ["#ff3d67", "#058bff", "#ffc233"],
                        fill: false,
                        data: [lastData.confirmed, lastData.recovered, lastData.deaths]
                    }
                ]
            })
        }

        fetchEvents();
    }, [])

    return (
        <section>
            <h2>국내 코로나 현황</h2>
            <div className="App-contents">
                <div>
                    <Bar data={confirmedData} options={confirmedOptions} />
                </div>
                <div>
                    <Line data={quarantinedData} options={quarantinedOptions} />
                </div>
                <div>
                    <Doughnut data={comparedData} options={comparedOptions} />
                </div>
            </div>
        </section>
    )
}

export default Contents;