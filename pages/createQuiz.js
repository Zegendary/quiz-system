import React from 'react'
import Head from 'next/head'
import SearchSelect from '../components/searchSelect'
import axios from 'axios'
import { Table, Button } from 'antd'
import DragableTable from '../components/DragableTable'

const columns = [
  {
    title: '题目',
    dataIndex: 'name',
  },
  {
    title: '类型',
    dataIndex: 'type',
  }
];

const columns1 = [
  {
    title: '题目',
    dataIndex: 'name',
  },
  {
    title: '类型',
    dataIndex: 'type',
  },
  {
    title: '操作',
    render: (text, record, index) => <>
      <Button size='small' onClick={() => editQuestion(text, index)}>编辑</Button>
      <Button size='small' style={{marginLeft: '4px'}} type="danger" onClick={() => deleteQuestion(index)}>删除</Button>
    </>
  }
];

const editQuestion = (text, index) => {
  console.log("index",index, "record",text)
}

const deleteQuestion = (index) => {
  console.log("index",index)
}

const data2 = [
  {
    name: 'John Brown',
    type: 'New York No. 1 Lake Park',
  },
  {
    name: 'Jim Green',
    type: 'London No. 1 Lake Park',
  },
  {
    name: 'Joe Black',
    type: 'Sidney No. 1 Lake Park',
  },
  {
    name: 'Disabled User',
    type: 'Sidney No. 1 Lake Park',
  },
];

const CreateQuiz = (props) => {
  const [questions, setQuestions] = React.useState([])
  const [selectedRows, setSelectedRows] = React.useState([])
  const [newQuestions, setNewQuestions] = React.useState(data2)
  const [pager, setPager] = React.useState({
    page: 1,
    totalCount: 1
  })
  const fetchQuestions = (value) => {
    console.log(value)
    axios("/api/questions",{
      params: {
        courseIds: value.map(v => v.key)
      }
    }).then(response => {
      setQuestions(response.data.questions)
      setPager(response.data.page)
    });
  }

  const data = [
    {
      name: 'John Brown',
      type: 'New York No. 1 Lake Park',
    },
    {
      name: 'Jim Green',
      type: 'London No. 1 Lake Park',
    },
    {
      name: 'Joe Black',
      type: 'Sidney No. 1 Lake Park',
    },
    {
      name: 'Disabled User',
      type: 'Sidney No. 1 Lake Park',
    },
  ];

  const rowSelection = {
    selectedRows,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(selectedRows)
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    }
  };

  return <div>
    <Head>
      <title>答卷系统-新建答卷</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <div className="main">

      <SearchSelect resourceName="courses" mapper={(course) =>{
        return {value: course.id, text: course.name}
      }} onSelect={fetchQuestions}/>

      <div className="actionWrapper">
        <div className="tableWrapper">
          <Table rowKey="name" rowSelection={rowSelection} columns={columns} dataSource={data} size="small" />
        </div>
        <div className="action">
          <Button disabled={selectedRows.length === 0}>导入 &rarr;</Button>
          <Button disabled={newQuestions.length === 0}>保存</Button>
          <Button type="primary">新建</Button>
        </div>
        <div className="tableWrapper">
          <DragableTable columns={columns1} data={newQuestions} setData={setNewQuestions}/>
        </div>
      </div>
    </div>
    <style jsx>{`
        .actionWrapper {
          display: flex;
          margin: 20px auto 20px auto;
          color: #333;
        }
        .main{
          max-width: 1000px;
          margin: auto;
          padding: 20px 0;
        }
        .tableWrapper{
          flex: 1
        }
        .action{
          display: flex;
          flex-direction: column;
          margin: 20px;
        }
        .action > :global(button){
          margin: 10px 0!important;
        }
      `}</style>
  </div>
}

export default CreateQuiz