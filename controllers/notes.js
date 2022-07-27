const notesRouter = require('express').Router();
const userExtractor = require('../middleware/userExtractor');
const Note = require('../models/Note');
const User = require('../models/User');
// const jwt = require('jsonwebtoken');

notesRouter.get('/', async (request, response) => {
	const notes = await Note.find({}).populate('user');
	response.json(notes);
});

notesRouter.get('/:id', (request, response, next) => {
	const id = request.params.id;
	Note.findById(id).then(note => {
		if (note) {
			response.json(note);
		} else {
			response.status(404).end();
		}
	}).catch((err) => {
		next(err);
	});
});

notesRouter.post('/', userExtractor, async (request, response, next) => {
	const { content, important = false } = request.body;
	const { userId } = request;
	const user = await User.findById(userId);

	if (!content) {
		return response.status(400).json({
			error: 'required "content" fields is missing'
		});
	}

	const newNote = new Note({
		content,
		date: new Date(),
		important,
		user: userId
	});

	try {
		const savedNote = await newNote.save();
		user.notes = user.notes.concat(savedNote._id);
		await user.save();
		response.json(savedNote);
	} catch (err) {
		next(err);
	}
});

notesRouter.put('/:id', userExtractor, (request, response, next) => {
	const { id } = request.params;
	const noteData = request.body;
	console.log(noteData);

	if (!noteData || !noteData.content) {
		return response.status(400).json({
			error: 'required "content" fields is missing'
		});
	}

	const newNoteInfo = {
		content: noteData.content,
		important: noteData.important
	};

	Note.findByIdAndUpdate(id, newNoteInfo, { new: true }).then(result => {
		response.json(result);
	}).catch(err => {
		next(err);
	});
});

// eslint-disable-next-line no-unused-vars
notesRouter.delete('/:id', userExtractor, async (request, response, next) => {
	const id = request.params.id;
	await Note.findByIdAndDelete(id);
	response.status(204).end();
});

module.exports = notesRouter;