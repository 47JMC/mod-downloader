import { useEffect, useState } from "react";

import { getGameVersions, getLoaders, type Mod } from "./hooks/modrinth";

import SearchBox from "./components/SearchBox";
import PresetsBar from "./components/PresetsBar";
import ModDisplayCard from "./components/ModDisplayCard";
import DownloadButton from "./components/DownloadButton";

function App() {
  const [selectedPreset, setSelectedPreset] = useState<number>(0);
  const [mods, setMods] = useState<Mod[]>(() => {
    const storedMods = localStorage.getItem("mods");
    return storedMods ? JSON.parse(storedMods) : [];
  });

  const [version, setVersion] = useState(
    () => localStorage.getItem("version") ?? "",
  );
  const [versions, setVersions] = useState<string[]>([]);

  const [loader, setLoader] = useState<string | undefined>(
    () => localStorage.getItem("loader") ?? undefined,
  );
  const [loaders, setLoaders] = useState<{ icon: string; name: string }[]>([]);

  useEffect(() => {
    getGameVersions().then((v) => {
      setVersions(v);
      if (!localStorage.getItem("version")) setVersion(v[0]);
    });

    getLoaders().then((l) => {
      setLoaders(l);
      if (!localStorage.getItem("loader")) setLoader("fabric");
    });
  }, []);

  const handleModToggle = (mod: Mod) => {
    const exists = mods.some(
      (m) => m.slug === mod.slug && m.preset === selectedPreset,
    );

    const newMods = exists
      ? mods.filter(
          (m) => !(m.slug === mod.slug && m.preset === selectedPreset),
        )
      : [...mods, { ...mod, preset: selectedPreset }];

    setMods(newMods);
    localStorage.setItem("mods", JSON.stringify(newMods));
  };

  const handleVersionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setVersion(e.target.value);
    localStorage.setItem("version", e.target.value);
  };

  const handleLoaderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLoader(e.target.value);
    localStorage.setItem("loader", e.target.value);
  };

  return (
    <div className="min-h-screen flex flex-col items-center gap-4">
      <h1 className="font-nunito font-extrabold m-4 text-4xl">
        Mod Downloader
      </h1>

      <SearchBox
        handleModToggle={handleModToggle}
        version={version}
        loader={loader!}
        mods={mods}
        selectedPreset={selectedPreset}
      />

      <div className="flex items-center gap-5">
        <div className="hidden md:flex flex-col gap-1">
          <p>Game version</p>
          <select
            value={version}
            onChange={handleVersionChange}
            className="appearance-[base-select] bg-[#201672] outline-3 rounded-md outline-[#171055] font-quicksand text-white text-sm px-2 py-1"
          >
            {versions.map((val, i) => (
              <option value={val} key={`${val}-${i}`}>
                {val}
              </option>
            ))}
          </select>
        </div>
        <div className="hidden md:flex flex-col gap-1">
          <p>Mod Loader</p>
          <select
            value={loader}
            onChange={handleLoaderChange}
            className="appearance-[base-select] bg-[#201672] outline-3 rounded-md outline-[#171055] font-quicksand text-white text-sm px-2 py-1"
          >
            {loaders.map((val, i) => (
              <option value={val.name} key={`${val.name}-${i}`}>
                {val.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Presets */}
      <PresetsBar
        activePreset={selectedPreset}
        setActivePreset={setSelectedPreset}
      />

      <DownloadButton
        preset={selectedPreset}
        mods={mods}
        loader={loader!}
        version={version}
      />

      <div className="bg-[#1f0541] rounded-lg m-2 font-quicksand font-medium">
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
