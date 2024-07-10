'use strict';
module.exports = (sequelize, DataTypes) => {
  var Conf = sequelize.define('Conf', {
    coeficiente: DataTypes.FLOAT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Conf;
};