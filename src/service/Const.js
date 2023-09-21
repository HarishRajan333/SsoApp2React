import axios from "axios";

export const keycloakAxios = axios.create({
    baseURL: "http://localhost:8080",
  });