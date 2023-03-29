import axios from 'axios';

const baseUrl = 'https://restcountries.com/v3.1/name/';

export const getCountry = (name) => {
    const request = axios.get(`${baseUrl}${name}`);
    return request.then((response) => response.data.find(() => true));
}
