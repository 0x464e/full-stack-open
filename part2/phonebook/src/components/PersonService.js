import axios from "axios";
const baseUrl = 'http://localhost:3001/persons';

const add = (newPerson) => axios.post(baseUrl, newPerson).then(x => x.data);

const update = (id, newPerson) => axios.put(`${baseUrl}/${id}`, newPerson).then(x => x.data);

const remove = (id) => axios.delete(`${baseUrl}/${id}`);

export default { add, update, remove };