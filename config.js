var connectionString = process.env.DATABASE_URL || 'postgres://' + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD + '@localhost/blog';

module.exports = connectionString;