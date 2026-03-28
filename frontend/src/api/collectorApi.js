import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api", // adjust if needed
});

// GET all collectors
export const getCollectors = () => API.get("/collectors");

// JOIN as collector
export const joinCollector = (data) => API.post("/collectors/join", data);