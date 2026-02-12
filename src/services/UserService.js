import httpClient from "../utils/http-client";

class UserService {
  async login(data) {
    const user = await httpClient.post("/login", data);
    return user;
  }

  async list() {
    const users = await httpClient.get("/users");
    return users;
  }

  async get(id) {
    const user = await httpClient.get(`/users/${id}`);
    return user;
  }

  async create(data) {
    const user = await httpClient.post("/users", data);
    return user;
  }

  async delete(id) {
    const user = await httpClient.delete(`/users/${id}`);
    return user;
  }

  async update(id, data) {
    const user = await httpClient.put(`/users/${id}`, data);
    return user;
  }
}

export default UserService;
