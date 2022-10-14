import axios from 'axios';
import { baseCollectionsUrl as baseUrl, topFiveBiggestCollectionsUrl } from "../constants/routes";

axios.defaults.headers.common = {
  "Content-Type": "application/json",
};

const getOptionalFieldTypes = async () => {
  const request = axios.get(baseUrl + "/optional-field-types");
  return await request;
};

const createCollection = async (data) => {
  const request = axios.post(baseUrl, data);
  return await request;
}

const editCollection = async (collection_id, data) => {
  const request = axios.post(baseUrl + `/${collection_id}`, data);
  return await request;
}

const getAllCollections = async () => {
  const request = axios.get(baseUrl);
  return await request;
}

const getUserCollections = async (user_id) => {
  const request = axios.get(baseUrl + `?user_id=${user_id}`);
  return await request;
}

const getTopBiggestCollections = async () => {
  const request = axios.get(topFiveBiggestCollectionsUrl);
  return await request;
}

const removeCollection = async (collection_id) => {
  const request = axios.delete(baseUrl + `/${collection_id}`);
  return await request;
}

const getCollectionOptionalFields = async (collection_id) => {
  const request = axios.get(baseUrl + `/${collection_id}/fields`);
  return await request;
}

export default {
  getOptionalFieldTypes,
  createCollection,
  editCollection,
  getAllCollections,
  getUserCollections,
  removeCollection,
  getCollectionOptionalFields,
  getTopBiggestCollections
};
