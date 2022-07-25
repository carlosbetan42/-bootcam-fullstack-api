const { app } = require('../index');
const supertest = require('supertest');
const api = supertest(app);

const initialNotes = [
	{
		content: 'Test 1',
		importante: true,
		date: new Date()
	},
	{
		content: 'Test 2',
		importante: true,
		date: new Date()
	},
	{
		content: 'Test 3',
		importante: true,
		date: new Date()
	}
];

const getAllContentFromNotes = async () => {
	const response = await api.get('/api/notes');
	return {
		contents: response.body.map(note => note.content),
		response
	};
};

module.exports = {
	initialNotes,
	api,
	getAllContentFromNotes
};