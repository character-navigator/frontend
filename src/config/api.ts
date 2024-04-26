import axios, { AxiosResponse } from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5025/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export function isUnsuccessfulResponse(response: AxiosResponse): boolean {
  return response.status !== 200;
}

export default instance;

