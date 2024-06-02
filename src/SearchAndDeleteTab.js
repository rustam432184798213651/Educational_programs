import './css/SearchAndDeleteTab.css';
import DeleteSign from './DeleteSign';
import PlusSign from './PlusSign'
export default function SearchAndDeleteTab() {
   
    return (
        <div id="SearchAndDeleteTab">
          <div style={{float: "left", color:"white", fontFamily: "inherit"}}>Databases</div>  <DeleteSign/> <PlusSign />
        </div>
    )
}