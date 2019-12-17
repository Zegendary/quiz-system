import React from 'react'
import Head from 'next/head'

const Dashboard = (props) => {

  return <div>
    <Head>
      <title>答卷系统-工作台</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
  </div>
}

Dashboard.getInitialProps = ({req}) => {
  const current_user = req? req.current_user : window.current_user
  return {user: current_user}
}

export default Dashboard