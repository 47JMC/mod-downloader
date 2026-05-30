import { useState } from "react";

import SearchBox from "./components/SearchBox";
import PresetsBar from "./components/PresetsBar";

function App() {
  const [selectedPreset, setSelectedPreset] = useState<number>(0);

  return (
    <div className="min-h-screen flex flex-col items-center gap-4">
      <h1 className="font-nunito font-extrabold m-4 text-4xl">
        Mod Downloader
      </h1>
      <SearchBox />

      {/* Presets */}
      <PresetsBar
        activePreset={selectedPreset}
        setActivePreset={setSelectedPreset}
      />
    </div>
  );
}

export default App;
