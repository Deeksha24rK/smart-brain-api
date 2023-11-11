const express = require('express');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',//for postgres
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        host: process.env.DATABASE_HOST,
        port: 5432,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PW,
        database: process.env.DATABASE_DB
    }
});

const app = express();

app.use(express.json()); // for parsing application/json - middleware
app.use(cors())

// const database = {
//     users: [
//         {
//             id: "3",
//             name: "John",
//             email: "john@gmail.com",
//             password: "cookies",
//             entries: 0,
//             joined: new Date()
//         },
//         {
//             id: "124",
//             name: "Sally",
//             email: "sally@gmail.com",
//             password: "bananas",
//             entries: 0,
//             joined: new Date()
//         }
//     ]
// }

app.get('/', (req, res) => {
    db.select('*').from('users').then(data => res.json(data))
})

app.post('/signin', (req, res) => signin.handleSignin(req, res, bcrypt, db));

app.post("/register", (req, res) => register.handleRegister(req, res, bcrypt, db));

app.get("/profile/:id", (req, res) => profile.handleProfile(req, res, db));

app.put("/image", (req, res) => image.handleImage(req, res, db));

app.post('/imageurl', (req, res) => image.handleApiCall(req, res));

// $ PORT=3000 node server.js - bash command //

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`App - Server is running on port ${PORT}`);
})