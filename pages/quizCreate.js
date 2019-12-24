import React, {useState, useEffect} from 'react'
import Head from 'next/head'
import axios from 'axios'
import { Input, notification } from 'antd'
import Nav from '../components/nav'
import QuizForm from '../components/quizForm'


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

const QuizCreate = (props) => {
  const [quiz, setQuiz] = useState({
    name: '',
    description: '',
    questions: []
  })

  useEffect(() => {
    window.current_user = props.user
  }, [])

  const onCreate = () => {
    axios.post('/api/quizzes', quiz).then(({data})=>{
      setQuiz({
        name:'',
        description: '',
        questions: []
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
    <Nav user={props.user} title="新建试卷"/>
    <div className="main">
      <QuizForm user={props.user} quiz={quiz} setQuiz={setQuiz} type="create" onHandle={onCreate}/>
    </div>
    <style jsx>{`
        .main{
          max-width: 1000px;
          margin: auto;
          padding: 20px 0;
        }
      `}</style>
  </div>
}

QuizCreate.getInitialProps = async ({req}) => {
  const current_user = req? req.current_user : window.current_user
  return {user: current_user}
}

export default QuizCreate