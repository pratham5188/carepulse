import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

let initialized = false;
let initError: Error | null = null;

async function ensureInitialized() {
  if (initError) throw initError;
  if (!initialized) {
    try {
      await registerRoutes(httpServer, app);

      app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
        const status = err.status || err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        console.error("Internal Server Error:", err);
        if (res.headersSent) {
          return next(err);
        }
        return res.status(status).json({ message });
      });

      initialized = true;
    } catch (err) {
      initError = err as Error;
      console.error("INIT ERROR:", err);
      throw err;
    }
  }
}

const handler = async (req: Request, res: Response) => {
  try {
    await ensureInitialized();
    app(req, res);
  } catch (err: any) {
    console.error("HANDLER ERROR:", err);
    res.status(500).json({ message: "Server initialization failed", error: err.message });
  }
};

export default handler;
