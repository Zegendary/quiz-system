import React from 'react'
import Head from 'next/head'
import axios from 'axios'
import {Button, Checkbox, Row, Col} from 'antd'
import Nav from '../components/nav'
import Link from 'next/link'

const AnswerPaperShow = (props) => {
  const [quizSnapshot, setQuizSnapshot] = React.useState({
    questions: []
  })
  const [answerPaper, setAnswerPaper] = React.useState({
    marks: [],
    answers: []
  })
  const [quiz, setQuiz] = React.useState({})

  React.useEffect(() => {
    window.current_user = props.user
    axios.get(`/api/answerPapers/${props.answerPaperId}`).then(({data}) => {
      setQuizSnapshot(data.quizSnapshot)
      setAnswerPaper(data.answerPaper)
      setQuiz(data.quiz)
    })
  }, [])

  return <div>
    <Head>
      <title>答卷系统</title>
      <link rel="icon" href="/favicon.ico"/>
    </Head>
    <Nav user={props.user} title="答卷详情"/>
    <div className="answerPaperContainer">
      <div className="answerPaperHeader">
        <h4>{quiz.name}</h4>
        <div className="questionIndex">
          {answerPaper.marks.map((m, index) =>
            <Button
              key={index}
              href={`#question${index + 1}`}
              size="small"
              type={m ? 'primary' : 'danger'}
            >
              {index + 1}
            </Button>)}
        </div>
      </div>
      <div className="answerPaperContent">
        {
          quizSnapshot.questions.map((qs, index) =>
            <div
              key={index}
              id={`question${index + 1}`}
              className={`answer ${answerPaper.marks[index] ? 'success' : 'error'}`}
            >
              {
                qs.type === 'ChoiceQuestion' ? <div className="choiceQuestion">
                  <p className="name">{qs.content}</p>
                  <Checkbox.Group style={{width: '100%'}}
                                  value={answerPaper.answers[index] && answerPaper.answers[index].choices} disabled>
                    <Row>
                      {qs.options.map(option => <Col key={option.text} span={24}>
                        <Checkbox value={option.text}>{option.text}</Checkbox>
                      </Col>)}
                    </Row>
                  </Checkbox.Group>
                  {!answerPaper.marks[index] && <div className="rightAnswers">
                    正确答案：{qs.options.filter(o => o['correct']).map((o, index) => 'ABCD'[index]).join(', ')}
                  </div>}
                </div> : <div className="clozeQuestion">

                </div>
              }
            </div>)
        }
      </div>
      <div className="answerPaperFooter">
        <Link href={`/quizzes/${quiz.id}`}>
          <a><Button>重新答题 &rarr;</Button></a>
        </Link>
        <Link href="/dashboard">
          <a><Button>工作台 &rarr;</Button></a>
        </Link>
      </div>
    </div>
    <style jsx>{`
      .answerPaperContainer {
        max-width: 600px;
        margin: auto;
        position: relative;
      }
      .answerPaperHeader,.answerPaperFooter{
        position: sticky;
        background: #ffffff;
        padding: 10px 0;
        z-index: 10;
      }
      .answerPaperHeader{top:0}
      .answerPaperFooter{bottom:0}
      .answerPaperFooter > a{
        margin-right: 20px;
      }
      .questionIndex > :global(a){
        margin-right: 10px;
        margin-top: 10px;
      }
      .answerPaperContent > .answer{
        padding: 10px;
        margin: 20px 0;
        border-radius: 2px;
      }
      .answer.error{
        border: 1px solid #f5222d;
      }
      .answer.success{
        border: 1px solid #52c41a;
      }
    `}</style>
  </div>
}

AnswerPaperShow.getInitialProps = async ({req, query}) => {
  const current_user = req ? req.current_user : window.current_user
  return {user: current_user, answerPaperId: query.id}
}

export default AnswerPaperShow