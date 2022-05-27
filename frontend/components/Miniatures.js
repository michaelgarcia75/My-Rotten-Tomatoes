import { forwardRef } from "react";
import { useRouter } from "next/router";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import StarRating from './StarRating';

const Miniatures = forwardRef(({ result }, ref) => {
  const BASE_URL = "https://image.tmdb.org/t/p/original/";
  const router = useRouter();
  const [expanded, setExpanded] = React.useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  }));

  return (
    <center>
      <div ref={ref} style={{ padding: 40 }}>
        <Card sx={{ maxWidth: 600 }}>
          <CardHeader title={result.title || result.original_name} />

          <CardMedia
            layout="responsive"
            component="img"
            height="300"
            image={
              `${BASE_URL}${result.backdrop_path || result.poster_path}` ||
              `${BASE_URL}${result.poster_path}`
            }
            alt="Poster"
            onClick={() => router.push(`/movie/${result._id}`)}
          />

          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {result.release_date || result.first_air_date} •{" "}
              {result.runtime && Math.floor(result.runtime / 60) + "h" + result.runtime % 60 + "m • "}
              {result.genres && result.genres.map((genre) => genre + " ")}

            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton aria-label="add to favorites">
              <ThumbUpIcon />{result.vote_count}
            </IconButton>
            <StarRating />

            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </CardActions>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography paragraph>Synopis:</Typography>
              <Typography paragraph>{result.overview}</Typography>
            </CardContent>
          </Collapse>
          <div></div>
        </Card>
      </div>
    </center>
  );
});

export default Miniatures;
