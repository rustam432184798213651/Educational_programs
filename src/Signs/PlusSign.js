import './../css/PlusSign.css'
import { GrAdd } from "react-icons/gr";
import { useState} from 'react';
import ReactDOM from 'react-dom';

const PopupForm = ({ show, onClose }) => {
    if (!show) {
      return null;
    }
  
    const handleSubmit = (e) => {
      e.preventDefault();
      const Program = document.getElementById("add_program");
      const Discipline = document.getElementById("add_discipline");
      const LabWork = document.getElementById("add_lab_work");
      fetch(`http://localhost:3001/addLabWork/${Program.value}/${Discipline.value}/${LabWork.value}`);
      onClose();
      window.location.reload();
    };
  
    return ReactDOM.createPortal(
      <div className="popup-overlay">
        <div className="popup-form">
          <button className="close-button" onClick={onClose}>X</button>
          <form id="insertForm" onSubmit={handleSubmit}>
            <div>
              <label>Program:</label>
              <input type="text" id="add_program" name="name" required />
            </div>
            <div>
              <label>Discipline:</label>
              <input type="text" id="add_discipline" name="email" required />
            </div>
            <div>
              <label>Lab work:</label>
              <input type="text" id="add_lab_work" name="email" required />
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>,
      document.body
    );
  };
  

function PlusSign() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const openPopup = () => {
      setIsPopupOpen(true);
    };
  
    const closePopup = () => {
      setIsPopupOpen(false);
    };
    return (
        <>
            <button id="PlusSign" onClick={openPopup}><GrAdd /></button>
            <PopupForm show={isPopupOpen} onClose={closePopup} />
        </>
    );
}

export default PlusSign;