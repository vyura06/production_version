import React, { useState } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { Switch} from "@mui/material"
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import LoginIcon from '@mui/icons-material/Login';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from "react-router-dom";
import ProfileMenu from "../profile/ProfileMenu";
import { MenuItem, FormControl, Select, InputLabel } from "@mui/material";
//import Search from "../search/Search";

import "../main/main.css";

import i18n from 'i18next'
import { useTranslation } from "react-i18next";
import "../../tranlations/i18next";

function Nav({ currentUser, setCurrentUser }) {

  const [currentTheme, setCurrentTheme] = useState(false);
  const [items, setItems] = useState("");

  const navigate = useNavigate();

  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  }

  const darktheme = createTheme({
    palette:{
      mode: "dark",
    },
  });
  
  const lighttheme = createTheme({
  });

  return (
    <ThemeProvider theme={currentTheme ? darktheme : lighttheme}> 
    <Paper
      component="form"
      className="main-nav"
    >
      <IconButton onClick={() => navigate("/")} sx={{ p: '10px' }} aria-label="home">
        <HomeIcon />
      </IconButton>
      
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />

      <IconButton sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>

      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={t("main.search")}
        inputProps={{ 'aria-label': 'search' }}
      />

      <FormControl>
        <InputLabel>{t("translations.lng")}</InputLabel>
        <Select style={{ width:"4rem" }}>
          <MenuItem onClick={() => changeLanguage("ru")}> {t("translations.ru")}</MenuItem>
          <MenuItem onClick={() => changeLanguage("en")}> {t("translations.en")}</MenuItem>
        </Select>
      </FormControl>

      <Switch checked={currentTheme} onChange={()=> setCurrentTheme(!currentTheme)}/>

      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />

      {currentUser ? <ProfileMenu currentUser={currentUser} setCurrentUser={setCurrentUser} /> : (
        <IconButton sx={{ p: '10px' }} aria-label="profile" onClick={() => navigate("/login")}>
          <LoginIcon />
        </IconButton>
      )}
     
    </Paper>
    </ThemeProvider>
  );
}

export default Nav;
