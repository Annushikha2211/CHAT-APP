import { useNavigate } from "react-router-dom";
import SearchUsers from "../Chat/SearchUsers";

function Search() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050805] px-5 py-8 text-white">

      <button
        onClick={() => navigate("/")}
        className="mb-8 text-[#39FF88]"
      >
        ← Back
      </button>

      <h1 className="mb-2 text-3xl font-bold">
        Find people
      </h1>

      <p className="mb-7 text-[#78877D]">
        Search by name or username.
      </p>

      <SearchUsers />
    </div>
  );
}

export default Search;