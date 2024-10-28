import Book, { IBook } from '../models/book';
import Author from '../models/author';

// Is not practical here to use embedded so instead we use references
function getBooks() {
  return Book.find({}, 'title author')
    .sort({ title: 1 })  // 1 indicates ascending order
    .populate('author');
}

export const showBooks = async (): Promise<string[] | void> => {
  try {
    const books: IBook[] = await getBooks().exec();
    return books.map((b: IBook) => {
      const authorName = new Author(b.author).name; // Assuming 'Author' returns the author's name
      return `${b._id} : ${b.title} : ${authorName}`;
    });
  } catch (err) {
    console.log('Could not get books ' + err);
  }
}
