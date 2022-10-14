import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import itemsService from "../../shared/api/items.service";
import { DataGrid } from '@mui/x-data-grid';
import { Chip, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import CollectionModal from "./CollectionModal";
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import "./collection.css";

function Collection({ currentUser }) {
  const location = useLocation();
  const navigate = useNavigate();
  const collection = location.state.collection;
  const {
    id,
    name,
    description,
    topic_name,
    created_date,
    author,
    image_link
  } = collection;
  const created = new Date(created_date).toLocaleString();
  const isOwner = (currentUser?.id === collection.user_id) || !!(currentUser?.is_admin);

  const [items, setItems] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [optionalFields, setOptionalFields] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClickOptions = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseOptions = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    itemsService
      .getCollectionItems(id)
      .then(res => setItems(res.data.items))
      .catch(err => console.log(err));

    itemsService
      .generateItemOptionalFields(id)
      .then(res => setOptionalFields(res.data.fields))
      .catch(err => console.log(err));
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 250 },
    {
      field: 'tags',
      headerName: 'Tags',
      sortable: false,
      width: 250,
      renderCell: (params) => (
        params.row.tags.map((tag, index) => (
          <Chip key={index} label={tag.name} variant="outlined" />
        ))
      ),
    },
    { field: 'created_date', headerName: 'Created', width: 200,
      valueGetter: (params) =>
        new Date(params.row?.created_date).toLocaleDateString() + ' ' +
        new Date(params.row?.created_date).toLocaleTimeString()},
    { field: 'last_edit', headerName: 'Last edit', width: 200,
      valueGetter: (params) =>
        new Date(params.row?.last_edit).toLocaleDateString() + ' ' +
        new Date(params.row?.last_edit).toLocaleTimeString()},
  ];

  const infoFields = [
    {
      name: "Name",
      value: name,
    },
    {
      name: "Topic",
      value: topic_name
    },
    {
      name: "Author",
      value: author
    },
    {
      name: "Items count",
      value: items.length,
    },
    {
      name: "Created",
      value: created,
    },
    {
      name: "Description",
      value: description,
    },
  ];

  const handleClickOpenModal = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setEditItem(null);
  };

  const handleModalAction = async (item) => {
    if (editItem) {
      const response = await itemsService.editItem(item.id, item);
      const editedItem = response.data.item;

      setSelectedItems([editedItem, selectedItems.slice(1)]);

      setItems(items.map(i => {
        if (i.id === editedItem.id)
          return editedItem;
        return i;
      }));
    } else {
      item.collection_id = id;
      const response = await itemsService.createItem(item);
      const newItem = response.data.item;

      setItems(items.concat([newItem]));
    }
    handleClose();
  }

  const handleSelection = (selectedIDs) => {
    const selected = items.filter(item => selectedIDs.includes(item.id));
    setSelectedItems(selected);
  }

  const handleCreateItem = () => {
    handleClickOpenModal();
    handleCloseOptions();
  }

  const handleEditItem = () => {
    if (selectedItems.length === 0) {
      handleCloseOptions();
      return;
    }

    setEditItem(selectedItems[0]);
    handleClickOpenModal();
    handleCloseOptions();
  }

  const handleDeleteItems = async () => {
    if (selectedItems.length === 0) {
      handleCloseOptions();
      return;
    }

    const selectedIDs = [];
    for (const item of selectedItems) {
      await itemsService.removeItem(item.id);
      selectedIDs.push(item.id);
    }

    setItems(items.filter(item => !selectedIDs.includes(item.id)));
    handleCloseOptions();
  }

  const handleItemLink = () => {
    if (selectedItems.length === 0) {
      handleCloseOptions();
      return;
    }

    const item = selectedItems[0];
    item.collection_name = name;
    navigate("/collections/" + id + "/items/" + item.id, { state: { item } });
    handleCloseOptions();
  }

  return (
    <div className="collection__container">
      <header className="collection__header">
        { image_link && (
          <img
            style={{ alignSelf: "flex-start" }}
            draggable="false"
            src={image_link}
            height="200"
            alt={topic_name} />
        )}
        <div className="collection__info">
          <div className="info__header">
            <h1>Info</h1>
              <div>
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
                  <MenuItem onClick={handleItemLink}>
                    <ListItemIcon>
                      <OpenInNewIcon />
                    </ListItemIcon>
                    <ListItemText>Go to item</ListItemText>
                  </MenuItem>

                  { isOwner && (
                    [
                      (<MenuItem onClick={handleCreateItem}>
                        <ListItemIcon>
                          <AddIcon />
                        </ListItemIcon>
                        <ListItemText>Create item</ListItemText>
                      </MenuItem>),
                      (<MenuItem onClick={handleEditItem}>
                        <ListItemIcon>
                          <EditIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Edit selected item</ListItemText>
                      </MenuItem>),
                      (<MenuItem onClick={handleDeleteItems}>
                        <ListItemIcon>
                          <DeleteIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Delete selected items</ListItemText>
                      </MenuItem>)
                    ]
                  )}
                </Menu>
              </div>
          </div>
          { infoFields.map((field, index) => (
            <div key={index} className="info__field">
              <div className="field__header">{field.name}</div>
              <p>{field.value}</p>
            </div>
          )) }
        </div>
      </header>
      { items.length ? (
        <DataGrid
          className="items__container"
          rows={items}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          onSelectionModelChange={handleSelection}
          disableSelectionOnClick
        />
      ) : (
        <p>There are no items.</p>
      )}
      { openModal && (
        <CollectionModal
          optionalFields={optionalFields}
          openModal={openModal}
          closeModal={handleClose}
          editItem={editItem}
          onAction={handleModalAction}
        />
      ) }
    </div>
  );
}

export default Collection;
