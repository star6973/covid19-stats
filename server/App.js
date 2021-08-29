const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = 5000
const url = "http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19InfStateJson";
const authKey = "e7QkPUk1he6L9GLScg5wEP8iyZ3zMORh/Tx46J3PWMEz8rxfx6If/WoO7IJ398v0SJsk2krxkh0lm0B4Ks0ayw==";

const url2 = "http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19NatInfStateJson";
const authKey2 = "e7QkPUk1he6L9GLScg5wEP8iyZ3zMORh/Tx46J3PWMEz8rxfx6If/WoO7IJ398v0SJsk2krxkh0lm0B4Ks0ayw==";

const startDate = "20200201";
const now = new Date();
const endDate = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}`

app.use(cors());
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})

app.get("/", (req, res) => {
    res.json("Express 서버 대기 중...")
})

//* 국내 발생 현황
app.get("/api/covid", async (req, res) => {
    await axios.get(url, {
        params: {
            serviceKey: encodeURI(authKey),
            numOfRows: 10,
            pageNo: 1,
            startCreateDt: startDate,
            endCreateDt: endDate,
        }
    }).then(response => {
        console.log(response.status);
        res.json(response.data.response.body);
    }).catch(error => {
        console.log(error);
        res.json({});
    })    
});

//* 해외 발생 현황
app.get("/api/covid2", async (req, res) => {
    await axios.get(url2, {
        params: {
            serviceKey: encodeURI(authKey2),
            numOfRows: 10,
            pageNo: 1,
            startCreateDt: startDate,
            endCreateDt: endDate,
        }
    }).then(response => {
        console.log(response.status);
        res.json(response.data.response.body);
    }).catch(error => {
        console.log(error);
        res.json({});
    })
})

//* 시도발생 현황
const url3 = "http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19SidoInfStateJson";
const authKey3 = "e7QkPUk1he6L9GLScg5wEP8iyZ3zMORh/Tx46J3PWMEz8rxfx6If/WoO7IJ398v0SJsk2krxkh0lm0B4Ks0ayw==";
app.get("/api/covid3", async (req, res) => {
    await axios.get(url3, {
        params: {
            serviceKey: encodeURI(authKey3),
            numOfRows: 10,
            pageNo: 1,
            startCreateDt: startDate,
            endCreateDt: endDate,
        }
    }).then(response => {
        console.log(response.status);
        res.json(response.data.response.body);
    }).catch(error => {
        console.log(error);
        res.json({});
    })
})

//* 연령별, 성별 감염 현황
const url4 = "http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19GenAgeCaseInfJson";
const authKey4 = "e7QkPUk1he6L9GLScg5wEP8iyZ3zMORh/Tx46J3PWMEz8rxfx6If/WoO7IJ398v0SJsk2krxkh0lm0B4Ks0ayw==";
app.get("/api/covid4", async (req, res) => {
    await axios.get(url4, {
        params: {
            serviceKey: encodeURI(authKey4),
            numOfRows: 10,
            pageNo: 1,
            startCreateDt: startDate,
            endCreateDt: endDate,
        }
    }).then(response => {
        console.log(response.status);
        res.json(response.data.response.body);
    }).catch(error => {
        console.log(error);
        res.json({});
    })
})

//* 외교부 코로나 최신 안전 소식
const url5 = "http://apis.data.go.kr/1262000/SafetyNewsList/getCountrySafetyNewsList";
const authKey5 = "e7QkPUk1he6L9GLScg5wEP8iyZ3zMORh/Tx46J3PWMEz8rxfx6If/WoO7IJ398v0SJsk2krxkh0lm0B4Ks0ayw==";
app.get("/api/covid5", async (req, res) => {
    await axios.get(url5, {
        params: {
            serviceKey: encodeURI(authKey5),
            numOfRows: 10,
            pageNo: 1,
            title1: "입국",
            title2: "격리",
            title3: "코로나",
        }
    }).then(response => {
        console.log(response.status);
        res.json(response.data.response.body);
    }).catch(error => {
        console.log(error);
        res.json({});
    })
})