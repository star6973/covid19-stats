import { covid19ServiceKey } from "./key.js";
import express from "express";
import yaml from "yamljs";
import path from "path";
import axios from "axios";
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

const appRoot = path.join(path.resolve(), "./.");
const swaggerSpec = swaggerJSDoc({
    swaggerDefinition: yaml.load(path.join(appRoot, "swagger_api.yaml")),
    apis: [
        path.join(appRoot, "covid19_korea_info.yaml"),
        path.join(appRoot, "covid19_world_info.yaml"),
        path.join(appRoot, "covid19_province_info.yaml"),
        path.join(appRoot, "covid19_age_gender_info.yaml"),
        path.join(appRoot, "covid19_news_info.yaml")
    ]
})
const app = express();
const port = 5000

app.use(cors());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})

const startDate = "20200201";
const now = new Date();
const endDate = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}`
let yesterDate = new Date();
yesterDate.setDate(yesterDate.getDate() - 1);
yesterDate = `${yesterDate.getFullYear()}${(yesterDate.getMonth() + 1).toString().padStart(2, "0")}${yesterDate.getDate().toString().padStart(2, "0")}`

//* 국내 발생 현황
const covid19KoreaInfoURL = "http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19InfStateJson";
app.get("/covid19/korea-info", async (req, res) => {
    await axios.get(covid19KoreaInfoURL, {
        params: {
            serviceKey: encodeURI(covid19ServiceKey),
            numOfRows: 10,
            pageNo: 1,
            startCreateDt: startDate,
            endCreateDt: endDate,
        }
    }).then(response => {
        res.json(response.data.response.body);
    }).catch(error => {
        res.json({});
    })
});

//* 해외 발생 현황
const covid19WorldInfoURL = "http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19NatInfStateJson";
app.get("/covid19/world-info", async (req, res) => {
    await axios.get(covid19WorldInfoURL, {
        params: {
            serviceKey: encodeURI(covid19ServiceKey),
            numOfRows: 10,
            pageNo: 1,
            startCreateDt: yesterDate,
            endCreateDt: endDate,
        }
    }).then(response => {
        res.json(response.data.response.body);
    }).catch(error => {
        res.json({});
    })
})

//* 시도발생 현황
const covid19ProvinceInfoURL = "http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19SidoInfStateJson";
app.get("/covid19/province-info", async (req, res) => {
    await axios.get(covid19ProvinceInfoURL, {
        params: {
            serviceKey: encodeURI(covid19ServiceKey),
            numOfRows: 10,
            pageNo: 1,
            startCreateDt: startDate,
            endCreateDt: endDate,
        }
    }).then(response => {
        res.json(response.data.response.body);
    }).catch(error => {
        res.json({});
    })
})

//* 연령별, 성별 감염 현황
const covid19AgeGenderInfoURL = "http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19GenAgeCaseInfJson";
app.get("/covid19/age-gender-info", async (req, res) => {
    await axios.get(covid19AgeGenderInfoURL, {
        params: {
            serviceKey: encodeURI(covid19ServiceKey),
            numOfRows: 10,
            pageNo: 1,
            startCreateDt: startDate,
            endCreateDt: endDate,
        }
    }).then(response => {
        res.json(response.data.response.body);
    }).catch(error => {
        res.json({});
    })
})

//* 외교부 코로나 최신 안전 소식
const covid19NewsInfoURL = "http://apis.data.go.kr/1262000/SafetyNewsList/getCountrySafetyNewsList";
app.get("/covid19/news-info", async (req, res) => {
    await axios.get(covid19NewsInfoURL, {
        params: {
            serviceKey: encodeURI(covid19ServiceKey),
            numOfRows: 10,
            pageNo: 1,
            title1: "코로나",
            title2: "covid",
        }
    }).then(response => {
        res.json(response.data.response.body);
    }).catch(error => {
        res.json({});
    })
})