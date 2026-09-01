/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    // Legacy aliases (kept for backward compatibility)
    text: '#FFFFFF',
    tint: '#FF3B3B',

    // Core surfaces
    background: '#0A0A0A',
    foreground: '#FFFFFF',

    // Cards / elevated surfaces
    card: '#111111',
    cardForeground: '#FFFFFF',

    // Primary action color (buttons, links, active states)
    primary: '#FF3B3B',
    primaryForeground: '#FFFFFF',

    // Secondary / less-emphasis interactive surfaces
    secondary: '#1A1A1A',
    secondaryForeground: '#FFFFFF',

    // Muted / subdued elements (dividers, timestamps, placeholders)
    muted: '#141414',
    mutedForeground: '#666666',

    // Accent highlights (badges, selected items, focus rings)
    accent: '#FF8A00',
    accentForeground: '#0A0A0A',

    // Destructive actions (delete, error states)
    destructive: '#EF4444',
    destructiveForeground: '#FFFFFF',

    // Borders and input outlines
    border: '#242424',
    input: '#242424',
  },

  // Border radius (in px). Sync from the sibling web artifact's --radius
  // CSS variable. This value applies to cards, buttons, inputs, and modals.
  radius: 12,
};

export default colors;
