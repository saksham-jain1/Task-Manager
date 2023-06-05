import React, { useEffect, useState } from "react";
import {
  Calendar,
  CheckSquare,
  List,
  Tag,
  Trash,
  Type,
  X,
} from "react-feather";
import Chip from "../Chip/Chip";
import Editable from "../Editable/Editable";
import Modal from "../Modal/Modal";
import "./CardInfo.css";

const CardInfo = ({ onClose, card, updateCard, boardId, completed }) => {
  const [activeColor, setActiveColor] = useState("#000000");
  const colors = [
    '#a8193d',
    '#4fcc25',
    '#1ebffa',
    '#8da377',
    '#9975bd',
    '#240959',
  ];

  const [values, setValues] = useState({ ...card });

  const addLabel = (value, color) => {
    const label = {
      id: Date.now() + Math.random(),
      text: value,
      color,
    };
    setValues({ ...values, labels: [...values.labels, label] });
    setActiveColor("");
  };

  const removeLabel = (id) => {
    const labels = values.labels?.filter((item) => item.id !== id);

    setValues({ ...values, labels: labels });
  };

  const addTask = (value) => {
    const task = {
      id: Date.now() + Math.random(),
      text: value,
      completed: false,
    };
    setValues({ ...values, tasks: [...values.tasks, task] });
  };

  const removeTask = (id) => {
    const tempTasks = values.tasks?.filter((item) => item.id !== id);
    setValues({ ...values, tasks: tempTasks });
  };

  const updateTask = (id, status) => {
    const index = values.tasks?.findIndex((item) => item.id === id);
    if (index < 0) return;

    const tempTasks = [...values.tasks];
    tempTasks[index].completed = status;
    setValues({ ...values, task: tempTasks });
  };

  useEffect(() => {
    updateCard(card.id, card._id, boardId, values);
  }, [values]);

  return (
    <Modal onClose={() => onClose()}>
      <div className="cardinfo">
        <div className="cardinfo_close">
          <X onClick={() => onClose()} />
        </div>
        <div className="cardinfo_box">
          <div className="cardinfo_box_title">
            <Type />
            Title
          </div>
          <div className="cardinfo_box_body">
            <Editable
              text={values?.title}
              buttonText={"Set Title"}
              placeholder={"Enter Title"}
              onSubmit={(value) => setValues({ ...values, title: value })}
            />
          </div>
        </div>
        <div className="cardinfo_box">
          <div className="cardinfo_box_title">
            <List />
            Description
          </div>
          <div className="cardinfo_box_body">
            <Editable
              text={values?.desc}
              buttonText={"Set Description"}
              placeholder={"Enter Description"}
              onSubmit={(value) => setValues({ ...values, desc: value })}
            />
          </div>
        </div>
        <div className="cardinfo_box">
          <div className="cardinfo_box_title">
            <Calendar />
            Date
          </div>
          <div className="cardinfo_box_body">
            <Editable
              type="date"
              text={
                values.date
                  ? new Date(values.date).toISOString().substring(0, 10)
                  : ""
              }
              buttonText={"Set Date"}
              placeholder={"Enter Date"}
              onSubmit={(value) => setValues({ ...values, date: value })}
            />
          </div>
        </div>
        <div className="cardinfo_box">
          <div className="cardinfo_box_title">
            <Tag />
            Labels
          </div>
          <div className="cardinfo_box_labels">
            {values?.labels?.map((item, index) => (
              <Chip
                close
                onClose={() => removeLabel(item.id)}
                key={item.id}
                color={item.color}
                text={item.text}
              />
            ))}
          </div>
          <div className="cardinfo_box_colors">
            {colors.map((item) => (
              <li
                className={item === activeColor ? "active" : ""}
                style={{ backgroundColor: item }}
                key={item}
                onClick={() => setActiveColor(item)}
              />
            ))}
            <input
              type="color"
              value={activeColor}
              onChange={(e) => {
                setActiveColor(e.target.value);
              }}
            />
          </div>
          <div className="cardinfo_box_body">
            <Editable
              text={"Add Label"}
              buttonText={"Add"}
              placeholder={"Enter Label"}
              onSubmit={(value) => addLabel(value, activeColor)}
            />
          </div>
        </div>

        <div className="cardinfo_box">
          <div className="cardinfo_box_title">
            <CheckSquare />
            Tasks
          </div>
          <div className="cardinfo_box_progress-bar_outer">
            <div className="cardinfo_box_progress-bar">
              <div
                className={`cardinfo_box_progress ${
                  completed === values?.tasks?.length
                    ? "cardinfo_box_progress-active"
                    : ""
                }`}
                style={{
                  width: (completed * 100) / values?.tasks?.length + "%",
                }}
              />
            </div>
            <div>
              {values?.tasks?.length > 0
                ? Math.round(
                    ((completed * 100) / values?.tasks?.length) * 100
                  ) /
                    100 +
                  "%"
                : ""}
            </div>
          </div>
          <div className="cardinfo_box_list">
            {values?.tasks?.map((item) => (
              <div key={item.id} className="cardinfo_task">
                <input
                  type="checkbox"
                  defaultChecked={item.completed}
                  onChange={(e) => updateTask(item.id, e.target.checked)}
                />
                <p>{item.text}</p>
                <Trash onClick={() => removeTask(item.id)} />
              </div>
            ))}
          </div>
          <div className="cardinfo_box_body">
            <Editable
              text={"Add new task"}
              buttonText={"Add task"}
              placeholder={"Enter task"}
              onSubmit={(value) => addTask(value)}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CardInfo;
