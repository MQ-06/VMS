import axios from 'axios';

const baseURL = 'https://countriesnow.space/api/v0.1/countries';

export const getCountries = async () => {
  const res = await axios.get(`${baseURL}/positions`);
  return res.data.data.map(c => c.name);
};

export const getStatesByCountry = async (country) => {
  const res = await axios.post(`${baseURL}/states`, { country });
  return res.data.data.states.map(s => s.name);
};

export const getCitiesByCountry = async (country) => {
  const res = await axios.post(`${baseURL}/cities`, { country });
  return res.data.data;
};
