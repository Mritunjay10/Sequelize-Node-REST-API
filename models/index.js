'use strict';

//sequelize-auto -o "./models" -d indi_rest_api -h localhost -u mritunjay -p 3306 -x qwerty -e mysql
//sequelize-auto -o "./models" -d csell -h localhost -u root -p 3306 -x qwerty -e mysql
//sequelize-auto -o "./models" -d indilabz_csell -h localhost -u csellnp -p 3306 -x csell@!!@@ -e mysql
const ZongJi = require('zongji');
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};
const Op = Sequelize.Op;

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
      config.database,
      config.username,
      config.password,
      config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

/*
timestamps: false,
timezone: '+5:30'*/
