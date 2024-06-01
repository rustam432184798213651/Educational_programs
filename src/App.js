import './css/App.css';
import SearchAndDeleteTab from './SearchAndDeleteTab'

function App() {
  return (
    <div className='App' stlye={{height: "100vh"}}>
      <div id="topPanel">  Educational programs </div>
      <SearchAndDeleteTab />
    </div>
  );
}

export default App;
