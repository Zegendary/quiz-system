import React from 'react'
import Head from 'next/head'
import Nav from '../components/nav'
import { List, Avatar, Button, Skeleton } from 'antd';
import axios from 'axios'
import Link from 'next/link'

const count = 3

const AnswerPaper = (props) => {
  const [state, setState] = React.useState({
    answerPapers: [],
    list: [],
    initLoading: true,
    page: 1,
    totalCount: 1,
    keyword: ''
  });

  const [quiz, setQuiz] = React.useState({})

  const { user } = props
  const {answerPapers, list, initLoading, page, totalCount} = state

  React.useEffect(() => {
    window.current_user = user
    getAnswerPapers(1)
    getQuiz()
  }, [])

  const onLoadMore = () => {
    getAnswerPapers(page + 1)
  }

  const getAnswerPapers = (page) => {
    setState({
      ...state,
      list: answerPapers.concat([...new Array(count)].map(() => ({ loading: true, marks: [], }))),
      initLoading: true
    })
    axios.get('/api/answerPapers', {
      params: {
        page,
        quizId: props.quizId
      }
    }).then((response) =>{
      setState({
        ...state,
        answerPapers: [...answerPapers, ...response.data.answerPapers],
        list: [...answerPapers, ...response.data.answerPapers],
        initLoading: false,
        page: response.data.page,
        totalCount: response.data.totalCount
      })
    })
  }

  const getQuiz = () => {
    axios.get(`/api/quizzes/${props.quizId}`).then((response) =>{
      setQuiz(response.data.quiz)
    })
  }

  const loadMore =
    !initLoading && (page*10 < totalCount) ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px',
        }}
      >
        <Button onClick={onLoadMore}>加载更多</Button>
      </div>
    ) : null;

  return (
    <div>
      <Head>
        <title>答卷系统</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Nav user={user} title="答卷列表"/>

      <div className="main">
        <p>{quiz.name}</p>
        <p>{quiz.description}</p>
        <p>答卷</p>
        <List
          loading={initLoading}
          itemLayout="horizontal"
          loadMore={loadMore}
          dataSource={list}
          renderItem={item => (
            <List.Item
              key={item.id}
              actions={[<span>{item.marks.filter(m => m).length}/{item.marks.length}</span>]}
            >
              <Skeleton avatar title={false} loading={item.loading} active>
                <List.Item.Meta
                  title={<Link href={`/answerPapers/${item.id}`}><a>1111</a></Link>}
                />
              </Skeleton>
            </List.Item>
          )}
        />
      </div>

      <style jsx>{`
        .main {
          max-width: 800px;
          margin: auto;
          color: #333;
          padding: 10px;
        }
      `}</style>
    </div>
  )
}

AnswerPaper.getInitialProps = ({req, query}) => {
  const current_user = req? req.current_user : window.current_user
  return {user: current_user, quizId: query.quizId}
}

export default AnswerPaper
