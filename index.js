// Authors:
// Shane Oatman https://github.com/shoatman
// Sunil Bandla https://github.com/sunilbandla
// Daniel Dobalian https://github.com/danieldobalian

var express = require("express");
var morgan = require("morgan");
var passport = require("passport");
var BearerStrategy = require('passport-azure-ad').BearerStrategy;

var options = {
    identityMetadata: "https://login.microsoftonline.com/ef3131b7-4c1b-4205-8a07-645cc0414c3d/v2.0/.well-known/openid-configuration",
    clientID: "c4e2ac92-6393-4714-bb4a-7c6d31dd614d",
    validateIssuer: false,
    loggingLevel: 'warn',
    passReqToCallback: false
};

// Check for client id placeholder
if (options.clientID === 'YOUR_CLIENT_ID') {
    console.error("Please update 'options' with the client id (application id) of your application");
    return;
}

var bearerStrategy = new BearerStrategy(options,
    function (token, done) {
        // Send user info using the second argument
        done(null, {}, token);
    }
);

var app = express();
app.use(morgan('dev'));

app.use(passport.initialize());
passport.use(bearerStrategy);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/hello",
    passport.authenticate('oauth-bearer', {session: false}),
    function (req, res) {
        var claims = req.authInfo;
        console.log('User info: ', req.user);
        console.log('Validated claims: ', claims);
        
        res.status(200).json({'name': claims['name']});
    }
);

var port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log("Listening on port " + port);
});
