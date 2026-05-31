import { motion } from "motion/react";

const PRESETS = ["Preset 1", "Preset 2", "Preset 3"];

type Props = {
  activePreset: number;
  setActivePreset: (preset: number) => void;
};

function PresetsBar({ activePreset, setActivePreset }: Props) {
  return (
    <div className="flex font-nunito font-medium text-lg m-2 bg-[#07123B] rounded-xl p-1 w-fit">
      {PRESETS.map((preset, i) => (
        <button
          key={preset}
          onClick={() => setActivePreset(i)}
          className="relative cursor-pointer py-2.5 px-6 rounded-xl transition-colors duration-200 z-10"
        >
          {/* Sliding background */}
          {activePreset === i && (
            <motion.div
              layoutId="active-preset"
              className="absolute inset-0 bg-[#0e2379] rounded-xl shadow-[0_0_16px_rgba(14,35,121,0.6)]"
              transition={{ type: "spring", stiffness: 400, damping: 34 }}
            />
          )}
          <span
            className={`relative z-10 transition-colors duration-200 ${activePreset === i ? "text-white" : "text-[#3d4f8a] hover:text-[#6b8cff]"}`}
          >
            {preset}
          </span>
        </button>
      ))}
    </div>
  );
}

export default PresetsBar;
