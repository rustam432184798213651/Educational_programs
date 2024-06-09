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
  if(data.length == 2) {
    return [];
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
  const [labWorks, setLabWorks] = useState([]);
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
      <div style={{display: "inline"}} > {discipline} </div>
     {labWorks.length > 0 && <ul id={"labWorks" + program + discipline} style={{display:"none"}}>
        {labWorks} 
      </ul>}
    </>
  )
}


function App() {
  const [value, setValue] = useState("");
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
  
  function AddDisciplines({program, i, displayLab, updateCurrentLabWork}) {
    const [disciplines, setDisciplines] = useState([]);
    function getDisciplinesToProgram(program) {
      function handler(e, program, discipline) {
        let tag = document.getElementById("labWorks" + program + discipline);
        if (tag) {
          tag.style.display = tag.style.display === "none" ?  "block" : "none"; 
        }
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
      getDisciplinesToProgram(program);
    }, []);
    return (
      <>
      <div value={"div" + i} className="listOfPrograms" style={{display: "inline"}}>{program}</div>
      <ul id={ program + "Disciplines"} className="disciplineList" style = {{listStyle: "None", paddingLeft: "0", display:"none"}}>
         {disciplines}
       </ul>
      </>
    )
  }
  
  function getAllPrograms() {

    fetch(localhost + '/getAllPrograms')
      .then(response => {
        return response.text();
      })
      .then(data => {
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
        setPrograms(arr.map((element, i) => (<div style={{width: "20vw", marginRight: "0"}}>
          <button onClick={e => handleClick(e, element)} style={{backgroundColor: "transparent", backgroundRepeat: "no-repeat", border: "none", cursor: "pointer", overflow: "hidden", outline: "none"}}><AiOutlineArrowDown /> </button> <AddDisciplines program={element} i={i} displayLab={displayLab} updateCurrentLabWork={updateCurrentLabWork}/>
        </div>)));
        
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
  async function exportToPdf() {
    if(value.length > 0) {
      await fetch('http://localhost:3001/download-pdf', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ html: value }),
      })
      .then((response) => response.blob())
      .then((blob) => {
        // Create blob link to download
        const url = window.URL.createObjectURL(
          new Blob([blob]),
        );
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
          'download',
          `FileName.pdf`,
        );
    
        // Append to html link element page
        document.body.appendChild(link);
    
        // Start download
        link.click();
    
        // Clean up and remove the link
        link.parentNode.removeChild(link);
      });
    }
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
