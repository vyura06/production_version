import React from "react";
import { Outlet } from "react-router-dom";
import Nav from "../navbar/Nav";
import "../main/main.css";

function Layout({ currentUser, setCurrentUser }) {
  return (
    <>
      <Nav currentUser={currentUser} setCurrentUser={setCurrentUser} />

      <main className="main-container">
        <Outlet />
      </main>
    </>
  );
}

export default Layout;
