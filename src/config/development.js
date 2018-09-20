module.exports = {
  env: 'development',
  db: process.env.DBURI,
  port: process.env.PORT || 4000,
  secret: process.env.SECRET,
};
