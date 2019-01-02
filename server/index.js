//Main starting point of the app
//initialization of server
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');


//DB setup
mongoose.connect('mongodb://localhost:auth/auth', { useNewUrlParser: true } );

//App setup
app.use(morgan('combined')); //morgan is logger
app.use(cors());
app.use(bodyParser.json({ type: '*/*'})); //any incoming request will be parsed as json
router(app);

//Server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on:', port);