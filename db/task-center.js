const { taskCenterConfig } = require('../config')
const { Pool } = require('pg');

const pool = new Pool(taskCenterConfig);

module.exports = {
  query: (text, params) => pool.query(text, params),
};
