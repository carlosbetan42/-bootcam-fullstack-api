const mongoose = require('mongoose');
const { server } = require('../index');
const Note = require('../models/Note');
const { initialNotes, api, getAllContentFromNotes } = require('./helpers');

beforeEach(async () => {
	await process.nextTick(() => { });
	await Note.deleteMany({});

	//parallel
	// const notesObjects = initialNotes.map(note => new Note(note));
	// const promises = notesObjects.map(note => note.save());
	// await Promise.all(promises);

	// sequential
	for (let note of initialNotes) {
		const noteObject = new Note(note);
		await noteObject.save();
	}
});

beforeAll(async () => {
	await mongoose.connect(process.env.MONGO_DB_URI_TEST);
});

describe('notes', () => {

	test('notes are returned as json', async () => {
		await api
			.get('/api/notes')
			.expect(200)
			.expect('Content-Type', /application\/json/);
	});

	test(`there are ${initialNotes.length} notes`, async () => {
		const { response } = await getAllContentFromNotes();

		expect(response.body).toHaveLength(initialNotes.length);
	});

	test(`there are ${initialNotes.length} notes`, async () => {
		const { response } = await getAllContentFromNotes();

		expect(response.body).toHaveLength(initialNotes.length);
	});

	test('the first note is about test1', async () => {
		const { contents } = await getAllContentFromNotes();
		expect(contents).toContain('Test 1');
	});

	test('a valid note can be added', async () => {
		const newNote = {
			content: 'Proximamente async/await',
			important: true
		};

		await api
			.post('/api/notes')
			.send(newNote)
			.expect(200)
			.expect('Content-Type', /application\/json/);

		const { response, contents } = await getAllContentFromNotes();

		expect(contents).toContain(newNote.content);
		expect(response.body).toHaveLength(initialNotes.length + 1);
	});

	test('note without content is not added', async () => {
		const newNote = {
			important: true
		};

		await api
			.post('/api/notes')
			.send(newNote)
			.expect(400);

		const { response, contents } = await getAllContentFromNotes();

		expect(contents).not.toContain(newNote.content);
		expect(response.body).toHaveLength(initialNotes.length);
	});

	test('a note can be deleted', async () => {
		const { response: firstReponse } = await getAllContentFromNotes();
		const { body: notes } = firstReponse;
		const noteToDelete = notes[0];

		await api
			.delete(`/api/notes/${noteToDelete.id}`)
			.expect(204);

		const { contents, response: secondResponse } = await getAllContentFromNotes();

		expect(secondResponse.body).toHaveLength(initialNotes.length - 1);
		expect(contents).not.toContain(noteToDelete.content);
	});

	// test('a note can not be deleted ', async () => {
	// 	await api
	// 		.delete('/api/notes/1234')
	// 		.expect(400);

	// 	const { response } = await getAllContentFromNotes();

	// 	expect(response.body).toHaveLength(initialNotes.length);
	// });
});

afterAll(() => {
	mongoose.connection.close();
});

afterAll(() => {
	server.close();
});