import './css/App.css';
import SearchAndDeleteTab from './SearchAndDeleteTab'
import {useState, useEffect} from 'react';
import { AiOutlineArrowDown } from "react-icons/ai";
import { GiConsoleController } from 'react-icons/gi';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {jsPDF} from 'jspdf';



const localhost = 'http://localhost:3001'

function MyJsonParser(data) {
  if(data.length == 0) {
    return {};
  }
  return JSON.stringify(data).slice(2, -2).split(",").map(el => {
    let parsed = JSON.parse("\"" + el + "\"");
    return parsed.slice(parsed.lastIndexOf(":") + 2, -2);
  });
}

function getHtmlContentFromResponse(data) {
  return JSON.parse(data)[0].htmlcontent;
}

function AddLabWorks({program, discipline, displayLab, updateCurrentLabWork}) {
  const [labWorks, setLabWorks] = useState(false); // Надо пофиксить потом
  function getLabWorksToDisciplineAndProgram(program, discipline) {
    fetch(localhost + '/getAllLabWorksByProgramAndDisciplineNames/' + program + '/' + discipline)
    .then(response => {
      return response.text();
    })
    .then(data => {
      let arr = MyJsonParser(data);
      setLabWorks(arr.map((element, i) => (
        <button onClick={(e) => {displayLab(e, program, discipline, element); updateCurrentLabWork(e, program, discipline, element)}}>  <div style={{width: "10vw"}}> {element} </div></button>
      )));
    })
  }
  useEffect(() => {
    getLabWorksToDisciplineAndProgram(program, discipline)
  }, []);
  return (
    <>
      <div style={{display: "inline"}} contentEditable="true"> {discipline} </div>
      <ul id={"labWorks" + program + discipline} style={{display:"none"}}>
        {labWorks} 
      </ul>
    </>
  )
}

function AddDisciplines({element, i, displayLab, updateCurrentLabWork}) {
  const [disciplines, setDisciplines] = useState(false);
  function getDisciplinesToProgram(program) {
    function handler(e, program, discipline) {
      let tag = document.getElementById("labWorks" + program + discipline);
      tag.style.display = tag.style.display === "none" ?  "block" : "none"; 
    }
    fetch(localhost + '/getAllDisciplinesByProgramName/' + program)
      .then(response => {
        return response.text();
      })
      .then(data => {
        
        let arr = MyJsonParser(data);
        setDisciplines(arr.map((discipline, i) => (
          <ul key={i} style = {{listStyle: "None", paddingLeft: "2vw"}}>
           <button onClick={e => handler(e, program, discipline)} style={{backgroundColor: "transparent", backgroundRepeat: "no-repeat", border: "none", cursor: "pointer", overflow: "hidden", outline: "none"}}><AiOutlineArrowDown /> </button>  <AddLabWorks program={program} discipline={discipline} displayLab={displayLab} updateCurrentLabWork={updateCurrentLabWork}/>
          </ul>
        )));
      })

  }
  useEffect(() => {
    getDisciplinesToProgram(element);
  }, []);
  return (
    <>
    <div  contentEditable="true" value={"div" + i} className="listOfPrograms" style={{display: "inline"}}>{element}</div>
    <ul id={ element + "Disciplines"} className="disciplineList" style = {{listStyle: "None", paddingLeft: "0", display:"none"}}>
       {disciplines}
     </ul>
    </>
  )
}

function App() {
  const [value, setValue] = useState(false);
  const [programs, setPrograms] = useState(false);
  const [cProgram, setCPrograms] = useState(false);
  const [cDiscipline, setCDiscipline] = useState(false);
  const [cLabWork, setCLabWork] = useState(false);
  function updateCurrentLabWork(e, program, discipline, labWork) {
    setCPrograms(program);
    setCDiscipline(discipline);
    setCLabWork(labWork);
  }

  function displayLab(e, program, discipline, lab) {
    fetch(localhost + `/getLabContent/${program}/${discipline}/${lab}`)
    .then(response => {
      return response.text();
    })
    .then(data => {
      setValue(getHtmlContentFromResponse(data));
    })
  }

  function getAllPrograms() {

    fetch(localhost + '/getAllPrograms')
      .then(response => {
        return response.text();
      })
      .then(data => {
        // let arr;
        // arr = JSON.stringify(data);
        // arr = arr.substring(2, arr.length - 2);
        // arr = arr.split(",");
        // let new_arr = [];
        // for(let i = 0; i < arr.length; i++) {
        //   if (i % 2) {
        //     new_arr.push(JSON.parse("\"" + arr[i] + "\""));
        //   }
        // } 
        // arr = new_arr;
        // for(let i = 0; i < arr.length; i++) {
        //   arr[i] = arr[i].substring(arr[i].lastIndexOf(":") + 2, arr[i].length - 2);
        // }
        let arr = null;
        if (data === undefined || data === '[]') {
          arr = [];
        }
        else {
          arr = MyJsonParser(data);
        }
        function handleClick(e, programName) {
          let tag = document.getElementById(programName + "Disciplines");
          tag.style.display = tag.style.display == "none" ?  "block" : "none"; 
      }
        setPrograms(arr.map((element, i) => (
          <div style={{width: "20vw", marginRight: "0"}}>
            <button onClick={e => handleClick(e, element)} style={{backgroundColor: "transparent", backgroundRepeat: "no-repeat", border: "none", cursor: "pointer", overflow: "hidden", outline: "none"}}><AiOutlineArrowDown /> </button> <AddDisciplines element={element} i={i} displayLab={displayLab} updateCurrentLabWork={updateCurrentLabWork}/>
          </div>
        )));
        //setPrograms(arr);
      });
  }
  useEffect(() => {
    getAllPrograms();
  }, []);
  function handler() {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: value })
  };
  fetch(localhost + `/updateHtmlContent/${cProgram}/${cDiscipline}/${cLabWork}`, requestOptions)
      .then(response => response.json())
      .then(data => {});
  }
  function exportToDocx() {
    var header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " + "xmlns:w='urn:schemas-microsoft-com:office:word' " + 
    "xmlns='http://www.w3.org/TR/REC-html40'>" +
    "<head><meta charset='utf-8'></head><body>";
    var footer = "</body></html>";
    var sourceHTML = header+value+footer;
    var source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);

    var fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = 'document.doc';
    fileDownload.click();
    document.body.removeChild(fileDownload);
  }
  function exportToPdf() {
    const doc = new jsPDF("l", "pt", "A4");
  // Adding the fonts.
    doc.setFont('Inter-Regular', 'normal');
      doc.html(value, {
        async callback(doc) {
            await doc.save('something.pdf');
        },
    });
  }
  return <><div id="topPanel">  Educational programs </div>
  <div style={{  display: "flex", justifyContent: "space-between"}}>
    <div>
      <SearchAndDeleteTab key="foeroifjer"  program={cProgram} discipline={cDiscipline} labWork={cLabWork} value={value} handler={handler} exportToDocx={exportToDocx} exportToPdf={exportToPdf}/>
      <ul id="mainList" style = {{listStyle: "None", paddingLeft: "0"}}>
        {programs}
      </ul>
    </div>
    <ReactQuill theme="snow" value={value}  onChange={setValue} style={{ marginTop:"0", marginRight:"0", marginBottom:"0", padding:"0", width: "80vw"}} />

  </div>
  </>;
}

export default App;
