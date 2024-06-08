
import { BiRename } from "react-icons/bi";
import './../css/RenameSign.css';
import {useState} from 'react';
import ReactDOM from 'react-dom';
const PopupForm = ({ show, onClose }) => {
    if (!show) {
      return null;
    }
  
    const handleSubmit = (e) => {
      e.preventDefault();
      const requestOptions = {
        method: 'PUT'
    };
      const type_ = document.querySelector('input[name="rename_type"]:checked');
      const current_ = document.getElementById("current");
      const new_ = document.getElementById("new");
      fetch(`http://localhost:3001/rename/${type_.value}/${current_.value}/${new_.value}`, requestOptions);
      onClose();
      window.location.reload();
    };
  
    return ReactDOM.createPortal(
      <div className="popup-overlay">
        <div className="popup-form">
          <button className="close-button" onClick={onClose}>X</button>
          <form id="insertForm" onSubmit={handleSubmit}>
            <div>
                <label>What type:</label>
                <input type="radio" id="Program" name="rename_type" value="Program" checked/>
                <label for="Program">Program</label>
                <input type="radio" id="Discipline" name="rename_type" value="Discipline"/>
                <label for="Discipline">Discipline</label>
                <input type="radio" id="LabWork" name="rename_type" value="LabWork"/>
                <label for="LabWork">LabWork</label>
            </div>
            <div>
              <label>Current name:</label>
              <input type="text" id="current"  required />
            </div>
            <div>
              <label>New name:</label>
              <input type="text" id="new"  required />
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>,
      document.body
    );
  };
export default function RenameSign () {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const openPopup = () => {
      setIsPopupOpen(true);
    };
  
    const closePopup = () => {
      setIsPopupOpen(false);
    };
    return (
        <>
           <button style={{height: "100%"}}  className="Sign" onClick={openPopup}> <BiRename /></button>
           <PopupForm show={isPopupOpen} onClose={closePopup} />
        </>
    );
}