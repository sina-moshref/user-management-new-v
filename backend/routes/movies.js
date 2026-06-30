import { listMoviesHandler, createMovieHandler } from "../controllers/movies.js";

const listMoviesOptions = {
  schema: {
    security: [{ bearerAuth: [] }],
    response: {
      200: {
        type: "object",
        properties: {
          movies: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                rating: { type: "integer" },
                description: { type: "string" },
                genre: { type: "string" },
                duration: { type: "string" },
                imageUrl: { type: "string" },
                createdAt: { type: "string" },
              },
            },
          },
        },
      },
    },
  },
  handler: listMoviesHandler,
};

const createMovieOptions = {
  schema: {
    security: [{ bearerAuth: [] }],
    body: {
      type: "object",
      required: ["name", "rating"],
      properties: {
        name: { type: "string", minLength: 1 },
        rating: { type: "integer", minimum: 1, maximum: 5 },
        description: { type: "string" },
        genre: { type: "string" },
        duration: { type: "string" },
        imageUrl: { type: "string" },
      },
    },
    response: {
      201: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          rating: { type: "integer" },
          description: { type: "string" },
          genre: { type: "string" },
          duration: { type: "string" },
          imageUrl: { type: "string" },
          createdAt: { type: "string" },
        },
      },
    },
  },
  handler: createMovieHandler,
};

export async function moviesRoutes(fastify) {
  fastify.get("/movies", {
    ...listMoviesOptions,
    preHandler: [
      fastify.authenticate,
      fastify.requireRoles(["admin", "moderator", "user"]),
    ],
  });

  fastify.post("/movies", {
    ...createMovieOptions,
    preHandler: [
      fastify.authenticate,
      fastify.requireRoles(["admin", "moderator"]),
    ],
  });
}
