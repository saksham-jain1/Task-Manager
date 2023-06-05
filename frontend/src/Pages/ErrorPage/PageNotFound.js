import React from 'react'
import img from "../../assets/pagenotfound.jpg"

const PageNotFound = () => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${img})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
    </div>
  );
}

export default PageNotFound