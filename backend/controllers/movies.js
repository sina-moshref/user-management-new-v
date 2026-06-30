import Movie from "../models/Movie.js";

export async function listMoviesHandler(request, reply) {
  const movies = await Movie.findAll({
    order: [["created_at", "DESC"]],
  });
  return { movies };
}

export async function createMovieHandler(request, reply) {
  const { name, rating, description, genre, duration, imageUrl } = request.body;

  if (!name || !name.trim()) {
    return reply.code(400).send({ error: "Name is required" });
  }
  const r = Number(rating);
  if (!r || r < 1 || r > 5) {
    return reply.code(400).send({ error: "Rating must be between 1 and 5" });
  }

  const movie = await Movie.create({
    name: name.trim(),
    rating: r,
    description: description || null,
    genre: genre || null,
    duration: duration || null,
    imageUrl: imageUrl || null,
  });

  return reply.code(201).send(movie);
}
