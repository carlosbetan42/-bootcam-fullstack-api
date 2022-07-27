require('dotenv').config();
require('./mongo.js');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const notFound = require('./middleware/notFound');
const handleErrors = require('./middleware/handleErrors');
const loginRouter = require('./controllers/login');
const notesRouter = require('./controllers/notes');
const usersRouter = require('./controllers/users');

app.use(cors());
app.use(express.json());
app.use('/static', express.static('public'));

app.get('/', (request, response) => {
	console.log(request.ip);
	console.log(request.ips);
	console.log(request.originalUrl);
	response.send('<h1>Test</h1>');
});

// eslint-disable-next-line no-unused-vars
app.get('/jelowing', (request, response, next) => {
	console.log('RUTA 1');
	response.send('<h1>Hola jellowing</h1>');
});

app.get('/jelowing', (request, response, next) => {
	console.log('RUTA 2');
	next();
});

app.get('/:name', (request, response, next) => {
	console.log('RUTA 3');
	next();
});

app.use('/api/login', loginRouter);
app.use('/api/notes', notesRouter);
app.use('/api/users', usersRouter);

app.use(notFound);
app.use(handleErrors);

const PORT = process.env.PORT || 3002;
const server = app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

process.on('uncaughtException', () => {
	mongoose.connection.close();
});

module.exports = { app, server };