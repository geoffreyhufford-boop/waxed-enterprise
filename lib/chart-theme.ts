import type { CSSProperties } from 'react'

type Theme = 'dark' | 'light' | 'retro'

interface ChartPalette {
  primary: string      // main accent (coral / orange)
  secondary: string    // supporting (dark purple / steel blue)
  tertiary: string     // third series (purple / teal)
  quaternary: string   // fourth series (green / lighter blue)
  muted: string        // de-emphasized bars (pale purple / mid blue)
  axisLabel: string    // axis tick labels
  grid: string         // grid stroke
  channels: {
    discogs: string
    storefront: string
    pos: string
    waxed: string
  }
  tooltip: {
    contentStyle: CSSProperties
    labelStyle: CSSProperties
    itemStyle: CSSProperties
  }
}

const dark: ChartPalette = {
  primary: '#E87B35',
  secondary: '#7B6FA0',
  tertiary: '#2D2540',
  quaternary: '#4A9A62',
  muted: '#B2BEC3',
  axisLabel: '#636E72',
  grid: 'rgba(0, 0, 0, 0.07)',
  channels: {
    discogs: '#2D2540',
    storefront: '#7B6FA0',
    pos: '#E87B35',
    waxed: '#4A9A62',
  },
  tooltip: {
    contentStyle: { background: '#E0E5EC', border: 'none', borderRadius: '16px', fontSize: '10px', fontFamily: 'var(--font-mono)', boxShadow: '4px 4px 8px #b8bec7, -4px -4px 8px #ffffff' },
    labelStyle: { color: '#636E72', fontWeight: 500, fontSize: '9px' },
    itemStyle: { color: '#2D3436', fontFamily: 'var(--font-mono)' },
  },
}

const light: ChartPalette = {
  ...dark,
  tooltip: {
    contentStyle: { background: '#F7F5F0', border: 'none', borderRadius: '16px', fontSize: '10px', fontFamily: 'var(--font-mono)', boxShadow: '4px 4px 8px #ccc9c3, -4px -4px 8px #ffffff' },
    labelStyle: { color: '#6B6B66', fontWeight: 500, fontSize: '9px' },
    itemStyle: { color: '#1A1A18', fontFamily: 'var(--font-mono)' },
  },
}

const retro: ChartPalette = {
  primary: '#D08030',
  secondary: '#4A6A8C',
  tertiary: '#48B0A8',
  quaternary: '#6A8AAC',
  muted: '#607890',
  axisLabel: '#90A0B8',
  grid: 'rgba(72, 176, 168, 0.1)',
  channels: {
    discogs: '#4A6A8C',
    storefront: '#6A8AAC',
    pos: '#D08030',
    waxed: '#48B0A8',
  },
  tooltip: {
    contentStyle: { background: '#0C0E12', border: '1px solid #3A5A7C', borderRadius: '0px', fontSize: '10px', fontFamily: 'var(--font-mono)' },
    labelStyle: { color: '#90A0B8', fontWeight: 500, fontSize: '9px' },
    itemStyle: { color: '#D8E0E8', fontFamily: 'var(--font-mono)' },
  },
}

const palettes: Record<Theme, ChartPalette> = { dark, light, retro }

export function getChartPalette(theme: Theme): ChartPalette {
  return palettes[theme]
}
