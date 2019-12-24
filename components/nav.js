import React from 'react'
import Link from 'next/link'
import { Button } from 'antd'

const Nav = ({user, title}) => (
  <nav>
    <div>{title}</div>
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
        max-width: 800px;
        margin: auto;
        display: flex;
        align-items: center;
      }
      ul {
        padding: 10px 0;
        margin: 0;
        flex: 1;
        display: flex;
        justify-content: flex-end;
      }
      li {
        display: flex;
        padding: 6px 8px;
      }
    `}</style>
  </nav>
)

export default Nav
