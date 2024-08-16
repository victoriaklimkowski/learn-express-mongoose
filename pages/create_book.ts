import { Request, Response } from 'express';
import Book, { IBook } from '../models/book';
import Author, { IAuthor } from '../models/author';
import Genre, { IGenre } from '../models/genre';
import { Document } from 'mongoose';

// Define the types for the functions that interact with the database.
async function getAuthor(family_name: string, first_name: string): Promise<Document<unknown, {}, IAuthor> & IAuthor> {
  return Author.findOne({ family_name, first_name }).exec() as Promise<Document<unknown, {}, IAuthor> & IAuthor>;
}

async function getGenre(name: string): Promise<Document<unknown, {}, IGenre>[]> {
  return Genre.find({ name }).exec() as Promise<Document<unknown, {}, IGenre>[]>;
}

// Function to create a new book
export async function new_book(
  res: Response,
  family_name: string,
  first_name: string,
  genre_name: string,
  title: string
): Promise<void> {
  try {
    const author = await getAuthor(family_name, first_name);
    const genre = await getGenre(genre_name);
    const book = new Book({
      title,
      summary: 'Demo Summary to be updated later',
      author: author._id,
      isbn: 'ISBN2022',
      genre: genre.map(g => g._id)
    });

    await book.save();
    res.send('Created new book: ' + book);
  } catch (err: unknown) {
    res.status(500).send('Error creating book: ' + (err as Error).message);
  }
}