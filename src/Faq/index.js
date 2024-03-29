
import React, {useEffect, useState} from "react";
import axios from "axios"
import Layout from "../Layout/Layout";
import PageContent from "../Layout/PageContent";
import {Collapse, Typography, Row, Col} from "antd"
import {marked} from "marked"
import md2json from "md-2-json"
const {Title} = Typography
const { Panel } = Collapse;


const Faq =  () => {
    const [markdown, setMarkdown] = useState(null)
    
    useEffect(() => {
     
       // getAbout()

        const getFaq = async () => {
          try {
              const res = await  axios(`/faq.md?cachebust=${Math.random()}`)

              setMarkdown(res.data)
             // console.log(md2json.parse(res.data))
              //setFaq(res.data)
             // console.log(res.data)
          } catch (error) {
              console.log(error)
          }
          
      }
      getFaq()
       

    },[])
  return (
    <Layout><PageContent style={{padding: "48px"}}>
        <Row><Col span={2}></Col><Col><Title level={2}>Frequently asked questions</Title></Col><Col span={2}></Col></Row>
        <Row><Col span={2}></Col><Col span={20}>
        {markdown && <span
                  dangerouslySetInnerHTML={{
                    __html: marked(markdown),
                  }}
                ></span>}
        </Col><Col span={2}></Col></Row>
        
        
       
        </PageContent></Layout>
  );
}

export default Faq;
