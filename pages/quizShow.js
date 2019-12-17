import React from 'react'
import Head from 'next/head'
import axios from 'axios'
import {Button, Checkbox, Row, Col} from 'antd'

const QuizShow = (props) => {
  const [quiz, setQuiz] = React.useState({
    content: []
  })
  const [question, setQuestion] = React.useState({
    index: 0
  })
  const [answers, setAnswers] = React.useState([])
  const [status, setStatus] = React.useState(false)

  React.useEffect(() => {
    axios.get(`/api/quizzes/${props.quizId}`).then((response) => {
      let length = response.data.quiz.content.length
      setAnswers(Array.from({length}).map(v=> { return {answer: null, choices: []}}))
      setQuiz(response.data.quiz)
    })
  },[])

  const onChange = (checkedValues) => {
    setAnswers(answers.map((a,i) => {
      return i === question.index?checkedValues: a
    }))
  }

  const onStart = () => {
    setStatus(true)
    setQuestion({
      index: 0,
      ...quiz.content[0]
    })
  }

  const changeQuestion = (index) => {
    setQuestion({
      index: index,
      ...quiz.content[index]
    })
  }

  return <div>
    <Head>
      <title>答卷系统-工作台</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <div className="quizContainer">
      <h4>{quiz.name}</h4>
      {status ?  <div className="quizContent">
        <div className="questionIndex">
          {quiz.content.map((question,index) =>
            <Button
              key={index}
              size="small"
              onClick={(index) =>changeQuestion(index)}
              className={`${question.index === index?'active':''} ${(answers[index].answer || answers[index].choices.length > 0)?'finished':''}`}>
              {index+1}
            </Button>)}
        </div>
        {
          question.type === 'ChoiceQuestion' ? <div className="choiceQuestion">
            <p className="name">{question.content}</p>
            <Checkbox.Group style={{ width: '100%' }} value={answers[question.index].choices} onChange={onChange}>
              <Row>
                {question.options.map(option => <Col key={option.text} span={24}>
                    <Checkbox value={option.text}>{option.text}</Checkbox>
                  </Col>)}
              </Row>
            </Checkbox.Group>
          </div> : <div className="clozeQuestion">

          </div>
        }
        <div className="actionButton">
          <Button disabled={question.index === 0} onClick={() =>changeQuestion(question.index - 1)}>上一题</Button>
          <Button type="primary">提交</Button>
          <Button disabled={question.index === (quiz.content.length - 1)} onClick={() =>changeQuestion(question.index + 1)}>下一题</Button>
        </div>
      </div>:<div className="quizStart">
        <p>{quiz.description}</p>
        {/*<p>建议时长：{quiz.duration} 秒</p>*/}
        <div className="buttonWrapper">
          <Button type="primary" onClick={onStart}>开始答题</Button>
        </div>
      </div>
      }
    </div>
    <style jsx>{`
      .quizContainer {
        max-width: 600px;
        padding: 20px;
        margin: auto;
        display: flex;
        flex-direction: column;
      }
      .quizContent{
        display: flex;
        flex-direction: column;
        flex: 1;
      }
      .actionButton{
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
        align-self: flex-end;
      }
      .quizStart .buttonWrapper{
        margin-top: 100px;
        text-align: center;
      }
      .questionIndex{
        display: flex;
        flex-wrap: wrap;
      }
      .questionIndex > :global(button){
        margin-right: 10px;
      }
    `}</style>
  </div>
}

QuizShow.getInitialProps = async ({req, query}) => {
  const current_user = req ? req.current_user : window.current_user
  return {user: current_user, quizId: query.id}
}

export default QuizShow