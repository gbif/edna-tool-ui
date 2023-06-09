
import React, {useEffect, useState} from "react";
import FilesAvailable from "../Components/FilesAvailable";
import {Row, Col, Tabs, Typography} from "antd"
import Layout from "../Layout/Layout";
import PageContent from "../Layout/PageContent";
import DataBrowser from "../Review/DataBrowser";
import MetaDataView from "./MetaDataView";
import withContext from "../Components/hoc/withContext";
const {Title} = Typography;
const Dataset = ({dataset}) => {

  return (
    <Layout><PageContent>
        {dataset?.metadata?.title && <Title>{dataset?.metadata?.title}</Title>}
        <Tabs defaultActiveKey="1" items={[

{
    key: '1',
    label: `Browse`,
    children: <DataBrowser />,
},
{
  key: '2',
  label: `Metadata`,
  children: <MetaDataView />,
},
{
    key: '3',
    label: `Files available`,
    children: <FilesAvailable dataset={dataset} />,
},
]} />
        
        </PageContent></Layout>
  );
}

const mapContextToProps = ({ dataset }) => ({
    dataset
  });
  
export default withContext(mapContextToProps)(Dataset);
