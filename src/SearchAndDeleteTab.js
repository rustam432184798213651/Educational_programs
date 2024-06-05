import './css/SearchAndDeleteTab.css';
import DeleteSign from './Signs/DeleteSign';
import PlusSign from './Signs/PlusSign';
import UpdateSign from './Signs/UpdateSign';
import ExportToPdf from './Signs/ExportToPdf';
import ExportToDocx from './Signs/ExportToDocx';
export default function SearchAndDeleteTab({program, discipline, labWork, value, handler, exportToDocx, exportToPdf}) {
   
    return (
        <div id="SearchAndDeleteTab">
          <div style={{float: "left", color:"white", fontFamily: "inherit"}}>Databases</div>  <DeleteSign /> <PlusSign /> <UpdateSign program={program} discipline={discipline} labWork={labWork} newHtmlContent={value} handler={handler}/> <ExportToDocx exportToDocx={exportToDocx}/> <ExportToPdf exportToPdf={exportToPdf}/> 
        </div>
    )
}