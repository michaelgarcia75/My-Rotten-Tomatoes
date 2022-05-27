import { useSelector } from "react-redux";
import FlipMove from "react-flip-move";
import { useRouter } from "next/router";
import * as React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import axios from "axios";
import Results from "../components/Results";


function Dashboard({user, movies}) {
  const [favorites, setFavorites] = React.useState([]);
  const [loading, setLoading] = React.useState(true);


  React.useEffect( () => { 

    const fetchData = async () => {
      const user2 = await axios.get('http://localhost:3001/users/'+ user._id)
      const favMovies = movies.filter((m) => user2.data.favorite.includes(m._id));
      console.log("fava",favMovies)
      setFavorites(favMovies);
      console.log("favorites", favorites)
      setLoading(false);
    }
    fetchData().catch(console.error)
  }, [])
  

  return (
    <>
    {!loading && (
      <div>
      <Results results={favorites} />
    </div>
  )}
  </>
  );
}
export async function getServerSideProps(context) {

  const request = await fetch('http://localhost:3001/movies').then((res) => res.json());
  console.log("req", request)

  return {
    props: {
      movies: request
    },
  };
}

export default Dashboard;
