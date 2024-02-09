require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const cors = require('cors');
const router = require('./router');

const app = express();

const corsConfig = {
  origin: 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsConfig));
app.use(express.json());

const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'sessions',
});

store.on('error', (error) => {
  console.log('MongoDB session store error:', error);
});

app.use(
  session({
    name: 'sid',
    saveUninitialized: false,
    resave: false,
    secret: process.env.SESSION_SECRET,
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60, // 1hr
      sameSite: true,
      httpOnly: false,
      secure: false, // set to secure=true in a production environment
    },
  }),
);

app.use(router);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
