var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');

//constants
var PORT = 3000;
var HOST = '0.0.0.0';

var app = express();


//use cookie
//app.use(cookie());


//use body parser for url & json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//configure routes
app.get('/home', function (req, res) {
    res.send('This is test home page');
});

//setup the app
app.listen(PORT, function () {
    console.log(`Running on http://${HOST}:${PORT}`);
});

