import httpClient from "../utils/http-client";

class UserService {
  async login(data) {
    const user = await httpClient.post("/login", data);
    return user;
  }

  async list() {
    const token = localStorage.getItem("token");
    const users = await httpClient.get("/users", { headers: { Authorization: `Bearer ${token}` } });
    return users;
  }

  async get(id) {
    const token = localStorage.getItem("token");
    const user = await httpClient.get(`/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    return user;
  }

  async create(data) {
    const token = localStorage.getItem("token");
    const user = await httpClient.post("/users", data, { headers: { Authorization: `Bearer ${token}` } });
    return user;
  }

  async delete(id) {
    const token = localStorage.getItem("token");
    const user = await httpClient.delete(`/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    return user;
  }

  async update(id, data) {
    const token = localStorage.getItem("token");
    const user = await httpClient.put(`/users/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
    return user;
  }
}

export default UserService;
