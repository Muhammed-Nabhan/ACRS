import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    define: {
      'process.env.REACT_APP_CONTRACT_ADDRESS': JSON.stringify('0xE9c3e3Af371af1546f58F4a7072AfDd75A47B7e2'),
    },
  },
  plugins: [react()],

})
