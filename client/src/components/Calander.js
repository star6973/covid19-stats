import { useState, useEffect } from "react";
import { ResponsiveCalendar } from "@nivo/calendar"
import axios from "axios";

const calanderTheme = {
    fontFamily: "BMHANNAPro",
    fontSize: 10,
    textColor: "black",
};

const calanderOption = (start, end) => {
    return {
        from: start,
        to: end,
        emptyColor: "#eeeeee",
        colors: [ "#ffa8a8", "#ff8787", "#ff6b6b", "#fa5252", "#f03e3e", "#e03131", "#c92a2a" ],
        margin: { top: 0, right: 40, bottom: 40, left: 40 },
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
const Calendar = () => {
    const [checkStartDate, setCheckStartDate] = useState("");
    const [checkEndDate, setCheckEndDate] = useState("");
    const [confirmedData, setConfirmedData] = useState({});

    useEffect(() => {
        const fetchURL = async () => {
            let response = await axios.get("/covid19/korea-info");
            response = (response.data.items).item.sort((a, b) => a.stateDt - b.stateDt);
            createDataForm(response);
        };

        const createDataForm = items => {
            const dataForm = items.reduce((acc, cur) => {
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

            setConfirmedData(
                dataForm.map(el => {
                    return {
                        day: el.formDate,
                        value: el.decideCount,
                    }
                })
            )

        }

        fetchURL();

        const startDate = "2020-02-01";
        const now = new Date();
        const endDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;

        setCheckStartDate(startDate);
        setCheckEndDate(endDate);
    }, [])

    return (
        <>
            {
                Object.keys(confirmedData).length !== 0 ?
                    <div className="App-chart-calander">
                        <p>국내 코로나 현황</p>
                        <ResponsiveCalendar
                            data={confirmedData}
                            theme={calanderTheme}
                            {...calanderOption(checkStartDate, checkEndDate)}
                        />
                    </div>
                :
                    <div>Loading...</div>
            }
        </>
    )
};

export default Calendar;