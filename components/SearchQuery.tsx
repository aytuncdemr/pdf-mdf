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
            className="search-bar w-full flex flex-col gap-2
        "
        >
            <input
                className="text-lg border h-full border-gray-500 rounded-lg py-2 px-4 w-full outline-none"
                placeholder={`Arama (${length} dosya)`}
                type="text"
                value={query || ""}
                onChange={(e) => setQuery(e.target.value)}
            />
        </div>
    );
}
