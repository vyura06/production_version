import React, { useState } from "react";
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Logout from '@mui/icons-material/Logout';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import {
  amber, blue, blueGrey, brown, common, cyan,
  deepOrange, deepPurple, green, grey, indigo, lightBlue,
  lightGreen, lime, orange, pink, purple, red, teal, yellow
} from '@mui/material/colors';
import { useNavigate } from "react-router-dom";

import {useTranslation} from "react-i18next";
import "../../tranlations/i18next";

const randomColors = [ amber, blue, blueGrey, brown, common,
  cyan, deepOrange, deepPurple, green, grey, indigo, lightBlue,
  lightGreen, lime, orange, pink, purple, red, teal, yellow
];
const randomIndex = ~~(Math.random() * ((randomColors.length - 1) - 0) + 0);
const randomColor = randomColors[randomIndex];

function ProfileMenu({ currentUser, setCurrentUser }) {

  const {t} = useTranslation();

  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const userFullName = `${currentUser.last_name} ${currentUser.first_name}`;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigate("/login");
  }

  return (
    <React.Fragment>
      <Box sx={{ backgroundColor:"#BCCEF8", display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title={t("profile.menu.settings")}>
          <IconButton
            onClick={handleClick}
            size="small"
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: randomColor[400] }} />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{ elevation: 0 }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        style={{ backgroundColor:"#BCCEF8"}}
      >
        <MenuItem onClick={() => navigate("/profile")}>
          <Avatar sx={{ bgcolor: randomColor[400] }} />
          { userFullName }
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => navigate("/registration")}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          {t("profile.menu.another")}
        </MenuItem>
        {currentUser?.is_admin && (
          <MenuItem onClick={() => navigate("/admin-panel")}>
            <ListItemIcon>
              <AdminPanelSettingsIcon fontSize="small" />
            </ListItemIcon>
            {t("profile.menu.admin")}
          </MenuItem>
        )}
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          {t("profile.menu.logout")}
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}

export default ProfileMenu;
