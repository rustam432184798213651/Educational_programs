import './../css/UpdateSign.css';
import { BsFiletypeDocx } from "react-icons/bs";

export default function ExportToDocx({exportToDocx}) {
    return (
        <>
           <button style={{height: "100%"}} className="Sign" id="UpdateSign" onClick={exportToDocx}> <BsFiletypeDocx /> </button>
        </>
    );
}
