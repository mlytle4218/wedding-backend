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
// port = process.env.PORT || 3001;
// let db = process.env.DB || config.db;
// let host = process.env.HOST || config.host
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
mongoose.connection.on('error',function (err) {  
  console.log('Mongoose default connection error: ' + err);
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
  console.log('Mongoose default connection disconnected'); 
});

app.use(morgan('combined', { stream: winston.stream }))

// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // add this line to include winston logging
//   winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// app.use(cors({origin: "http://localhost:3000/"}))
app.use(cors())


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/routes');
// routes(app)
app.use('/api', routes) 

// application -------------------------------------------------------------
app.get('*', function(req, res) {
  res.sendFile(`${appRoot}/public/index.html`); // load the single view file (angular will handle the page changes on the front-end)
}); 

app.listen(port);

console.log('RESTful API server started on: ' + port);

// console.log(process.env.WEDDING_BACKEND_SECRET_KEY)

module.exports = app