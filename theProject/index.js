// const passport = require('passport')
const express = require('express');
const user = require('./routs/user')
const product = require('./routs/product')
const auth = require('./routs/auth')
const thirdParty = require('./routs/thirdPartyRoute')
const app = express();
var bodyParser = require('body-parser');
const passport = require('passport');

app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

// app.use(express.json());
app.use(bodyParser.json({limit: '50mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
// app.use(bodyParser.json({limit: "50mb"}));
// app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}))
// app.use(express.json({limit: '50mb'}));
// app.use(express.urlencoded({limit: '50mb'}));
// app.use(express.urlencoded({limit: '50mb'}));
// bodyParser = {
//     json: {limit: '10mb', extended: true},
//     urlencoded: {limit: '10mb', extended: true}
//   };
app.use(express.static('public'));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user,cb){
    cb (null, user.id);
})
passport.deserializeUser(function (id,cb){
    cb (null, id);
})

app.use('/api/user',user);
app.use('/api/product',product)
app.use('/api/auth',auth)
app.use('/auth',thirdParty)

const port = process.env.PORT || 3050;

app.listen(port, () => console.log(`listnig on port ${port}......`)) 