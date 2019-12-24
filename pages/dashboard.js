import React, {useState, useEffect} from 'react'
import Head from 'next/head'
import axios from 'axios'
import {Table, Tabs} from 'antd'

const { TabPane } = Tabs;

const Dashboard = (props) => {
  const [quizzes, setQuizzes] = useState([])
  const [answerPapers, setAnswerPapers] = useState([])
  const [quizPager, setQuizPager] = useState({
    page: 1,
    totalCount: 1
  })
  const [answerPaperPager, setAnswerPaperPager] = useState({
    page: 1,
    totalCount: 1
  })

  useEffect(()=>{
    window.current_user = props.user
    fetchMyQuizzes(1)
    fetchMyAnswerPapers(1)
  }, [])

  const quizColumns = [
    {
      title: '试卷名',
      dataIndex: 'name',
      render: (text, record, index) => {
        return <a href={`/quizzes/${record.id}/edit`}>{text}</a>
      },
    },
    {
      title: '回答数量',
      dataIndex: 'answerPapers',
      render: (text, record, index) => {
        return <a href={`/quizzes/${record.id}/answerPapers`}>{text.length}</a>
      }
    }
  ];

  const answerPaperColumns = [
    {
      title: '试卷名',
      dataIndex: 'quiz.name',
      render: (text, record, index) => {
        return <a href={`/answerPapers/${record.id}`}>{text}</a>
      },
    },
    {
      title: '得分',
      dataIndex: 'marks',
      render: (text, record, index) => {
        return `${text.filter(m => m).length}/${text.length}`
      },
      width: 100
    }
  ];

  const fetchMyQuizzes = (page) => {
    axios.get('/api/quizzes', {
      params: {
        page,
        creatorId: props.user.id
      }
    }).then(({data}) =>{
      setQuizzes(data.quizzes)
      setQuizPager({
        page,
        totalCount: data.totalCount
      })
    })
  }

  const fetchMyAnswerPapers = (page) =>{
    axios.get('/api/answerPapers', {
      params: {
        page,
        creatorId: props.user.id
      }
    }).then(({data}) =>{
      setAnswerPapers(data.answerPapers)
      setAnswerPaperPager({
        page,
        totalCount: data.totalCount
      })
    })
  }

  return <div>
    <Head>
      <title>答卷系统-工作台</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <div id="dashboard" className="container">
      <Tabs defaultActiveKey="1">
        <TabPane tab="我创建的答卷" key="1">
          <Table rowKey="id" pagination={{current: quizPager.page, total: quizPager.totalCount, onChange: (value) => fetchMyQuizzes(value)}}
                 columns={quizColumns} dataSource={quizzes} size="small" />
        </TabPane>
        <TabPane tab="我的回答" key="2">
          <Table rowKey="id" pagination={{current: answerPaperPager.page, total: answerPaperPager.totalCount, onChange: (value) => fetchMyAnswerPapers(value)}}
                 columns={answerPaperColumns} dataSource={answerPapers} size="small" />
        </TabPane>
      </Tabs>
    </div>
    <style jsx>{`
        .container {
          max-width: 800px;
          margin: 10px auto;
          color: #333;
        }
      `}</style>
  </div>
}

Dashboard.getInitialProps = ({req}) => {
  const current_user = req? req.current_user : window.current_user
  return {user: current_user}
}

export default Dashboard