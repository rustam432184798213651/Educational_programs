import './../css/UpdateSign.css';
import { GrUpdate } from "react-icons/gr";

function UpdateSign() {
    function handler() {
        alert("button was pressed.");
    }
    return (
        <>
           <button id="UpdateSign" onClick={handler}> <GrUpdate /></button>
        </>
    );
}

export default UpdateSign;