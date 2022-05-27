import * as React from 'react';
import { useState } from 'react';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import axios from 'axios';
import qs from 'qs';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function ImportMovies() {
    const [query, setQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [open1, setOpen1] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);
    const [open3, setOpen3] = React.useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const options = {
            method: 'GET',
            url: `https://api.themoviedb.org/3/search/movie?api_key=c2646b799f81f358824b75c2c0553a6b&include_adult=false&query=${query}`,
        };
        try {
            const { data } = await axios(options);
            console.log(data.results);
            setMovies(data.results);

        } catch (e) {
            console.error(e)
        }
    }

    const addMovie = async (id) => {

        setOpen1(true);
        setErrorMessage("");
        setSuccessMessage("");
        setOpen2(false);
        setOpen3(false);
        const options = {
            method: 'GET',
            url: `https://api.themoviedb.org/3/movie/${id}?api_key=c2646b799f81f358824b75c2c0553a6b`,
        };

        try {
            const res = await axios(options);
            const movie = res.data;
            console.log(movie);
            console.log(movie.genres);
            const genres = movie.genres.map((g) => {
                const { name } = g;
                return name
            })
            console.log("test", genres)
            movie.genres = genres;
            console.log("test2", movie)
            const options2 = {
                method: 'POST',
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
                data: qs.stringify(movie),
                url: 'http://localhost:3001/movies'
            }
            console.log("options2", options2);

            const res2 = await axios(options2);
            console.log(res2);
            setOpen1(false);
            setSuccessMessage(`${movie.title} has been successfully imported`);
            setOpen2(true);

        } catch (e) {
            setOpen1(false);
            if (e.response.status == 500) {
                setErrorMessage(e.response.data.message)
                setOpen3(true);
            }
        }
    }

    const handleClose1 = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen1(false);
    }
    const handleClose2 = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen2(false);
    }
    const handleClose3 = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen3(false);
    }

    return (
        <>
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        marginTop: 2,
                        display: 'flex',
                        flexDirection: 'row',
                    }}
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Movie title"
                        name="query"
                        autoFocus
                        variant="outlined"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ ml: 2, mt: 3, mb: 5 }}
                    >
                        Search
                    </Button>
                </Box>
            </Container>
            <Snackbar open={open1} autoHideDuration={6000} onClose={handleClose1}>
                <Alert onClose={handleClose1} sx={{ mb: 2 }} severity="info" > Loading ...</Alert>
            </Snackbar>
            <Snackbar open={open2} autoHideDuration={6000} onClose={handleClose2}>
                <Alert onClose={handleClose2} sx={{ mb: 2 }} severity="success" >{successMessage}</Alert>
            </Snackbar>
            <Snackbar open={open3} autoHideDuration={6000} onClose={handleClose3}>
                <Alert onClose={handleClose3} sx={{ mb: 2 }} severity="error">{errorMessage}</Alert>
            </Snackbar>
            {movies && (
                movies.map(m => {
                    return (
                        <Container sx={{ mb: 2 }} component="main" maxWidth="lg">
                            <Box sx={{ display: 'flex', flexDirection: 'row', border: 1, borderRadius: 1, pl: 5 }}>
                                <Box key={m.id} sx={{ width: 800 }}>

                                    <h2>
                                        {m.title}
                                    </h2>
                                    <span>{m.release_date}</span>
                                    <p>
                                        {m.overview}
                                    </p>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }} justifyContent="center">
                                    <Button
                                        type="button"
                                        variant="contained"
                                        sx={{ ml: 20, mt: 3 }}
                                        onClick={() => addMovie(m.id)}
                                    >
                                        Import
                                    </Button>
                                </Box>
                            </Box>
                        </Container>
                    )
                }))
            }
        </>
    )
}