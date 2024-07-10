'use strict';
module.exports = (sequelize, DataTypes) => {
  var Mail = sequelize.define('Mail', {
    contenido: DataTypes.STRING,
    check: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Mail;
};