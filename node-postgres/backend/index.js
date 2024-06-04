const express = require('express')
const app = express()
const port = 3001
const postgre = require('./database_interaction')

String.prototype.hashCode = function() {
  var hash = 0,
    i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

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
  postgre.executeQuery("SELECT name FROM EducationalPrograms;").then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  });
})

app.get('/getAllDisciplinesByProgramName/:ProgramName', (req, res) => {
  const ProgramName = "'" + req.params.ProgramName + "'";
  const query = "SELECT DISTINCT D.name FROM LabWorksToEducationalProgramsAndDisciplines AS DTEP JOIN EducationalPrograms AS EP ON DTEP.educationalProgramId = EP.id JOIN Disciplines AS D ON DTEP.disciplineId = D.id WHERE EP.name = " + ProgramName + ";";
  postgre.executeQuery(query).then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})

app.get('/delete/:Program/:Discipline/:LabWork', (req, res) => {
  const Program = "'" + req.params.Program + "'";
  const  Discipline = "'" + req.params.Discipline + "'";
  const LabWork = "'" + req.params.LabWork + "'";
  const query = "DELETE FROM LabWorksToEducationalProgramsAndDisciplines WHERE " + `EducationalProgramId = ${Program.hashCode()} AND DisciplineId = ${Discipline.hashCode()} AND LabWorkId = ${LabWork.hashCode()};`;
  postgre.executeQuery(query).then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})

app.get('/getAllLabWorksByProgramAndDisciplineNames/:ProgramName/:DisciplineName', (req, res) => {
  const ProgramName = "'" + req.params.ProgramName + "'";
  const DisciplineName = "'" + req.params.DisciplineName + "'";
  const query = "SELECT LW.name FROM LabWorksToEducationalProgramsAndDisciplines AS LTEPAD JOIN EducationalPrograms AS EP ON LTEPAD.educationalProgramId = EP.id JOIN Disciplines AS D ON LTEPAD.disciplineId = D.id JOIN LabWorks AS LW ON LTEPAD.labWorkId = LW.id WHERE EP.name = " + ProgramName +  " AND D.name = " + DisciplineName + ";";
  postgre.executeQuery(query).then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})

app.get('/addLabWork/:ProgramName/:DisciplineName/:LabWorkName', (req, res) => {
  const ProgramName = "'" + req.params.ProgramName + "'";
  const DisciplineName = "'" + req.params.DisciplineName + "'";
  const LabWorkName = "'" + req.params.LabWorkName + "'";
  const ProgramId = ProgramName.hashCode();
  const DisciplineId =  DisciplineName.hashCode();
  const LabWorkId = LabWorkName.hashCode();
  const insert_into_EducationalPrograms = "INSERT INTO EducationalPrograms (id, name) VALUES (" + ProgramId  + ", " + ProgramName + ") ON CONFLICT DO NOTHING;";
  const insert_into_Disciplines = "INSERT INTO Disciplines (id, name) VALUES (" + DisciplineId + ", " + DisciplineName + ") ON CONFLICT DO NOTHING;";
  const insert_into_LabWorkName = "INSERT INTO LabWorks (id, name) VALUES (" + LabWorkId + ", " + LabWorkName + ") ON CONFLICT DO NOTHING;";
  const insert_into_LabWorksToEducationalProgramsAndDisciplines =  "INSERT INTO LabWorksToEducationalProgramsAndDisciplines (LabWorkId, EducationalProgramId, DisciplineId) VALUES " + `(${LabWorkId}, ${ProgramId}, ${DisciplineId}) ON CONFLICT DO NOTHING;`;
  const insert_into_disciplinesIdToEducationalProgramId = "INSERT INTO DisciplinesIdToEducationalProgramId (disciplineId, educationalProgramId) VALUES " + `(${DisciplineId}, ${ProgramId}) ON CONFLICT DO NOTHING;`
  const query = insert_into_EducationalPrograms + insert_into_Disciplines + insert_into_LabWorkName + insert_into_disciplinesIdToEducationalProgramId + insert_into_LabWorksToEducationalProgramsAndDisciplines;
  postgre.executeQuery(query).then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})

app.get('/getLabContent/:Program/:Discipline/:LabWork', (req, res) => {
  const ProgramName      = "'" + req.params.Program    + "'";  
  const DisciplineName   = "'" + req.params.Discipline + "'"; 
  const LabWorkName      = "'" + req.params.LabWork    + "'"; 
  const query = "SELECT LTEPAD.htmlContent FROM LabWorksToEducationalProgramsAndDisciplines AS LTEPAD JOIN EducationalPrograms AS EP ON LTEPAD.educationalProgramId = EP.id JOIN Disciplines AS D ON LTEPAD.disciplineId = D.id JOIN LabWorks AS LW ON LTEPAD.labWorkId = LW.id WHERE EP.name = " + ProgramName +  " AND D.name = " + DisciplineName + " AND LW.name = "+ LabWorkName +";";
  console.log(query);
  postgre.executeQuery(query).then(response => {
    console.log(response);
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