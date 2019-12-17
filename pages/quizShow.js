import React from 'react'
import Head from 'next/head'
import axios from 'axios'

const QuizShow = (props) => {
  const [quiz, setQuiz] = React.useState({})

  React.useEffect(() => {
    axios.get(`/api/quizzes/${props.quizId}`).then((response)=>{
      setQuiz(response.data.quiz)
    })
  },[])
  return <div>
    <Head>
      <title>答卷系统-工作台</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <div>
      {quiz.id}
    </div>
  </div>
}

QuizShow.getInitialProps = async ({req, query}) => {
  const current_user = req ? req.current_user : window.current_user
  return {user: current_user, quizId: query.id}
}

export default QuizShow