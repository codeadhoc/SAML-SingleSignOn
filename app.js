/**
 * SSO INTERGRATION
 */
var https = require('https');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var saml = require('passport-saml');
var fs = require('fs');

const PORT = 3000;


// Saml Configurations attributes
const samlConfig = {
    issuer: "EnterpriseCustomApp",
    entityId: "Saml-SSO-App",
    callbackUrl: "https://3.84.95.177:3000/login/callback",
    signOut: "https://3.84.95.177:3000/signout/callback",
    entryPoint: "https://3.84.95.177/realms/EnterpriseApps/protocol/saml",
};

// For running apps on https mode
const sp_pub_cert = fs.readFileSync('sp-pub-key.pem', 'utf8');
const sp_pvk_key = fs.readFileSync('sp-pvt-key.pem', 'utf8');

//  from idp's metadata
const idp_cert = fs.readFileSync('idp-pub-key.pem', 'utf8');

passport.serializeUser(function (user, done) {
    console.log('-----------------------------');
    console.log('serialize user');
    console.log(user);
    console.log('-----------------------------');
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    console.log('-----------------------------');
    console.log('deserialize user');
    console.log(user);
    console.log('-----------------------------');
    done(null, user);
});

const samlStrategy = new saml.Strategy({
    callbackUrl: samlConfig.callbackUrl,
    entryPoint: samlConfig.entryPoint,
    issuer: samlConfig.issuer,
    identifierFormat: null,
    decryptionPvk: sp_pvk_key,
    cert: [idp_cert, idp_cert],
    privateCert: fs.readFileSync('sp-pvt-key.pem', 'utf8'),
    validateInResponseTo: true,
    disableRequestedAuthnContext: true,

}, (profile, done) => {
    console.log('passport.use() profile: %s \n', JSON.stringify(profile));
    return done(null, profile);
});


const app = express();
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
}));

passport.use('samlStrategy', samlStrategy);
app.use(passport.initialize({}));
app.use(passport.session({}));


app.get('/',
    (req, res) => {
        res.send('Test Home Page');
    }
);

app.get('/login',
    (req, res, next) => {
        console.log('-----------------------------');
        console.log('/Start login handler');
        next();
    },
    passport.authenticate('samlStrategy'),
);

app.post('/login/callback',
    (req, res, next) => {
        console.log('/Start login callback ');
        next();
    },
    passport.authenticate('samlStrategy'),
    (req, res) => {
        console.log("/SSO payload");
        console.log(req.user);
        res.send(req.user);
    }
);

// if https server
const server = https.createServer({
    'key': sp_pvk_key,
    'cert': sp_pub_cert
}, app).listen(PORT, () => {
    console.log('Listening on https://localhost:%d', server.address().port)
});