import { useState, useEffect } from 'react';
import axios from 'axios';
import './Header.scss';

const Header = () => {
    const [koreaData, setKoreaData] = useState({
        confirmedCnt: 0,
        clearCnt: 0,
        examCnt: 0,
        deathCnt: 0,
    });

    useEffect(() => {
        const fetchURL = async () => {
            let response = await axios.get('/covid19/korea-info');
            response = response.data.items.item
                .sort((a, b) => a.stateDt - b.stateDt)
                .slice(-2);

            console.log('데이터 1 = ', response);
            createDataForm(response);

            response = await axios.get('/covid19/news-info');
            response = response.data.items.item;
            console.log('데이터 2 = ', response);
        };

        const createDataForm = (items) => {
            const dataForm = items.reduce((acc, cur) => {
                const createDate = new Date(cur.createDt);
                const formDate = `${createDate.getFullYear()}-${(
                    createDate.getMonth() + 1
                )
                    .toString()
                    .padStart(2, '0')}-${createDate
                    .getDate()
                    .toString()
                    .padStart(2, '0')}`;
                const decideCount = cur.decideCnt;
                const findItem = acc.find((el) => el.formDate === formDate);

                if (!findItem) {
                    acc.push({ formDate, decideCount });
                } else {
                    findItem.formDate = formDate;
                    findItem.decideCount += decideCount;
                }

                return acc;
            }, []);
        };

        fetchURL();
    }, []);

    return (
        <div className="App-header bg-gradient-info">
            <div className="header-container">
                <div className="row">
                    <div className="col">
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col">
                                        <span className="h2 font-weight-bold mb-0">
                                            {koreaData.confirmedCnt}
                                        </span>
                                        <h5 className="text-uppercase text-muted mb-0 card-title">
                                            확진환자
                                        </h5>
                                    </div>
                                    <div className="col-auto col">
                                        <div classNam="icon"></div>
                                    </div>
                                </div>
                                <p className="mt-3 mb-0 text-muted text-sm">
                                    <span className="text-success mr-2">
                                        <i className="fa fa-arrow-up">3.48%</i>
                                    </span>
                                    <span className="text-nowrap">
                                        Since last month
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col">
                                            <span className="h2 font-weight-bold mb-0">
                                                1234
                                            </span>
                                            <h5 className="text-uppercase text-muted mb-0 card-title">
                                                격리해제
                                            </h5>
                                        </div>
                                        <div className="col-auto col">
                                            <div className="icon"></div>
                                        </div>
                                    </div>
                                    <p className="mt-3 mb-0 text-muted text-sm">
                                        <span className="text-success mr-2">
                                            <i className="fa fa-arrow-up">
                                                3.48%
                                            </i>
                                        </span>
                                        <span className="text-nowrap">
                                            Since last month
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col">
                                            <span className="h2 font-weight-bold mb-0">
                                                1234
                                            </span>
                                            <h5 className="text-uppercase text-muted mb-0 card-title">
                                                검사중
                                            </h5>
                                        </div>
                                        <div className="col-auto col">
                                            <div className="icon"></div>
                                        </div>
                                    </div>
                                    <p className="mt-3 mb-0 text-muted text-sm">
                                        <span className="text-success mr-2">
                                            <i className="fa fa-arrow-up">
                                                3.48%
                                            </i>
                                        </span>
                                        <span className="text-nowrap">
                                            Since last month
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col">
                                            <span className="h2 font-weight-bold mb-0">
                                                1234
                                            </span>
                                            <h5 className="text-uppercase text-muted mb-0 card-title">
                                                사망자
                                            </h5>
                                        </div>
                                        <div className="col-auto col">
                                            <div className="icon"></div>
                                        </div>
                                    </div>
                                    <p className="mt-3 mb-0 text-muted text-sm">
                                        <span className="text-success mr-2">
                                            <i className="fa fa-arrow-up">
                                                3.48%
                                            </i>
                                        </span>
                                        <span className="text-nowrap">
                                            Since last month
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
