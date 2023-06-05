import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Minus, Plus, Search, Share2, Trash2, X } from "react-feather";
import "./Drawer.css";
import axios from "axios";
import Editable from "../Editable/Editable";

const Drawer = ({
  pages,
  setPages,
  UserId,
  setActivePageIndex,
  activePageIndex,
}) => {
  const [visible, setVisible] = useState(false);
  const [share, setShare] = useState("selected");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState("");
  const [search, setSearch] = useState("Work");
  const [searchResult, setSearchResult] = useState([]);
  const [visibleSection, setVisisbleSection] = useState("");
  const [title, setTitle] = useState(pages[activePageIndex]?.title);

  const getImg = async () => {
    if (search === "") return;
    setLoading(true);
    const result = await axios.get(
      `https://api.unsplash.com/search/photos?page=1&per_page=16&query=${search}&client_id=MfZPeaNJSdCRK_62ilFvcQz9zQTo-vH6qcO8cVGtO-M`
    );
    setLoading(false);
    setImages(result);
  };

  const setNewName = async (title) => {
    const tempPages = [...pages];
    tempPages[activePageIndex].title = title;

    const { data } = await axios.patch(
      `/api/page/${pages[activePageIndex]?._id}`,
      { title }
    );
    setPages(tempPages);
    setVisisbleSection("");
  };

  const setBg = async (url) => {
    const tempPages = [...pages];
    tempPages[activePageIndex].bg = 'url("' + url + '")';
    const { data } = await axios.patch(
      `/api/page/${pages[activePageIndex]?._id}`,
      { bg: 'url("' + url + '")' }
    );
    setPages(tempPages);
  };

  const { v4: uuidv4 } = require("uuid");

  const addPage = async (value) => {
    if (value === "") return;
    const tempPage = {
      id: uuidv4(),
      title: value,
      bg: "",
      boards: [],
      user: [],
      logs: [],
    };
    // user id me dikkat aa rahi
    console.log(UserId);
    const { data } = await axios.post(`/api/page/`, { ...tempPage, UserId });
    setPages([...pages, { ...tempPage, _id: data._id }]);
    setActivePageIndex(pages.length);
  };

  const removePage = async (pageId) => {
    const index = pages.findIndex((item) => item.id === pageId);
    if (index < 0) return;
    const tempPages = pages.filter((item) => item.id !== pageId);
    if (index <= activePageIndex) setActivePageIndex(activePageIndex - 1);
    const { data } = await axios.delete(
      `/api/page/${pages[activePageIndex]?._id}`
    );
    setPages(tempPages);
  };

  const handleSearch = async (query) => {
    setSearchResult([]);
    if (!query) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 4000);
    try {
      const { data } = await axios.get(`/api/users?search=${query}`);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      // toast({
      //   title: "Error Occured!",
      //   description: "Failed to load the search result",
      //   status: "error",
      //   duration: 5000,
      //   isClosable: true,
      //   position: "bottom-left",
      // });
    }
  };

  const handleshare = async (e) => {
    setSearchResult([]);
    setShare(e.target.value);
    try {
      const tempPages = [...pages];
      const { data } = await axios.patch(
        `/api/page/${pages[activePageIndex]?._id}`,
        { permission: share, users: [] }
      );
      setPages(tempPages);
    } catch (error) {
      
    }
  };

  const addUser = async (user) => {
    try {
      const tempPages = [...pages];
      const check = tempPages[activePageIndex].users.filter((item) => {
        if (item._id !== user._id) return item;
      });
      tempPages[activePageIndex].users = [
        ...check,
        { _id: user._id, name: user.name, email: user.email },
      ];
      const users = tempPages[activePageIndex].users.map((item) => {
        return item._id;
      });
      const { data } = await axios.patch(
        `/api/page/${pages[activePageIndex]?._id}`,
        { users }
      );
      setPages(tempPages);
    } catch (error) {}
  };

  const handleDelete = async (user) => {
    try {
      const tempPages = [...pages];
      const check = tempPages[activePageIndex].users.filter((item) => {
        if (item._id !== user._id) return item;
      });
      tempPages[activePageIndex].users=check;
      const users = tempPages[activePageIndex].users.map((item) => {
        return item._id;
      });
      const { data } = await axios.patch(
        `/api/page/${pages[activePageIndex]?._id}`,
        { users }
      );
      setPages(tempPages);
    } catch (error) {}
  };

  return (
    <div className="drawer">
      {!visible && (
        <Menu
          onClick={() => {
            getImg();
            setVisible(true);
          }}
        />
      )}
      {visible && (
        <div className="drawer_outer" onClick={() => setVisible(false)}>
          <div className="drawer_body" onClick={(e) => e.stopPropagation()}>
            <div className="drawer_body_top">
              <h1>Menu</h1>
              <X onClick={() => setVisible(false)} />
            </div>
            <button
              className="drawer_body_accordion"
              onClick={() =>
                setVisisbleSection((prev) =>
                  prev === "rename" ? "" : "rename"
                )
              }
            >
              Rename Page
              {visibleSection !== "rename" ? <Plus /> : <Minus />}
            </button>
            <div
              className="drawer_body_panel drawer_body_rename"
              style={{
                display: visibleSection === "rename" ? "block" : "none",
              }}
            >
              <input
                type="text"
                placeholder="Enter New Title"
                value={title}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    setNewName(title);
                  }
                }}
                onChange={(e) => setTitle(e.target.value)}
              />
              <button onClick={() => setNewName(title)}>Set Title</button>
            </div>
            <hr />
            <button
              className="drawer_body_accordion"
              onClick={() =>
                setVisisbleSection((prev) => (prev === "share" ? "" : "share"))
              }
            >
              Share
              {visibleSection !== "share" ? <Plus /> : <Minus />}
            </button>
            <div
              className="drawer_body_panel drawer_body_share"
              style={{
                display: visibleSection === "share" ? "block" : "none",
              }}
            >
              <select value={share} onChange={(e) => handleshare(e)}>
                <option value="anyone">AnyOne With the Link</option>
                <option value="selected">Selected</option>
              </select>
              <input
                type="text"
                placeholder="Search User By Email"
                onChange={(e) => handleSearch(e.target.value)}
                style={{
                  display: share === "selected" ? "block" : "none",
                }}
              />
              <div className="badges">
                {pages[activePageIndex].users.map((user) => (
                  <div key={user._id} className="badge">
                    {user.name}
                    <X onClick={() => handleDelete(user)} />
                  </div>
                ))}
              </div>

              {loading ? (
                <div className="loader"></div>
              ) : (
                <div className="list">
                  {searchResult?.slice(0, 4)?.map((user) => (
                    <div
                      className="list-item"
                      key={user._id}
                      onClick={() => addUser(user)}
                    >
                      <span>{user.name}</span>
                      <span>
                        <b>Email : </b>
                        {user.email}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    `http://localhost:3000/pages/${pages[activePageIndex].id}`
                  )
                }
              >
                Copy Link &nbsp; <Share2 size={16} />{" "}
              </button>
            </div>
            <hr />
            <button
              className={`drawer_body_accordion ${
                visibleSection === "bg" ? "active" : ""
              }`}
              onClick={() =>
                setVisisbleSection((prev) => (prev === "bg" ? "" : "bg"))
              }
            >
              Change Background
              {visibleSection !== "bg" ? <Plus /> : <Minus />}
            </button>
            <div
              className="drawer_body_panel"
              style={{ display: visibleSection === "bg" ? "block" : "none" }}
            >
              <div className="drawer_body_search-box">
                <input
                  type="text"
                  placeholder="Search Image"
                  value={search}
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      getImg();
                    }
                  }}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button onClick={getImg}>
                  <Search />
                </button>
              </div>
              <div className="drawer_body_images custom-scroll">
                {loading && <div className="loader"></div>}
                {images?.data?.total
                  ? images?.data?.results?.map((curr) => (
                      <img
                        src={curr.urls.thumb}
                        key={curr.id}
                        alt={curr.alt_description}
                        onClick={() => setBg(curr.urls.regular)}
                      />
                    ))
                  : "Images Not Found"}
              </div>
            </div>
            <hr />
            <button
              className="drawer_body_accordion"
              onClick={() =>
                setVisisbleSection((prev) => (prev === "pages" ? "" : "pages"))
              }
            >
              Pages
              {visibleSection !== "pages" ? <Plus /> : <Minus />}
            </button>
            <div
              className="drawer_body_panel"
              style={{ display: visibleSection === "pages" ? "block" : "none" }}
            >
              <div className="drawer_body_pages custom-scroll">
                {pages?.map((item, index) => (
                  <Link
                    key={item?.id + "2"}
                    to={`/pages/${item.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      className={`drawer_body_page ${
                        item?.id === pages[activePageIndex]?.id ? "active" : ""
                      }`}
                      onClick={() => setActivePageIndex(index)}
                    >
                      <p>{item?.title}</p>
                      <div className="drawer_body_page_controls">
                        {/* <Edit2 onClick={()=> console.log("")} /> */}
                        <Trash2 onClick={() => removePage(item.id)} />
                      </div>
                    </div>
                  </Link>
                ))}
                <Editable
                  text="Add New Page"
                  buttonText={"Add New Page"}
                  onSubmit={(value) => addPage(value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Drawer;
