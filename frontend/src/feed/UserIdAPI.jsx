export const requestOption = (token) => {
  const requestOptions = {
    method: "GET",
    url: "/api/users/me",
    headers: {
      "Content-Type": "applications/json",
      Authorization: "Bearer " + token,
    },
  };
  return requestOptions;
};
