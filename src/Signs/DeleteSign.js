import './../css/DeleteSign.css'
import { RiDeleteBin5Line } from "react-icons/ri";
import { useState } from 'react';
import ReactDOM from 'react-dom';
const PopupForm = ({ show, onClose }) => {
    if (!show) {
      return null;
    }
  
    const handleSubmit = (e) => {
      e.preventDefault();
      const Program = document.getElementById("delete_program");
      const Discipline = document.getElementById("delete_discipline");
      const LabWork = document.getElementById("delete_labwork");
      if(LabWork.value && !Discipline.value) {
        alert("Введите название дисциплины, лабораторную работу которой хотите удалить.");
        return;
      }
      else { 
      if(Discipline.value && !LabWork.value) {
          fetch(`http://localhost:3001/delete/${Program.value}/${Discipline.value}`);
        }
        else if (Discipline.value && LabWork.value) {
          fetch(`http://localhost:3001/delete/${Program.value}/${Discipline.value}/${LabWork.value}`);
        }
        else {
          fetch(`http://localhost:3001/delete/${Program.value}`);
        }
        onClose();
        window.location.reload();
      }
    };
    
    return ReactDOM.createPortal(
      <div className="popup-overlay">
        <div className="popup-form">
          <button className="close-button" onClick={onClose}>X</button>
          <form id="insertForm" onSubmit={handleSubmit}>
            <div>
              <label>Program:</label>
              <input type="text" id="delete_program" name="name" required />
            </div>
            <div>
              <label>Discipline:</label>
              <input type="text" id="delete_discipline" name="email"/>
            </div>
            <div>
              <label>Labwork:</label>
              <input type="text" id="delete_labwork" name="email"/>
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>,
      document.body
    );
  };

export default function DeleteSign() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const openPopup = () => {
      setIsPopupOpen(true);
    };
  
    const closePopup = () => {
      setIsPopupOpen(false);
    };
    return (
        <>
           <button style={{height: "100%"}} className="Sign" id="DeleteSign" onClick={openPopup}> <RiDeleteBin5Line /> </button>
           <PopupForm show={isPopupOpen} onClose={closePopup} />
        </>
    );
}