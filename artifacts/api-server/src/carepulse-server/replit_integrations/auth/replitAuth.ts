import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import pg from "pg";
import { authStorage } from "./storage";
import bcrypt from "bcryptjs";

const { Pool } = pg;

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000;
  const isProduction = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
  const dbUrl = process.env.DATABASE_URL;

  let store: session.Store | undefined;

  if (dbUrl) {
    try {
      const sslDbUrl = isProduction && !dbUrl.includes("sslmode=")
        ? dbUrl + (dbUrl.includes("?") ? "&sslmode=require" : "?sslmode=require")
        : dbUrl;

      const sessionPool = new Pool({ connectionString: sslDbUrl });

      sessionPool.on("error", (err) => {
        console.error("Session pool error (non-fatal):", err.message);
      });

      const pgStore = connectPg(session);
      store = new pgStore({
        pool: sessionPool,
        createTableIfMissing: true,
        ttl: sessionTtl,
        tableName: "sessions",
        errorLog: (...args: any[]) => console.error("Session store error:", ...args),
      });
    } catch (err: any) {
      console.warn("Session store init failed, using memory store:", err.message);
      store = undefined;
    }
  } else {
    console.warn("DATABASE_URL not set — using in-memory session store");
  }

  return session({
    secret: process.env.SESSION_SECRET || "medimind-secret-key-change-in-production",
    store,
    resave: false,
    saveUninitialized: false,
    proxy: isProduction,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" as const : "lax" as const,
      maxAge: sessionTtl,
    },
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());

  app.post("/api/register", async (req, res) => {
    try {
      const { email, password, firstName, lastName, phone, role, hospitalId } = req.body;

      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const allowedRoles = ["patient", "doctor", "admin"];
      const userRole = allowedRoles.includes(role) ? role : "patient";

      const existing = await authStorage.getUserByEmail(email);
      if (existing) {
        return res.status(409).json({ message: "Email already registered" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await authStorage.upsertUser({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone: phone ? phone.replace(/\D/g, "").replace(/^91/, "").slice(0, 10) : null,
        role: userRole,
        hospitalId: (userRole === "doctor" || userRole === "admin") && hospitalId ? Number(hospitalId) : null,
      });

      (req.session as any).userId = user.id;

      const { password: _, ...safeUser } = user;
      req.session.save((saveErr) => {
        if (saveErr) {
          console.error("Session save error (register):", saveErr);
        }
        res.status(201).json(safeUser);
      });
    } catch (error: any) {
      console.error("Registration error:", error?.message || error);
      res.status(500).json({ message: "Registration failed: " + (error?.message || "Unknown error") });
    }
  });

  app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const user = await authStorage.getUserByEmail(email);
      if (!user || !user.password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      (req.session as any).userId = user.id;

      const { password: _, ...safeUser } = user;
      req.session.save((saveErr) => {
        if (saveErr) {
          console.error("Session save error (login):", saveErr);
        }
        res.json(safeUser);
      });
    } catch (error: any) {
      console.error("Login error:", error?.message || error);
      res.status(500).json({ message: "Login failed: " + (error?.message || "Unknown error") });
    }
  });

  app.get("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out successfully" });
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const userId = (req.session as any)?.userId;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await authStorage.getUser(userId);
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  (req as any).currentUser = user;
  next();
};

export function requireRole(...args: (string | string[])[]): RequestHandler {
  const roles = args.flat();
  return (req: any, res, next) => {
    const user = req.currentUser;
    if (!user || !roles.includes(user.role || "patient")) {
      return res.status(403).json({ message: "Access denied. Insufficient permissions." });
    }
    next();
  };
}
