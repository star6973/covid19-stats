import Calendar from "./Calander";
import Choropleth from "./Choropleth";
import Bar from "./Bar";
import Bump from "./Bump";

//^ Header
//^ content: 내용
//^ contentHtml: html 내용
//^ countryEnName: 국가명(영문)
//^ countryName: 국가명(한글)
//^ fileUrl: 첨부파일 경로
//^ id: 교윳값
//^ title: 제목
//^ wrDt: 작성일

const Contents = () => {

    return (
        <div className="App-contents">
            {/* <Calendar />
            <Bar />
            <Bump /> */}
            <Choropleth />
        </div>
    )
}

export default Contents;