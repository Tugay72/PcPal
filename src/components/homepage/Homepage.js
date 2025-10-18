import { useEffect, useState, useRef } from 'react';
import './Homepage.css'
import columns from '../../table_columns.js';
import { InputNumber, Radio, Space, Slider, Checkbox, Button, Col, Row, Statistic, Table } from 'antd';
import { findPcPart } from '../../functions/find_part.js';

const fileNames = ['cpu', 'video-card', 'memory', 'motherboard', 'internal-hard-drive', 'case', 'power-supply'];

function Homepage() {
    const [totalBuilds, setTotalBuilds] = useState(Math.floor(Math.random() * (2000000 + 0 + 1)) + 1);
    const [price, setPrice] = useState(500);
    const [infiniteBudget, setInfiniteBudget] = useState(false);
    const [purpose, setPurpose] = useState('Work');
    const [storage, setStorage] = useState('500');
    const [ramStorage, setRamStorage] = useState('16');
    const [ramType, setRamType] = useState('Either');
    const [cpuBrand, setCPUBrand] = useState('Either');
    const [gpuBrand, setGPUBrand] = useState('Either');
    const [dataSource, setDataSource] = useState([]);
    const [includeOS, setIncludeOS] = useState(false);
    const [microATX, setMicroATX] = useState(false);
    const [sidePanel, setSidePanel] = useState(false);
    const [loading, setLoading] = useState(false);

    const tableRef = useRef(null);
    const filterTabRef = useRef(null);

    const [filterOpened, setFilterOpened] = useState(false);

    const [expandedKeys, setExpandedKeys] = useState([]);

    const ramOptions = [
        { label: 'DDR4', value: 'DDR4' },
        { label: 'DDR5', value: 'DDR5' },
        { label: 'Either', value: 'Either' },
    ];

    //Scroll effect after pressing configure button
    const handleScroll = (ref) => {
        console.log(ref)
        ref.current.scrollIntoView({ behavior: 'smooth' });
    };

    //Configure PC
    const handleConfigure = async () => {
        setLoading(true);
        try {
            setTotalBuilds((prevTotalBuilds) => prevTotalBuilds + 1);
            const data = await findPcPart(price, purpose, storage, cpuBrand, gpuBrand, ramType, ramStorage, includeOS, microATX);
            setDataSource(data);
        } catch (error) {
            console.error('Error fetching PC parts:', error);
        } finally {
            setTimeout(handleScroll(tableRef), 1);
            setLoading(false);
        }
    };

    const handleFilter = async () => {
        setFilterOpened(!filterOpened);
        setTimeout(handleScroll(filterTabRef), 1);
    }

    // Handlers for user inputs
    const handlePurpose = (e) => setPurpose(e.target.value);
    const handlePrice = (value) => setPrice(value);
    const handleStorage = (e) => setStorage(e.target.value);
    const handleRamStorage = (e) => setRamStorage(e.target.value);
    const handleRamType = (e) => setRamType(e.target.value);
    const handleCPU = (e) => setCPUBrand(e.target.value);
    const handleGPU = (e) => setGPUBrand(e.target.value);
    const handleOS = (e) => setIncludeOS(e.target.checked);
    const handleCaseType = (e) => setMicroATX(e.target.checked);
    const handleSidePanel = (e) => setSidePanel(e.target.checked);
    const handleInfiniteBudget = (e) => {
        setInfiniteBudget(e.target.checked);

        if (infiniteBudget == false) {
            setPrice(1000000);
            setCPUBrand('Either')
            setGPUBrand('Either')
            setRamType('DDR5');
            setRamStorage('64')
            setStorage('2000');
            setIncludeOS(true);
            setSidePanel(true);
        }
        else {
            setPrice(1000);
            setCPUBrand('Either')
            setGPUBrand('Either')
            setRamType('Either');
            setRamStorage('16')
            setStorage('500');
            setIncludeOS(false);
            setSidePanel(false);
        }


    }

    return (
        <div className="Homepage">
            <div className="content">
                <div className="header-content">
                    <Row>
                        <Col span={24}>
                            <Statistic
                                valueStyle={{ color: 'aliceblue', fontSize: '2rem' }}
                                title={<span style={{ color: 'rgb(218, 225, 231)', fontSize: '1rem' }}>PC's Built</span>}
                                value={totalBuilds}
                            />
                        </Col>
                    </Row>
                </div>

                <div className="selection-content" ref={filterTabRef}>
                    <div style={{
                        display: 'flex',
                        displayDirection: 'row',
                        marginBottom: '1rem'
                    }}>
                        <div className="content-box">
                            <p>Purpose</p>
                            <hr />
                            <Radio.Group onChange={handlePurpose} value={purpose}>
                                <Space direction="vertical">
                                    <Radio value={'Work'}>Work</Radio>
                                    <Radio value={'School'}>School</Radio>
                                    <Radio value={'Gaming'}>Gaming</Radio>
                                    <Radio value={'Engineer'}>Engineer / Architecture</Radio>
                                    <Radio value={'Just Google'}>Just Google</Radio>
                                </Space>
                            </Radio.Group>
                        </div>

                        <div className="content-box">
                            <p>Budget ($)</p>
                            <hr />
                            <Slider
                                disabled={infiniteBudget}
                                step={price > 2000 ? 50 : 5}
                                min={500}
                                max={5000}
                                onChange={handlePrice}
                                value={typeof price === 'number' ? price : 0}
                            />

                            <InputNumber
                                disabled={infiniteBudget}
                                min={500}
                                max={5000}
                                style={{ margin: '0 16px' }}
                                value={price}
                                onChange={handlePrice}
                            />
                            <br /> <br />

                            <Checkbox onChange={handleInfiniteBudget}>I dont have a budget</Checkbox>
                        </div>
                    </div>

                    <Button
                        style={{ margin: '1rem', color: 'white' }}
                        onClick={handleFilter}
                        color='default'
                        variant='link'
                    >
                        Filter {!filterOpened ? '⇊' : '⇈'}
                    </Button>

                    {filterOpened ? (
                        <div style={{
                            display: 'flex',
                            displayDirection: 'row',
                            marginBottom: '1rem'
                        }}>

                            <div className="content-box">
                                <p>CPU Brand Preference</p>
                                <hr />
                                <Radio.Group onChange={handleCPU} value={cpuBrand}>
                                    <Space direction="vertical">
                                        <Radio value={'Intel'}>Intel</Radio>
                                        <Radio value={'AMD'}>AMD</Radio>
                                        <Radio value={'Either'}>Either</Radio>
                                    </Space>
                                </Radio.Group>


                            </div>

                            <div className="content-box">
                                <p>GPU Brand Preference</p>
                                <hr />
                                <Radio.Group onChange={handleGPU} value={gpuBrand}>
                                    <Space direction="vertical">
                                        <Radio value={'Nvidia'}>Nvidia</Radio>
                                        <Radio value={'AMD'}>AMD</Radio>
                                        <Radio value={'Intel'}>Intel</Radio>
                                        <Radio value={'Either'}>Either</Radio>
                                    </Space>
                                </Radio.Group>
                            </div>

                            <div className="content-box">
                                <p>Ram</p>
                                <hr />
                                <Radio.Group onChange={handleRamStorage} value={ramStorage}>
                                    <Space direction="vertical">
                                        <Radio value={'8'}>8GB</Radio>
                                        <Radio value={'16'}>16GB</Radio>
                                        <Radio value={'32'}>32GB</Radio>
                                        <Radio value={'64'}>64GB</Radio>
                                    </Space>


                                </Radio.Group>

                                <Space direction="vertical" style={{ marginTop: '5rem' }}>
                                    <Radio.Group
                                        value={ramType}
                                        onChange={handleRamType}
                                        block
                                        options={ramOptions}
                                        defaultValue="either"
                                        optionType="button"
                                        buttonStyle="solid"
                                    />
                                </Space>
                            </div>
                            <div className="content-box">
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

                            <div className="content-box">
                                <p>Other Preferences</p>
                                <hr />
                                <Checkbox onChange={handleOS}>Windows 11 (+119.99$)</Checkbox>
                                <Checkbox onChange={handleCaseType}>Micro ATX Case</Checkbox>
                                <Checkbox onChange={handleSidePanel}>Side: Tempered Glass</Checkbox>
                            </div>
                        </div>
                    ) : (
                        <></>
                    )}

                    <Button
                        style={{ margin: '3rem' }}
                        onClick={handleConfigure}
                    >
                        Configure
                    </Button>

                </div>

                <div className="summary-table" ref={tableRef}>
                    <Table dataSource={dataSource} columns={columns}
                        expandable={{
                            onExpand: (expanded, record) => {
                                if (expanded) {
                                    setExpandedKeys(prev => [...prev, record.key]);
                                } else {
                                    setExpandedKeys(prev => prev.filter(k => k !== record.key));
                                }
                            },
                            expandedRowKeys: expandedKeys,
                        }}
                        rowClassName={(record) =>
                            expandedKeys.includes(record.key)
                                ? 'tree-expanded-row'
                                : 'tree-collapsed-row'
                        }></Table>
                </div>
            </div>

        </div>
    );
}

export default Homepage;
