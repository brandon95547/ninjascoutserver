const Knex = require('knex');
const port = 5001
const express = require('express')
const fs = require('fs')
const app = express()
const cors = require('cors');
app.use(cors({origin: true, credentials: true}))
const { parse } = require('csv-parse')
require('dotenv').config()

const csvPath = './ebay_sales.csv'

const config = {
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  host: process.env.POSTGRES_HOST,
  port: 5432,
};

const knex = Knex({
  client: 'pg',
  connection: config,
})

const seedEbaySales = (res) => {
  fs.createReadStream(csvPath)
    .pipe(parse({delimiter: "\n", columns: true, trim: true, quote: ''}))
    .on('data', function (csvRow) {
      // grab the 1st instance of each object and then split the comma delimited string into an array
      const row = csvRow[Object.keys(csvRow)[0]].split(',')

      // declare our item values
      const ebay_sales_title = row[1]
      const ebay_sales_price = row[2]
      const ebay_sales_itemid = row[3]
      const ebay_sales_date = row[4]
      const ebay_sales_condition = row[5]
      const ebay_sales_cat = row[6]

      knex('ebay_sales').where({ ebay_sales_itemid })
        .then(row => {
          if (row.length) {
            // console.log('found')
          } else {
            knex('ebay_sales').insert({
              ebay_sales_title: ebay_sales_title.replace(/[^\d\w ]/g, ""),
              ebay_sales_condition: ebay_sales_condition.replace(/[^\d\w ]/g, ""),
              ebay_sales_cat: ebay_sales_cat.replace(/[^\d\w ]/g, ""),
              ebay_sales_itemid: ebay_sales_itemid.replace(/[^\d]/g, ""),
              ebay_sales_price: ebay_sales_price.replace(/[^\d.]/g, ""),
              ebay_sales_date,
              active: 1
            })
              .then(function (result) {
                // console.log(result)
                  // res.json({ success: true, message: 'ok' });
              })
              .catch(err => {
                console.log(err)
                // res.send('not found')
                // throw err
              })
          }
        })
        .catch(err => {
          console.log(err)
          // throw err
        })

    })
    .on('end',function() {
      res.send('done')
    }); 
}

app.get('/seed', (req, res) => {
  seedEbaySales(res)
})

app.get('/sales', (req, res) => {
  const keyword = req.query.keyword
  console.log(keyword)
  const chunks = keyword.split(' ')
  let selectCondition = ''
  chunks.forEach((element, index) => {
    if (index !== 0) {
      selectCondition += ` and LOWER(ebay_sales_title) like '%${element}%'`
    }
  });
  const sql = `SELECT * FROM ebay_sales WHERE LOWER(ebay_sales_title) like '%${chunks[0]}%'${selectCondition}`
  return knex.raw(sql)
    .then(row => {
      return res.send({ row: row.rows })
    })
    .catch(err => {
      res.send(err)
      // res.sendStatus(500)
      throw err
    })
  // res.sendFile('index.html', {root: __dirname})
});

app.listen(port, () => {
    console.log(`Now listening on port ${port}`); 
});