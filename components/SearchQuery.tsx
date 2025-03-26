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
            className="search-bar mb-4
        "
        >
            <input
                className="text-lg border  lg:py-2 lg:px-2 max-w-[%25] w-[29rem] border-gray-500 rounded-md  outline-none"
                placeholder={`Arama yap (${length} dosya)`}
                type="text"
                value={query || ""}
                onChange={(e) => setQuery(e.target.value)}
            />
        </div>
    );
}
