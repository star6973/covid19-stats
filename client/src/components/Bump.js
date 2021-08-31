import { useState, useEffect } from "react";
import { ResponsiveBump } from "@nivo/bump";
import axios from "axios";


//& SwarmPlot
//& confCaseRate: 확진률
//& criticalRate: 치명률
//& deathRate: 사망률
//& gubun: 구분(성별, 연령별) -> 8/21일 날짜에 대해 남성/여성/0-9/10-19/.../80이상

const Bump = () => {
    const [ageConfData, setAgeConfData] = useState({});
    const [ageCriticalData, setAgeCriticalData] = useState({});
    const [ageDeathData, setAgeDeathData] = useState({});

    const [genderData, setGenderData] = useState({});

    useEffect(() => {

        const fetchURL = async () => {
            let response = await axios.get("/covid19/age-gender-info");
            response = (response.data.items).item.sort((a, b) => new Date(a.createDt) - new Date(b.createDt));

            createDataForm(response);
        };

        const createDataForm = items => {
            const dataForm = items.reduce((acc, cur) => {
                const createDate = new Date(cur.createDt);
                const formDate = `${createDate.getFullYear()}-${(createDate.getMonth() + 1).toString().padStart(2, "0")}`;
                const gubun = cur.gubun;
                const confRate = cur.confCaseRate;
                const criticalRate = cur.criticalRate;
                const deathRate = cur.deathRate;
                const findItem = acc.find(el => el.formDate === formDate && el.gubun === gubun);
            
                if (!findItem) {
                    acc.push({ formDate, gubun, confRate, criticalRate, deathRate });
                } else {
                    findItem.formDate = formDate;
                    findItem.gubun = gubun;
                    findItem.confRate = confRate;
                    findItem.criticalRate = criticalRate;
                    findItem.deathRate = deathRate;
                }
            
                return acc;
            }, []);


            const refineAgeData = dataForm.filter(val => (val.gubun !== "여성" && val.gubun !== "남성"));
            const refineGenderData = dataForm.filter(val => (val.gubun === "여성" | val.gubun === "남성"));

            console.log(refineAgeData);
            console.log(refineGenderData);

            setAgeConfData(
                refineAgeData.
            )
            
        };


        fetchURL();
    }, []);

    return (
        <>
            {
                Object.keys(ageConfData).length !== 0 && Object.keys(ageCriticalData).length !== 0 && Object.keys(ageDeathData).length !== 0 ?
                    <div className="App-chart-bar">
                        <ResponsiveBump
                            data={ageConfData}
                        />
                    </div>
                :
                    <div>Loading...</div>
            }
        </>
    )
};

export default Bump;