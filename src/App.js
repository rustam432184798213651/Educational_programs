import './css/App.css';
import SearchAndDeleteTab from './SearchAndDeleteTab'
import {useState, useEffect} from 'react';
import { AiOutlineArrowDown } from "react-icons/ai";


function AddDisciplines({element, i}) {
  const [disciplines, setDisciplines] = useState(false);
  function getDisciplinesToProgram(program) {
    console.log(program);
    fetch('http://localhost:3001/getAllDisciplinesByProgramName/' + program)
      .then(response => {
        return response.text();
      })
      .then(data => {
        let arr = JSON.stringify(data).slice(2, -2).split(",").map(el => {
          let parsed = JSON.parse("\"" + el + "\"");
          return parsed.slice(parsed.lastIndexOf(":") + 2, -2);
        });
        setDisciplines(arr.map((element, i) => (
          <ul key={i} style = {{listStyle: "None", paddingLeft: "2vw"}}>
           <button style={{backgroundColor: "transparent", backgroundRepeat: "no-repeat", border: "none", cursor: "pointer", overflow: "hidden", outline: "none"}}><AiOutlineArrowDown /> </button> <div style={{display: "inline"}} contentEditable="true"> {element} </div>
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
    <ul className="disciplineList" style = {{listStyle: "None", paddingLeft: "0"}}>
       {disciplines}
     </ul>
    </>
  )
}

function App() {
  const [programs, setPrograms] = useState(false);

  

  function getAllPrograms() {
    fetch('http://localhost:3001/getAllPrograms')
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
        let arr = JSON.stringify(data).slice(2, -2).split(",").filter((_, i) => i % 2).map(el => {
          let parsed = JSON.parse("\"" + el + "\"");
          return parsed.slice(parsed.lastIndexOf(":") + 2, -2);
        });        

        setPrograms(arr.map((element, i) => (
          <ul key={i} style = {{listStyle: "None", paddingLeft: "0"}}>
           <button style={{backgroundColor: "transparent", backgroundRepeat: "no-repeat", border: "none", cursor: "pointer", overflow: "hidden", outline: "none"}}><AiOutlineArrowDown /> </button> <AddDisciplines element={element} i={i}/>
          </ul>
        )));
        //setPrograms(arr);
      });
  }
  useEffect(() => {
    getAllPrograms();
  }, []);
  return (
    <div className='App' stlye={{height: "100vh"}}>
      <div id="topPanel">  Educational programs </div>
      <SearchAndDeleteTab />
      <ul id="mainList" style = {{listStyle: "None", paddingLeft: "0"}}>
        {programs}
      </ul>
    </div>
  );
}

export default App;
