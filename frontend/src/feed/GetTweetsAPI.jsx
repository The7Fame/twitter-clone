export const requestOption = (token) => {
  const requestOptions = {
    method: "GET",
    url: "/api/tweets",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  };
  return requestOptions;
};
