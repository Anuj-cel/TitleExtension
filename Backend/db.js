const {Sequelize}=require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});
const dbConnect = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

  
    await sequelize.sync();
    console.log("✅ All models synchronized.");
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};
module.exports={dbConnect,sequelize};