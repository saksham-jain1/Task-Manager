import React, { useState } from "react";
import { Menu, Search, X } from "react-feather";
import "./Drawer.css";
import axios from 'axios';

const Drawer = ({ setImgUrl }) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState("");
  const [search, setSearch] = useState("Work")

  const getImg = async() =>{
    if(search==="") return;
    setLoading(true);
    const result = await axios.get(`https://api.unsplash.com/search/photos?page=1&per_page=16&query=${search}&client_id=MfZPeaNJSdCRK_62ilFvcQz9zQTo-vH6qcO8cVGtO-M`);
    setLoading(false);
    setImages(result);
  }

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
              <h1>Change Background</h1>
              <X onClick={() => setVisible(false)} />
            </div>
            <div className="drawer_body_search-box">
              <input
                type="text"
                placeholder="Search Image"
                value={search}
                onKeyUp={(e)=>{if(e.key==="Enter"){getImg()}}}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button onClick={getImg}>
                <Search />
              </button>
            </div>
            <div className="drawer_body_images custom-scroll">
              {loading && <p>Loading...</p>}
              {images?.data?.results?.map((curr) => (
                <img
                  src={curr.urls.small}
                  key={curr.id}
                  alt={curr.alt_description}
                  onClick={() => setImgUrl('url("' + curr.urls.regular + '")')}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Drawer;
