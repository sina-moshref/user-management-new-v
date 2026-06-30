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

export async function updateMovieHandler(request, reply) {
  const { id } = request.params;
  const { name, rating, description, genre, duration, imageUrl } = request.body;

  const movie = await Movie.findByPk(id);
  if (!movie) return reply.code(404).send({ error: "Movie not found" });

  if (name !== undefined) movie.name = name.trim();
  if (rating !== undefined) {
    const r = Number(rating);
    if (r < 1 || r > 5) return reply.code(400).send({ error: "Rating must be between 1 and 5" });
    movie.rating = r;
  }
  if (description !== undefined) movie.description = description || null;
  if (genre !== undefined) movie.genre = genre || null;
  if (duration !== undefined) movie.duration = duration || null;
  if (imageUrl !== undefined) movie.imageUrl = imageUrl || null;

  await movie.save();
  return movie;
}

export async function deleteMovieHandler(request, reply) {
  const { id } = request.params;
  const movie = await Movie.findByPk(id);
  if (!movie) return reply.code(404).send({ error: "Movie not found" });
  await movie.destroy();
  return { ok: true };
}
