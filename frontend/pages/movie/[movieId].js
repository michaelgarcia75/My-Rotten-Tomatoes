import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Comments from "../../components/Comments/Comments";
import React, { useState } from "react";
import NewComment from "../../components/Comments/NewComment";
import FavoriteIcon from "@mui/icons-material/Favorite";
import IconButton from "@mui/material/IconButton";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cart.slice";
import axios from 'axios';
import qs from 'qs';

function Movie({ result, user }) {

  const BASE_URL = "https://image.tmdb.org/t/p/original/";
  const dispatch = useDispatch();
  const [comments, setComments] = useState(result.comments);
  const [favorites, setFavorites] = useState([]);



  const sendComment = async (content) => {

    console.log("userid", user._id);

    const newComment = {
      userId: user._id,
      username: user.username,
      comment: content,
      date: new Date().toLocaleDateString("fr"),
    }
    console.log("new comment : ", newComment)

    const options = {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: qs.stringify(newComment),
      url: `http://localhost:3001/movies/${result._id}/comment`
    }
    try {

      const res = await axios(options);
      console.log(res);
      if (res.status === 200) {
        setComments([...comments, newComment]);
      }
    } catch (e) {
      console.log("error", e);
    }
  };

  const addFavorite = async () => {

    console.log("userid", user._id);
    console.log("movieid", result._id)

    const newFavorite = {
      // userId: user._id,
      favorite: result._id
    }
    console.log("new favorite : ", newFavorite)

    const options = {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: qs.stringify(newFavorite),
      url: `http://localhost:3001/users/${user._id}/favorite`
    }
    try {

      const res = await axios(options);
      console.log(res);
      if (res.status === 200) {
        setFavorites([...favorites, newFavorite]);
      }
    } catch (e) {
      console.log("error", e);
    }
  };



  return (
    <center>
      <div style={{ padding: 40 }}>
        <Card sx={{ maxWidth: 1200 }}>
          <CardMedia
            layout="fill"
            objectFit="cover"
            component="img"
            height="600"
            image={
              `${BASE_URL}${result.backdrop_path || result.poster_path}` ||
              `${BASE_URL}${result.poster_path}`
            }
            alt="affiche film"
          />
          <CardActions disableSpacing>
            <IconButton
              aria-label="add to favorites"
              onClick={() => addFavorite()}
            >
              <FavoriteIcon variant="body2" color="text.secondary" /> Ajouter
              aux favoris
            </IconButton>
          </CardActions>

          <h1>{result.title || result.original_name}</h1>

          <Typography paragraph>
            {result.release_date || result.first_air_date} •{" "}
            {Math.floor(result.runtime / 60)}h{result.runtime % 60}m •{" "}
            {result.genres.map((genre) => genre + " ")}
          </Typography>
          <Typography paragraph>Synopis:</Typography>
          <Typography paragraph>{result.overview}</Typography>

          <CardContent>
            <NewComment sendComment={sendComment} />
            <Comments comments={comments} />
          </CardContent>
          <CardActions disableSpacing></CardActions>
        </Card>
      </div>
    </center>
  );
}

export default Movie;

export async function getServerSideProps(context) {
  const { movieId } = context.query;

  // const request = await fetch(
  //   `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.API_KEY}&language=fr-FR&append_to_response=videos`
  // ).then((response) => response.json());

  const options = {
    method: 'GET',
    url: `http://localhost:3001/movies/${movieId}`,
  };
  const res = await axios(options);

  return {
    props: {
      result: res.data
    },
  };
}
