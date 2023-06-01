const {Sequelize} = require('sequelize');

module.exports = new Sequelize(
    'telegabot',
    'ida',
    'root',
    {
        host: '45.12.228.19',
        port: '5432',
        dialect: 'postgres'
    }
)