import Miniatures from "./Miniatures";
import FlipMove from "react-flip-move";

function Results({ results }) {
  return (
    <FlipMove>
      {results.map((result) => (
        <Miniatures key={result.id} result={result} />
      ))}
    </FlipMove>
  );
}

export default Results;
