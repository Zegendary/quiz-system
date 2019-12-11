import React from 'react'
import Head from 'next/head'
import Nav from '../components/nav'

const Home = ({user}) => (
  <div>
    <Head>
      <title>答卷系统</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Nav user={user}/>

    <div className="hero">
      <h1 className="title">欢迎来到答卷系统</h1>

      <div className="row">
        <a href="createQuiz" className="card">
          <h3>新建答卷 &rarr;</h3>
        </a>
        <a href="/dashboard" className="card">
          <h3>控制台 &rarr;</h3>
        </a>
        <a href="/quizzes" className="card">
          <h3>试卷列表 &rarr;</h3>
        </a>
      </div>
    </div>

    <style jsx>{`
      .hero {
        width: 100%;
        color: #333;
      }
      .title {
        margin: 0;
        width: 100%;
        padding-top: 80px;
        line-height: 1.15;
        font-size: 48px;
      }
      .title,
      .description {
        text-align: center;
      }
      .row {
        max-width: 880px;
        margin: 80px auto 40px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
      }
      .card {
        padding: 18px 18px 24px;
        width: 220px;
        text-align: left;
        text-decoration: none;
        color: #434343;
        border: 1px solid #9b9b9b;
      }
      .card:hover {
        border-color: #067df7;
      }
      .card h3 {
        margin: 0;
        color: #067df7;
        font-size: 18px;
      }
      .card p {
        margin: 0;
        padding: 12px 0 0;
        font-size: 13px;
        color: #333;
      }
    `}</style>
  </div>
)

export default Home
