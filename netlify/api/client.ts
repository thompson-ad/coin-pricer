import fetch from "node-fetch";

export const apiURL = "https://coinranking1.p.rapidapi.com/coin";

const fetchConfig = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "71d316bab3msh745974fccc4e3fbp14c1b5jsnfc5dff0ed5af",
    "X-RapidAPI-Host": "coinranking1.p.rapidapi.com",
  },
};

export const client = async (endpoint: string, config = fetchConfig) => {
  return fetch(`${apiURL}/${endpoint}`, config).then(async (response) => {
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      return Promise.reject(data);
    }
  });
};
