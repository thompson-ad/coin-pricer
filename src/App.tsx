import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import useInterval from "./useInterval";

function App() {
  const [coins, setCoins] = useState([]);

  // Show an error message if it fails to fetch
  useInterval(
    () => {
      fetchSupportedCoins()
        .then((coins) => {
          setCoins(coins);
        })
        .catch((err) => console.error("ERROR", err));
    },
    5000,
    true
  );

  const fetchSupportedCoins = () => {
    return window
      .fetch("/.netlify/functions/get-coins")
      .then(async (response) => {
        const { data: coinsData } = await response.json();
        if (response.ok) {
          if (coinsData.length > 0) {
            return coins;
          } else {
            return Promise.reject(new Error(`Coin data not available`));
          }
        } else {
          return Promise.reject("Something went wrong");
        }
      });
  };

  console.log("COINS", coins);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
