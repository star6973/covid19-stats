import { useState, useEffect } from 'react';
import { ResponsiveChoropleth } from '@nivo/geo';
import axios from 'axios';
import worldJSON from './world.json';
import isoXMLData from './ISO_CODE.xml';
import './Choropleth.scss';

const choroplethTheme = {
    fontFamily: 'BMHANNAPro',
    fontSize: 10,
    textColor: 'black',
};
const choroplethOption = {
    colors: "nivo",
    unknownColor: "#666666",
    valueFormat: ".2s",
    projectionTranslation: [0.5, 0.5],
    enableGraticule: true,
    graticuleLineColor: "#dddddd",
    borderWidth: 0.5,
    borderColor: "#152538",
    legends: [
        {
            anchor: 'bottom-left',
            direction: 'column',
            justify: true,
            translateX: 20,
            translateY: -100,
            itemsSpacing: 0,
            itemWidth: 94,
            itemHeight: 18,
            itemDirection: 'left-to-right',
            itemTextColor: '#444444',
            itemOpacity: 0.85,
            symbolSize: 18,
            effects: [
                {
                    on: 'hover',
                    style: {
                        itemTextColor: '#000000',
                        itemOpacity: 1,
                    },
                },
            ],
        },
    ],
};

const Choropleth = () => {
    const [worldConfData, setWorldConfData] = useState({});

    useEffect(() => {
        const fetchURL = async () => {
            let response = await axios.get('/covid19/world-info');
            response = response.data.items.item;
            const xml = await axios.get(isoXMLData, {
                'Content-Type': 'application/xml; charset=utf-8',
            });
            createDataForm(response, xml);
        };

        const createDataForm = (items, xml) => {
            const refineItems = items.map((item) => {
                return {
                    id: item.nationNmEn,
                    value: item.natDefCnt,
                };
            });

            // * XML 파일 Parser
            const parser = new DOMParser();
            const dom = parser.parseFromString(xml.data, 'text/xml');
            const tables = dom
                .getElementsByTagName('table')[0]
                .getElementsByTagName('row');
            let nationCodeDict = {};

            for (let i = 0; i < tables.length; i++) {
                let cells = tables[i].getElementsByTagName('cell');
                let nation = cells[0].getElementsByTagName('data')[0].innerHTML;
                let isoCode =
                    cells[1].getElementsByTagName('data')[0].innerHTML;

                nationCodeDict[nation] = isoCode;
            }

            const formData = refineItems
                .map((el) => {
                    return {
                        id: nationCodeDict[el.id],
                        value: el.value,
                    };
                })
                .filter((item) => item.id !== undefined);

            console.log('formData = ', formData);

            setWorldConfData(formData);
        };

        fetchURL();
    }, [setWorldConfData]);

    return (
        <div className="App-Choropleth">
            {Object.keys(worldConfData).length !== 0 ? (
                <div className="App-Choropleth-container">
                    <div className="App-chart-choropleth">
                        <ResponsiveChoropleth
                            data={worldConfData}
                            features={worldJSON.features}
                            theme={choroplethTheme}
                            label="properties.name"
                            {...choroplethOption}
                        />
                    </div>
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
};

export default Choropleth;