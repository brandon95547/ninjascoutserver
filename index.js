const Knex = require('knex');
const app = express()
const port = 5001
const express = require('express')
var parse = require('csv-parse');
require('dotenv').config()

const path = './ebay.csv'

// seed ebay sold listings for a interactive experience
var csvData=[];
fs.createReadStream(path)
    .pipe(parse({delimiter: ':'}))
    .on('data', function(csvrow) {
        console.log(csvrow);
        //do something with csvrow
        csvData.push(csvrow);
    })
    .on('end',function() {
      //do something with csvData
      console.log(csvData);
    });

app.get('/', (req, res) => {
  const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.PUBLIC_IP,
    port: 5432,
  };
  
  const knex = Knex({
    client: 'pg',
    connection: config,
  });

  return knex('ebay_sales').where({ ebay_sales_id: 2 })
    .then(row => {
      return res.send({ row })
    })
    .catch(err => {
      res.sendStatus(500)
      throw err
    })
  // res.sendFile('index.html', {root: __dirname})
});

app.listen(port, () => {
    console.log(`Now listening on port ${port}`); 
});