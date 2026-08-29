/* Public profile URLs. Env vars override the defaults if ever needed. */
export const SOCIAL = {
  instagram: import.meta.env.VITE_INSTAGRAM_URL || 'https://www.instagram.com/elizacaystudio',
  tiktok:    import.meta.env.VITE_TIKTOK_URL    || 'https://www.tiktok.com/@elizacaystudio',
  pinterest: import.meta.env.VITE_PINTEREST_URL || 'https://www.pinterest.com/elizacaystudio',
}
