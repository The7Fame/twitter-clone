export const requestOption = (email, password) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: JSON.stringify(
      `grant_type=&username=${email}&password=${password}&scope=&client_id=&client_secret=`
    ),
  };
  return requestOptions;
};
