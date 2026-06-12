import api from "./api";

export const userService = {
  login: async (email, password) => {
    const response = await api.post("/users/api/login/", {
      email: email,
      password: password,
    });
    return response.data;
  },

  register: async (registerPayload) => {
    const response = await api.post("/users/api/register/", registerPayload);
    return response.data;
  },
};