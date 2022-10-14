import axios from 'axios';
import { baseTagsUrl as baseUrl } from "../constants/routes";

axios.defaults.headers.common = {
  "Content-Type": "application/json",
};

const getTags = async () => {
  const request = axios.get(baseUrl);
  return await request;
}

export default { getTags };
