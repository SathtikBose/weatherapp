import { useState } from "react";
import PropagateLoader from "react-spinners/ClipLoader";
import "./App.css";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

function App() {
  const [state, setState] = useState("delhi");
  const [country, setCountry] = useState("in");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const client_id = import.meta.env.VITE_CLIENT_ID;
  const client_secret_id = import.meta.env.VITE_SECRET_ID;

  async function getdata() {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://data.api.xweather.com/airquality/${state},${country}?format=json&client_id=${client_id}&client_secret=${client_secret_id}`
      );
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <>
      <div className="container">
        <h2>Weather App</h2>
        <div className="state_field_container">
          <input
            type="text"
            placeholder="enter the state"
            id="state"
            onChange={(e) => setState(e.target.value)}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="enter the country"
            id="country"
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>
        <div>
          <button onClick={() => getdata()} aria-details="disable">
            Get the Data
          </button>
        </div>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          data && (
            <div>
              {data.error ? (
                data.error.code === "invalid_location" ? (
                  <div>
                    <p>{data.error.description}</p>
                  </div>
                ) : data.error.code === "invalid_client" ? (
                  <div>
                    <p>Invalid client credentials</p>
                  </div>
                ) : (
                  <div>
                    <p>Unknown error occurred</p>
                  </div>
                )
              ) : (
                <div>
                  <p>State name: {data?.response[0].place.name}</p>
                  <p>Country name: {data?.response[0].place.country}</p>
                  <p>Air Quality : {data?.response[0].periods[0].category}</p>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </>
  );
}

export default App;
