import './css/App.css';
import SearchAndDeleteTab from './SearchAndDeleteTab'
import {useState, useEffect} from 'react';

function App() {
  const [programs, setPrograms] = useState(false);

  function getAllPrograms() {
    fetch('http://localhost:3001/getAllEducationalPrograms')
      .then(response => {
        return response.text();
      })
      .then(data => {
        setPrograms(data);
      });
  }
  getAllPrograms();
  return (
    <div className='App' stlye={{height: "100vh"}}>
      <div id="topPanel">  Educational programs </div>
      <SearchAndDeleteTab />
      <br/>
      {programs}
    </div>
  );
}

export default App;
