import React from 'react'
import Head from 'next/head'
import SearchSelect from '../components/searchSelect'
import axios from 'axios'
import { Table, Button, Modal, Input, notification } from 'antd'
import DragableTable from '../components/DragableTable'


const {TextArea} = Input
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
  const [quizInfo, setQuizInfo] = React.useState({
    name: '',
    description: ''
  })
  const [pager, setPager] = React.useState({
    page: 1,
    totalCount: 1
  })

  React.useEffect(() => {
    window.current_user = props.user
  }, [])

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
      ...quizInfo,
      questions: newQuestions
    }).then(({data})=>{
      setNewQuestions([])
      setQuizInfo({
        name:'',
        description: ''
      })
      notification.success({
        message: '生成试卷成功',
        description: <div>点击 <a href={`/quizzes/${data.quiz.id}`}>链接</a> 查看，或者复制 {`${window.location.origin}/quizzes/${data.quiz.id}`}</div>,
      });
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
          <Input addonBefore="试卷名" value={quizInfo.name} onChange={(e) => {setQuizInfo({...quizInfo, name: e.target.value})}}/>
          <TextArea
            value={quizInfo.description}
            onChange={(e) => {setQuizInfo({...quizInfo, description: e.target.value})}}
            placeholder="添加试卷描述"
            autoSize={{ minRows: 3, maxRows: 5 }}
          />
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

CreateQuiz.getInitialProps = async ({req}) => {
  const current_user = req? req.current_user : window.current_user
  return {user: current_user}
}

export default CreateQuiz