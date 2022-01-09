const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const http = require('http');
const indexRouter = require('./routes/index');
const uploadRouter = require('./routes/upload');
require('./websocket');

// Express Configuration
const app = express();
app.use(cors({
    origin: 'http://localhost:4200'
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/api/video', uploadRouter);

// Server Configuration
const server = http.createServer(app);
const port = process.env.PORT || '3000';
server.listen(port, () => {
    console.log('Http Listening on ' + port);
});
