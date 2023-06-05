import axios from "axios";
import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import "./App.css";
import ErrorPage from "./Pages/ErrorPage/ErrorPage";
import PageNotFound from "./Pages/ErrorPage/PageNotFound";
import HomePage from "./Pages/HomePage/HomePage";

function App() {
  const { v4: uuidv4 } = require("uuid");

  const [pages, setPages] = useState([]);
  const [activeTab, setActiveTab] = useState("login");
  const [data, setData] = useState({ email: "", password: "" });
  const [user, setUser] = useState("");
  const [online, setOnline] = useState(window.navigator.onLine);

  setInterval(() => {
    setOnline(window.navigator.onLine);
  }, 5000);

  const navigate = useNavigate();
  //  useEffect(() => {
  //  localStorage.setItem("task-manager", JSON.stringify(pages));
  //   if (pages && login && window.location.pathname === "/pages") {
  //     navigate(`/pages/${pages[0].id}`);
  //   }
  // }, [pages]);

  // page change popup
  // edit

  // setInterval(async () => {
  //   if (pages) {
  //     const user_data = await axios.post("/api/users/login", data);
  //     // setUser(user_data.data);
  //     setPages(user_data.data.pages);
  //   }
  // }, 2000);
  const { id } = useParams();
  const login = async () => {
    if (data.email && data.password) {
      try {
        const user_data = await axios.post("/api/users/login", data);
        setUser(user_data.data);
        setPages(user_data.data.pages);
        if (id) {
          var check = user_data.data.pages.filter((item) => {
            if (item.id == id || item._id == id) return item;
          });
        }
        console.log(check.length);
        if (!id || check.length)
          navigate(`/pages/${user_data.data.pages[0].id}`);
        else {
          const page = await axios.get(`/api/page/${id}`, {
            params: { _id: user_data.data._id },
          });
          if (page.data != "No data Found") {
            setPages([page.data]);
            navigate(`/pages/${id}`);
          } else {
            navigate("/error");
          }
        }
      } catch (error) {
        //add toast
        console.log(error);
      }
    } else {
      // fill detail toast
    }
  };

  const signup = async () => {
    if (data.name && data.email && data.password && data.cpassword) {
      if (data.cpassword === data.password) {
        try {
          const user = await axios.post("/api/users/", {
            ...data,
            pages: {
              id: uuidv4(),
              title: "First 2.0",
              bg: "",
              boards: [],
              users: [],
            },
          });
          setPages(user.data.pages);
          setUser(user.data);
          console.log(user);
        } catch (error) {
          //add toast
          console.log(error.response.data);
        }
      } else {
        // toast for pass not match
      }
    } else {
      // fill detail toast
    }
  };

  const Login = () => {
    return (
      <>
        <label htmlFor="email">Email </label>
        <input
          type="email"
          name="email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
          id="email"
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
          id="password"
        />
        <br />
        <input
          type="button"
          value="Login"
          onClick={() => login()}
          id="submit"
        />
        <input type="reset" value="Reset" id="reset" />
      </>
    );
  };

  const SignUp = () => {
    return (
      <>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          value={data.name}
          name="username"
          id="username"
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />
        <label htmlFor="email">Email </label>
        <input
          type="email"
          value={data.email}
          name="email"
          id="email"
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          value={data.password}
          name="password"
          id="password"
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />
        <label htmlFor="cpassword">Confirm Password</label>
        <input
          type="password"
          value={data.cpassword}
          name="cpassword"
          id="cpassword"
          onChange={(e) => setData({ ...data, cpassword: e.target.value })}
        />
        <br />
        <input
          type="button"
          value="Sign Up"
          onClick={(e) => signup(e)}
          id="submit"
        />
        <input type="reset" value="Reset" id="reset" />
      </>
    );
  };

  const Header = () => {
    return (
      <div className="header">
        <span
          className={activeTab === "home" ? "active" : ""}
          onClick={() => setActiveTab("home")}
        >
          Home
        </span>
        <span
          className={activeTab !== "home" ? "active" : ""}
          onClick={() => {
            setActiveTab("login");
            setData({ email: "", password: "" });
          }}
        >
          Login/Sign-Up
        </span>
      </div>
    );
  };

  return (
    <div className="app1 custom-scroll">
      {!user && (
        <>
          <Header />
          {activeTab === "login" || activeTab === "signup" ? (
            <>
              <div className="label">Task On Time</div>
              <div className="form">
                <div className="form_top">
                  <div
                    className={activeTab === "login" ? "active" : ""}
                    onClick={() => {
                      setActiveTab("login");
                      setData({ email: "", password: "" });
                    }}
                  >
                    Login
                  </div>
                  <div
                    className={activeTab === "signup" ? "active" : ""}
                    onClick={() => {
                      setActiveTab("signup");
                      setData({
                        name: "",
                        email: "",
                        password: "",
                        cpassword: "",
                      });
                    }}
                  >
                    SignUp
                  </div>
                </div>
                <div>{activeTab === "login" ? <Login /> : <SignUp />}</div>
              </div>
            </>
          ) : (
            <div className="home"></div>
          )}
        </>
      )}
      {user ? (
        <Routes>
          <Route
            path="/"
            exact
            element={
              <HomePage
                pages={pages}
                UserId={user?._id}
                online={online}
                setPages={setPages}
              />
            }
          />
        </Routes>
      ) : (
        <div>Loading.. </div>
      )}
    </div>
  );
}

export default App;
