import { differenceInHours } from "date-fns";

async function Weezy() {
  const cottonmouth = process.env.COTTONMOUTH;
  const fallbackData = {
    queryCost: 1,
    latitude: 31.769105,
    longitude: -94.18997,
    resolvedAddress: "75935, USA",
    address: "75935",
    timezone: "America/Chicago",
    tzoffset: -6,
    days: [
      {
        datetime: "2026-02-06",
        datetimeEpoch: 1770357600,
        tempmax: 76.9,
        tempmin: 39.2,
        temp: 57.8,
        feelslikemax: 76.9,
        feelslikemin: 37.2,
        feelslike: 57.2,
        dew: 38.4,
        humidity: 50.2,
        precip: 0,
        precipprob: 0,
        precipcover: 0,
        preciptype: null,
        snow: 0,
        snowdepth: 0,
        windgust: 13.9,
        windspeed: 5.8,
        winddir: 268.8,
        pressure: 1019.6,
        cloudcover: 1.6,
        visibility: 10,
        solarradiation: 194.2,
        solarenergy: 16.8,
        uvindex: 7,
        severerisk: 10,
        sunrise: "07:06:23",
        sunriseEpoch: 1770383183,
        sunset: "17:55:50",
        sunsetEpoch: 1770422150,
        moonphase: 0.65,
        conditions: "Clear",
        description: "Clear conditions throughout the day.",
        icon: "clear-day",
        stations: ["KF17", "KLFK", "KRFI", "KOCH", "DRKT2"],
        source: "comb",
      },
    ],
    stations: {
      KRFI: {
        distance: 74773,
        latitude: 32.14,
        longitude: -94.85,
        useCount: 0,
        id: "KRFI",
        name: "KRFI",
        quality: 99,
        contribution: 0,
      },
      KF17: {
        distance: 7348,
        latitude: 31.83,
        longitude: -94.16,
        useCount: 0,
        id: "KF17",
        name: "CENTER MUNIC AIRP, TX US TG",
        quality: 99,
        contribution: 0,
      },
      KOCH: {
        distance: 54448,
        latitude: 31.58,
        longitude: -94.72,
        useCount: 0,
        id: "KOCH",
        name: "NACOGDOCHES, TX",
        quality: 99,
        contribution: 0,
      },
      KLFK: {
        distance: 80169,
        latitude: 31.23,
        longitude: -94.75,
        useCount: 0,
        id: "KLFK",
        name: "KLFK",
        quality: 100,
        contribution: 0,
      },
      DRKT2: {
        distance: 18338,
        latitude: 31.803,
        longitude: -94,
        useCount: 0,
        id: "DRKT2",
        name: "SABINE NORTH 2 TX US",
        quality: 0,
        contribution: 0,
      },
    },
  };

  const getInitialLocation = async () => {
    try {
      const resp = await fetch("https://ipapi.co/json/");
      if (!resp.ok) throw new Error();
      const ipdata = await resp.json();
      return `${ipdata.latitude},${ipdata.longitude}`;
    } catch (error) {
      return "38.637624,-90.317958";
    }
  };

  const fetchData = async (location) => {
    const timeFetched = Date.now();
    try {
      const resp = await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/today/next3days?unitGroup=us&include=days&key=${cottonmouth}&contentType=json`,
      );
      if (!resp.ok) throw new Error(`${resp.status}`);
      const fetchedData = await resp.json();
      return { timeFetched, ...fetchedData };
    } catch (error) {
      console.error("Fetch Error: ", error);
      return { timeFetched, ...fallbackData };
    }
  };

  //#region Initialize Weather Data
  //          Check if there's stored data and fetch new data if none or older than an hour
  let rawData = localStorage.getItem("weatherData");
  let data = rawData ? JSON.parse(rawData) : null;
  if (!data) {
    const loc = await getInitialLocation();
    data = await fetchData(loc);
    localStorage.setItem("weatherData", JSON.stringify(data));
  } else if (differenceInHours(Date.now(), data.timeFetched) >= 1) {
    data = await fetchData(data.resolvedAddress);
    localStorage.setItem("weatherData", JSON.stringify(data));
  }
  //#endregion

  async function getWeather(location) {
    if (data.resolvedAddress === location) return data;
    data = await fetchData(location);
    localStorage.setItem("weatherData", JSON.stringify(data));
    return data;
  }

  return { getWeather };
}

export { Weezy };

// Visual Crossing API Query URL Structure
//  Gets 4 days of weather starting with today in US measurements
//
// https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/LOCATION_HERE/today/next3days?unitGroup=us&include=days&key=API_KEY_HERE&contentType=json
