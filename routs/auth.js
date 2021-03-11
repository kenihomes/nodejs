// const _ = require('lodash');
const bcrypt = require('bcrypt')
// const { User } = require('../model/user')
const express = require('express')
const router = express.Router();
const { Pool, Client } = require('pg')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')

const pool = new Pool({
    ssl: {
        rejectUnauthorized: false,
    },
})

generateAuthToken = function (user) {
    const token = jwt.sign(
        {
            id: user[3],
            role: user[2],
            username: user[4]
        }
        , process.env.jwtprivatekey, { expiresIn: "3600000ms" })
    return token;
}

//authenticat user by id password 

router.post('/', async (req, res) => {
    // const { error } = validate(req.body);
    // if (error) return res.status(400).send(error.details[0].message);
    try {
        email = req.body.email
        text = `SELECT (emailid,password,role,id,username) FROM users WHERE emailid = ('${email}')`
        let user = await pool.query(text);
        if (user.rows[0] == undefined) {
            return res.status(400).send('invalid email or password');
        }
        console.log(req.body)
        user = user.rows[0][`?column?`]
        user = user.replace(/[()]/g, '');
        user = user.split(",")

        // res.json(user)
        const validPassword = await bcrypt.compare(req.body.password, user[1])
        if (!validPassword) {
            return res.status(400).send('invalid email or password');
        }
        // console.log(user)
        const token = generateAuthToken(user);
        JSON.stringify(token)
        role = user[2]
        // console.log(role)
        data = { token, role }
        res.send(JSON.stringify(data))
    }
    catch (err) {
        res.status(400).json(err.message);
    }
})

router.get('/me', auth, async (req, res) => {
    console.log("lalalall")
    console.log(req.user)
    text = `SELECT (username,role) FROM users WHERE id ='${req.user.id}'`
    let usersArry = await pool.query(text)
    console.log(usersArry)
    usersArry = usersArry.rows[0][`?column?`]
    usersArry = usersArry.replace(/[()]/g, '');
    usersArry = usersArry.split(",")
    // console.log(usersArry)
    // let user = await User.findById(req.user._id).select('-password').
    // user = JSON.stringify(user)
    res.json(usersArry)
});

module.exports = router;