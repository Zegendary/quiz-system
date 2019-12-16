const Sequelize = require('sequelize');
const path = require('path');

const sequelize = new Sequelize(undefined,undefined, undefined, {
  host: 'localhost',
  dialect: 'sqlite',

  // SQLite only
  storage: path.join(__dirname, '../quiz-xdml.sqlite')
});

sequelize
  .authenticate()
  .then(function(err) {
    console.log('Connection has been established successfully.');
  })
  .catch(function (err) {
    console.log('Unable to connect to the database:', err);
  });

module.exports = sequelize;