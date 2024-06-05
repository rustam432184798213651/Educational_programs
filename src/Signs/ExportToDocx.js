import './../css/UpdateSign.css';
import { BsFiletypeDocx } from "react-icons/bs";

export default function ExportToDocx({exportToDocx}) {
    return (
        <>
           <button id="UpdateSign" onClick={exportToDocx}> <BsFiletypeDocx /> </button>
        </>
    );
}
