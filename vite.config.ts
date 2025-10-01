import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

<<<<<<< Updated upstream
// https://vite.dev/config/
=======
>>>>>>> Stashed changes
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // This should come after react()
  ],
  server: {
    host: "localhost",
    port: 5173,
    cors: true,
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
  },
});
