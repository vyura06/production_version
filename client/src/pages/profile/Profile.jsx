import React, { useEffect, useState } from "react";
import { Alert, AlertTitle, Avatar, Chip, Button } from "@mui/material";
import CollectionsBookmarkOutlinedIcon from '@mui/icons-material/CollectionsBookmarkOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddIcon from '@mui/icons-material/Add';
import ProfileModal from "../profile/ProfileModal";
import CollectionsTable from "../table/CollectionsTable";
import collectionsService from "../../service/collections.service";
import usersService from "../../service/users.service";
import "./profile.css";

import {useTranslation} from "react-i18next";
import "../../tranlations/i18next";

function Profile({ currentUser, topics, fieldTypes }) {

  const {t} = useTranslation();

  const [collections, setCollections] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editCollection, setEditCollection] = useState(null);
  const [userLikes, setUserLikes] = useState([]);

  const columns = [
    "#",
    t("profile.columns.name"),
    t("profile.columns.topic"),
    t("profile.columns.itemsCount"),
    t("profile.columns.created"),
    t("profile.columns.link"),
    t("profile.columns.edit"),
    t("profile.columns.delete")
  ];

  useEffect(() => {
    if (!currentUser) return;

    collectionsService
      .getUserCollections(currentUser.id)
      .then(res => setCollections(res.data.collections))
      .catch(err => console.log(err));

    usersService
      .getUserLikes(currentUser.id)
      .then(res => setUserLikes(res.data.likes))
      .catch(err => console.log(err));
  }, [currentUser]);

  if (!currentUser) {
    return (
      <>
      <Alert severity="warning" style={{ width: "100%", marginTop: 30 }}>
        <AlertTitle>{t("profile.warning")}</AlertTitle>
        {t("profile.visit")} — <strong>{t("profile.continue")}</strong>
      </Alert>
      </>
    );
  }

  const handleClickOpenModal = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setEditCollection(null);
  };

  const handleModalAction = async (collection) => {
    if (editCollection) {
      await collectionsService.editCollection(collection.id, collection);
      setCollections(collections.map(c => {
        if (c.id === collection.id)
          return collection;
        return c;
      }));
    } else {
      collection.user_id = currentUser.id;
      const response = await collectionsService.createCollection(collection);
      const newCollection = response.data.collection;

      setCollections([...collections, newCollection]);
    }
    handleClose();
  }

  const handleRemoveCollection = (id) => {
    const filteredCollections = collections.filter(collection => collection.id !== id);
    setCollections(filteredCollections);
    collectionsService
      .removeCollection(id)
      .catch(err => console.log(err));
  }

  const handleEditCollection = (id) => {
    setEditCollection(
      collections.find(collection => collection.id === id)
    );
    setOpenModal(true);
  }

  const fullName = `${currentUser.last_name} ${currentUser.first_name}`;
  const created = new Date(currentUser.created_date).toLocaleString();

  return (
    <div className="profile__container">
      <div className="user__container">
        <Avatar sx={{ width: 200, height: 200 }} />
        <div className="user-info">
          <h1>{fullName}</h1>
          <p style={{ textAlign: "center" }}>{t("profile.account")} {created}</p>
          <div className="user-info__stats">
            <div className="stats__stat">
              <Chip label={userLikes.length} color="info" icon={<FavoriteBorderIcon />} onClick={() => {}} />
              <span>{t("profile.totalLikes")}</span>
            </div>
            <div className="stats__stat">
              <Chip label={collections.length} color="info"
                icon={<CollectionsBookmarkOutlinedIcon />} onClick={() => {}} />
              <span>{t("profile.totalCollections")}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="collections__container">
        <header>
          <h1>{t("profile.col")}</h1>
          <Button onClick={handleClickOpenModal} variant="contained" endIcon={<AddIcon />}>
          {t("profile.create")}
          </Button>
        </header>
        { collections.length ? (
          <CollectionsTable
            columns={columns}
            collections={collections}
            onEdit={handleEditCollection}
            onRemove={handleRemoveCollection}
          />
        ) : (
          <p>{t("profile.noItem")}</p>
        )}
        { openModal && (
          <ProfileModal
            currentUser={currentUser}
            fieldTypes={fieldTypes}
            topics={topics}
            openModal={openModal}
            closeModal={handleClose}
            editCollection={editCollection}
            onAction={handleModalAction}
          />
        ) }
      </div>
    </div>
  );
}

export default Profile;
