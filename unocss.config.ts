import { defineConfig, presetAttributify, presetUno } from 'unocss'
import presetRemToPx from '@unocss/preset-rem-to-px'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetRemToPx({
      baseFontSize: 4,
    }),
  ],
  rules: [
    ['object-fit-contain', { 'object-fit': 'contain' }],
    ['shadow-def', { 'box-shadow': '0 1px 4px rgba(0, 0, 0, 0.1)' }],
    ['cell-border', { border: '1px solid #0000001a' }],
  ],
});