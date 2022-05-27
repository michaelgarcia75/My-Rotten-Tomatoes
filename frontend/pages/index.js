import Results from "../components/Results";
import * as React from "react";
import { useState } from "react";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import axios from "axios";
import Miniatures from "../components/Miniatures";

export default function Home({ results }) {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState(results);

  const searchMovies = async (e) => {
    e.preventDefault();

    if (!query) {
      setMovies(results)
    } else {
      const filteredMovies = results.filter((r) => r.title.toLowerCase().includes(query.toLowerCase()))
      setMovies(filteredMovies)
    }



    // const url = `https://api.themoviedb.org/3/search/movie?api_key=c2646b799f81f358824b75c2c0553a6b&language=en-US&query=${query}&page=1&include_adult=true`;
    // try {
    //   const res = await fetch(url);
    //   const data = await res.json();
    //   setMovies(data.results);
    // } catch (err) {
    //   console.error(err);
    // }
  };

  console.log(results);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const options = {
      method: "GET",
      url: "http://localhost:3001/movies",
    };
    try {
      const { data } = await axios(options);
      console.log(data.results);
      setMovies(data.results);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 2,
            display: "flex",
            flexDirection: "row",
          }}
        >
          <TextField
            sx={{ m: 1, minWidth: 200, color: "white", ml: 2, mt: 3 }}
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
            secureTextEntry={true}
          />

        </Box>
        <center>
          <Button
            variant="contained"
            type="button"
            sx={{ ml: 2, mt: 3, mb: 5 }}
            onClick={searchMovies}
          >
            Search
          </Button>
        </center>

      </Container>
      {/* <div>
        {movies.map((result) => (
          <Miniatures result={result} key={result.id} />
        ))}
      </div> */}

      <Results results={movies} />
    </div>
  );
}

export async function getServerSideProps(context) {
  const request = await fetch("http://localhost:3001/movies")
    .then((res) =>
      res.json()
    );
  console.log("req", request);

  return {
    props: {
      results: request,
    },
  };
}
