import "react-dropdown/style.css";

export default function SearchQuery({
    query,
    setQuery,
    length,
}: {
    query: string | null;
    length: number;
    setQuery: React.Dispatch<React.SetStateAction<string | null>>;
}) {
    return (
        <div
            className="search-bar w-full
        "
        >
            <input
                className="text-lg border min-h-[3rem] lg:min-h-[5rem] h-full border-gray-400 rounded-xl px-4 w-full outline-none"
                placeholder={`Arama (${length} dosya)`}
                type="text"
                value={query || ""}
                onChange={(e) => setQuery(e.target.value)}
            />
        </div>
    );
}
