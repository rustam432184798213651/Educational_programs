import './css/App.css';
import SearchAndDeleteTab from './SearchAndDeleteTab'
import {useState, useEffect} from 'react';
import { AiOutlineArrowDown } from "react-icons/ai";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


const localhost = 'http://localhost:3001'

function MyJsonParser(data) {
  console.log(data);
  return JSON.stringify(data).slice(2, -2).split(",").map(el => {
    let parsed = JSON.parse("\"" + el + "\"");
    return parsed.slice(parsed.lastIndexOf(":") + 2, -2);
  });
}

function getHtmlContentFromResponse(data) {
  return JSON.parse(data)[0].htmlcontent;
}

function AddLabWorks({program, discipline, displayLab}) {
  const [labWorks, setLabWorks] = useState(false); // Надо пофиксить потом
  function getLabWorksToDisciplineAndProgram(program, discipline) {
    fetch(localhost + '/getAllLabWorksByProgramAndDisciplineNames/' + program + '/' + discipline)
    .then(response => {
      return response.text();
    })
    .then(data => {
      let arr = MyJsonParser(data);
      setLabWorks(arr.map((element, i) => (
        <button onClick={(e) => displayLab(e, program, discipline, element)}>  <div style={{width: "10vw"}}> {element} </div></button>
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

function AddDisciplines({element, i, displayLab}) {
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
           <button onClick={e => handler(e, program, discipline)} style={{backgroundColor: "transparent", backgroundRepeat: "no-repeat", border: "none", cursor: "pointer", overflow: "hidden", outline: "none"}}><AiOutlineArrowDown /> </button>  <AddLabWorks program={program} discipline={discipline} displayLab={displayLab}/>
          </ul>
        )));
      })

  }
  useEffect(() => {
    getDisciplinesToProgram(element);
  }, []);
  return (
    <>
    <div contentEditable="true" value={"div" + i} className="listOfPrograms" style={{display: "inline"}}>{element}</div>
    <ul id={ element + "Disciplines"} className="disciplineList" style = {{listStyle: "None", paddingLeft: "0", display:"none"}}>
       {disciplines}
     </ul>
    </>
  )
}

function App() {
  const [programs, setPrograms] = useState(false);

  const [value, setValue] = useState(false);
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
        let arr = MyJsonParser(data);
        function handleClick(e, programName) {
          let tag = document.getElementById(programName + "Disciplines");
          tag.style.display = tag.style.display == "none" ?  "block" : "none"; 
      }
        setPrograms(arr.map((element, i) => (
          <div style={{width: "20vw", marginRight: "0"}}>
            <button onClick={e => handleClick(e, element)} style={{backgroundColor: "transparent", backgroundRepeat: "no-repeat", border: "none", cursor: "pointer", overflow: "hidden", outline: "none"}}><AiOutlineArrowDown /> </button> <AddDisciplines element={element} i={i} displayLab={displayLab}/>
          </div>
        )));
        //setPrograms(arr);
      });
  }
  useEffect(() => {
    getAllPrograms();
  }, []);

  
  return <><div id="topPanel">  Educational programs </div>
  <SearchAndDeleteTab />
  <ul id="mainList" style = {{listStyle: "None", paddingLeft: "0"}}>
    {programs}
  </ul>
  <ReactQuill theme="snow" value={value} onChange={setValue} style={{marginLeft: "22vw", marginTop: "-21vh"}} /></>;
}

export default App;
