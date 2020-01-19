const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')();

admin.initializeApp();

const firebaseConfig = {
  apiKey: 'AIzaSyCoo_2spcVLDbuQTmLqy-wElOj0UmzclPw',
  authDomain: 'socialape-428af.firebaseapp.com',
  databaseURL: 'https://socialape-428af.firebaseio.com',
  projectId: 'socialape-428af',
  storageBucket: 'socialape-428af.appspot.com',
  messagingSenderId: '66730172129',
  appId: '1:66730172129:web:288a3e6d96b62214b3e1a0',
  measurementId: 'G-ERFRV85DTM'
};

const firebase = require('firebase');
firebase.initializeApp(firebaseConfig);

const db = admin.firestore();

app.get('/screams', (req, res) => {
  db.collection('screams')
    .orderBy('createdAt', 'desc')
    .get()
    .then(data => {
      let = screams = [];
      data.forEach(doc => {
        screams.push({
          screamId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt
        });
      });

      return res.json(screams);
    })
    .catch(err => console.error(err));
});

app.post('/scream', (req, res) => {
  const { body, userHandle } = req.body;
  const newScream = {
    body,
    userHandle,
    createdAt: new Date().toISOString()
  };

  db.collection('screams')
    .add(newScream)
    .then(doc => {
      console.log(doc);
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch(err => {
      res.status(500).json({ error: 'Something went wrong' });
      console.error(err);
    });
});

const isEmpty = string => {
  if (string.trim() === '') return true;
  return false;
};

const isEmail = email => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) return true;
  return false;
};

// Signup endpoint
app.post('/signup', (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle
  };

  let errors = {};

  if (isEmpty(newUser.email)) {
    errors.email = 'Email field can not be empty';
  } else if (!isEmail(newUser.email)) {
    errors.email = 'Please provide a valid email';
  }

  if (isEmpty(newUser.password)) errors.password = 'Password can not be empty';

  if (isEmpty(newUser.handle)) errors.handle = 'Handle field can not be empty';

  if (newUser.password != newUser.confirmPassword)
    errors.confirmPassword = 'Password and confirm password must match!';

  if (Object.keys(errors).length > 0) res.status(400).json(errors);

  let token, userId;
  db.doc(`/users/${newUser.handle}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        return res.status(400).json({ handle: 'handle already exist' });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then(data => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then(tokenId => {
      token = tokenId;
      const userCred = {
        handle: newUser.handle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId
      };

      return db.doc(`/users/${newUser.handle}`).set(userCred);
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch(err => {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        return res.status(400).json({ email: 'Email already in use!' });
      }
      return res.status(500).json({ error: err.code });
    });
});

// Login
app.post('/login', (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  };

  let errors = {};

  if (isEmpty(user.email)) errors.email = 'Please enter your email address.';
  if (isEmpty(user.password)) errors.password = 'Please enter your password.';

  if (Object.keys(errors).length > 0) res.status(400).json(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then(data => data.user.getIdToken())
    .then(token => {
      res.json({ token });
    })
    .catch(err => {
      console.error(err);
      if (err.code === 'auth/wrong-password')
        res
          .status(403)
          .json({ general: 'Wrong credentials, please try again.' });
      return res.status(500).json({ error: err });
    });
});

exports.api = functions.https.onRequest(app);
