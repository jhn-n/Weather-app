const locationNode = document.querySelector("#location");
const resolvedLocationNode = document.querySelector("#resolved-location");
const submitButton = document.querySelector("#location-submit");
const descriptionNode = document.querySelector("#description");
const temperatureNode = document.querySelector("#temperature");
const unitsButton = document.querySelector("#units");
const img = document.querySelector("img");
const currentNode = document.querySelector("#current-conditions");
const loadingNode = document.querySelector("#loading");

locationNode.value = "Southend-on-sea";
let Celsius = false;
let temperature = null;
let currentCondition = null;
let tic;

getWeather2();
submitButton.addEventListener("click", getWeather2);
unitsButton.addEventListener("click", changeUnits);

function success(response) {
  console.log(response);
  resolvedLocationNode.innerText = response.resolvedAddress;
  descriptionNode.innerText = response.description;
  temperatureNode.innerText = response.currentConditions.temp;
  temperature = Number(response.currentConditions.temp);
  Celsius = false;
  currentNode.innerText = response.currentConditions.conditions;
}

function failure(e) {
  console.log("get Weather catch:", e);
  descriptionNode.innerText = "Unknown location";
  temperatureNode.innerText = "";
  temperature = null;
  currentNode.innerText = "";
  getUnknownImage();
}

function getWeather() {
  tic = Date.now();
  loadingNode.innerText = "Loading";
  const weatherLocation = locationNode.value;
  const apiKey = "MNM5JMUKR77PAFUHBZDRKC7SR";
  fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${weatherLocation}?key=${apiKey}&contentType=json`,
    { mode: "cors" }
  )
    .then((response) => response.json())
    .then((response) => {
      success(response);
      getNewImage();
    })
    .catch(failure);
}

async function getWeather2() {
  tic = Date.now();
  loadingNode.innerText = "Loading";
  const weatherLocation = locationNode.value;
  const apiKey = "MNM5JMUKR77PAFUHBZDRKC7SR";

  try {
    const fetchData = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${weatherLocation}?key=${apiKey}&contentType=json`,
      { mode: "cors" }
    );
    const response = await fetchData.json();
    success(response);
    getNewImage2();
  } catch (error) {
    failure(error);
  }
}

function changeUnits() {
  if (Celsius) {
    unitsButton.innerHTML = "<sup>o</sup>F";
    Celsius = false;
    if (typeof temperature === "number") {
      temperature = Math.round(10 * ((temperature * 9) / 5 + 32)) / 10;
      temperatureNode.innerText = temperature;
    }
  } else {
    unitsButton.innerHTML = "<sup>o</sup>C";
    Celsius = true;
    if (typeof temperature === "number") {
      temperature = Math.round(10 * (((temperature - 32) * 5) / 9)) / 10;
      temperatureNode.innerText = temperature;
    }
  }
}

function getNewImage() {
  const imageText = currentNode.innerText;
  const apikey = "JjmPoTovDxJNJWe9u0Igm7viV85bUkFU&s";
  fetch(
    `https://api.giphy.com/v1/gifs/translate?api_key=${apikey}=${imageText}`,
    { mode: "cors" }
  )
    .then(function (response) {
      return response.json();
    })
    .then((response) => {
      if (response.data.length === 0) {
        getUnknownImage();
        throw "empty description";
      }
      img.src = response.data.images.original.url;
      loadingNode.innerText = `Done in ${Date.now() - tic}ms`;
    })
    .catch((e) => {
      console.log("catch fired:", e);
    });
}

async function getNewImage2() {
  const imageText = currentNode.innerText;
  const apikey = "JjmPoTovDxJNJWe9u0Igm7viV85bUkFU&s";
  try {
    const fetchData = await fetch(
      `https://api.giphy.com/v1/gifs/translate?api_key=${apikey}=${imageText}`,
      { mode: "cors" }
    );
    const jsonData = await fetchData.json();
    if (jsonData.data.length === 0) {
      getUnknownImage();
      throw "empty description";
    }
    img.src = jsonData.data.images.original.url;
    loadingNode.innerText = `Done in ${Date.now() - tic}ms`;
  } catch (error) {
    console.log(error);
  }
}

function getUnknownImage() {
  const imageText = "unknown";
  const apikey = "JjmPoTovDxJNJWe9u0Igm7viV85bUkFU&s";
  fetch(
    `https://api.giphy.com/v1/gifs/translate?api_key=${apikey}=${imageText}`,
    { mode: "cors" }
  )
    .then(function (response) {
      return response.json();
    })
    .then((response) => {
      img.src = response.data.images.original.url;
      loadingNode.innerText = `Done in ${Date.now()-tic}ms`;
    })
    .catch((e) => {
      console.log("catch fired from unknown image:", e);
    });
}
