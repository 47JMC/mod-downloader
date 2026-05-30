import { motion } from "motion/react";
import type { Mod } from "../hooks/modrinth";

type Props = { mod: Mod; index?: number };

function ModDisplayCard({ mod, index = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05, ease: "easeOut" }}
      className="group m-2 p-3 flex items-center gap-4 rounded-xl bg-[#0a1235] border border-[#1a2760] hover:border-[#2d3f9e] hover:bg-[#0c1642] transition-all duration-200 cursor-pointer shadow-md hover:shadow-[0_4px_24px_rgba(13,25,90,0.6)]"
    >
      {/* Icon */}
      <div className="shrink-0">
        <img
          src={mod.icon_url}
          alt={`${mod.title} icon`}
          className="w-14 h-14 rounded-xl border border-[#1a2760] group-hover:border-[#2d3f9e] transition-colors duration-200 object-cover"
        />
      </div>

      {/* Text */}
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <p className="font-quicksand font-bold text-white text-lg leading-tight truncate">
          {mod.title}
        </p>
        <p className="font-quicksand text-[#4f65ae] text-wrap text-sm truncate">
          {mod.description}
        </p>
        <div className="flex items-center text-xs gap-1.5 mt-1 text-[#3d4f8a]">
          By
          <span className="font-quicksand text-[#2a90d8] font-medium">
            {mod.author}
          </span>
          <span className="text-[#1a2760]">·</span>
          <span>{mod.downloads.toLocaleString()} downloads</span>
        </div>
      </div>

      {/* Add button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="shrink-0 font-quicksand font-semibold text-sm px-4 py-2 rounded-xl
          bg-[#031970] border-2 border-[#1a2f8a]
          text-[#6b8cff] hover:text-green-400
          hover:bg-[#05175e] hover:border-green-500/60
          transition-colors duration-200
          shadow-[0_0_12px_rgba(3,25,112,0.4)] hover:shadow-[0_0_16px_rgba(74,222,128,0.15)]"
      >
        Add +
      </motion.button>
    </motion.div>
  );
}

export default ModDisplayCard;
