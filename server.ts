import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Mock enhancement endpoint for demo purposes
  // In a real scenario, this would call the Python FastAPI backend or Gemini API
  app.post("/api/enhance", async (req, res) => {
    const { image, settings } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // For the demo, we'll just return the same image or a slightly modified one
    // In the frontend, we'll use Gemini for the real "AI" magic if requested
    res.json({ 
      success: true, 
      enhancedImage: image, // Placeholder
      message: "Image enhanced successfully (Demo Mode)" 
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
