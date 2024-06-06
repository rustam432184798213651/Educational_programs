import './../css/UpdateSign.css';
import { GrUpdate } from "react-icons/gr";

function UpdateSign({program, discipline, labWork, newHtmlContent, handler}) {
   
    return (
        <>
           <button style={{height: "100%"}} className="Sign" id="UpdateSign" onClick={handler}> <GrUpdate /></button>
        </>
    );
}

export default UpdateSign;