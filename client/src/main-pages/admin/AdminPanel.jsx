import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import usersService from "../../shared/api/users.service";
import SettingsIcon from '@mui/icons-material/Settings';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import BlockIcon from '@mui/icons-material/Block';
import DeleteIcon from '@mui/icons-material/Delete';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import "./admin.css";

function AdminPanel({ currentUser, setCurrentUser }) {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClickOptions = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseOptions = () => {
    setAnchorEl(null);
  };

  if (!currentUser || !currentUser?.is_admin)
    navigate("/");

  useEffect(() => {
    usersService
      .getAllUsers()
      .then(res => setUsers(res.data.users))
      .catch(err => console.log(err));
  }, []);

  const getDateFormat = (date) => {
    const newDate = new Date(date);
    const datePart = newDate.toLocaleDateString();
    const timePart = newDate.toLocaleTimeString();

    return `${datePart} ${timePart}`;
  }

  const getBoleanFormat = (value) => value ? "✔" : "✖";

  const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'last_name', headerName: 'Last name', width: 130 },
    { field: 'first_name', headerName: 'First name', width: 130 },
    { field: 'email', headerName: 'Email', width: 130 },
    { field: 'password', headerName: 'Password', width: 130 },
    { field: 'is_admin', headerName: 'Admin', width: 80,
      valueGetter: (params) => getBoleanFormat(params.row.is_admin) },
    { field: 'is_blocked', headerName: 'Blocked', width: 80,
      valueGetter: (params) => getBoleanFormat(params.row.is_blocked) },
    { field: 'created_date', headerName: 'Created', width: 200,
      valueGetter: (params) => getDateFormat(params.row.created_date)},
    { field: 'last_visit', headerName: 'Last visit', width: 200,
    valueGetter: (params) => getDateFormat(params.row.last_visit) },
  ];

  const handleSelection = (selectedIDs) => {
    const selected = users.filter(user => selectedIDs.includes(user.id));
    setSelectedUsers(selected);
  }

  const getAllUsers = async () => {
    const response = await usersService.getAllUsers();
    return response.data.users;
  }

  const checkCurrentUserStatuses = (updatedUsers) => {
    const user = updatedUsers.find(user => user.id === currentUser.id);
    setCurrentUser(user);

    if (!user.is_admin) navigate("/");
    else if (user.is_blocked) {
      setCurrentUser(null);
      navigate("/");
    }
  }

  const changeUsers = async (part, fn) => {
    const newSelectedUsers = [];
    for (const selectedUser of selectedUsers) {
      const response = await fn.call(null, selectedUser.id, !selectedUser[part]);
      const updatedUser = response.data.user;
      newSelectedUsers.push(updatedUser);
    }
    setSelectedUsers(newSelectedUsers);

    const updatedUsers = await getAllUsers();
    setUsers(updatedUsers);
    checkCurrentUserStatuses(updatedUsers);
  }

  const handleChangeBlockStatus = async () =>
    await changeUsers("is_blocked", usersService.changeUserBlockStatus);

  const handleChangeAdminStatus = async () =>
    await changeUsers("is_admin", usersService.changeUserAdminStatus);

  const handleDeleteUsers = async () => {
    const selectedIDs = [];
    for (const user of selectedUsers) {
      await usersService.removeUser(user.id);
      selectedIDs.push(user.id);
    }
    setUsers(users.filter(u => !selectedIDs.includes(u.id)));
    handleCloseOptions();
  }

  return (
    <div className="admin__container">
      <header className="admin__header">
        <h1>Admin panel</h1>
        <div className="admin__actions">
          <IconButton
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClickOptions}
          >
            <SettingsIcon />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleCloseOptions}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={handleChangeBlockStatus}>
              <ListItemIcon>
                <BlockIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Block/Unblock users</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleChangeAdminStatus}>
              <ListItemIcon>
                <SupervisorAccountIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Give/remove admin status</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleDeleteUsers}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Delete selected users</ListItemText>
            </MenuItem>
          </Menu>
        </div>
      </header>
      <div className="users__container">
        <DataGrid
          rows={users}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          onSelectionModelChange={handleSelection}
        />
      </div>
    </div>
  )
}

export default AdminPanel;
