export const requestOption = (userId, token) => {
  const requestOptions = {
    method: "DELETE",
    url: `/api/users/${userId}/follow`,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  };
  return requestOptions;
};
