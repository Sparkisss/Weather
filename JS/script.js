// ce8e42ea0b715eafad13b9f7948c3363
const link = 
"http://api.weatherstack.com/current?access_key=ce8e42ea0b715eafad13b9f7948c3363";

const store = {
  city: 'London',
}

const fetchData = async () => {
  const result = await fetch(`${link}&query=${store.city}`);
  const data = await result.json();

  console.log(data);
}

fetchData();