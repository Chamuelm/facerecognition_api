const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const config = require('config');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = process.env.NODE_ENV != "production" ? knex(config.get("dbConfig")) : knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: true
    }
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/signin', signin.handleSignin(db, bcrypt));
app.post('/register', register.handleRegister(db, bcrypt));
app.get('/profile/:id', profile.handleProfile(db));
app.post('/image', image.handleImage(db));
app.get('/', (req ,res) => res.send("Face Recognition API is running"));

const port = process.env.PORT || config.get('apiPort');
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
