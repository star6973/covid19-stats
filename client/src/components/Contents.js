import Calendar from "./Calander";
import Bar from "./Bar";
import Bump from "./Bump";

//! Choropleth
//! 해외발생 현황
//! areaNm: 지역명(한글)
//! areaNmEn: 지역명(영문)
//! natDeathCnt: 국가별 사망자 수
//! natDeathRate: 확진률 대비 사망률
//! natDefCnt: 국가별 확진자 수
//! nationNm: 국가명(한글)
//! nationNmEn: 국가명(영문)
//! seq: 게시글 번호(고윳값)

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
            <Calendar />
            <Bar />
            <Bump />
        </div>
    )
}

export default Contents;