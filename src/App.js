import { useEffect, useState } from "react";
import "./App.css";
import Board from "./Components/Board/Board";
import Drawer from "./Components/Drawer/Drawer";
import Editable from "./Components/Editable/Editable";

function App() {
  const [boards, setBoards] = useState(JSON.parse(localStorage.getItem('task-manager'))|| []);
  const [target, setTarget] = useState({
    cid: "",
    bid: "",
  });
  const [imgUrl, setImgUrl] = useState(
    'url("https://source.unsplash.com/1600x900/?office")'
  );

  const addCard = (title, bid) => {
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
    tempBoards[index].cards.push(card);
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

  const updateCard = (cid,bid,card) => {
    const bIndex = boards.findIndex((item)=>item.id===bid);
    if(bIndex<0) return;

    const cIndex = boards[bIndex].cards.findIndex((item)=>item.id===cid);
    if(cIndex<0) return;

    const tempBoards = [...boards];
    tempBoards[bIndex].cards[cIndex]=card;
    setBoards(tempBoards);
  }

  useEffect(() => {
    localStorage.setItem('task-manager',JSON.stringify(boards));
  }, [boards]);
  

  return (
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
      </div>
    </div>
  );
}

export default App;
