import { useState } from "react";
import type { Mod } from "./hooks/modrinth";

import SearchBox from "./components/SearchBox";

function App() {
  const [results, setResults] = useState<Mod[]>([]);

  return (
    <div className="min-h-screen flex flex-col items-center gap-4">
      <h1 className="font-nunito font-extrabold m-4 text-4xl">
        Mod Downloader
      </h1>
      <SearchBox onResults={setResults} />
    </div>
  );
}

export default App;
