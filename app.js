var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var saml = require('passport-saml');
var fs = require('fs');

//constants
var PORT = 3000;

//read ceritificate
var fs_sp_pvt_key = 'sp-pvt-key.pem';
var sp_pvt_key = fs.readFileSync(fs_sp_pvt_key, 'utf8');

var fs_idp_pub_key = 'idp-pub-key.pem';
var idp_pub_key = fs.readFileSync(fs_idp_pub_key, 'utf8');


//setup saml
var samlstrategy = new saml.Strategy({
    callbackUrl: 'https://ec2-52-90-86-169.compute-1.amazonaws.com:3000/login/callback',
    entryPoint: 'https://ec2-52-90-86-169.compute-1.amazonaws.com/realms/EnterpriseApps/protocol/saml',
    issuer: 'EnterpriseCustomApp',
    identifierFormat: 'null',
    decryptionPvk: sp_pvt_key,
    privateKey: sp_pvt_key,
    validateInResponseTo: false,
    disableRequestedAuthnContext: true,
    cert: idp_pub_key
}, function (profile, done) {
    return done(null, profile);
});

//setup passport & configure SAML strategy
passport.serializeUser(function (user, done) {
    console.log(user);
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    console.log(user);
    done(null, user);
});

passport.use('samlStrategy', samlstrategy);

//init app
var app = express();

//configure app
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize({}));
app.use(passport.session({}));

//configure routes
app.get('/home', function (req, res) {
    res.send('This is test home page');
});

//login
app.get('/login', function (req, res, next) {
    console.log('inside login handler');
    next();
}, passport.authenticate('samlStrategy')
);

//post login
app.post('/login/callback',
    function (req, res, next) {
        console.log('-----------------------------');
        console.log('/Start login callback ');
        next();
    },
    passport.authenticate('samlStrategy'),
    function (req, res) {
        console.log('-----------------------------');
        console.log('login call back dumps');
        console.log(req.user);
        console.log('-----------------------------');
        res.send('Log in Callback Success');
    }
);


//setup the app
app.listen(PORT, function () {
    console.log(`Running on http://localhost:${PORT}`);
});

