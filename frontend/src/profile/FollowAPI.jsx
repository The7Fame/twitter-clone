export const requestOption = (userId, token) => {
  const requestOptions = {
    method: "POST",
    url: `/api/users/${userId}/follow`,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      whom_user: userId,
    }),
  };
  return requestOptions;
};
