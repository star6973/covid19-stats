import { useState, useEffect } from "react";
import { ResponsiveChoroplethCanvas } from '@nivo/geo'
import axios from "axios";
import isoXMLData from "../ISO_CODE.xml"

const Choropleth = () => {
    const [worldConfData, setWorldConfData] = useState([]);

    useEffect(() => {
        const fetchURL = async () => {
            let response = await axios.get("/covid19/world-info");
            response = response.data.items.item;
            const xml = await axios.get(isoXMLData, {"Content-Type": "application/xml; charset=utf-8"})            
            createDataForm(response, xml);
        };

        const createDataForm = (items, xml) => {
            const refineItems = items.map(item => {
                return {
                    id: item.nationNmEn,
                    value: item.natDefCnt,
                }
            })

            // * XML 파일 Parser
            const parser = new DOMParser();
            const dom = parser.parseFromString(xml.data, "text/xml");
            const tables = dom.getElementsByTagName("table")[0].getElementsByTagName("row");
            let nationCodeDict = {};
            
            for (let i = 0; i < tables.length; i++) {
                let cells = tables[i].getElementsByTagName("cell");
                let nation = cells[0].getElementsByTagName("data")[0].innerHTML;
                let isoCode = cells[1].getElementsByTagName("data")[0].innerHTML;
                
                nationCodeDict[nation] = isoCode;
            }

            const formData = refineItems.map(el => {
                return {
                    id: nationCodeDict[el.id],
                    value: el.value,
                }
            }).filter(item => item.id !== undefined)
            
            console.log("formData = ", formData);

            setWorldConfData(formData);
        }
        
        fetchURL();
    }, [worldConfData]);

    return (
        <>
            {
                Object.keys(worldConfData).length !== 0 ?
                    <div className="App-chart-choropleth">
                        <ResponsiveChoroplethCanvas
                            data={worldConfData}
                            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                            colors="RdBu"
                            domain={[ 0, 1000000 ]}
                            unknownColor="#101b42"
                            label="properties.name"
                            valueFormat=".2s"
                            projectionTranslation={[ 0.5, 0.5 ]}
                            projectionRotation={[ 0, 0, 0 ]}
                            enableGraticule={true}
                            graticuleLineColor="rgba(0, 0, 0, .2)"
                            borderWidth={0.5}
                            borderColor="#101b42"
                            legends={[
                                {
                                    anchor: 'bottom-left',
                                    direction: 'column',
                                    justify: true,
                                    translateX: 20,
                                    translateY: -60,
                                    itemsSpacing: 0,
                                    itemWidth: 92,
                                    itemHeight: 18,
                                    itemDirection: 'left-to-right',
                                    itemOpacity: 0.85,
                                    symbolSize: 18
                                }
                            ]}
                        />
                    </div>
                :
                    <div>Loading...</div>
            }
        </>
    )
}

export default Choropleth;