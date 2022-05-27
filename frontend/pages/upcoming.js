import Results from "../components/Results";

const API_KEY = process.env.API_KEY;
const API_PREFIX = "https://api.themoviedb.org/3";

export async function getServerSideProps() {
  const request = await fetch(
    `${API_PREFIX}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`
  ).then((res) => res.json());

  return {
    props: {
      results: request.results,
    },
  };
}

export default function Home({ results }) {
  console.log(results);
  return (
    <div>
      <Results results={results} />
    </div>
  );
}
