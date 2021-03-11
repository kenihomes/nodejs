const { Pool, Client } = require('pg')
require('dotenv').config()
const express = require('express')
const router = express.Router();
const random = require('random');
// const { route } = require('./user');

const pool = new Pool({
    ssl: {
        rejectUnauthorized: false,
    },
})

// for add new product
router.post('/product', async (req, res) => {
    try {
        const productName = req.body.productName
        const company = req.body.company
        const quantity = req.body.quantity
        const price = req.body.price
        const productType = req.body.productType
        const photo = req.body.photo
        const id = random.int(0, 999999)
        values = [productName, company, quantity, price, productType, photo, id]
        text1 = `SELECT (productName) FROM product WHERE productName = ('${productName}')`
        check = await pool.query(text1)
        if (check.rows[0] != undefined) {
            return res.status(404).json("product is alredy their  ");
        }
        text = "INSERT INTO product(productName,company,quantity,price,type,photo,id) VALUES($1,$2,$3,$4,$5,$6,$7)"
        query = await pool.query(text, values)
        res.json("product added")
    }
    catch (err) {
        console.log(err)
        res.json(err.message)
    }
})

function queryToJSON(productArry,productJSON) {
    //for get data from quey and convert to JSON
    for (currentRow = 0; currentRow < productArry.rowCount; currentRow++) {
        let currentData = productArry.rows[currentRow][`?column?`]
        currentData = currentData.replace(/[()]/g, '');
        currentData = currentData.split(",")
        currentDataObject = {
            productName: currentData[0],
            company: currentData[1],
            quantity: currentData[2],
            price: currentData[3],
            productType: currentData[4],
            id: currentData[5]
        }
        // console.log(currentDataObject)
        productJSON.push(currentDataObject)
    }
}

router.get("/", async (req, res) => {
    try{

        text = `SELECT (productName,company,quantity,price,type,id) FROM product`
        let productArry = await pool.query(text)
        // typeof(usersStr)
        // usersArry = usersStr.split(',');
        let productJSON = []
    
    queryToJSON(productArry,productJSON)
    // console.log(userJSON)
    res.json(productJSON)
}
catch (err) {
    res.json(err)
}
});

router.put('/', async (req, res) => {
    try {
        console.log("...............product put")
        const productName = req.body.productName
        const company = req.body.company
        const quantity = req.body.quantity
        const price = req.body.price
        const productType = req.body.productType
        const id = req.body.id
        // const profileImg = req.body.profileImg
        // console.log(productName, company, quantity, price, productType,id)

        text = `UPDATE product SET (productName,company,quantity,price,type) = ('${productName}', '${company}', '${quantity}', '${price}','${productType}') WHERE id = ('${id}');`
        query = await pool.query(text)
        console.log("its done")
        res.send(req.body.username)
    }
    catch (err) {
        res.json(err)
    }
})

router.delete('/', async (req, res) => {
    try {
        const id = req.body.id
        text = `DELETE FROM product WHERE id = '${id}';`
        query = await pool.query(text)
        console.log("its done")
        res.send(req.body.username)
    }
    catch (err) {
        console.log(err)
    }
})

router.put('/customer', async (req, res) => {
    try {
        console.log("...............cust put")
        const quantity = req.body.quantity
        const id = req.body.id
        // const profileImg = req.body.profileImg
        console.log(quantity,id)

        text = `UPDATE product SET (quantity) = ('${quantity}') WHERE id = ('${id}');`
        query = await pool.query(text)
        console.log("its done")
        res.send(req.body.username)
    }
    catch (err) {
        console.log(err)
    }
})


module.exports = router;
