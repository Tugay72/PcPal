import { useEffect, useState } from 'react';
import './App.css';
import columns from './table_columns.js';

import { InputNumber, Radio, Space, Slider, Checkbox } from 'antd';
import { Button, Col, Row, Statistic } from 'antd';
import { Table } from 'antd';

import { findPcPart } from './find_part.js';
const fileNames = ['cpu','video-card', 'memory', 'motherboard', 'internal-hard-drive', 'case', 'power-supply'];
var data = [];

function App() {
  const [price, setPrice] = useState(500);
  const [purpose, setPurpose] = useState('Work');
  const [storage, setStorage] = useState('500');
  const [cpuBrand, setCPUBrand] = useState('Either');
  const [gpuBrand, setGPUBrand] = useState('Either');
  const [dataSource, setDataSource] = useState([]);
  const [includeOS, setIncludeOS] = useState(false);
  const [microATX, setMicroATX] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle filtering and fetching of data
  const handleConfigure = async () => {
    setLoading(true); // Start loading
    try {
      const data = await findPcPart(price, purpose, storage, cpuBrand, gpuBrand, includeOS, microATX);
      setDataSource(data);

    } catch (error) {
      console.error('Error fetching PC parts:', error);

    } finally {
      setLoading(false);
    }
  };

  // Handlers for user inputs
  const handlePurpose = (e) => {
    setPurpose(e.target.value);
  };

  const handlePrice = (value) => {
    setPrice(value);
  };

  const handleStorage = (e) => {
    setStorage(e.target.value);
  };

  const handleCPU = (e) => {
    setCPUBrand(e.target.value);
  };

  const handleGPU = (e) => {
    setGPUBrand(e.target.value);
  };

  const handleOS = (e) => {
    setIncludeOS(e.target.checked);
  };
  
  const handleCaseType = (e) => {
    setMicroATX(e.target.checked);
  };

  return (
    <div className="App">
      <div className='content'>
        <div className='header-content'>
          <Row>
            <Col span={24}>
              <Statistic 
                valueStyle={{ color: 'aliceblue' }}
                title={<span style={{ color: 'rgb(218, 225, 231)' }}>PC's Builded</span>} 
                value={1712932} />
            </Col>
          </Row>
        </div>

        <div className='selection-content'>
          <Row>

            {/* Purpose Section */}
            <Col>
              <div className='content-box'>
                <p>Purpose</p>
                <hr />
                <Radio.Group onChange={handlePurpose} value={purpose}>
                  <Space direction="vertical">
                    <Radio value={'Work'}>Work</Radio>
                    <Radio value={'School'}>School</Radio>
                    <Radio value={'Gaming'}>Gaming</Radio>
                    <Radio value={'Engineer'}>Engineer</Radio>
                    <Radio value={'Just Google'}>Just Google</Radio>
                  </Space>
                </Radio.Group>
              </div>
            </Col>

            {/* Price Section */}
            <Col> 
              <div className='content-box'>
                <p>Budget ($)</p>
                <hr />
                <Row>
                  <Col span={14}>
                    <Slider
                      min={300}
                      max={5000}
                      onChange={handlePrice}
                      value={typeof price === 'number' ? price : 0}
                    />
                  </Col>
                  <Col span={4}>
                    <InputNumber
                      min={300}
                      max={5000}
                      style={{
                        margin: '0 16px',
                      }}
                      value={price}
                      onChange={handlePrice}
                    />
                  </Col>
                </Row>
              </div>
            </Col>

            {/* Storage Needs Section */}
            <Col>
              <div className='content-box'>
                <p>Storage</p>
                <hr />
                <Radio.Group onChange={handleStorage} value={storage}>
                  <Space direction="vertical">
                    <Radio value={'250'}>250GB</Radio>
                    <Radio value={'500'}>500GB</Radio>
                    <Radio value={'1000'}>1TB</Radio>
                    <Radio value={'2000'}>2TB+</Radio>
                  </Space>
                </Radio.Group>
              </div>
            </Col>

            {/* Brands Section */}
            <Col>
              <div className='content-box'>
                <p>CPU Brand Preference</p>
                <hr />
                <Radio.Group onChange={handleCPU} value={cpuBrand}>
                  <Space direction="vertical">
                    <Radio value={'Intel'}>Intel</Radio>
                    <Radio value={'AMD'}>AMD</Radio>
                    <Radio value={'Either'}>Either</Radio>
                  </Space>
                </Radio.Group>
                
                <br /> <br />
                <p>GPU Brand Preference</p>
                <hr />
                <Radio.Group onChange={handleGPU} value={gpuBrand}>
                  <Space direction="vertical">
                    <Radio value={'Nvidia'}>Nvidia</Radio>
                    <Radio value={'AMD'}>AMD</Radio>
                    <Radio value={'Either'}>Either</Radio>
                  </Space>
                </Radio.Group>
              </div>
            </Col>

            {/*Other Preferences */}
            <Col>
              <div className='content-box'>
                <p>Other Preferences</p>
                <hr></hr>
                <Checkbox onChange={handleOS}>Windows 11 (+119.99$)</Checkbox>
                <Checkbox onChange={handleCaseType}>Micro ATX Case</Checkbox>
                
              </div>
            </Col>
          </Row>

          <Row>
            <Col span={10}></Col>
            <Col span={2}>
              <Button
              onClick={handleConfigure}
              style={{ margin: '3rem' }}>
                  Configure
              </Button>
            </Col>
          </Row>
        </div>

        <Table 
          style={{ marginBottom: '3rem', marginTop: '1rem' }}
          dataSource={dataSource}
          columns={columns}
        ></Table>
      </div>
    </div>
  );
}

export default App;
