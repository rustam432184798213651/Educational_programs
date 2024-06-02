import './../css/DeleteSign.css'
import { RiDeleteBin5Line } from "react-icons/ri";
export default function DeleteSign() {
    function handler() {
        alert("button was pressed.");
    }
    return (
        <>
           <button id="DeleteSign" onClick={handler}> <RiDeleteBin5Line /> </button>
        </>
    );
}