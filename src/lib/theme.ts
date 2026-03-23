import { createTheme, MantineColorsTuple } from "@mantine/core";

// Golden/Orange brand color for buttons
const jobbiGold: MantineColorsTuple = [
  "#fff8e1",
  "#ffecb3",
  "#ffe082",
  "#ffd54f",
  "#ffca28",
  "#f5a623", // Main golden color
  "#f59f00",
  "#e69500",
  "#cc8400",
  "#b37400",
];

// Dark purple/blue for backgrounds
const jobbiDark: MantineColorsTuple = [
  "#e8e8f0",
  "#c4c4d4",
  "#9e9eb8",
  "#78789c",
  "#525280",
  "#1a1a3e", // Main dark color
  "#161638",
  "#121230",
  "#0e0e28",
  "#0a0a20",
];

// Override Mantine's dark palette so dark-6 (cards) and dark-7 (body) use our brand bg
const dark: MantineColorsTuple = [
  "#ffffff", // dark-0 – primary text
  "#eaf3f8", // dark-1 – secondary text
  "#a6a7ab", // dark-2 – dimmed text
  "#5c5f66", // dark-3
  "#373a40", // dark-4
  "#2c2e33", // dark-5
  "#080036", // dark-6 – card / surface bg
  "#080036", // dark-7 – body bg
  "#050020", // dark-8
  "#030014", // dark-9
];

export const theme = createTheme({
  // Brand colors
  colors: {
    jobbiGold: jobbiGold,
    jobbiDark: jobbiDark,
    dark: dark,
  },
  primaryColor: "jobbiGold",

  // Typography - Roboto is loaded via next/font/google in layout.tsx
  fontFamily: "Roboto, -apple-system, BlinkMacSystemFont, sans-serif",
  headings: {
    fontFamily: "Roboto, -apple-system, BlinkMacSystemFont, sans-serif",
    fontWeight: "700", // Roboto Bold
    sizes: {
      h1: {
        fontSize: "var(--font-headline-1)",
        lineHeight: "var(--font-headline-1-lh)",
      },
      h2: {
        fontSize: "var(--font-headline-3)",
        lineHeight: "var(--font-headline-3-lh)",
      },
      h3: {
        fontSize: "var(--font-headline-3)",
        lineHeight: "var(--font-headline-3-lh)",
      },
      h4: {
        fontSize: "var(--font-subtext)",
        lineHeight: "var(--font-subtext-lh)",
        fontWeight: "var(--font-subtext-weight)",
      },
      h5: {
        fontSize: "var(--font-headline-3)",
        lineHeight: "var(--font-headline-3-lh)",
      },
      h6: {
        fontSize: "var(--font-headline-3)",
        lineHeight: "var(--font-headline-3-lh)",
      },
    },
  },

  // Radius
  defaultRadius: "xl",

  // Component defaults
  components: {
    Anchor: {
      styles: {
        root: {
          transition: "color 0.2s ease",
        },
      },
    },
    Button: {
      defaultProps: {
        size: "md",
        radius: "xl",
      },
      styles: {
        root: {
          fontSize: "var(--font-button)",
          fontWeight: 900, // Roboto Black
          height: "var(--jobbi-button-height)",
          transition: "all 0.2s ease",
          width: "fit-content",
          padding: "0 25px",
        },
      },
    },
    TextInput: {
      defaultProps: {
        size: "md",
        radius: "xl",
      },
      styles: {
        input: {
          fontSize: "var(--font-input)",
          fontWeight: 500,
          height: "var(--jobbi-input-height)",
          minHeight: "unset",
          padding: "0 1.5rem",
          color: "var(--color-text-input)",
          backgroundColor: "var(--color-overlay-purple)",
          border: "none",
        },
      },
    },
    NumberInput: {
      defaultProps: {
        size: "md",
        radius: "xl",
      },
      styles: {
        input: {
          fontSize: "var(--font-input)",
          fontWeight: 500,
          height: "var(--jobbi-input-height)",
          minHeight: "unset",
          padding: "0 1.5rem",
          color: "var(--color-text-input)",
          backgroundColor: "var(--color-overlay-purple)",
          border: "none",
        },
      },
    },
    Textarea: {
      defaultProps: {
        size: "md",
        radius: "xl",
      },
      styles: {
        input: {
          fontSize: "var(--font-input)",
          fontWeight: 500,
          minHeight: "unset",
          padding: "1rem 1.5rem",
          color: "var(--color-text-input)",
          backgroundColor: "var(--color-overlay-purple)",
          border: "none",
        },
      },
    },
    PasswordInput: {
      defaultProps: {
        size: "md",
        radius: "xl",
      },
      styles: {
        input: {
          fontSize: "var(--font-input)",
          fontWeight: 500,
          height: "var(--jobbi-input-height)",
          minHeight: "unset",
          padding: "0 1.5rem",
          color: "var(--color-text-input)",
          backgroundColor: "var(--color-overlay-purple)",
          border: "none",
        },
        innerInput: {
          paddingLeft: "1.5rem",
          color: "var(--color-text-input)",
        },
      },
    },
    Select: {
      defaultProps: {
        size: "md",
        radius: "xl",
      },
      styles: {
        input: {
          fontSize: "var(--font-input)",
          fontWeight: 500,
          height: "var(--jobbi-input-height)",
          minHeight: "unset",
          padding: "0 1.5rem",
          color: "var(--color-text-input)",
          backgroundColor: "var(--color-overlay-purple)",
          border: "none",
        },
        dropdown: {
          backgroundColor: "var(--color-overlay-purple)",
          borderColor: "var(--color-overlay-purple)",
        },
        option: {
          color: "white",
        },
      },
    },
    DateInput: {
      defaultProps: {
        size: "md",
        radius: "xl",
      },
      styles: {
        input: {
          fontSize: "var(--font-input)",
          fontWeight: 500, // Roboto Medium
          height: "var(--jobbi-input-height)",
          minHeight: "unset",
          padding: "0 1.5rem",
          color: "var(--color-text-input)",
          backgroundColor: "var(--color-overlay-purple)",
          border: "none",
        },
        calendarHeader: {
          backgroundColor: "transparent",
        },
        calendarHeaderControl: {
          color: "white",
        },
        calendarHeaderLevel: {
          color: "white",
        },
        day: {
          color: "white",
        },
        weekday: {
          color: "rgba(255, 255, 255, 0.6)",
        },
        month: {
          color: "white",
        },
        year: {
          color: "white",
        },
      },
    },
    Popover: {
      styles: {
        dropdown: {
          backgroundColor: "var(--color-overlay-purple)",
          borderColor: "var(--color-overlay-purple)",
          "--mantine-color-gray-0": "var(--color-overlay-purple-medium)",
          "--mantine-color-dark-5": "var(--color-overlay-purple-medium)",
          "--mantine-color-text": "white",
        },
      },
    },
    Card: {
      defaultProps: {
        radius: "md",
        withBorder: true,
      },
    },
    Switch: {
      styles: {
        track: {
          "--switch-bg": "var(--color-accent)",
          backgroundColor: "var(--color-primary)",
          borderColor: "var(--color-primary)",
        },
        thumb: {
          backgroundColor: "var(--color-accent)",
          borderColor: "var(--color-accent)",
        },
      },
    },
    Checkbox: {
      defaultProps: {
        size: "lg",
        radius: "xl",
      },
      styles: {
        input: {
          backgroundColor: "white",
          borderColor: "white",
          cursor: "pointer",
        },
        icon: {
          color: "var(--color-accent)",
          width: "50%",
          height: "50%",
          transform: "translateY(1px)",
        },
        label: {
          cursor: "pointer",
        },
      },
    },
    Accordion: {
      styles: {
        root: {
          width: "100%",
          maxWidth: 940,
          marginLeft: "auto",
          marginRight: "auto",
        },
        item: {
          backgroundColor: "var(--color-primary)",
          borderRadius: 35,
          border: "none",
          marginBottom: 16,
        },
        control: {
          borderRadius: 35,
          color: "white",
          paddingLeft: 40,
          paddingRight: 30,
          backgroundColor: "transparent",
          "&:hover": {
            backgroundColor: "transparent",
          },
        },
        label: {
          color: "white",
          fontWeight: 500,
        },
        chevron: {
          color: "white",
          transition: "transform 0.3s ease",
        },
        panel: {
          color: "white",
        },
        content: {
          color: "white",
          padding: "0 40px 24px",
        },
      },
    },
  },
});
