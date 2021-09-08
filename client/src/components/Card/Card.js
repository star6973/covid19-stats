import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCaretSquareUp,
    faCaretSquareDown,
} from '@fortawesome/free-solid-svg-icons';
import AnimatedNumber from 'animated-number-react';
import axios from 'axios';
import './Card.scss';

const CONFIRMED = '확진환자';
const CLEAR = '격리해제';
const EXAM = '검사중';
const DEATH = '사망자';
const Card = () => {
    const [koreaData, setKoreaData] = useState({
        confirmedCnt: '',
        confirmedRate: '',
        clearCnt: '',
        clearRate: '',
        examCnt: '',
        examRate: '',
        deathCnt: '',
        deathRate: '',
    });

    const [confirmedCntIcon, setConfirmedCntIcon] = useState(faCaretSquareUp);
    const [clearCntIcon, setClearCntIcon] = useState(faCaretSquareUp);
    const [examCntIcon, setExamCntIcon] = useState(faCaretSquareUp);
    const [deathCntIcon, setDeathCntIcon] = useState(faCaretSquareUp);

    useEffect(() => {
        const fetchURL = async () => {
            let response = await axios.get('/covid19/korea-info');
            response = response.data.items.item
                .sort((a, b) => a.stateDt - b.stateDt)
                .slice(-2);

            const nowConfirmedCnt = response[1].decideCnt;
            const nowConfirmedRate =
                response[1].decideCnt - response[0].decideCnt; //! 확진자 증감률
            const nowClearCnt = response[1].clearCnt;
            const nowClearRate = response[1].clearCnt - response[0].clearCnt; //! 격리해제 증감률
            const nowExamCnt = response[1].examCnt;
            const nowExamRate = response[1].examCnt - response[0].examCnt; //! 검사자 증감률
            const nowDeathCnt = response[1].deathCnt;
            const nowDeathRate = response[1].deathCnt - response[0].deathCnt; //! 사망자 증감률

            setKoreaData({
                confirmedCnt: nowConfirmedCnt,
                confirmedRate: Math.abs(nowConfirmedRate).toLocaleString(),
                clearCnt: nowClearCnt,
                clearRate: Math.abs(nowClearRate).toLocaleString(),
                examCnt: nowExamCnt,
                examRate: Math.abs(nowExamRate).toLocaleString(),
                deathCnt: nowDeathCnt,
                deathRate: Math.abs(nowDeathRate).toLocaleString(),
            });

            setConfirmedCntIcon(
                nowConfirmedRate >= 0 ? faCaretSquareUp : faCaretSquareDown,
            );
            setClearCntIcon(
                nowClearRate >= 0 ? faCaretSquareUp : faCaretSquareDown,
            );
            setExamCntIcon(
                nowExamRate >= 0 ? faCaretSquareUp : faCaretSquareDown,
            );
            setDeathCntIcon(
                nowDeathRate >= 0 ? faCaretSquareUp : faCaretSquareDown,
            );
        };

        fetchURL();
    }, []);

    return (
        <div className="App-Card">
            {Object.keys(koreaData.confirmedRate).length !== 0 &&
            Object.keys(koreaData.clearRate).length !== 0 &&
            Object.keys(koreaData.examRate).length !== 0 &&
            Object.keys(koreaData.deathRate).length !== 0 ? (
                <div className="App-Card-container">
                    <div className="App-chart-card">
                        <p>코로나 바이러스 감염현황</p>
                        <div className="row">
                            <div className="col">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col">
                                                <div className="card-title">
                                                    {CONFIRMED}
                                                </div>
                                                <div className="card-confirmed-rate">
                                                    <FontAwesomeIcon
                                                        icon={confirmedCntIcon}
                                                        color="red"
                                                        style={{
                                                            marginRight: 5,
                                                        }}
                                                    />
                                                    {koreaData.confirmedRate}
                                                </div>
                                                <div className="card-count">
                                                    <AnimatedNumber
                                                        value={
                                                            koreaData.confirmedCnt
                                                        }
                                                        formatValue={(n) =>
                                                            Intl.NumberFormat(
                                                                'en-US',
                                                            ).format(
                                                                n.toFixed(0),
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
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
                                                    <div className="card-title">
                                                        {CLEAR}
                                                    </div>
                                                    <div className="card-clear-rate">
                                                        <FontAwesomeIcon
                                                            icon={clearCntIcon}
                                                            color="blue"
                                                            style={{
                                                                marginRight: 5,
                                                            }}
                                                        />
                                                        {koreaData.clearRate}
                                                    </div>
                                                    <div className="card-count">
                                                        <AnimatedNumber
                                                            value={
                                                                koreaData.clearCnt
                                                            }
                                                            formatValue={(n) =>
                                                                Intl.NumberFormat(
                                                                    'en-US',
                                                                ).format(
                                                                    n.toFixed(
                                                                        0,
                                                                    ),
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
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
                                                    <div className="card-title">
                                                        {EXAM}
                                                    </div>
                                                    <div className="card-exam-rate">
                                                        <FontAwesomeIcon
                                                            icon={examCntIcon}
                                                            color="green"
                                                            style={{
                                                                marginRight: 5,
                                                            }}
                                                        />
                                                        {koreaData.examRate}
                                                    </div>
                                                    <div className="card-count">
                                                        <AnimatedNumber
                                                            value={
                                                                koreaData.examCnt
                                                            }
                                                            formatValue={(n) =>
                                                                Intl.NumberFormat(
                                                                    'en-US',
                                                                ).format(
                                                                    n.toFixed(
                                                                        0,
                                                                    ),
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
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
                                                    <div className="card-title">
                                                        {DEATH}
                                                    </div>
                                                    <div className="card-death-rate">
                                                        <FontAwesomeIcon
                                                            icon={deathCntIcon}
                                                            color="black"
                                                            style={{
                                                                marginRight: 5,
                                                            }}
                                                        />
                                                        {koreaData.deathRate}
                                                    </div>
                                                    <div className="card-count">
                                                        <AnimatedNumber
                                                            value={
                                                                koreaData.deathCnt
                                                            }
                                                            formatValue={(n) =>
                                                                Intl.NumberFormat(
                                                                    'en-US',
                                                                ).format(
                                                                    n.toFixed(
                                                                        0,
                                                                    ),
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
};

export default Card;
