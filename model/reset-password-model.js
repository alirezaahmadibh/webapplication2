const {DataTypes} = require('sequelize');
const sequelize = require('../database/sequelize-connect');

const ResetPassword = sequelize.define('ResetPassword', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    // Other model options go here
});

module.exports = ResetPassword; 