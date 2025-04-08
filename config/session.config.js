const session = require('express-session');
const redisClient = require('./redis.config');
const RedisStore = require('connect-redis').RedisStore;

module.exports = session({
  store: new RedisStore({
    client: redisClient,
    prefix: 'sso_server_sess:',
  }),
  secret: process.env.SESSION_SECRET || 'your_default_secret',
  name: 'sso-server-app',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 10 * 60 * 60 * 1000,
    sameSite: 'Lax',
  },
});
