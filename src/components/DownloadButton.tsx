import { useState } from "react";
import { motion } from "motion/react";
import downloadIcon from "../assets/download.svg";
import { downloadModsAsZip, type Mod } from "../hooks/modrinth";

type DownloadButtonProps = {
  preset: number;
  mods: Mod[];
  loader: string;
  version: string;
};

function DownloadButton({
  preset,
  mods,
  loader,
  version,
}: DownloadButtonProps) {
  const [downloading, setDownloading] = useState(false);
  const filteredMods = mods.filter((m) => m.preset === preset);

  const handleDownload = async () => {
    if (downloading || filteredMods.length === 0) return;
    setDownloading(true);
    await downloadModsAsZip(filteredMods, version, loader);
    setDownloading(false);
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.8 }}
      transition={{ duration: 0.3 }}
      onClick={handleDownload}
      disabled={downloading || filteredMods.length === 0}
      className="p-3 m-2 flex gap-2 rounded-xl border-3 border-green-400 hover:border-amber-700 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold font-nunito transition-colors"
    >
      <p className="text-lg">{downloading ? "Downloading..." : "Download"}</p>
      <img src={downloadIcon} alt="Download Icon" />
    </motion.button>
  );
}

export default DownloadButton;
