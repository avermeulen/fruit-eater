// API code here.

const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

const fruits = {
	apple: 5,
	pear : 7,
	banana : 23
};

app.post('/api/fruits/:fruit', function(req, res){
	const {fruit} = req.params;
	if (!fruits[fruit]){
		fruits[fruit] = 0
	}
	fruits[fruit]++
	res.json({})
});

app.get('/api/fruits', function(req, res){
	res.json({fruits})
})

const PORT = process.env.PORT || 3011;

// console.log(PORT);
app.listen(PORT, () => console.log(`App started on ${PORT}`))