import React, { useState } from "react";
import "./Board.css";
import { MoreHorizontal } from "react-feather";
import Card from "../Card/Card";
import Editable from "../Editable/Editable";
import Dropdown from "../Dropdown/Dropdown";

const Board = ({ board, removeBoard,addCard,removeCard,handleDragEnter,handleDragEnd,updateCard,page_Id }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  return (
    <div className="board">
      <div className="board_top">
        <p className="board_top_title">
          {board?.title}&emsp;
          <span>{board?.cards?.length}</span>
        </p>
        <div
          className="board_top_more"
          onClick={(e) => {
            e.stopPropagation();
            setShowDropdown((prev) => !prev);
          }}
        >
          <MoreHorizontal />
          {showDropdown && (
            <Dropdown
              open={showDropdown}
              onClose={(e) => setShowDropdown(false)}
            >
              <div className="board_dropdown">
                <p onClick={() => removeBoard(board.id,board._id,page_Id)}>Delete Board</p>
              </div>
            </Dropdown>
          )}
        </div>
      </div>
      <div className="board_cards custom-scroll">
        {board?.cards.map((item) => (
          <Card
            card={item}
            key={item.id}
            removeCard={removeCard}
            boardId={board?.id}
            board_Id={board?._id}
            handleDragEnd={handleDragEnd}
            handleDragEnter={handleDragEnter}
            updateCard={updateCard}
          />
        ))}
        <Editable
          displayClass="board_cards_add"
          text="Add Card"
          placeholder="Enter Card Title"
          onSubmit={(value) => addCard(value, board?.id,board?._id)}
          boardId={board?.id}
          board_Id={board?._id}
          handleDragEnd={handleDragEnd}
          handleDragEnter={handleDragEnter}
        />
      </div>
    </div>
  );
};

export default Board;
