var config = require('./config');
var dbConfig = global.gConfig.database_config_pg;
module.exports = {
    HOST: dbConfig.host,
    USER: dbConfig.user,
    PASSWORD: dbConfig.password,
    DB: dbConfig.database,
    dialect: "postgres",
    port:"5432",
    pool: {
      max: 5,
      min: 0
    }
  };
  