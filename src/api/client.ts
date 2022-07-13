export const apiURL = "/.netlify/functions";

const defaultConfig = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

export const client = async (endpoint: string, config = defaultConfig) => {
  return fetch(`${apiURL}/${endpoint}`, config).then(async (response) => {
    const data = await response.json();
    if (response.ok) {
      return data.data;
    } else {
      return Promise.reject(data);
    }
  });
};
