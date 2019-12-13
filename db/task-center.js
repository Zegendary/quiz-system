const { Pool } = require('pg');

const pool = new Pool({
  user: 'zhangxinwang',
  host: 'localhost',
  database: 'task_center_development',
  password: '',
  port: 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
