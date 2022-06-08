// API code here.

const express = require('express');
const app = express();
const cors = require('cors');
const PgPromise = require('pg-promise');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const initOptions = {/* initialization options */};
const pgp = PgPromise(initOptions);

const DATABASE_URL= process.env.DATABASE_URL || "postgres://fruit_eater:eat123@localhost:5432/fruit_eater_app";

const config = { 
	connectionString : DATABASE_URL
}

if (process.env.NODE_ENV == 'production') {
	config.ssl = { 
		rejectUnauthorized : false
	}
}

const db = pgp(config);

const FruitEaterService = require('./fruit-eater-service');
const fruitEaterService = FruitEaterService(db);

// enable the req.body object - to allow us to use HTML forms
// and when using POST requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const fruits = {
	apple: 5,
	pear : 7,
	banana : 23
};

app.use(function(req, res, next){

	const token = req.headers['token']
	if (token) {
		console.log(token);
	}	

	next();
})

app.post('/api/fruits/:fruit', function(req, res){
	const {fruit} = req.params;
	if (!fruits[fruit]){
		fruits[fruit] = 0
	}
	fruits[fruit]++
	res.json({})
});



function getUser(req, res, next){

	const token = req.headers['authorization'];
	if (token) {
		const jwtKey = token.split(' ')[1];
		const data = jwt.verify(jwtKey, JWT_SECRET_KEY);
		req.username = data.username;
		next();
	} else {
		res.sendStatus(403);
	}

}


app.get('/api/fruits', getUser, async function(req, res){

	let counters = await fruitEaterService.getUserCounters(req.username);
	if (counters.length == 0) {
		await fruitEaterService.createCountersForUser(req.username);
		counters = await fruitEaterService.getUserCounters(req.username);
	}
	res.json({fruits : counters})
	
});

app.post('/api/eat', getUser, async function(req, res){
	const {fruit} = req.body;
	await fruitEaterService.eatFruit(req.username, fruit)
	res.json({status: 'success'});
});


app.post('/api/user', async function (req, res){

	const {username, password} = req.body;
	await fruitEaterService.createUser(username, password);
	res.json({status : 'success'});

});

app.post('/api/login', async function (req, res){

	const {username, password} = req.body;
	const user = await fruitEaterService.findUser(username);

	if (user) {
		token = jwt.sign({ username: username }, JWT_SECRET_KEY);
		res.json({
			status : 'success',
			data: {token}
		});
	} else {
		res.sendStatus(403)
	}

});


const PORT = process.env.PORT || 3011;

app.listen(PORT, () => console.log(`App started on ${PORT}`))