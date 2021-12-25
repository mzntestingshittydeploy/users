const setTimezone = require('set-tz');
setTimezone('Europe/Ljubljana');

const express = require('express');
const passport = require('passport');
//const schedule = require('node-schedule');
//const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const routes = require('./routes/routes.js');
const db = require('./db.js');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({origin: true, credentials:true}));
//app.use(cookieParser());
app.use('/api', routes);
app.use((error, req, res, next) => {
    console.log(error);
    return res.status(500).json(error);
});

app.use(passport.initialize());
app.use(passport.session());

const port = process.env.PORT || 80;
app.listen(port, function () {
    console.log(`Microservices ${process.env.SERVICE_NAME} service is listening on ${port}!`);
});
