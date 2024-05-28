import React, { useState, useEffect } from "react";
import { Row, Col, Spin } from "antd";
import axios from "axios";
import Highcharts from "highcharts";
import config from "../config";

import HC_exporting from "highcharts/modules/exporting";
import HC_sunburst from "highcharts/modules/sunburst";
import HighchartsReact from "highcharts-react-official";
import _ from 'lodash'
import withContext from "../Components/hoc/withContext";
import hashCode from "../Util/hashCode"

HC_exporting(Highcharts);
HC_sunburst(Highcharts);
const ranks = ['kingdom', 'phylum', 'class', 'order', 'family', 'genus'];

const TaxonomyChart = ({dataset, sampleIndex, selectedSample, topTaxa}) => {
    const [options, setOptions] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [taxonID, setTaxonID] = useState(null);
   
  useEffect(() => {

    if(dataset && !isNaN(Number(sampleIndex))){
        getData(dataset, sampleIndex, selectedSample)
    }
  }, [dataset, sampleIndex])



  const  getData = async (dataset, sampleIndex, selectedSample) => {
    try {
      setLoading(true)
      const res = await axios.get(`${config.backend}/dataset/${dataset.id}/data/sample/${sampleIndex}/taxonomy`)

      initChart(res?.data, selectedSample)
     setLoading(false)

    } catch (error) {
      setLoading(false)

    }
  }

 
  
    
      const initChart = (data, selectedSample) => {
       // const DOI = dataset.doi ? "https://doi.org/" + dataset.doi : null;
      // const groupedData = _.groupBy(data, 'rank');
      let firstIndexRankWithMultipleTaxa
        if(topTaxa){
           firstIndexRankWithMultipleTaxa = topTaxa.findIndex(elm => elm.length > 2);
        }


    //   

        


       const colors = Highcharts.getOptions().colors;
        let options = {

            chart: {
              height: '100%'
            },
           
            // Let the center circle be transparent
           // colors: ['transparent'].concat(Highcharts.getOptions().colors),
           colorAxis: {},
            title: {
              text: selectedSample
            },
          
            subtitle: {
              text: 'Taxonomic composition'
            },
           legend: {
        enabled: false
      },  
            series: [{
              type: 'sunburst',
              data: data.map(d => { return d.rank === ranks[firstIndexRankWithMultipleTaxa] || d.rank === "phylum" ? {...d, color: colors[Math.abs(hashCode(d.id)) % 10]} : d}),
              name: 'Root',
              turboThreshold: 0,
              allowDrillToNode: true,
              cursor: 'pointer',
              dataLabels: {
                format: '{point.name}',
                filter: {
                  property: 'innerArcLength',
                  operator: '>',
                  value: 16
                },
                rotationMode: 'circular'
              },
              levels: [{
                level: 1,
                levelIsConstant: false,
                dataLabels: {
                  filter: {
                    property: 'outerArcLength',
                    operator: '>',
                    value: 64
                  }
                }
              }, {
                level: 2,
                colorByPoint: true
              },
              {
                level: 3,
                colorVariation: {
                  key: 'brightness',
                  to: -0.5
                }
              }, {
                level: 4,
                colorVariation: {
                  key: 'brightness',
                  to: 0.5
                }
              },
             {
                level: 5,
                colorVariation: {
                  key: 'brightness',
                  to: 0.5
                }
              }, {
                level: 6,
                enabled: false,
                colorVariation: {
                  key: 'brightness',
                  to: 0.5,
                  dataLabels: null
                }
              }, {
                level: 7,
                enabled: false,
                dataLabels: {
                  enabled: false,
                },
                levelSize: {
                  value: 0
                },
                
              },]
          
            }],
          
            tooltip: {
              headerFormat: '',
              pointFormat: '<b>{point.name}</b> - <b>{point.value} ASVs</b>'
            }
          };
    
        setOptions(options);
      };

      return invalid ? null : loading || !options ? (
        <Row style={{ padding: "48px" }}>
          <Col flex="auto"></Col>
          <Col>
            <Spin size="large" />
          </Col>
          <Col flex="auto"></Col>
        </Row>
      ) : (
        <HighchartsReact highcharts={Highcharts} options={options} />
      );
}

const mapContextToProps = ({ dataset, rank }) => ({
    dataset,
    rank,
  });
  
  export default withContext(mapContextToProps)(TaxonomyChart);