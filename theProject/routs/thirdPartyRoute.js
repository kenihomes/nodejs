const _ = require('lodash');
const express = require('express')
const router = express.Router();
const jwt = require('jsonwebtoken')
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// const GitHubStrategy = require('passport-github').Strategy;
const { Pool, Client } = require('pg')

let token
const pool = new Pool({
    ssl: {
        rejectUnauthorized: false,
    },
})

generateAuthTokenT = function (user) {
    console.log("hear")
    token = jwt.sign(
        {
            id: user[0],
            role: user[1],
            username: user[2]
        }
        , process.env.jwtprivatekey, { expiresIn: "3600000ms" })
    return token;
}

router.get('/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: 'index.html' }),
    function (req, res) {
        try {

            res.redirect('/xyz.html'); //res.send( JSON.stringify(token));
        }
        catch (e) {
            console.log(e)
            res.send(e)
        }
    });

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3050/auth/google/callback"
},
    async function (accessToken, refreshToken, profile, done) {
        done(null, profile);
        // console.log(profile)
        googleprofile = profile
        text = `SELECT (role,id,username) FROM users WHERE id = ('${profile.id}')`
        thirdParty = await pool.query(text)
        // console.log(thirdParty)
        if (thirdParty.rowCount != 0) {
            let currentData = thirdParty.rows[0][`?column?`]
            currentData = currentData.replace(/[()]/g, '');
            currentData = currentData.split(",")
            currentData[2] = currentData[2].replace("'", "")
            user = [currentData[1], currentData[0], currentData[2]]
            // console.log(currentData)
            console.log("user is already there")
            token = generateAuthTokenT(user)
            console.log(token)
            return
        }
        else {
            username = profile.displayName
            firstname = profile.name.givenName
            lastname = profile.name.familyName
            role = "Customer"
            id = profile.id
            values = [username, firstname, lastname, role, id]
            // console.log(values)
            text = "INSERT INTO users(username,firstname,lastname,role,id) VALUES($1,$2,$3,$4,$5)"
            query = await pool.query(text, values)
            tokenVal = [id, role, username]
            token = generateAuthTokenT(tokenVal)
        }
    }

));


router.get('/auth/twitter', passport.authenticate('twitter'));

router.get('/twitter/callback',
  passport.authenticate('twitter', { successRedirect: '/xyz.html',
                                     failureRedirect: 'index.html' }));


  passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: "http://localhost:3050/auth/twitter/callback"
  },
 async function(atoken, tokenSecret, profile, done) {
    done(null, profile);
    console.log(profile);
    text = `SELECT (role,id,username) FROM users WHERE id = ('${profile._json.id}')`
        thirdParty = await pool.query(text)
        console.log("+++++++++++++++++")
        console.log(thirdParty)
        if (thirdParty.rowCount != 0) {
            let currentData = thirdParty.rows[0][`?column?`]
            currentData = currentData.replace(/[()]/g, '');
            currentData = currentData.split(",")
            currentData[2] = currentData[2].replace("'", "")
            user = [currentData[1], currentData[0], currentData[2]]
            // console.log(currentData)
            console.log("user is already there")
            token = generateAuthTokenT(user)
            console.log(token)
            return
        }
        else {
            username = profile._json.name
            role = "Customer"
            id = profile._json.id
            values = [username,role, id]
            // console.log(values)
            text = "INSERT INTO users(username,role,id) VALUES($1,$2,$3)"
            query = await pool.query(text, values)
            tokenVal = [id, role, username]
            token = generateAuthTokenT(tokenVal)
        }
  }
));

router.get('/xyz', (req, res) => {
    res.send(JSON.stringify(token))
    console.log(".........")
})

module.exports = router;

