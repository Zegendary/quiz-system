import React from 'react'
import Head from 'next/head'
import axios from 'axios'
import QuizForm from '../components/quizForm'
import {notification} from 'antd'

const QuizCreate = (props) => {
  const [quiz, setQuiz] = React.useState({
    name: '',
    description: '',
    questions: []
  })

  React.useEffect(() => {
    window.current_user = props.user
    axios.get(`/api/quizzes/${props.quizId}`).then((response) => {
      setQuiz(response.data.quiz)
    })
  }, [])

  const onUpdate = () => {
    axios.put('/api/quizzes', quiz).then(({data})=>{
      setQuiz({
        name:'',
        description: '',
        questions: []
      })
      notification.success({
        message: '更新试卷成功',
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
      <QuizForm user={props.user} quiz={quiz} setQuiz={setQuiz} type="update" onHandle={onUpdate}/>
    </div>
  </div>
}

QuizCreate.getInitialProps = async ({req, query}) => {
  const current_user = req? req.current_user : window.current_user
  return {user: current_user, quizId: query.id}
}

export default QuizCreate