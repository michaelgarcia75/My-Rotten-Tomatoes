const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const UserModel = require('../model/model');
const MovieModel = require('../model/modelMovies');
const qs = require('qs');
const { constants } = require('buffer');

const router = express.Router();

router.post(
    '/signup',
    passport.authenticate('signup', { session: false }),
    async (req, res, next) => {
        res.json({
            message: 'Signup successful',
            user: req.user
        });
    }
);

router.post(
    '/login',
    async (req, res, next) => {
        passport.authenticate(
            'login',
            async (err, user, info) => {
                try {
                    if (err || !user) {
                        const error = new Error('An error occurred.');

                        return next(error);
                    }

                    req.login(
                        user,
                        { session: false },
                        async (error) => {
                            if (error) return next(error);

                            const body = { _id: user._id, username: user.username, email: user.email, is_admin: user.is_admin, favorite: user.favorite };
                            const token = jwt.sign({ user: body }, 'TOP_SECRET');

                            return res.json({ token, body });
                        }
                    );
                } catch (error) {
                    return next(error);
                }
            }
        )(req, res, next);
    }
);

//CRUD

router.get('/users', function (req, res) {
    UserModel.find(function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            res.send(data);
        }
    });
});

router.get('/users/:id', function (req, res) {
    const id = req.params.id
    UserModel.findById(id,
        function (err, data) {
            if (err) {
                console.log(err);
            }
            else {
                res.send(data);
            }
        });
});

router.put('/users/:id', function (req, res) {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }
    const id = req.params.id;
    UserModel.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update User with id=${id}. Maybe User was not found!`
                });
            } else res.send({ message: "User was updated successfully." });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({
                message: "Error updating User with id=" + id
            });
        });
});

router.delete('/users/:id', function (req, res) {
    const id = req.params.id;
    UserModel.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete User with id=${id}. Maybe User was not found!`
                });
            } else {
                res.send({
                    message: "User was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete User with id=" + id
            });
        });
});

router.post('/users/:id/favorite', function (req, res) {
    const data = req.body
    const newFavorite = {
        // userId: data.userId,
        favorite: data.favorite,
    }
    const id = req.params.id;
    console.log(newFavorite);

    UserModel.findByIdAndUpdate(
        id,
        { $push: { "favorite": data.favorite } },
        { safe: true, upsert: false },
        function (err, data) {
            if (err) {
                console.log(err);
                return res.status(500).send({ message: "Error adding movie to favorite with id=" + id });
            }
            return res.send({ message: "movie was added to favorite successfully." });
        });
});


//CRUDMOVIES
router.get('/movies', function (req, res) {
    MovieModel.find(function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            res.send(data);
        }
    });
});

router.get('/movies/:id', function (req, res) {
    const id = req.params.id
    MovieModel.findById(id,
        function (err, data) {
            if (err) {
                console.log(err);
            }
            else {
                res.send(data);
            }
        });
});

router.put('/movies/:id', function (req, res) {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }
    const id = req.params.id;
    MovieModel.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Movie with id=${id}. Maybe Movie was not found!`
                });
            } else res.send({ message: "Movie was updated successfully." });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({
                message: "Error updating Movie with id=" + id
            });
        });
});

router.delete('/movies/:id', function (req, res) {
    const id = req.params.id;
    MovieModel.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Movie with id=${id}. Maybe Movie was not found!`
                });
            } else {
                res.send({
                    message: "Movie was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Movie with id=" + id
            });
        });
});

router.post('/movies', function (req, res) {
    const newMovie = new MovieModel();
    const data = qs.parse(req.body);
    newMovie.adult = data.adult;
    newMovie.backdrop_path = data.backdrop_path;
    newMovie.budget = data.budget;
    newMovie.genres = data.genres;
    newMovie.id = data.id;
    newMovie.original_language = data.original_language;
    newMovie.overview = data.overview;
    newMovie.poster_path = data.poster_path;
    newMovie.release_date = data.release_date;
    newMovie.title = data.title;
    newMovie.runtime = data.runtime;
    newMovie.vote_average = data.vote_average;


    newMovie.save(function (err, data) {
        if (err) {
            console.log(err);
            res.status(500).send({
                message: "Error, movie probably already imported"
            });
        }
        else {
            res.send("Data inserted");
        }
    });
});


router.post('/movies/:id/comment', function (req, res) {
    const data = req.body
    const newComment = {
        userId: data.userId,
        username: data.username,
        comment: data.comment,
        date: data.date,
    }
    const id = req.params.id;
    console.log(newComment);

    MovieModel.findByIdAndUpdate(
        id,
        { $push: { "comments": newComment } },
        { safe: true, upsert: false },
        function (err, data) {
            if (err) {
                console.log(err);
                return res.status(500).send({ message: "Error adding comment to movie with id=" + id });
            }
            return res.send({ message: "Comment was added successfully." });
        });
});

module.exports = router;


