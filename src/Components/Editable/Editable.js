import React, { useState } from "react";
import { X } from "react-feather";
import "./Editable.css";

const Editable = ({
  text,
  placeholder,
  buttonText,
  onSubmit,
  editClass,
  displayClass,
  boardId,
  board_Id,
  handleDragEnd,
  handleDragEnter,
  type,
}) => {
  const [showEdit, setShowEdit] = useState(false);
  const [inputValue, setInputValue] = useState("");
  return (
    <div
      className="editable"
      onDragEnd={() => handleDragEnd("", boardId,board_Id)}
      onDragEnter={() => handleDragEnter("", boardId,board_Id)}
    >
      {showEdit ? (
        <form
          className={`editable_edit ${editClass || ""}`}
          onSubmit={(e) => {
            e.preventDefault();
            if (onSubmit) 
            {
              onSubmit(inputValue);
              setInputValue("");
            }
            setShowEdit(false);
          }}
        >
          <input
            autoFocus
            type={type||"text"}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder || "Enter item"}
          />
          <div className="editable_edit_footer">
            <button type="submit">{buttonText || "Add"}</button>
            <X onClick={() => setShowEdit(false)} />
          </div>
        </form>
      ) : (
        <p
          className={`editable_display ${displayClass || ""}`}
          onClick={() => setShowEdit(true)}
        >
          {text || "Add item"}
        </p>
      )}
    </div>
  );
};

export default Editable;