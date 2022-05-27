import Results from "../components/Results";

const API_KEY = process.env.API_KEY;

export default function Home({ results }) {
  console.log(results);
  return (
    <div>
      <Results results={results} />
    </div>
  );
}

export async function getServerSideProps(context) {
  const genre = context.query.genre;

  const request = await fetch(
    `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`
  ).then((res) => res.json());

  return {
    props: {
      results: request.results,
    },
  };
}
