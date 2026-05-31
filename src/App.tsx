import { useEffect, useState } from "react";

import { getGameVersions, type Mod } from "./hooks/modrinth";

import SearchBox from "./components/SearchBox";
import PresetsBar from "./components/PresetsBar";
import ModDisplayCard from "./components/ModDisplayCard";

function App() {
  const [selectedPreset, setSelectedPreset] = useState<number>(0);
  const [mods, setMods] = useState<Mod[]>([]);
  const [versions, setVersions] = useState<string[]>([]);
  const [version, setVersion] = useState("");

  useEffect(() => {
    getGameVersions().then((v) => {
      setVersions(v);
      setVersion(v[0]); // default to latest
    });
  }, []);

  const handleModToggle = (mod: Mod) => {
    const exists = mods.some(
      (m) => m.slug === mod.slug && m.preset === selectedPreset,
    );

    if (exists) {
      setMods((prev) =>
        prev.filter(
          (m) => !(m.slug === mod.slug && m.preset === selectedPreset),
        ),
      );
    } else {
      setMods((prev) => [...prev, { ...mod, preset: selectedPreset }]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center gap-4">
      <h1 className="font-nunito font-extrabold m-4 text-4xl">
        Mod Downloader
      </h1>
      <SearchBox handleModToggle={handleModToggle} version={version} />

      <select
        value={version}
        onChange={(e) => setVersion(e.target.value)}
        className="appearance-auto bg-[#201672] outline-3 rounded-md outline-[#171055] font-quicksand text-white text-sm px-2 py-1"
      >
        {versions.map((val, i) => (
          <option value={val} key={`${val}-${i}`}>
            {val}
          </option>
        ))}
      </select>

      {/* Presets */}
      <PresetsBar
        activePreset={selectedPreset}
        setActivePreset={setSelectedPreset}
      />

      <div className="bg-[#1f0541] rounded-lg m-2  font-quicksand font-medium">
        {mods
          .filter((mod) => mod.preset === selectedPreset)
          .map((mod) => (
            <ModDisplayCard
              mod={mod}
              key={mod.slug}
              handleModToggle={handleModToggle}
              isAdded={mods.some(
                (m) => m.slug === mod.slug && m.preset === selectedPreset,
              )}
            />
          ))}
      </div>
    </div>
  );
}

export default App;
