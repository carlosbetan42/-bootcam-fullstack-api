require('dotenv').config();
require('./mongo.js');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// const api = require('@serverless/cloud');
// const Sentry = require('@sentry/node');
// const Tracing = require('@sentry/tracing');

// const logger = require('./loggerMiddleware');
const app = express();
const Note = require('./models/Note');
const notFound = require('./middleware/notFound.js');
const handleErrors = require('./middleware/handleErrors.js');

app.use(cors());
app.use(express.json());
// app.use(logger);
app.use('/static', express.static('public'));

// Sentry.init({
// 	dsn: 'https://f41575bb027545c9ba470f71ceff5487@o1331410.ingest.sentry.io/6595592',
// 	// or pull from params
// 	// dsn: params.SENTRY_DSN,
// 	// environment: params.INSTANCE_NAME,
// 	integrations: [
// 		// enable HTTP calls tracing
// 		new Sentry.Integrations.Http({ tracing: true }),
// 		// enable Express.js middleware tracing
// 		new Tracing.Integrations.Express({ app }),
// 	],

// 	// Set tracesSampleRate to 1.0 to capture 100%
// 	// of transactions for performance monitoring.
// 	// We recommend adjusting this value in production
// 	tracesSampleRate: 1.0,
// 	// or pull from params
// 	// tracesSampleRate: parseFloat(params.SENTRY_TRACES_SAMPLE_RATE),
// });


app.get('/', (request, response) => {
	response.send('<h1>Test</h1>');
});

// eslint-disable-next-line no-unused-vars
app.get('/jelowing', (request, response, next) => {
	console.log('RUTA 1');
	response.send('<h1>Hola jellowing</h1>');
	// next();
});

app.get('/jelowing', (request, response, next) => {
	console.log('RUTA 2');
	next();
});

app.get('/:name', (request, response, next) => {
	console.log('RUTA 3');
	next();
});

app.get('/api/notes', (request, response) => {
	Note.find().then(notes => {
		response.json(notes);
	});
});

app.get('/api/notes/:id', (request, response, next) => {
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

app.post('/api/notes', (request, response, next) => {
	const noteData = request.body;

	if (!noteData || !noteData.content) {
		return response.status(400).json({
			error: 'required "content" fields is missing'
		});
	}

	const note = new Note({
		content: noteData.content,
		important: typeof noteData.important !== 'undefined' ? noteData.important : false,
		date: new Date()
	});

	note.save().then(savedNote => {
		response.json(savedNote);
	}).catch(err => {
		next(err);
	});
});

app.put('/api/notes/:id', (request, response, next) => {
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

app.delete('/api/notes/:id', (request, response, next) => {
	const id = request.params.id;
	Note.findByIdAndDelete(id).then(() => {
		response.status(204).end();
	}).catch(err => {
		next(err);
	});
});

app.use(handleErrors);

// api.use(Sentry.Handlers.errorHandler());
app.use(notFound);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

process.on('uncaughtException', () => {
	mongoose.connection.disconnect();
});