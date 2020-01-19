const functions = require('firebase-functions');

const app = require('express')();

const FBAuth = require('./util/fbAuth');

const { getAllScreams, postNewScream } = require('./handlers/screams');
const { signupUser, loginUser, uploadImage } = require('./handlers/users');

// Screams route
app.get('/screams', getAllScreams);
app.post('/scream', FBAuth, postNewScream);

// Users Endpoints
app.post('/signup', signupUser);
app.post('/login', loginUser);
app.post('/user/upload', FBAuth, uploadImage);

exports.api = functions.https.onRequest(app);
