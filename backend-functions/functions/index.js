const functions = require('firebase-functions');

const app = require('express')();

const FBAuth = require('./util/fbAuth');

const {
  getAllScreams,
  postNewScream,
  getSingleScream,
  commentOnScream,
  likeScream,
  unlikeScream,
  deleteScream
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
app.delete('/scream/:screamId', FBAuth, deleteScream);
app.get('/scream/:screamId/like', FBAuth, likeScream);
app.get('/scream/:screamId/unlike', FBAuth, unlikeScream);
app.post('/scream/:screamId/comment', FBAuth, commentOnScream);

// Users Endpoints
app.post('/signup', signupUser);
app.post('/login', loginUser);
app.post('/user/upload', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);

exports.api = functions.https.onRequest(app);
