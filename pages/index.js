import React from 'react'
import Head from 'next/head'
import Nav from '../components/nav'
import { List, Avatar, Button, Skeleton } from 'antd';
import axios from 'axios'

const Home = (props) => {
  const [state, setState] = React.useState({
    quizzes: [],
    initLoading: true,
    page: 1,
    totalCount: 1,
    keyword: ''
  });

  const { user } = props
  const {quizzes, initLoading, keyword, page, totalPage} = state

  React.useEffect(() => {
    getQuizzes(1)
  }, [])

  const onLoadMore = () => {
    getQuizzes(state.page + 1)
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
        quizzes: [quizzes, ...response.data.quizzes],
        initLoading: false,
        page: response.data.page,
        totalPage: response.data.totalPage
      })
    })
  }

  const loadMore =
    !initLoading && (page !== totalPage) ? (
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
              actions={[<a key="list-loadmore-edit">edit</a>, <a key="list-loadmore-more">more</a>]}
            >
              <Skeleton avatar title={false} loading={item.loading} active>
                <List.Item.Meta
                  avatar={
                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                  }
                  title={<a href="https://ant.design">{item.name.last}</a>}
                  description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                />
                <div>content</div>
              </Skeleton>
            </List.Item>
          )}
        />
      </div>

      <style jsx>{`
        .main {
          max-width: 1000px;
          margin: auto;
          color: #333;
        }
      `}</style>
    </div>
  )
}

export default Home
