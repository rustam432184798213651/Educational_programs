const express = require('express')
const app = express()
const port = 3001
const postgre = require('./database_interaction')
const bodyParser = require('body-parser');

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

app.use(bodyParser.json({ limit: "50mb" }))
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
  //const query = "SELECT DISTINCT D.name FROM LabWorksToEducationalProgramsAndDisciplines AS DTEP JOIN EducationalPrograms AS EP ON DTEP.educationalProgramId = EP.id JOIN Disciplines AS D ON DTEP.disciplineId = D.id WHERE EP.name = " + ProgramName + ";";
  const query = `SELECT DISTINCT DTP.discipline_name FROM DisciplinesToProgram DTP WHERE DTP.program_name=${ProgramName};`;
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
  const LabWorkId = req.params.LabWorkName == 'null' ? -1 : LabWorkName.hashCode();
  const insert_into_disciplines_to_program = `INSERT INTO DisciplinesToProgram (discipline_name, program_name) VALUES (${DisciplineName}, ${ProgramName}) ON CONFLICT DO NOTHING;`;
  const insert_into_EducationalPrograms = "INSERT INTO EducationalPrograms (id, name) VALUES (" + ProgramId  + ", " + ProgramName + ") ON CONFLICT DO NOTHING;";
  const insert_into_Disciplines =  "INSERT INTO Disciplines (id, name) VALUES (" + DisciplineId + ", " + DisciplineName + ") ON CONFLICT DO NOTHING;";
  const insert_into_LabWorkName = LabWorkId != -1 ? "INSERT INTO LabWorks (id, name) VALUES (" + LabWorkId + ", " + LabWorkName + ") ON CONFLICT DO NOTHING;" : "";
  const insert_into_LabWorksToEducationalProgramsAndDisciplines = LabWorkId != -1 ? "INSERT INTO LabWorksToEducationalProgramsAndDisciplines (LabWorkId, EducationalProgramId, DisciplineId) VALUES " + `(${LabWorkId}, ${ProgramId}, ${DisciplineId}) ON CONFLICT DO NOTHING;` : '';
  const query =  insert_into_EducationalPrograms + insert_into_Disciplines + insert_into_LabWorkName +  insert_into_LabWorksToEducationalProgramsAndDisciplines + insert_into_disciplines_to_program;
  console.log(query);
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
  postgre.executeQuery(query).then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})

app.put('/updateHtmlContent/:Program/:Discipline/:LabWork', (req, res) => {
  const ProgramName      = "'" + req.params.Program    + "'";  
  const DisciplineName   = "'" + req.params.Discipline + "'"; 
  const LabWorkName      = "'" + req.params.LabWork    + "'"; 
  const ProgramId = ProgramName.hashCode();
  const DisciplineId = DisciplineName.hashCode();
  const LabWorkId = LabWorkName.hashCode();
  const query = `UPDATE LabWorksToEducationalProgramsAndDisciplines SET htmlcontent = '${req.body.content}' WHERE educationalprogramid = ${ProgramId} AND disciplineid = ${DisciplineId} AND labworkid = ${LabWorkId};`;
  postgre.executeQuery(query).then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})

app.put('/rename/:type_/:current_/:new_', (req, res) => {
  const dct = {
    "Program": ["EducationalPrograms", "educationalProgramId"],
    "Discipline": ["Disciplines", "disciplineId"],
    "LabWork": ["LabWorks", "labWorkId"]
  };
  const [tableNameToChange, idToChange] = dct[req.params.type_];
  const current_= "'" + req.params.current_ + "'";
  const new_ = "'" + req.params.new_ + "'";
  const current_hash_code = current_.hashCode();
  const new_hash_code = new_.hashCode();
  let additional_query = "";
  const query = `UPDATE ${tableNameToChange} SET id = ${new_hash_code}, name = ${new_} WHERE id = ${current_hash_code};`;

  postgre.executeQuery(query).then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })

})

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})