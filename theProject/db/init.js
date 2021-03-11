//For secure connection:
// const fs = require('fs');
const { Pool, Client } = require('pg')
require('dotenv').config()

// Configure the database connection.

const pool = new Pool({ssl: {
      rejectUnauthorized: false,
    },})

// const pool =  new Pool ({
//   user: "kishan",
//   password: "Savn-d0uDwvm78qY",
//   host: "free-tier.gcp-us-central1.cockroachlabs.cloud",
//   database: "steep-boar-1057.defaultdb",
//   port: 26257,
//   ssl: {
//     rejectUnauthorized: false,
//   },
//   //For secure connection:
//   /*ssl: {
//         ca: fs.readFileSync('/certs/ca.crt')
//             .toString()
//     }*/
// });

async function initusers(){
const res = await pool.query(`CREATE TABLE IF NOT EXISTS users (
  id STRING PRIMARY KEY,
  emailId STRING UNIQUE,
  username STRING ,
  firstname STRING ,
  lastname STRING ,
  password STRING ,
  birthdate DATE ,
  photo STRING NULL,
  role STRING )`)

  // const res = await pool.query(`CREATE TABLE IF NOT EXISTS users (
  //   id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  //   emailId STRING NOT NULL UNIQUE,
  //   username STRING NOT NULL,
  //   firstname STRING NOT NULL,
  //   lastname STRING NOT NULL,
  //   password STRING ,
  //   birthdate DATE NOT NULL,
  //   photo STRING NULL,
  //   role STRING NOT NULL)`)
console.log(res)
}
initusers();

async function initproducts(){
  try{

    const res = await pool.query(`CREATE TABLE IF NOT EXISTS product (
      id STRING PRIMARY KEY,
      productName STRING UNIQUE,
      company STRING,
      quantity INT,
      price INT,
      type STRING,
      photo STRING[])`)
      
      console.log(res)
    }
    catch (err) {
      console.log(err)
    }
  }
  initproducts();
   

  module.exports.pool =  pool ;
  // module.exports = initproducts;