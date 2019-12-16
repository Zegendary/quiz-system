import React from 'react'
import Head from 'next/head'
import SearchSelect from '../components/searchSelect'
import axios from 'axios'
import { Table, Button } from 'antd'
import DragableTable from '../components/DragableTable'

const columns = [
  {
    title: '题目',
    dataIndex: 'answerable.content',
  },
  {
    title: '类型',
    dataIndex: 'answerable_type',
    render: (text, record, index) => {
      return text === 'ChoiceQuestion' ? '选择题': '填空题'
    },
    width: 100
  }
];

const CreateQuiz = (props) => {
  const [questions, setQuestions] = React.useState([])
  const [selectedRows, setSelectedRows] = React.useState([])
  const [newQuestions, setNewQuestions] = React.useState([])
  const [courseIds, setCourseIds] = React.useState([])
  const [pager, setPager] = React.useState({
    page: 1,
    totalCount: 1
  })

  const onSelect = (value) => {
    let ids = value.map(v => v.key)
    setCourseIds(ids)
    fetchQuestions({
      courseIds: ids,
      page: 1
    })
  }

  const fetchQuestions = (params) => {
    axios("/api/questions",{
      params: params
    }).then(response => {
      setQuestions(response.data.questions)
      setPager(response.data.pager)
    });
  }

  const pageOnChange = (value) => {
    fetchQuestions({
      courseIds,
      page: value
    })
  }

  const rowSelection = {
    selectedRowKeys: selectedRows.map(r => r.id),
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(selectedRows)
    }
  };

  const onImport = () => {
    const questions = selectedRows.map(r => {
      return {
        content: r.answerable.content,
        type: r.answerable_type,
        options: r.answerable.options,
        answers: r.answerable.answers,
        preprocessor: r.answerable.preprocessor
      }
    })
    setNewQuestions([...newQuestions, ...questions])
    setSelectedRows([])
  }

  const columns1 = [
    {
      title: '题目',
      dataIndex: 'content',
    },
    {
      title: '类型',
      dataIndex: 'type',
      render: (text, record, index) => {
        return text === 'ChoiceQuestion' ? '选择题': '填空题'
      },
      width: 100
    },
    {
      title: '操作',
      width: 130,
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

  const onSubmit = () => {
    axios.post('/api/quizzes', {
      questions: newQuestions
    }).then((response)=>{
      console.log(response)
    })
  }

  return <div>
    <Head>
      <title>答卷系统-新建答卷</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <div className="main">
      <SearchSelect resourceName="courses" mapper={(course) =>{
        return {value: course.id, text: course.name}
      }} onSelect={onSelect}/>

      <div className="actionWrapper">
        <div className="tableWrapper">
          <Table rowKey="id" pagination={{current: pager.page, total: pager.totalCount, onChange: pageOnChange}}
                 rowSelection={rowSelection} columns={columns} dataSource={questions} size="small" />
        </div>
        <div className="action">
          <Button disabled={selectedRows.length === 0} onClick={onImport}>导入 &rarr;</Button>
          <Button disabled={newQuestions.length === 0} onClick={onSubmit}>提交</Button>
          {/*<Button type="primary">添加</Button>*/}
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