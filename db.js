
const seque = require('sequelize');
const sequeLize = new seque('banco', 'root', '', {
    dialect: 'mysql',
    host: 'localhost',
    port: 3306
});
module.exports = sequeLize