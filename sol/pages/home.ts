import { Response } from 'express';
import Book from '../models/book';
import Author from '../models/author';
import BookInstance from '../models/bookinstance';
import Genre from '../models/genre';

export async function show_home(res: Response): Promise<void> {
  try {
    const booksCount = await Book.countDocuments({}).exec();
    const copiesCount = await BookInstance.countDocuments({}).exec();
    const availableCount = await BookInstance.countDocuments({ status: 'Available' }).exec();
    const authorsCount = await Author.countDocuments({}).exec();
    const genresCount = await Genre.countDocuments({}).exec();

    const msg = `
      <div>
        <p>Books: ${booksCount}</p>
        <p>Copies: ${copiesCount}</p>
        <p>Copies Available: ${availableCount}</p>
        <p>Authors: ${authorsCount}</p>
        <p>Genres: ${genresCount}</p>
      </div>
    `;
    res.send(msg);
  } catch (err: unknown) {
    res.status(500).send('Error retrieving home data: ' + (err as Error).message);
  }
}