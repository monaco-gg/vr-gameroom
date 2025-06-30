// // src/components/Toggle.tsx
// //TODO: MRC customize
// "use client";
// import { useTheme } from "next-themes";
// import { useEffect, useState } from "react";

// export default function Toggle() {
//   const { theme, setTheme, resolvedTheme } = useTheme();
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => setMounted(true), []);

//   if (!mounted) return null; // Evita mismatch entre server/client

//   const toggleTheme = () => {
//     setTheme(resolvedTheme === "dark" ? "light" : "dark");
//   };

//   return (    
//     <button
//       onClick={toggleTheme}
//       className="px-3 py-1 rounded-xl shadow bg-success text-success-text"
//     >{resolvedTheme === "dark" ? "🌙" : "☀️"}
//     </button>    
//   );
// }
"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Toggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      onClick={() =>
        setTheme(resolvedTheme === "dark" ? "light" : "dark")
      }
      className="px-4 py-2 rounded-md font-medium shadow 
                 bg-success 
                 hover:bg-opacity-80 
                 focus-visible:outline-success"
    >
      {resolvedTheme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}
