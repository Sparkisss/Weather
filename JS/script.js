// ce8e42ea0b715eafad13b9f7948c3363
const link = 
"http://api.weatherstack.com/current?access_key=3443974e06c78c165ea053a9908e3089";

const root = document.getElementById('root');
const popup = document.getElementById('popup');
const textInput = document.getElementById('text-input');
const form = document.getElementById('form');

let store = {
  city: 'Brest',
  temperature: 0,
  observationTime: "00:00 AM",
  visibility: 0,
  isDay: 'Yes',
  description: '',
  windSpeed: 0,
  properties: {
    cloudcover: {},
    humidity: {},
    windSpeed: {},
    visibility: {},
    pressure: {},
    uvIndex: {},
},
};
const fetchData = async () => {
  try {
  const query = localStorage.getItem('query') || store.city;
  const result = await fetch(`${link}&query=${query}`);
  const data = await result.json();

  const {
    current: { 
      cloudcover,
      temperature,
      humidity,
      observation_time:observationTime,
      pressure, uv_index: uvIndex,
      visibility,
      is_day: isDay,
      weather_descriptions: description,
      wind_speed:windSpeed,
    },
    location: {
      name
    }
  } = data;
  console.log(data);
  store = {
    ...store,
    isDay,
    city: name,
    temperature,
    observationTime,
    description: description[0],
    properties: {
    cloudcover: {
      title: 'Cloud cover',
      value: `${cloudcover}%`,
      icon: 'cloud.png',
    },
    humidity: {
      title: 'Humidity',
      value: `${humidity}%`,
      icon: 'humidity.png',
    },
    windSpeed: {
      title: 'Wind speed',
      value: `${windSpeed}km/h`,
      icon: 'wind.png',
    },
    visibility: {
      title: 'Visibility',
      value: `${visibility}%`,
      icon: 'visibility.png',
    },
    pressure: {
      title: 'Pressure',
      value: `${pressure}%`,
      icon: 'gauge.png',
    },
    uvIndex: {
      title: 'Uv index',
      value: `${uvIndex}%`,
      icon: 'uv-index.png',
    },
  },
};
  renderComponent();
  }catch(err) {
    console.log(err);
  }
};


const getImage = (description) => {
  switch (description) {
    case "Overcast":
      return 'partly.png';
    case 'Cloudy':
      return 'cloud.png';
    case "Fog":
      return 'fog.png';
    case 'Sunny':
      return 'sunny.png';
    case "Clear":
      return 'clear.png';
      default:
        return "the.png";
  }
};

const renderProperty = (properties) => {
  return Object.values(properties).map(({title, value, icon}) => {
      return ` <div class="property">
            <div class="property-icon">
              <img src="./img/icons/${icon}" alt="/">
              </div>
              <div class="property-info">
                <div class="property-info__value">${value}</div>
                <div class="property-info__description">${title}</div>
              </div>
            </div>`
  }).join("");
};
const markup = () => {
  const { city, description, observationTime, temperature, isDay, properties } = store;
  const containerClass = isDay === 'yes' ? 'is-day' : '';

  return `<div class="container ${containerClass}">
            <div class="top">
              <div class="city">
                <div class="city-subtitle">Weather Today in</div>
                <div class="city-title" id="city">
                <span>${city}</span>
                </div>
              </div>
              <div class="city-info">
                <div class="top-left">
                <img class="icon" src="./img/${getImage(description)}" alt="" />
                <div class="description">${description}</div>
                </div>
                
                <div class="top-rifht">
                <div class="city-info__subtitle">as of ${observationTime}</div>
                <div class="city-info__title">${temperature}°</div>
                </div>
              </div>
            </div>
            <div id="properties">${renderProperty(properties)}</div>
          </div>`;
};

const renderComponent = () => {
  root.innerHTML = markup();
  const city = document.getElementById('city');
  city.addEventListener('click', togglePopupClass);
};
const togglePopupClass = () => {
  popup.classList.toggle('active');
};

const handleInput = (e) => {
  store = {
    ...store,
    city: e.target.value,
  };
};

const handleSubmit = (e) => {
  e.preventDefault();

  const value = store.city;

  if (!value) return null;

  localStorage.setItem('query', value);
  fetchData();
  togglePopupClass();
}

form.addEventListener('submit', handleSubmit);
textInput.addEventListener('input', handleInput);

fetchData();