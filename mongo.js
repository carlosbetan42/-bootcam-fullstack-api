const mongoose = require('mongoose');
// const connectionString = process.env.MONGO_DB_URI;

const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = process.env;
const connectionString = NODE_ENV === 'test' ? MONGO_DB_URI_TEST : MONGO_DB_URI;

// conexión a mongodb
mongoose.connect(connectionString)
	.then(() => {
		console.log('Database connected');
	}).catch(err => {
		console.log(err);
	});

// Note.find().then(result => {
// 	console.log(result);
// 	mongoose.connection.close();
// });

// const note = new Note({
// 	content: 'MongoDB es increible, midu',
// 	date: new Date(),
// 	important: true
// });

// note.save()
// 	.then((result) => {
// 		console.log(result);
// 		mongoose.connection.close();
// 	}).catch(err => {
// 		console.log(err);
// 	});
