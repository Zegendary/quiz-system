// eslint-disable-next-line import/no-unresolved
import { Pool } from 'pg';

const pool = new Pool({
  user: 'zhangxinwang',
  host: 'localhost',
  database: 'task_center_development',
  password: '',
  port: 5432,
});

export default {
  query: (text, params) => pool.query(text, params),
};
