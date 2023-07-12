import { useEffect, useState } from "react";
import "./App.css";
import Board from "./Components/Board/Board";
import Drawer from "./Components/Drawer/Drawer";
import Editable from "./Components/Editable/Editable";
import Chatbot from "./Components/Chatbot/Chatbot";
import todoimg from "./resources/todo.gif";
import checkListimg from "./resources/checklist.gif";
import img1 from "./resources/Trello-board-1024x512.png";
import img2 from "./resources/OIG (1).jpeg";
import img3 from "./resources/OIG (2).jpeg";
import img4 from "./resources/OIG.jpeg";
import img5 from "./resources/OIG.rW_ApBw6DEW7c.jpeg";

function App() {
  const [boards, setBoards] = useState(
    JSON.parse(localStorage.getItem("task-manager")).boards || []
  );
  const [target, setTarget] = useState({
    cid: "",
    bid: "",
  });
  const [imgUrl, setImgUrl] = useState(
    JSON.parse(localStorage.getItem("task-manager"))?.imgUrl ||
      'url("https://source.unsplash.com/1600x900/?office")'
  );
  const [visible, setVisible] = useState(true);

  const addCard = async (title, bid) => {
    const card = {
      id: Date.now() + Math.random(),
      title,
      labels: [],
      tasks: [],
      date: "",
      desc: "",
    };
    const index = boards.findIndex((item) => item.id === bid);
    if (index < 0) return;
    const tempBoards = [...boards];
    tempBoards[index].cards.push({ ...card });
    setBoards(tempBoards);
  };

  const removeCard = (cid, bid) => {
    const bIndex = boards.findIndex((item) => item.id === bid);
    if (bIndex < 0) return;
    const cIndex = boards[bIndex].cards.findIndex((item) => item.id === cid);
    if (cIndex < 0) return;

    const tempBoards = [...boards];
    tempBoards[bIndex].cards.splice(cIndex, 1);
    setBoards(tempBoards);
  };
  const addBoard = (title) => {
    setBoards([
      ...boards,
      { id: Date.now() + Math.random() * 2, title, cards: [] },
    ]);
  };
  const removeBoard = (bid) => {
    const tempBoards = boards.filter((item) => item.id !== bid);
    setBoards(tempBoards);
  };

  const handleDragEnter = (cid, bid) => {
    setTarget({ cid: cid, bid: bid });
  };
  const handleDragEnd = (cid, bid) => {
    let s_bIndex, s_cIndex, t_bIndex, t_cIndex;
    s_bIndex = boards.findIndex((item) => item.id === bid);
    if (s_bIndex < 0) return;

    s_cIndex = boards[s_bIndex].cards?.findIndex((item) => item.id === cid);
    if (s_cIndex < 0) return;

    t_bIndex = boards.findIndex((item) => item.id === target.bid);
    if (t_bIndex < 0) return;

    const tempBoards = [...boards];
    const tempCard = tempBoards[s_bIndex].cards[s_cIndex];

    t_cIndex = boards[t_bIndex].cards?.findIndex(
      (item) => item.id === target.cid
    );
    if (t_cIndex < 0 && target.cid !== "") return;
    else if (target.cid === "") {
      tempBoards[s_bIndex].cards.splice(s_cIndex, 1);
      tempBoards[t_bIndex].cards.push(tempCard);
      setBoards(tempBoards);
      return;
    }

    tempBoards[s_bIndex].cards.splice(s_cIndex, 1);
    tempBoards[t_bIndex].cards.splice(t_cIndex, 0, tempCard);
    setBoards(tempBoards);
  };

  const updateCard = async (cid, bid, card) => {
    const bIndex = boards.findIndex((item) => item.id === bid);
    if (bIndex < 0) return;

    const cIndex = boards[bIndex].cards.findIndex((item) => item.id === cid);
    if (cIndex < 0) return;

    const tempBoards = [...boards];
    tempBoards[bIndex].cards[cIndex] = card;
    setBoards(tempBoards);
  };

  useEffect(() => {
    localStorage.setItem("task-manager", JSON.stringify({ imgUrl, boards }));
  }, [boards, imgUrl]);

  return (
    <>
      {visible ? (
        <div className="index">
          <h1>About the Kanban App</h1>
          <div className="top">
            <img src={img1} alt="" width="100%" />
            <button className="start" onClick={() => setVisible(false)}>
              Get Started
            </button>
          </div>
          The Kanban App is a Trello clonedesigned to help individuals and teams
          manage their tasks and projects more efficiently. Inspired by the
          popular Kanban method, this app provides an intuitive and visual
          interface that allows users to organize their work into boards, lists,
          and cards.
          <br />
          <br />
          <div className="body">
            <div className="body_text">
              <h2>Key Features:</h2>
              <br />
              <ol type="1">
                <li>
                  Boards, Lists, and Cards: Create multiple boards to represent
                  different projects or categories. Within each board, you can
                  create lists to represent different stages or phases of your
                  project. Add cards to each list to represent specific tasks or
                  items.
                </li>
                <li>
                  Drag-and-Drop Interface: Easily move cards between lists and
                  boards using a simple drag-and-drop interface. This feature
                  allows you to quickly update the status of your tasks and keep
                  track of their progress.
                </li>
                <li>
                  Customizable Boards: Personalize your boards with custom
                  backgrounds. Choose from a selection of preset backgrounds or
                  upload your own images to create a visually appealing and
                  personalized workspace.
                </li>
                <li>
                  Collaboration and Sharing: Collaborate with team members by
                  sharing boards. Invite others to join your board, assign
                  tasks, and track progress together. This fosters better
                  communication and teamwork.
                </li>
                <li>
                  Task Details and Attachments: Add detailed descriptions, due
                  dates, labels, and attachments to each card. Keep all the
                  relevant information in one place for easy reference and
                  organization.
                </li>
                <li>
                  Notifications and Reminders: Stay updated with real-time
                  notifications for changes, updates, and due dates. Set
                  reminders to ensure you never miss an important deadline.
                </li>
                <li>
                  Responsive Design: The Kanban App is designed to be
                  responsive, allowing you to access and manage your tasks from
                  any device, including desktops, laptops, tablets, and mobile
                  phones.
                </li>
              </ol>
            </div>
            <img className="body_img" src={todoimg} alt="todo img" />
          </div>
          <div className="body" style={{ flexWrap: "wrap-reverse" }}>
            <img className="body_img" src={checkListimg} alt="todo img" />
            <div className="body_text">
              <h2>Benefits</h2>
              <br />
              <ul>
                <li>
                  Simplify task management: The Kanban App simplifies task
                  management by providing a visual representation of your
                  workflow. It helps you prioritize tasks, identify bottlenecks,
                  and ensure that nothing falls through the cracks.
                </li>
                <li>
                  Enhance collaboration: By allowing team members to collaborate
                  on boards, the app promotes seamless communication,
                  coordination, and teamwork. Everyone can stay informed about
                  project progress and contribute to its success.
                </li>
                <li>
                  Improve productivity: With its intuitive interface and
                  drag-and-drop functionality, the Kanban App streamlines task
                  management, enabling you to focus on completing tasks rather
                  than managing them. This enhances productivity and efficiency.
                </li>
                <li>
                  Stay organized: The app's structured organization system helps
                  you keep track of tasks, deadlines, and progress. You can
                  easily visualize your workflow, identify tasks that require
                  attention, and stay on top of your projects.
                </li>
                <li>
                  Personalize your workspace: The ability to customize
                  backgrounds and tailor the app to your preferences adds a
                  personal touch to your workspace, making it more engaging and
                  enjoyable to use.
                </li>
              </ul>
              <br />
              The Kanban App is a powerful tool for individuals and teams
              seeking to enhance their task management and collaboration.
              Whether you're organizing personal projects, managing team tasks,
              or tracking progress on a complex project, this app offers a
              user-friendly and versatile solution.
            </div>
          </div>
          <div className="top">
            <button
              className="start"
              style={{ marginTop: "50px" }}
              onClick={() => setVisible(false)}
            >
              Get Started
            </button>
          </div>
          <div className="images">
            <img src={img2} alt="" />
            <img src={img3} alt="" />
            <img src={img4} alt="" />
            <img src={img5} alt="" />
          </div>
        </div>
      ) : (
        <div className="app">
          <div className="app_navbar">
            <h2>Kanban</h2>
            <Drawer setImgUrl={setImgUrl} />
          </div>
          <div
            className="app_outer"
            style={{
              backgroundImage: imgUrl,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          >
            <div className="app_boards">
              {boards.map((item) => (
                <Board
                  board={item}
                  key={item.id}
                  removeBoard={removeBoard}
                  addCard={addCard}
                  removeCard={removeCard}
                  handleDragEnd={handleDragEnd}
                  handleDragEnter={handleDragEnter}
                  updateCard={updateCard}
                />
              ))}
              <div className="app_boards_board">
                <Editable
                  displayClass="app_boards_board_add"
                  placeholder="Enter board title"
                  onSubmit={(value) => addBoard(value)}
                />
              </div>
            </div>
            <Chatbot boards={boards} />
          </div>
        </div>
      )}
    </>
  );
}

export default App;
