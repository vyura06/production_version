import axios from 'axios';
import { baseTopicsUrl as baseUrl } from "../constants/routes";

axios.defaults.headers.common = {
  "Content-Type": "application/json",
};

const getTopics = async () => {
  const request = axios.get(baseUrl);
  return await request;
};

export default { getTopics };
