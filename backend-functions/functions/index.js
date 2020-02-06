const functions = require('firebase-functions');
const app = require('express')();

const FBAuth = require('./util/fbAuth');
const { db } = require('./util/admin');

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
  getAuthenticatedUser,
  getUserDetails,
  markNotificationsRead
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
app.get('/user/:handle', getUserDetails);
app.post('/notifications', FBAuth, markNotificationsRead);

exports.api = functions.https.onRequest(app);

exports.createNotificationOnLike = functions.firestore
  .document('likes/{id}')
  .onCreate(snapshort => {
    db.doc(`/screams/${snapshort.data().screamId}`)
      .get()
      .then(doc => {
        if (doc.exists) {
          return db.doc(`/notifications/${snapshort.id}`).set({
            created: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshort.data().userHandle,
            type: 'like',
            read: false,
            screamId: doc.id
          });
        }
      })
      .then(() => {
        return;
      })
      .catch(err => {
        console.error(err);
        return;
      });
  });

exports.deleteNotificationOnUnlike = functions.firestore
  .document('likes/{id}')
  .onDelete(snapshort => {
    db.doc(`/notifications/${snapshort.id}`)
      .delete()
      .then(() => {
        return;
      })
      .catch(err => {
        console.error(err);
        return;
      });
  });

exports.createNotificationOnComment = functions.firestore
  .document('comments/{id}')
  .onCreate(snapshort => {
    db.doc(`/screams/${snapshort.data().screamId}`)
      .get()
      .then(doc => {
        if (doc.exists) {
          return db.doc(`/notifications/${snapshort.id}`).set({
            created: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshort.data().userHandle,
            type: 'comment',
            read: false,
            screamId: doc.id
          });
        }
      })
      .then(() => {
        return;
      })
      .catch(err => {
        console.error(err);
        return;
      });
  });
