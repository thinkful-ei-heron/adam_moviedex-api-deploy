require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const MOVIES = require('./movie-data.json');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
    
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
    }
    next()
})

app.get('/movie', function handleGetMovies(req, res) {
    const {genre, country, avg_vote} = req.query
    let response = MOVIES

    if (genre) {
        response = response.filter(movie => movie.genre.toLowerCase().includes(genre.toLowerCase()))
    }

    if (country) {
        response = response.filter(movie => movie.country.toLowerCase().includes(country.toLowerCase()))
    }
    
    if (avg_vote) {
        const numericAvgVote = parseFloat(avg_vote)
        response = response.filter(movie => movie.avg_vote >= numericAvgVote)
    }
    res.json(response)
})

app.listen(8000, () => {
    console.log('Server listening at http://localhost:8000')
})