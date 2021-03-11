const { Pool, Client } = require('pg')
require('dotenv').config()
const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt')
const random = require('random')

const pool = new Pool({
    ssl: {
        rejectUnauthorized: false,
    },
})

async function tabel() {
    text = "SELECT * FROM accounts"
    res = await pool.query(text)
    console.log(res.rows)
}

// for add new user to database
router.post('/user', async (req, res) => {
    try {
        console.log("...............")
        const email = req.body.email
        const userName = req.body.userName
        const firstName = req.body.firstName
        const lastName = req.body.lastName
        let password = req.body.password
        const role = req.body.role
        const birthdate = req.body.birthDate
        const profileImg = req.body.profileImg
        // console.log(req.body.password)
        // console.log(req.body.email)
        const id = random.int(0, 999999)
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
        // ({ email,username,firstname,lastname,password,birthdate } = { bod, b: 20 });
        values = [email, userName, firstName, lastName, password, birthdate, profileImg, role, id]
        text1 = `SELECT (emailid) FROM users WHERE emailid = ('${email}')`
        check = await pool.query(text1) 
        if (check.rows[0] != undefined) {
            return res.status(400).json("user is alredy their");
        }
        text = "INSERT INTO users(emailid,username,firstname,lastname,password,birthdate,photo,role,id) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)"
        query = await pool.query(text, values)
        res.send("user add")
    }
    catch (err) {
        console.log(err)
        res.status(400).json(err.message);
    }
})

// for convert query array of objects to json
function queryToJSON(usersArry,userJSON) {
    //for get data from quey and convert to JSON
    for (currentRow = 0; currentRow < usersArry.rowCount; currentRow++) {
        let currentData = usersArry.rows[currentRow][`?column?`]
        currentData = currentData.replace(/[()]/g, '');
        currentData = currentData.split(",")
        currentDataObject = {
            email: currentData[0],
            userName: currentData[1],
            firstName: currentData[2],
            lastName: currentData[3],
            password: currentData[4],
            birthDate: currentData[5],
            role: currentData[6],
            id: currentData[7]
        }
        // console.log(currentDataObject)
        userJSON.push(currentDataObject)
    }
   return userJSON
}

// for get all user
router.get("/", async (req, res) => {
    text = `SELECT (emailid,username,firstname,lastname,password,birthdate,role,id) FROM users`
    const usersArry = await pool.query(text)
    // typeof(usersStr)
    // usersArry = usersStr.split(',');
    let userJSON = []
 
    userJSON = queryToJSON(usersArry,userJSON)
    // console.log(userJSON)
    res.json(userJSON)
});


//for update user in database
router.put('/', async (req, res) => {
    try {
        console.log("...............put")
        const email = req.body.email
        const userName = req.body.userName
        const firstName = req.body.firstName
        const lastName = req.body.lastName
        const role = req.body.role
        const birthdate = req.body.birthDate
        const id = req.body.id
        // const profileImg = req.body.profileImg
        console.log(userName, firstName, lastName, birthdate, role, id)
        // ({ email,username,firstname,lastname,password,birthdate } = { bod, b: 20 });
        values = [userName, firstName, lastName, birthdate, role, id]
        text = `UPDATE users SET (username,firstname,lastname,birthdate,role) = ('${userName}', '${firstName}', '${lastName}', '${birthdate}','${role}') WHERE id = ('${id}');`
        // text= `UPDATE users SET (username,firstname,lastname,birthdate,role) = VALUES($1,$2,$3,$4,$5) WHERE id = VALUES($6) ;`
        query = await pool.query(text)
        console.log("its done")
        res.send(req.body.username)
    }
    catch (err) {
        res.status(500).json(err)
        console.log(err)
    }
})

router.delete('/', async (req, res) => {
    try {
        const id = req.body.id
        text = `DELETE FROM users WHERE id = '${id}';`
        query = await pool.query(text)
        console.log("its done")
        res.send(req.body.username)
    }
    catch (err) {
        console.log(err)
        res.json(err)
    }
})


module.exports = router;


