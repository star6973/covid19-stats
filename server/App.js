const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = 5000
const url = "http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19InfStateJson";
const authKey = "e7QkPUk1he6L9GLScg5wEP8iyZ3zMORh/Tx46J3PWMEz8rxfx6If/WoO7IJ398v0SJsk2krxkh0lm0B4Ks0ayw==";

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