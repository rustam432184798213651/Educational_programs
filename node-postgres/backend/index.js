const express = require('express')
const app = express()
const port = 3001
const postgre = require('./database_interaction')

app.use(express.json());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers"
  );
  next();
});

app.get('/getAllPrograms', (req, res) => {
  postgre.executeQuery("SELECT * FROM EducationalPrograms").then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  });
})

app.get('/getAllDisciplinesByProgramName/:ProgramName', (req, res) => {
  const ProgramName = "'" + req.params.ProgramName + "'";
  const query = "SELECT D.name FROM DisciplinesIdToEducationalProgramId AS DTEP JOIN EducationalPrograms AS EP ON DTEP.educationalProgramId = EP.id JOIN Disciplines AS D ON DTEP.disciplineId = D.id WHERE EP.name = " + ProgramName + ";";
  postgre.executeQuery(query).then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})


// app.get('/', (req, res) => {
//   console.log(pool.query("SELECT * FROM EducationalPrograms", 
//     (error, results) => {
//         if(results && results.rows) {
//            res.status(200).send(results.rows);
//         }
//     }
// ))
// })

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})