const express = require('express')
const app = express()
const port = 3001
const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Educational_programs',
    password: "123456",
    port: "5432"
})
app.get('/', (req, res) => {
  console.log(pool.query("SELECT * FROM EducationalPrograms", 
    (error, results) => {
        if(results && results.rows) {
           res.status(200).send(results.rows);
        }
    }
))
})

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})