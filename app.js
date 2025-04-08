const express = require('express');
const dotenv = require('dotenv')
const dotenvExpand = require('dotenv-expand');
const session = require('./config/session.config.js');
const path = require('path');

dotenvExpand.expand(dotenv.config());

const app = express();
const PORT = process.env.PORT || 3000;

// Static + Body Parser
app.use(express.static('public/assets'));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session
app.use(session);

// Routes
app.use('/', require('./routes/index.routes'));
app.use('/', require('./routes/auth.routes'));

// Error Handling
app.use(require('./middlewares/errorHandler'));

app.listen(PORT, () => {
    console.log(`SSO server is running on port ${PORT}...`);
});
