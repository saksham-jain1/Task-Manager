import React, { useEffect, useState } from "react";
import Board from "../../Components/Board/Board";
import Drawer from "../../Components/Drawer/Drawer";
import Editable from "../../Components/Editable/Editable";
import { List } from "react-feather";
import "./HomePage.css";
import axios from "axios";
import Logs from "../../Components/Logs/Logs";

const HomePage = ({ pages, setPages, online, UserId }) => {
  let index = 0;
  const [activePageIndex, setActivePageIndex] = useState(index);
  const [boards, setBoards] = useState(pages[0]?.boards || []);
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    setBoards(pages[activePageIndex]?.boards);
  }, [activePageIndex, pages]);

  const [target, setTarget] = useState({
    cid: "",
    bid: "",
    b_id: "",
  });

  const addCard = async (title, bid, b_id) => {
    const card = {
      id: Date.now() + Math.random(),
      title,
      labels: [],
      tasks: [],
      date: "",
      desc: "",
    };
    const { data } = await axios.post("/api/card", { ...card, BoardId: b_id });
    const index = boards.findIndex((item) => item.id === bid);
    if (index < 0) return;
    const tempBoards = [...boards];
    tempBoards[index].cards.push({ ...card, _id: data._id });
    setBoards(tempBoards);
  };

  const removeCard = async (cid, c_id, bid, b_id) => {
    const bIndex = boards.findIndex((item) => item.id === bid);
    if (bIndex < 0) return;
    const cIndex = boards[bIndex].cards.findIndex((item) => item.id === cid);
    if (cIndex < 0) return;

    const { data } = await axios.delete(`/api/card/${c_id}`, {
      data: { BoardId: b_id },
    });
    const tempBoards = [...boards];
    tempBoards[bIndex].cards.splice(cIndex, 1);
    setBoards(tempBoards);
  };

  const addBoard = async (title, PageId) => {
    const board = {
      id: Date.now() + Math.random() * 2 + "",
      title: title,
      cards: [],
    };
    const { data } = await axios.post(`/api/board/`, { board, PageId });
    if (boards) setBoards([...boards, { ...board, _id: data._id }]);
    else setBoards([{ ...board, _id: data._id }]);
  };

  const removeBoard = async (bid, b_id, p_id) => {
    const tempBoards = boards.filter((item) => item.id !== bid);
    const { data } = await axios.delete(`/api/board/${b_id}`, {
      data: { PageId: p_id },
    });
    setBoards(tempBoards);
  };

  const handleDragEnter = (cid, bid, b_id) => {
    setTarget({ cid: cid, bid: bid, b_id: b_id });
  };

  const handleDragEnd = async (cid, bid, b_id) => {
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

    const sdata = tempBoards[s_bIndex].cards.map((item) => {
      return item._id;
    });
    const tdata = tempBoards[t_bIndex].cards.map((item) => {
      return item._id;
    });
    const { datas } = await axios.patch(`/api/board/${b_id}`, { cards: sdata });
    const { datat } = await axios.patch(`/api/board/${target.b_id}`, {
      cards: tdata,
    });

    setBoards(tempBoards);
  };

  const updateCard = async (cid, c_id, bid, card) => {
    const bIndex = boards.findIndex((item) => item.id === bid);
    if (bIndex < 0) return;

    const cIndex = boards[bIndex].cards.findIndex((item) => item.id === cid);
    if (cIndex < 0) return;

    const tempBoards = [...boards];
    tempBoards[bIndex].cards[cIndex] = card;

    const { data } = await axios.patch(`/api/card/${c_id}`, card);
    setBoards(tempBoards);
  };

  useEffect(() => {
    const tempPages = [...pages];
    if (activePageIndex > -1 && tempPages[activePageIndex]) {
      tempPages[activePageIndex].boards = boards;
      setPages(tempPages);
    }
  }, [boards]);

  return (
    <div className="app">
      <div className="app_navbar">
        <h2>Trello</h2>
        <h2 style={{ color: "white" }}>{pages[activePageIndex]?.title}</h2>
        <Drawer
          pages={pages}
          setPages={setPages}
          setActivePageIndex={setActivePageIndex}
          activePageIndex={activePageIndex}
          UserId={UserId}
        />
      </div>
      <div
        className="app_outer custom-scroll"
        style={{
          backgroundImage:
            pages[activePageIndex]?.bg ||
            'url("https://source.unsplash.com/1200x900/?office")',
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div className="app_boards">
          {boards &&
            boards?.map((item) => (
              <Board
                board={item}
                key={item._id}
                removeBoard={removeBoard}
                page_Id={pages[activePageIndex]?._id}
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
              onSubmit={(value) => addBoard(value, pages[activePageIndex]?._id)}
            />
          </div>
        </div>
      </div>
      <div className="app_footer">
        <div style={{ background: online ? "lime" : "yellow" }}>
          Working {online ? "Online" : "Offline"}
        </div>
        <span>
          <List onClick={() => setVisible(!visible)} />
        </span>
          {visible && <Logs setVisible={setVisible} logs={pages.logs} />}
      </div>
    </div>
  );
};

export default HomePage;
