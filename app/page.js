'use client'

import { React, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import {Button, Flex, Input, Tree, Space, Table, Tag, Dropdown, Menu, Switch} from 'antd';

import JSONFormat from 'json-format';

import { BsBraces } from "react-icons/bs";
import { BiBracket } from "react-icons/bi";

function App() {

    const { TextArea } = Input;

    const [jsonText, setJsonText] = useState('');
    const [treeData, setTreeData] = useState([{title: 'ROOT', key: 'ROOT', path: ''}]);
    const [flatCfgObj, setFlatCfgObj] = useState({ignoreFields: [], flatFields: [], joinFields: [], mergeFields: []});
    const flatCfgStr = JSONFormat(flatCfgObj);
    const items = [
        {
            key: 'setRoot',
            label: 'Set as rootField',
        },
        {
            key: 'ignoreField',
            label: 'IgnoreField',
        },
        {
            key: 'mergeField',
            label: 'MergeField'
        },
        {
            key: 'flatField',
            label: 'FlatField'
        },
        {
            key: 'joinField',
            label: 'JoinField'
        }
    ];

    const titleRender = (nodeData) => {
        const onClick = ({ key }) => {
            const path = nodeData.path;
            const {...flatCfgObjCopy} = flatCfgObj;
            switch (key) {
                case 'setRoot' :
                    flatCfgObjCopy.rootField = path;
                    break;
                case 'ignoreField':
                    flatCfgObjCopy.ignoreFields.push(path);
                    break;
                case 'mergeField':
                    flatCfgObjCopy.mergeFields.push(path);
                    break;
                case 'flatField':
                    flatCfgObjCopy.flatFields.push(path);
                    break;
                case 'joinField':
                    flatCfgObjCopy.joinFields.push(path);
                    break;
                default :
            }
            setFlatCfgObj(flatCfgObjCopy);
        };
        return (
            <Dropdown menu={{
                items, onClick
            }} trigger={['contextMenu']}>
                <div>{nodeData.title}</div>
            </Dropdown>
        );
    };

    const setCamelToUnderline = (value) => {
        const {...flatCfgObjCopy} = flatCfgObj;
        flatCfgObjCopy.camelToUnderscore = value;
        setFlatCfgObj(flatCfgObjCopy);
    }
    const columns = [{title: 'Name', dataIndex: 'name'}];
    const data = [{key: '1', name: 'Josh Long'}];
    return (
        <Flex wrap="wrap" gap="middle" vertical={false}>
            <div style={{ width: '33%'}} >
                <TextArea value = {jsonText}
                          onChange = {(e) => setJsonText(e.target.value)}
                          onBlur = {() => setTreeData(calculateTreeData(jsonText))}
                          autoSize={{ minRows: 10, maxRows: 15 }}
                />
            </div>
            <div style={{ width: '30%'}} >
                <Tree
                    showIcon
                    defaultExpandAll
                    titleRender={titleRender}
                    switcherIcon={<DownOutlined />}
                    treeData={treeData}
                />
            </div>
            <div style={{ width: '33%'}} >
                <TextArea value = {flatCfgStr} autoSize={{ minRows: 9, maxRows: 15 }}/>
                <Space>
                    <span>camelToUnderline</span>
                    <Switch defaultChecked onChange={setCamelToUnderline}/>
                    <Button type="primary" danger onClick={() => {
                        setFlatCfgObj({ignoreFields: [], flatFields: [], joinFields: [], mergeFields: []});
                    }}>Reset</Button>
                    <Button type="primary">Flat</Button>
                </Space>
            </div>
            <div>
                <Table columns={columns} dataSource={data} pagination={false} />
            </div>
        </Flex>
    );
}

function calculateTreeData(jsonText) {
    let jsonObj = null;
    try {
        jsonObj = JSON.parse(jsonText)
    } catch (e) {

    }
    if (jsonObj == null) {
        alert('illegal json');
        return [{title: 'ROOT', key: 'ROOT', path: ''}];
    }
    let treeData  = [{title: 'ROOT', key: 'ROOT', path: ''}];
    traverseJsonObj(jsonObj, treeData[0], 'ROOT', '');
    return treeData;
}

/**
 *
 * @param jsonObj
 * @param treeObj
 * @param path 包含数组索引的路径
 * @param nodePath 不包含数组索引的路径
 */
function traverseJsonObj(jsonObj, treeObj, path, nodePath) {
    if (jsonObj instanceof Array) {
        treeObj.icon = <BiBracket />
        if(jsonObj.length > 0){
            let children = [];
            for (let idx in jsonObj) {
                let idxPath = path + '.' + idx;
                let child = {title: idx.toString(), key: idxPath, path: nodePath};
                traverseJsonObj(jsonObj[idx], child, idxPath, nodePath);
                children.push(child);
            }
            treeObj.children = children;
        }
    } else if (jsonObj instanceof Object) {
        treeObj.icon = <BsBraces />
        let children = [];
        for (let key in jsonObj) {
            let keyPath = path + '.' + key;
            let objNodePath = nodePath;
            if (objNodePath != '') {
                objNodePath += '.';
            }
            objNodePath += key;
            let child = {title: key, key: keyPath, path: objNodePath};
            traverseJsonObj(jsonObj[key], child, keyPath, objNodePath);
            children.push(child);
        }
        if (children.length > 0) {
            treeObj.children = children;
        }
    } else {
        if (jsonObj != null && (typeof jsonObj) == 'string') {
            jsonObj = '"' + jsonObj + '"';
        }
        treeObj.title += ': ' + jsonObj;
    }
}

export default App;