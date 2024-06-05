import './css/SearchAndDeleteTab.css';
import DeleteSign from './Signs/DeleteSign';
import PlusSign from './Signs/PlusSign';
import UpdateSign from './Signs/UpdateSign';
export default function SearchAndDeleteTab({program, discipline, labWork, value, handler}) {
   
    return (
        <div id="SearchAndDeleteTab">
          <div style={{float: "left", color:"white", fontFamily: "inherit"}}>Databases</div>  <DeleteSign /> <PlusSign /> <UpdateSign program={program} discipline={discipline} labWork={labWork} newHtmlContent={value} handler={handler}/>
        </div>
    )
}