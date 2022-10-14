import React from "react";
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import LoginIcon from '@mui/icons-material/Login';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";
import "../main.css";

function Nav({ currentUser, setCurrentUser }) {
  const navigate = useNavigate();

  return (
    <Paper
        component="form"
        className="main-nav"
      >
        <IconButton onClick={() => navigate("/")} sx={{ p: '10px' }} aria-label="home">
          <HomeIcon />
        </IconButton>
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search"
          inputProps={{ 'aria-label': 'search' }}
        />
        <IconButton sx={{ p: '10px' }} aria-label="search">
          <SearchIcon />
        </IconButton>
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        { currentUser ? <ProfileMenu currentUser={currentUser} setCurrentUser={setCurrentUser} /> : (
          <IconButton sx={{ p: '10px' }} aria-label="profile" onClick={() => navigate("/login")}>
            <LoginIcon />
          </IconButton>
        )}
      </Paper>
  );
}

export default Nav;
