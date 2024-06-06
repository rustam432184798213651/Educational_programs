import './../css/UpdateSign.css';
import { FaRegFilePdf } from "react-icons/fa6";

export default function ExportToPdf({exportToPdf}) {
    return (
        <>
           <button style={{height: "100%"}} className="Sign" id="UpdateSign" onClick={exportToPdf}> <FaRegFilePdf /> </button>
        </>
    );
}