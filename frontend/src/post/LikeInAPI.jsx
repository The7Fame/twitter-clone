export const requestOption = (token, tweetId) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      id_tweet: tweetId,
    }),
  };
  return requestOptions;
};
