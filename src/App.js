import { useEffect, useState } from 'react';
import './App.css';
import columns from './table_columns.js';


import { InputNumber, Radio, Space, Slider } from 'antd';
import { Button, Col, Row, Statistic } from 'antd';
import { Table } from 'antd';

const fileNames = ['cpu','video-card', 'memory', 'motherboard', 'internal-hard-drive', 'case', 'power-supply'];
var data = [];

function App() {
  const [price, setPrice] = useState(500);
  const [purpose, setPurpose] = useState('Work');
  const [storage, setStorage] = useState('500GB');
  const [cpuBrand, setCPUBrand] = useState('Either');
  const [gpuBrand, setGPUBrand] = useState('Either');
  const [filteredParts, setFilteredParts] = useState({});

  const loadJsonFile = (fileName) => {
    return import(`./datasets/pc_parts/${fileName}.json`);
  };

  // Find one item by condition (for example: by price)
  const findOneByCondition = (data, condition) => {
    for (var i = 10; i < condition; i += 10) {
      var foundPart = data.find((item) => item.price <= condition && item.price >= condition - i);
      if (foundPart) {
        return foundPart;
      }
    }
    console.log('No Match!');
    return null;
  };

  // Handle filtering and fetching of data
  const handleConfigure = async () => {
    data = [];
    var leftMoney = price
    for (let fileName of fileNames) {
      const fileData = await loadJsonFile(fileName);

      var minPrice = 0
      var priceMultiplier = 1

      // CPU
      if(fileName == 'cpu'){
        minPrice = 60;
        if (purpose == 'Work' || purpose == 'Engineer'){
          priceMultiplier = 0.3
        }
        else if(purpose == 'Gaming'){
          priceMultiplier = 0.2
        }
        else{
          priceMultiplier = 0.1
        }
      }

      // GPU
      else if(fileName == 'video-card'){
        minPrice = 50;
        if (purpose == 'Gaming' || purpose == 'Engineer'){
          priceMultiplier = 0.3
        }
        else{
          priceMultiplier = 0.1
        }
      }
      
      // Continue adding other parts like cpu and gpu filtering

      const calculatedPrice = Math.max(price * priceMultiplier, minPrice);
      const foundItem = findOneByCondition(fileData.default, calculatedPrice); // ADD Brand filtering from here to other function 
      if (foundItem){

        leftMoney -= foundItem.price
        data.push({
          key: `${fileName}-${foundItem.name}`,
          part: fileName,
          brand: foundItem.name, // Check chipset names
          price: foundItem.price,
        });
      }
    }

    setFilteredParts(data);
    console.log('Filtered parts:', data);
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
                      max={2000}
                      onChange={handlePrice}
                      value={typeof price === 'number' ? price : 0}
                    />
                  </Col>
                  <Col span={4}>
                    <InputNumber
                      min={300}
                      max={2000}
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
                    <Radio value={'250GB'}>250GB</Radio>
                    <Radio value={'500GB'}>500GB</Radio>
                    <Radio value={'1TB'}>1TB</Radio>
                    <Radio value={'2TB+'}>2TB+</Radio>
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
          </Row>

          <Row>
            <Col span={10}></Col>
            <Col span={2}>
              <Button
              onClick={handleConfigure} // Trigger filtering when clicking "Configure"
              style={{ margin: '3rem' }}>
                  Configure
              </Button>
            </Col>
          </Row>
        </div>

        <Table 
          style={{ marginBottom: '3rem' }}
          dataSource={data}
          columns={columns}
        ></Table>
      </div>
    </div>
  );
}

export default App;
