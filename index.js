let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser')
let cors = require('cors');
let appRoot = require('app-root-path');
let winston = require('./api/config/winston');
require('dotenv').config()
app = express();
Invitation = require('./api/models/invitation')
User = require('./api/models/user')
var morgan = require('morgan');
let port = process.env.PORT;
let db = process.env.DB;
let host = process.env.HOST;



console.log("starting off in index.js");

// configuration =================
mongoose.Promise = global.Promise;


var mongoDB = `mongodb://${host}/${db}`;
// var mongoDB = `mongodb://mongo:${db}`;
mongoose.connect(mongoDB, { useNewUrlParser: true, useFindAndModify: false });

mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open to ' + mongoDB);
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
  console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
});

app.use(morgan('combined', { stream: winston.stream }))

// app.use(cors({origin: "http://localhost:3000/"}))
app.use(cors())


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/routes');
// routes(app)
app.use('/api', routes)
console.log(process.env.NODE_ENV)

// application -------------------------------------------------------------
if (process.env.NODE_ENV == 'development') {
  app.get('*', function (req, res) {
    res.sendFile(`${appRoot}/public/index.html`); // load the single view file (angular will handle the page changes on the front-end)
  });
}
if (process.env.NODE_ENV == 'maintenance') {
  app.get('*', function (req, res) {
    res.sendFile(`${appRoot}/public/index.html`); // load the single view file (angular will handle the page changes on the front-end)
  });
}
if (process.env.NODE_ENV == 'production') {

  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(require('path').resolve(__dirname, 'client', 'build', 'index.html'))
  })
}


app.listen(port);

console.log('RESTful API server started on: ' + port);


module.exports = app