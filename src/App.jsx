import { useEffect, useState } from "react";
import PropagateLoader from "react-spinners/ClipLoader";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

export default function AppNew() {
  const countryApiKey = import.meta.env.VITE_COUNTRY_API_KEY;
  const weatherClientID = import.meta.env.VITE_WEATHER_CLIENT_ID;
  const WeatherSecretID = import.meta.env.VITE_WEATHER_SECRET_ID;
  const [textColor, setTextColor] = useState("dark");
  const [backgroundColor, setBackgroundColor] = useState("light");
  const [country, setCounrty] = useState(null);
  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [state, setState] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchCountryError, setFetchCountryError] = useState(false);
  const [fetchStateError, setFetchStateError] = useState(false);

  function LightModeDarkMode() {
    if (backgroundColor === "light") {
      setTextColor("light");
      setBackgroundColor("dark");
      document.body.style.backgroundColor = "#000";
      document.body.style.color = "#fff";
    } else {
      setTextColor("dark");
      setBackgroundColor("light");
      document.body.style.backgroundColor = "#fff";
      document.body.style.color = "#000";
    }
  }

  async function getCountry() {
    try {
      var headers = new Headers();
      headers.append("X-CSCAPI-KEY", countryApiKey);

      var requestOptions = {
        method: "GET",
        headers: headers,
        redirect: "follow",
      };

      const country = await fetch(
        "https://api.countrystatecity.in/v1/countries",
        requestOptions
      );
      const countryData = await country.json();
      setCountryData(countryData);
    } catch (error) {
      setFetchCountryError(true);
    }
  }

  async function getStaes() {
    try {
      var headers = new Headers();
      headers.append("X-CSCAPI-KEY", countryApiKey);

      var requestOptions = {
        method: "GET",
        headers: headers,
        redirect: "follow",
      };

      const statesResponse = await fetch(
        `https://api.countrystatecity.in/v1/countries/${country}/states`,
        requestOptions
      );
      const stateData = await statesResponse.json();
      setStateData(stateData);
    } catch (error) {
      setFetchStateError(true);
    }
  }

  async function getWeather() {
    setIsLoading(true);
    try {
      const weatherResponse = await fetch(
        `https://data.api.xweather.com/airquality/${state},${country.toLowerCase()}?format=json&client_id=${weatherClientID}&client_secret=${WeatherSecretID}`
      );
      const weatherData = await weatherResponse.json();
      setWeatherData(weatherData);
      setIsLoading(false);
    } catch (error) {
      console.error("Unable the fetch api");
    }
  }
  useEffect(() => {
    getCountry();
    if (country) {
      getStaes();
    }
  }, [country]);

  return (
    <>
      <div>
        <nav className={`navbar navbar-expand-lg bg-body-${"black"}`}>
          <div className="container-fluid">
            <a className={`navbar-brand text-${textColor}`} href="/">
              Weather App
            </a>
            <button
              className={`border border-0 text-${textColor} bg-${backgroundColor} `}
              onClick={() => LightModeDarkMode()}
            >
              <i
                className={`fa-solid fa-${
                  backgroundColor === "light" ? "moon" : "sun"
                }`}
                style={{ fontSize: "27px" }}
              ></i>
            </button>
          </div>
        </nav>
      </div>
      {!fetchCountryError ? (
        <div className="container my-3">
          <select
            className={`form-select text-${textColor} bg-${backgroundColor}`}
            aria-label="Default select example"
            onChange={(e) =>
              setCounrty(
                e.target.value === "Select Country"
                  ? null
                  : e.target.value.toLowerCase()
              )
            }
          >
            <option defaultValue="null">Select Country</option>
            {countryData.map((value) => {
              return (
                <option key={value.id} value={value.iso2}>
                  {value.name}
                </option>
              );
            })}
          </select>
        </div>
      ) : (
        <div className="container my-3">
          <h5>Unable to fetch data from the server :( please try afterwards</h5>
        </div>
      )}
      {country && !fetchStateError && (
        <div className="container">
          <select
            className={`form-select text-${textColor} bg-${backgroundColor}`}
            aria-label="Default select example"
            onChange={(e) => setState(e.target.value)}
          >
            <option defaultValue="null">Select State</option>
            {stateData.map((value) => {
              return (
                <option
                  key={value.id}
                  value={value.name.toLowerCase()}
                  value2={value.name}
                >
                  {value.name}
                </option>
              );
            })}
          </select>
        </div>
      )}
      {country && state && (
        <div className="container">
          {country != null && state != null && (
            <div className="container my-3 d-flex justify-content-center">
              <button
                className={`btn btn-light text-${textColor} bg-${backgroundColor}`}
                onClick={() => getWeather()}
              >
                Find The Result
              </button>
            </div>
          )}
        </div>
      )}
      {isLoading ? (
        <PropagateLoader cssOverride={override} size={15} speedMultiplier={6} />
      ) : (
        weatherData && (
          <div className="container d-flex justify-content-center">
            {weatherData.error ? (
              weatherData.error.code === "invalid_location" ? (
                <div>
                  <p>{weatherData.error.description}</p>
                </div>
              ) : data.error.code === "invalid_client" ? (
                <div>
                  <p>Invalid client credentials </p>
                </div>
              ) : (
                <div>
                  <p>Unknown error occurred</p>
                </div>
              )
            ) : (
              <div
                className="card"
                style={{
                  width: "18rem",
                  backgroundColor: `#${weatherData?.response[0]?.periods[0]?.color}`,
                }}
              >
                <div className="card-body ">
                  <h5 className="card-title">Air Qulaity</h5>
                  <h6 className="card-subtitle mb-2 text-body-secondary">
                    State : {weatherData?.response[0].place.name.toUpperCase()}
                  </h6>
                  <h6 className="card-subtitle mb-2 text-body-secondary">
                    Country :
                    {weatherData?.response[0].place.country.toUpperCase()}
                  </h6>
                  <p className="card-text">
                    Date :
                    {new Date(
                      weatherData?.response[0].periods[0].dateTimeISO
                    ).toLocaleString("en-GB", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="card-text">
                    AQI : {weatherData?.response[0].periods[0].aqi} ppm
                  </p>
                  <p className="card-text">
                    Air Quality : {weatherData?.response[0].periods[0].category}
                  </p>
                </div>
              </div>
            )}
          </div>
        )
      )}
    </>
  );
}
