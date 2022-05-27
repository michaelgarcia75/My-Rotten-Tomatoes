const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MovieSchema = new Schema({
    adult: {
        type: Boolean,
    },
    backdrop_path: {
        type: String,
    },
    budget: {
        type: Number,
    },
    genres: {
        type: [String],
        default: [],
    },
    id: {
        type: Number,
        unique: true,
    },
    original_language: {
        type: String,
    },
    overview: {
        type: String,
        required: true
    },
    poster_path: {
        type: String,
    },
    release_date: {
        type: String,
        required: true
    },
    runtime: {
        type: Number,
    },
    title: {
        type: String,
        required: true
    },
    vote_average: {
        type: Number,
    },
    comments: {
        type: [Object],
        default: [],
    }
});


const MovieModel = mongoose.model('movie', MovieSchema);

module.exports = MovieModel;