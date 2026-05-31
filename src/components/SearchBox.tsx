import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

import { searchMods, type Mod } from "../hooks/modrinth";

import ModDisplayCard from "./ModDisplayCard";

function SearchBox({
  onResults,
  handleModToggle,
  version,
  loader,
}: {
  onResults?: (results: Mod[]) => void;
  handleModToggle: (mod: Mod) => void;
  version?: string;
  loader: string;
}) {
  const [results, setResults] = useState<Mod[]>([]);
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [rect, setRect] = useState({ top: 0, left: 0, width: 0 });

  const searchFn = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!focused && containerRef.current) {
      const r = containerRef.current.getBoundingClientRect();
      setRect({ top: r.top, left: r.left, width: r.width });
    }
  }, [focused]);

  useEffect(() => {
    if (focused) inputRef.current?.focus();
  }, [focused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (searchFn.current) clearTimeout(searchFn.current);
    searchFn.current = setTimeout(async () => {
      if (!value.trim()) {
        onResults?.([]);
        return;
      }
      const data = await searchMods(value.trim(), version!, loader);
      onResults?.(data.hits);
      setResults(data.hits);
      console.log(data);
    }, 400);
  };

  // Cleanup timer on unmount
  useEffect(
    () => () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    },
    [],
  );

  const closedStyle = {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    x: 0,
  };

  const openStyle = {
    top: 32,
    left: "50%",
    width: Math.min(window.innerWidth * 0.9, 672),
    x: "-50%",
  };

  return (
    <>
      <div ref={containerRef} className="w-72 h-12 m-5" />

      <AnimatePresence>
        {focused && (
          <motion.div
            key="backdrop"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setFocused(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        className="fixed z-50"
        animate={focused ? openStyle : closedStyle}
        transition={{ type: "spring", stiffness: 380, damping: 36, mass: 0.8 }}
      >
        <div className="relative flex items-center">
          <svg
            className="absolute left-4 w-4 h-4 text-[#4a5fad] pointer-events-none z-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>

          <input
            ref={inputRef}
            type="text"
            value={query}
            placeholder="Search mods..."
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            maxLength={35}
            onKeyDown={(e) => e.key === "Escape" && setFocused(false)}
            className={`font-quicksand w-full pl-11 rounded-xl outline-none transition-shadow duration-200
              bg-[#0C1642] placeholder:text-[#3d4f8a] placeholder:font-medium text-white
              ${
                focused
                  ? "shadow-[0_0_0_2px_#2d3f9e,0_20px_60px_rgba(0,0,0,0.5)] py-4 text-lg pr-36"
                  : "shadow-[0_0_0_2px_#0e2379] hover:shadow-[0_0_0_2px_#1a2d6e] py-3 pr-10"
              }`}
          />

          <AnimatePresence>
            {focused && (
              <motion.div
                key="input-extras"
                className="absolute right-3 flex items-center gap-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
              >
                <button
                  onClick={() => setFocused(false)}
                  className="absolute -right-2.5 text-[#3d4f8a] hover:text-white transition-colors"
                >
                  <kbd className="font-mono text-xs border border-[#2a3870] rounded px-1.5 py-0.5 bg-[#0a1235]">
                    esc
                  </kbd>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {focused && (
            <motion.div
              key="dropdown"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15, delay: 0.05 }}
              className="mt-2 bg-[#0a1235] max-h-[75vh] overflow-y-auto border border-[#1a2760] rounded-xl shadow-2xl p-3 text-sm text-[#4a5fad] font-quicksand"
            >
              {results.length > 0 ? (
                results.map((mod, i) => (
                  <ModDisplayCard
                    key={mod.slug}
                    mod={mod}
                    index={i}
                    handleModToggle={handleModToggle}
                  />
                ))
              ) : (
                <p className="px-2 py-1">
                  {query
                    ? `No results for "${query}"`
                    : "Start typing to search mods…"}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

export default SearchBox;
