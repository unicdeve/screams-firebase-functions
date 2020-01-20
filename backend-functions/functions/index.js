const functions = require('firebase-functions');

const app = require('express')();

const FBAuth = require('./util/fbAuth');

const {
  getAllScreams,
  postNewScream,
  getSingleScream,
  commentOnScream
} = require('./handlers/screams');

const {
  signupUser,
  loginUser,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser
} = require('./handlers/users');

// Screams route
app.get('/screams', getAllScreams);
app.post('/scream', FBAuth, postNewScream);
app.get('/scream/:screamId', getSingleScream);
// TODO: delete scream
// TODO: like a scream
// TODO: unlike a scream
app.post('/scream/:screamId/comment', FBAuth, commentOnScream);

// Users Endpoints
app.post('/signup', signupUser);
app.post('/login', loginUser);
app.post('/user/upload', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);

exports.api = functions.https.onRequest(app);
