'use client'

import { React, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Button, Flex, Input, Tree, Space, Table, Tag } from 'antd';

const ROOT = [{
    title: 'JSON',
    key: 'ROOT'
}]

function App() {

    const { TextArea } = Input;

    const [jsonText, setJsonText] = useState('');
    const [treeData, setTreeData] = useState(ROOT);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Tags',
            key: 'tags',
            dataIndex: 'tags',
            render: (_, { tags }) => (
                <>
                    {tags.map((tag) => {
                        let color = tag.length > 5 ? 'geekblue' : 'green';
                        if (tag === 'loser') {
                            color = 'volcano';
                        }
                        return (
                            <Tag color={color} key={tag}>
                                {tag.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a>Invite {record.name}</a>
                    <a>Delete</a>
                </Space>
            ),
        },
    ];
    const data = [
        {
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
            tags: ['nice', 'developer'],
        },
        {
            key: '2',
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
            tags: ['loser'],
        },
        {
            key: '3',
            name: 'Joe Black',
            age: 32,
            address: 'Sydney No. 1 Lake Park',
            tags: ['cool', 'teacher'],
        },
    ];

    return (
        <Flex gap="middle" vertical>
            <TextArea value = {jsonText}
                      onChange = {(e) => setJsonText(e.target.value)}
                      onBlur = {() => setTreeData(calculateTreeData(jsonText))}
            />
            <Tree
                showIcon
                defaultExpandAll
                defaultSelectedKeys={['0-0-0']}
                switcherIcon={<DownOutlined />}
                treeData={treeData}
            />
            <TextArea value = {jsonText} />
            <Button type="primary">Flat</Button>
            <Table columns={columns} dataSource={data} />
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
        return ROOT;
    }



    return [
        {
            title: 'parent 2222222222222222222',
            key: '0-0',
            children: [
                {
                    title: 'leaf',
                    key: '0-0-0',
                },
                {
                    title: 'leaf',
                    key: '0-0-1',
                },
            ],
        },
    ];
}

export default App;