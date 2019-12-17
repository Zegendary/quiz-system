import React from 'react'
import Head from 'next/head'
import Nav from '../components/nav'
import { List, Avatar, Button, Skeleton } from 'antd';
import axios from 'axios'
import Link from 'next/link'

const Home = (props) => {
  const [state, setState] = React.useState({
    quizzes: [],
    initLoading: true,
    page: 1,
    totalCount: 1,
    keyword: ''
  });

  const { user } = props
  const {quizzes, initLoading, keyword, page, totalCount} = state

  React.useEffect(() => {
    window.current_user = user
    getQuizzes(1)
  }, [])

  const onLoadMore = () => {
    getQuizzes(page + 1)
  }

  const getQuizzes = (page) => {
    setState({...state, initLoading: true})
    axios.get('/api/quizzes', {
      params: {
        page,
        keyword: state.keyword
      }
    }).then((response) =>{
      setState({
        ...state,
        quizzes: [...quizzes, ...response.data.quizzes],
        initLoading: false,
        page: response.data.page,
        totalCount: response.data.totalCount
      })
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
        <title>答卷系统-首页</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Nav user={user}/>

      <div className="main">
        <List
          loading={initLoading}
          itemLayout="horizontal"
          loadMore={loadMore}
          dataSource={quizzes}
          renderItem={item => (
            <List.Item
              key={item.id}
              actions={[<a key="list-loadmore-edit">查看</a>]}
            >
              <Skeleton avatar title={false} loading={initLoading} active>
                <List.Item.Meta
                  title={<Link href={`/quizzes/${item.id}`}><a>{item.name}</a></Link>}
                  description={item.description}
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
        }
      `}</style>
    </div>
  )
}

Home.getInitialProps = ({req}) => {
  const current_user = req? req.current_user : window.current_user
  return {user: current_user}
}

export default Home
