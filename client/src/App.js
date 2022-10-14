import React, { useEffect, useState } from "react";
// import { ThemeProvider } from '@mui/material/styles';
import Login from "./pages/authenfication/Login";
import Registration from "./pages/authenfication/Registration";
import MainPage from "./pages/main/MainPage";
import Layout from "./pages/layout/Layout";
import Profile from "./pages/profile/Profile";
// import theme from "./theme/theme";
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import topicsService from "./service/topics.service";
import collectionsService from "./service/collections.service";
import Collection from "./pages/collection/Collection";
import Item from "./pages/item/Item";
import './App.css';
import AdminPanel from "./pages/admin/AdminPanel";

function App() {
  // const [currentTheme, setCurrentTheme] = useState();
  const [currentUser, setCurrentUser] = useState(null);
  const [collectionTopics, setCollectionTopics] = useState([]);
  const [fieldTypes, setFieldTypes] = useState([]);

  useEffect(() => {
    topicsService
      .getTopics()
      .then(res => setCollectionTopics(res.data.topics))
      .catch(err => console.log(err));

    collectionsService
      .getOptionalFieldTypes()
      .then(res => setFieldTypes(res.data.types))
      .catch(err => console.log(err));
  }, []);

  // TODO: trim form values

  return (
    // <ThemeProvider theme={currentTheme}>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login setCurrentUser={setCurrentUser} />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/" element={<Layout currentUser={currentUser} setCurrentUser={setCurrentUser} />}>
          <Route index element={<MainPage currentUser={currentUser} />} />
          <Route path="/collections/:id" element={<Collection currentUser={currentUser} />} />
          <Route path="/collections/:collection_id/items/:id" element={<Item currentUser={currentUser} />} />
          <Route path="/admin-panel" element={<AdminPanel currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
          <Route path="profile" element={
            <Profile
              fieldTypes={fieldTypes}
              topics={collectionTopics}
              currentUser={currentUser}
            /> } />
        </Route>
      </Routes>
    </BrowserRouter>
    // </ThemeProvider>
  );
}

export default App;
