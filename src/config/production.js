module.exports = {
  env: 'production',
  db: process.env.DBURI,
  port: process.env.PORT || 4000,
  secret: process.env.SECRET,
};
