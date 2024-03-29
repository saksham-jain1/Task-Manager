import React, { useState } from "react";
import {
  AlertTriangle,
  CheckSquare,
  Clock,
  MoreHorizontal,
} from "react-feather";
import CardInfo from "../CardInfo/CardInfo";
import Chip from "../Chip/Chip";
import Dropdown from "../Dropdown/Dropdown";
import "./Card.css";

const Card = ({
  card,
  removeCard,
  boardId,
  board_Id,
  handleDragEnd,
  handleDragEnter,
  updateCard,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const completed = card?.tasks?.filter((item) => item.completed)?.length;
  const date=new Date();
  return (
    <>
      {showModal && (
        <CardInfo
          completed={completed}
          updateCard={updateCard}
          boardId={boardId}
          card={card}
          onClose={() => setShowModal(false)}
        />
      )}
      <div
        className="card"
        draggable
        onDragEnd={() => handleDragEnd(card?.id, boardId, board_Id)}
        onDragEnter={() => handleDragEnter(card?.id, boardId, board_Id)}
        onClick={() => setShowModal(true)}
      >
        <div className="card_top">
          <div className="card_top_labels">
            {card?.labels?.map((item, index) => (
              <Chip key={index} text={item.text} color={item.color} />
            ))}
          </div>
          <div
            className="card_top_more"
            onClick={(e) => {
              e.stopPropagation();
              setShowDropdown((prev) => !prev);
            }}
          >
            <MoreHorizontal />
            {showDropdown && (
              <Dropdown
                open={showDropdown}
                onClose={() => setShowDropdown(false)}
              >
                <div className="card_dropdown">
                  <p onClick={() => removeCard(card.id,card._id, boardId,board_Id)}>
                    Delete Card
                  </p>
                </div>
              </Dropdown>
            )}
          </div>
        </div>
        <div className="card_title">{card?.title}</div>
        <div className="card_footer">
          {card?.date && (
            <p>
              <Clock />
              {card?.date}
            </p>
          )}
          {card?.tasks?.length > 0 && (
            <p>
              <CheckSquare />
              {`${completed}/${card?.tasks?.length}`}
            </p>
          )}
        </div>
        {card.date && date.toISOString().substring(0, 10) > card.date ? (
          <div className="card_delayed">
            <p>
              <AlertTriangle />
              Delayed
            </p>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default Card;
