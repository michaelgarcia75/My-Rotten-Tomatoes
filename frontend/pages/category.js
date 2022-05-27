import Results from "../components/Results";
import requests from "../utility/requests";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Home({ results }) {
  const [key, setGenre] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  console.log(results);

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleChange = (event) => {
    setGenre(event.target.value);
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <center>
      <div>
        <FormControl sx={{ m: 1, minWidth: 150, color: "white" }}>
          <InputLabel
            id="demo-controlled-open-select-label"
            sx={{ color: "black" }}
          >
            Category
          </InputLabel>
          <Select
            labelId="demo-controlled-open-select-label"
            id="demo-controlled-open-select"
            open={open}
            onClose={handleClose}
            onOpen={handleOpen}
            value={key}
            label="Genre"
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>

            {Object.entries(requests).map(([key, { title, url }]) => (
              <MenuItem
                key={key}
                onClick={() =>
                  router.push(`http://localhost:3000/category/?genre=${key}`)
                }
              >
                Genre
                {title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Results results={results} />
      </div>
    </center>
  );
}

export async function getServerSideProps(context) {
  const genre = context.query.genre;

  const request = await fetch(
    `https://api.themoviedb.org/3${
      requests[genre]?.url || requests.fetchTrending.url
    }`
  ).then((res) => res.json());

  return {
    props: {
      results: request.results,
    },
  };
}
