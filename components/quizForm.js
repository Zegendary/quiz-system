import React from 'react'
import SearchSelect from './searchSelect'
import axios from 'axios'
import { Table, Button, Input } from 'antd'
import DragableTable from './DragableTable'
import PropTypes from 'prop-types'


const {TextArea} = Input
const columns = [
  {
    title: '题目',
    dataIndex: 'answerable.content',
  },
  {
    title: '类型',
    dataIndex: 'answerable_type',
    render: (text, record, index) => {
      return text === 'ChoiceQuestion' ? '选择题': '填空题'
    },
    width: 100
  }
];

const QuizForm = (props) => {
  const {user, onHandle, quiz, setQuiz, type} = props
  const [questions, setQuestions] = React.useState([])
  const [selectedRows, setSelectedRows] = React.useState([])
  const [courseIds, setCourseIds] = React.useState([])
  const [pager, setPager] = React.useState({
    page: 1,
    totalCount: 1
  })

  const onSelect = (value) => {
    let ids = value.map(v => v.key)
    setCourseIds(ids)
    fetchQuestions({
      courseIds: ids,
      page: 1
    })
  }

  const fetchQuestions = (params) => {
    axios("/api/questions",{
      params: params
    }).then(response => {
      setQuestions(response.data.questions)
      setPager(response.data.pager)
    });
  }

  const pageOnChange = (value) => {
    fetchQuestions({
      courseIds,
      page: value
    })
  }

  const rowSelection = {
    selectedRowKeys: selectedRows.map(r => r.id),
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(selectedRows)
    }
  };

  const onImport = () => {
    const questions = selectedRows.map(r => {
      return {
        content: r.answerable.content,
        type: r.answerable_type,
        options: r.answerable.options,
        answers: r.answerable.answers,
        preprocessor: r.answerable.preprocessor
      }
    })
    setQuiz({
      ...quiz,
      questions: [...quiz.questions, ...questions]
    })
    setSelectedRows([])
  }

  const columns1 = [
    {
      title: '题目',
      dataIndex: 'content',
    },
    {
      title: '类型',
      dataIndex: 'type',
      render: (text, record, index) => {
        return text === 'ChoiceQuestion' ? '选择题': '填空题'
      },
      width: 100
    },
    {
      title: '操作',
      width: 130,
      render: (text, record, index) => <>
        <Button size='small' onClick={() => editQuestion(text, index)}>编辑</Button>
        <Button size='small' style={{marginLeft: '4px'}} type="danger" onClick={() => deleteQuestion(index)}>删除</Button>
      </>
    }
  ];

  const editQuestion = (text, index) => {
    console.log("index",index, "record",text)
  }

  const deleteQuestion = (index) => {
    console.log("index",index)
  }

  return <div>
    {
      user.roles_mask > 0 ? <SearchSelect resourceName="courses" mapper={(course) =>{
          return {value: course.id, text: course.name}
        }} onSelect={onSelect}/> : null
    }
    <div className="actionWrapper">
      {
        user.roles_mask > 0 ? <div className="tableWrapper">
          <Table rowKey="id" pagination={{current: pager.page, total: pager.totalCount, onChange: pageOnChange}}
                 rowSelection={rowSelection} columns={columns} dataSource={questions} size="small" />
        </div>: null
      }
      <div className="action">
        <Button disabled={selectedRows.length === 0} onClick={onImport}>导入 &rarr;</Button>
        <Button disabled={quiz.questions.length === 0} onClick={onHandle}>
          {type === 'create' && "生成"}
          {type === 'update' && "更新"}
          &rarr;
        </Button>
        {/*<Button type="primary">添加</Button>*/}
      </div>
      <div className="tableWrapper">
        <Input addonBefore="试卷名" value={quiz.name} onChange={(e) => {setQuiz({...quiz, name: e.target.value})}}/>
        <TextArea
          value={quiz.description}
          onChange={(e) => {setQuiz({...quiz, description: e.target.value})}}
          placeholder="添加试卷描述"
          autoSize={{ minRows: 3, maxRows: 5 }}
        />
        <DragableTable columns={columns1} data={quiz.questions} setData={(qs) => {setQuiz({...quiz,questions: qs})}}/>
      </div>
    </div>
    <style jsx>{`
        .actionWrapper {
          display: flex;
          margin: 20px auto 20px auto;
          color: #333;
        }
        .tableWrapper{
          flex: 1
        }
        .tableWrapper > :global(*){
          margin: 10px 0;
        }
        .action{
          display: flex;
          flex-direction: column;
          margin: 20px;
        }
        .action > :global(button){
          margin: 10px 0!important;
        }
      `}</style>
  </div>
}

QuizForm.propTypes = {
  quiz: PropTypes.object.isRequired,
  setQuiz: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  onHandle: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

export default QuizForm