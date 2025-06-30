const { nextui } = require("@nextui-org/react");
const plugin = require("tailwindcss/plugin");
const { resolve } = require("path");

const config = require(resolve(__dirname, "src/config/styles.config.json"));
const tailwindStyle = config?.tailwind ?? {};

// Define as cores padrão para fallback
const defaultColors = {
  success: "#10b981",
  "success-text": "#ffffff",
  error: "#ef4444",
  "error-text": "#ffffff",
  warning: "#f59e0b",
  "warning-text": "#000000",
  primary: "#3b82f6",
  "primary-text": "#ffffff",
};

// Função para achatar objetos de cores aninhadas
function flattenColors(colors, prefix = "") {
  const flat = {};
  for (const key in colors) {
    const value = colors[key];
    const newKey = prefix ? `${prefix}-${key}` : key;

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      Object.assign(flat, flattenColors(value, newKey));
    } else if (typeof value === "string") {
      flat[newKey] = value;
    }
  }
  return flat;
}

// Merge das cores padrão com as cores do JSON (se enviadas)
//const lightColorsFromJson = flattenColors(tailwindStyle.light?.colors ?? {});
const darkColorsFromJson = flattenColors(tailwindStyle.dark?.colors ?? {});

const colorSets = {
 // light: { ...defaultColors, ...lightColorsFromJson },
  dark: { ...defaultColors, ...darkColorsFromJson },
};

// Combine cores para Tailwind, dark sobrescreve se conflito
const themeColors = {
  //...colorSets.light,
  ...colorSets.dark,
};

// Debug
console.log("🎨 Tailwind Theme Colors:", themeColors);

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],  
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        archivo: ["Archivo", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      fontSize: {
        xs2: "10px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      ringColor: {...themeColors},
      colors: {
        //...themeColors, // Alimenta IntelliSense
        //light: colorSets.light, // Opcional para acesso em temas
        dark: colorSets.dark, // Opcional também
      },
    },
  },
  plugins: [
    nextui({
      layout: {
        spacingUnit: 4,
        disabledOpacity: 0.5,
        dividerWeight: "1px",
        fontSize: {
          tiny: "0.75rem",
          small: "0.875rem",
          medium: "1rem",
          large: "1.125rem",
        },
        lineHeight: {
          tiny: "1rem",
          small: "1.25rem",
          medium: "1.5rem",
          large: "1.75rem",
        },
        radius: {
          small: "8px",
          medium: "12px",
          large: "14px",
        },
        borderWidth: {
          small: "1px",
          medium: "2px",
          large: "3px",
        },
      },
      themes: {
        // light: {
        //   colors: colorSets.light,
        //   layout: {
        //     hoverOpacity: 0.8,
        //     boxShadow: {
        //       small:
        //         "0px 0px 5px 0px rgb(0 0 0 / 0.02), 0px 2px 10px 0px rgb(0 0 0 / 0.06), 0px 0px 1px 0px rgb(0 0 0 / 0.3)",
        //       medium:
        //         "0px 0px 15px 0px rgb(0 0 0 / 0.03), 0px 2px 30px 0px rgb(0 0 0 / 0.08), 0px 0px 1px 0px rgb(0 0 0 / 0.3)",
        //       large:
        //         "0px 0px 30px 0px rgb(0 0 0 / 0.04), 0px 30px 60px 0px rgb(0 0 0 / 0.12), 0px 0px 1px 0px rgb(0 0 0 / 0.3)",
        //     },
        //   },
        // },
        dark: {
          colors: colorSets.dark,
          layout: {
            hoverOpacity: 0.9,
            boxShadow: {
              small:
                "0px 0px 5px 0px rgb(0 0 0 / 0.05), 0px 2px 10px 0px rgb(0 0 0 / 0.2), inset 0px 0px 1px 0px rgb(255 255 255 / 0.15)",
              medium:
                "0px 0px 15px 0px rgb(0 0 0 / 0.06), 0px 2px 30px 0px rgb(0 0 0 / 0.22), inset 0px 0px 1px 0px rgb(255 255 255 / 0.15)",
              large:
                "0px 0px 30px 0px rgb(0 0 0 / 0.07), 0px 30px 60px 0px rgb(0 0 0 / 0.26), inset 0px 0px 1px 0px rgb(255 255 255 / 0.15)",
            },
          },
        },
      },
    }),

    plugin(function ({ addUtilities, theme }) {
      function hexToRgb(hex) {
        if (typeof hex !== "string") return null;
        hex = hex.replace(/^#/, "");
        if (hex.length === 3) {
          hex = hex
            .split("")
            .map((x) => x + x)
            .join("");
        }
        const bigint = parseInt(hex, 16);
        if (isNaN(bigint)) return null;
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `${r} ${g} ${b}`;
      }

      const opacities = {
        10: "0.1",
        20: "0.2",
        30: "0.3",
        40: "0.4",
        50: "0.5",
        60: "0.6",
        70: "0.7",
        80: "0.8",
        90: "0.9",
        100: "1",
      };
      const utilities = {};
      const colors = theme("colors") || {};

      for (const [colorName, colorValue] of Object.entries(colors)) {
        let hex = null;
        if (typeof colorValue === "string") {
          hex = colorValue;
        } else if (colorValue && typeof colorValue.color === "string") {
          hex = colorValue.color;
        }

        const rgb = hexToRgb(hex);
        if (rgb) {
          for (const [opacityKey, opacityValue] of Object.entries(opacities)) {
            utilities[`.bg-${colorName}-${opacityKey}`] = {
              "--tw-bg-opacity": opacityValue,
              backgroundColor: `rgb(${rgb} / var(--tw-bg-opacity))`,
            };
            utilities[`.text-${colorName}-${opacityKey}`] = {
              "--tw-text-opacity": opacityValue,
              color: `rgb(${rgb} / var(--tw-text-opacity))`,
            };
          }
        }
      }

      addUtilities(utilities, ["responsive", "hover"]);
    }),
  ],
};
