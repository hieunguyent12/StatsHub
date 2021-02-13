import axios from "axios";

export const githubAPI = axios.create({
  headers: { Authorization: `token ${process.env.REACT_APP_AUTH_TOKEN}` },
});
