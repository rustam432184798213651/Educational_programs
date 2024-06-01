import './css/PlusSign.css'
import { GrAdd } from "react-icons/gr";

function PlusSign() {
    function handler() {
        alert("button was pressed.");
    }
    return (
        <>
            <button id="PlusSign" onClick={handler}><GrAdd /></button>
        </>
    );
}

export default PlusSign;