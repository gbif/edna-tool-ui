import { useState, useEffect } from "react";
import { Row, Col, Typography, Select, Input, theme } from "antd"
import OntologySelect from "./OntologySelect";
const { Text, Divider, Link } = Typography;

const DefaultValueSelect = ({style = { width: 300 }, onChange, term, vocabulary = null, ontology, initialValue }) => {
    const [value, setValue] = useState(initialValue || null)
    useEffect(() => {
        
    }, [vocabulary, term])

    useEffect(() => {
        if(initialValue){
            setValue(initialValue)
        }
    }, [initialValue])

    useEffect(() => {
        if (typeof onChange === 'function') {
            onChange(value)
        }
    }, [value])
    

    return <Row>
        <Col>
    {vocabulary ? <Select placeholder="Add default value" style={style} value={value} defaultValue={initialValue} onChange={val => {
        setValue(val)
    }}>
        {vocabulary?.map(h => <Select.Option key={h} value={h}>{h}</Select.Option>)}
    </Select> : ontology ? <OntologySelect ontology={ontology} onChange={onChange} initialValue={initialValue} term={term}/> :
    <Input value={value} style={style} placeholder="Add default value" onChange={e => {
        setValue(e?.target?.value)
    } } />}
    </Col><Col flex="auto"></Col>
    </Row>

}

export default DefaultValueSelect