// server.js
import "dotenv/config";
import Fastify from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import sequelize from "./config/database.js";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { authRoutes } from "./routes/auth.js";
import { moviesRoutes } from "./routes/movies.js";
import { usersRoutes } from "./routes/users.js";
import User from "./models/User.js";
import Movie from "./models/Movie.js";
const fastify = Fastify({ logger: true });

const PORT = process.env.PORT;

fastify.register(cors, {
  origin: "https://watch-time.pages.dev",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
fastify.register(jwt, {
  secret: "super-secret-change-me",
});
fastify.register(swagger, {
  openapi: {
    openapi: "3.0.0",
    info: { title: "fastify-api" },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT from POST /login. Example: Bearer &lt;token&gt;",
        },
      },
    },
  },
});

fastify.register(swaggerUi, {
  routePrefix: "/docs",
  exposeRoute: true,
});

fastify.decorate("authenticate", async (request, reply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

fastify.decorate("requireRoles", (allowedRoles) => {
  return async (request, reply) => {
    if (!request.user || !allowedRoles.includes(request.user.role)) {
      return reply.code(403).send({ error: "Forbidden" });
    }
  };
});

fastify.register(authRoutes);
fastify.register(moviesRoutes);
fastify.register(usersRoutes);

fastify.get("/health", async () => {
  return { status: "ok" };
});

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("Sequelize connected ✅");

    await fastify.listen({
      port: PORT || 3000,
      host: "0.0.0.0",
    });

    console.log(`🚀 Server running on http://localhost:${PORT || 3000}`);

    try {
      const { Server } = await import("socket.io");
      const io = new Server(fastify.server, {
        cors: {
          origin: true,
          credentials: true,
          methods: ["GET", "POST"],
        },
        transports: ["websocket", "polling"],
      });

      io.use(async (socket, next) => {
        try {
          const token =
            socket.handshake.auth.token ||
            socket.handshake.headers.authorization?.replace("Bearer ", "");

          if (!token) {
            return next(new Error("Authentication required"));
          }

          const decoded = await fastify.jwt.verify(token);
          socket.userId = decoded.id;
          socket.userEmail = decoded.email;
          socket.userRole = decoded.role;

          next();
        } catch (error) {
          console.error("Socket.IO authentication failed:", error.message);
          next(new Error("Authentication failed"));
        }
      });

      const updateLastSeen = async (userId, stats) => {
        const time = new Date().toISOString();
        try {
          await User.update(
            { isOnline: stats, lastSeen: time },
            { where: { id: userId } },
          );
          return time;
        } catch (error) {
          console.error("Failed to update lastSeen:", error.message);
          return time;
        }
      };

      const ADMIN_ROOM = "role:admin";

      io.on("connection", async (socket) => {
        const userId = socket.userId;
        const userEmail = socket.userEmail;
        const userRole = socket.userRole;

        socket.join(`role:${userRole}`);

        socket.on("get-users", () => {
          io.emit("users-updated", userId);
        });

        console.log(
          "Socket.IO client connected:",
          socket.id,
          "User:",
          userEmail,
          "Room:",
          `role:${userRole}`,
        );

        const lastSeen = await updateLastSeen(userId, true);
        socket.emit("user-online-synced");
        io.to(ADMIN_ROOM).emit("user-online", { userId, lastSeen });

        socket.on("disconnect", async (reason) => {
          const lastSeenOff = await updateLastSeen(userId, false);
          io.to(ADMIN_ROOM).emit("user-offline", {
            userId,
            lastSeen: lastSeenOff,
          });
        });

        socket.on("error", (error) => {
          console.error("Socket.IO error:", error);
        });
      });

      console.log(`Socket.IO available at http://localhost:${PORT || 3000}`);
    } catch (error) {
      console.warn(
        "Socket.IO not available. To enable Socket.IO, run: npm install socket.io",
      );
    }
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
