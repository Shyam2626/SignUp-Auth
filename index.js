const express = require("express");
const mongoose = require('mongoose');
const path = require('path');
const details = require('./models/connection');
require('dotenv').config();
const app = express();
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster1.0sfxnq9.mongodb.net/UserDetails`, { useNewUrlParser: true, useUnifiedTopology: true });

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => res.render('login.ejs'));

app.post('/', async (req, res) => {
    const enteredUsername = req.body.username;
    const enteredPassword = req.body.password;

    try {
        const user = await details.findOne({ username: enteredUsername, password: enteredPassword });
        if (user) {
            res.send("your username password is found");
        } else {
            res.send('Invalid username or password.');
        }
    } catch (error) {
        res.send('Error validating login.');
    }
});

app.post('/newuser', async (req, res) => {
    let firstname = req.body.firstname, lastname = req.body.lastname, username = req.body.username, password = req.body.password;
    let enteredDetails = new details({
        firstname: firstname,
        lastname: lastname,
        username: username,
        password: password,
    });
    try {
        try {
            const user = await details.findOne({ username: username });
            if (!user) {
                await enteredDetails.save();
                res.render('login.ejs');
            } else {
                const errorMessage = "Username already exists. Please enter another username.";
                res.send(`<script>alert("${errorMessage}"); window.location.href = "/";</script>`);
            }
        } catch (err) { res.send('Error in Storing data') }
    } catch (error) {
        res.send('Error saving data.');
    }
});


app.post('/createaccount', (req, res) => res.render('new.ejs'));

app.get('/home', (req, res) => res.render('home.ejs'));

app.listen(3000, () => console.log('server started'));