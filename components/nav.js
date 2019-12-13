import React from 'react'
import Link from 'next/link'
import { Button } from 'antd'

const Nav = ({user}) => (
  <nav>
    <div className="logo">
      <Link href="/">
        <a>欢迎来到答卷系统</a>
      </Link>
    </div>
    {
      user ? <ul>
        <li>
          <Link href="/dashboard">
            <a><Button>工作台 &rarr;</Button></a>
          </Link>
        </li>
        <li>
          <Link href="/createQuiz">
            <a><Button>新建答卷 &rarr;</Button></a>
          </Link>
        </li>
      </ul>: <ul>
        <li>
          <a href="https://user.xiedaimala.com">登录</a>
        </li>
      </ul>
    }

    <style jsx>{`
      :global(body) {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, Avenir Next, Avenir,
          Helvetica, sans-serif;
      }
      nav {
        text-align: center;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      ul {
        flex: 1;
        display: flex;
        justify-content: flex-end;
      }
      nav > ul {
        padding: 4px 16px;
      }
      li {
        display: flex;
        padding: 6px 8px;
      }
      a {
        color: #067df7;
        text-decoration: none;
        font-size: 13px;
      }
    `}</style>
  </nav>
)

export default Nav
