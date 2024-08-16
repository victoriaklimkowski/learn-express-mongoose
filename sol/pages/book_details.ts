import { Request, Response } from 'express';
import Book, { IBook }  from '../models/book';
import BookInstance, { IBookInstance }  from '../models/bookinstance';


// Function to get a book by ID
async function getBook(id: string): Promise<IBook | null> {
  if (typeof id !== 'string') {
    return null;
  }
  return Book.findOne({ _id: id }).populate('author').exec();
}

// Function to get book details
async function getBookDtl(id: string): Promise<IBookInstance[]> {
  return BookInstance.find({ book: id }).select('imprint status').exec();
}

// Function to handle showing book details
export const showBookDtls = async (res: Response, id: string): Promise<void> => {
  try {
    const [book, copies] = await Promise.all([
      getBook(id),
      getBookDtl(id)
    ]);

    if (!book) {
      res.status(404).send(`Book ${id} not found`);
      return;
    }

    res.send({
      title: book.title,
      author: book.author.name,
      copies: copies
    });
  } catch (err) {
    res.status(500).send(`Error fetching book ${id}`);
  }
};


// async.parallel([
  //   function(callback) {
  //     callback(null, get_book(id));
  //   },
  //   function(callback) {
  //     callback(null, get_book_dtl(id));
  //   }
  // ],
  // async function(err, results) {
  //   if(err) {
  //     res.send(`Book ${id} not found`);
  //     return;
  //   }
  //   try {
  //     let book = await results[0].exec();
  //     let copies = await results[1].exec();
  //     res.send({
  //       title: book.title,
  //       author: book.author.name,
  //       copies: copies,
  //     });
  //   }
  //   catch(err) {
  //     res.send(`Book ${id} not found`);
  //   }
  // });

// let book = await get_book(id).exec();
// let book_dtl = await get_book_dtl(id).exec();
// if(book && book_dtl)
//   console.log({
//     title: book.title,
//     summary: book.summary,
//     author: book.author.name,
//     copies: book_dtl.map(function(b) {
//       return {
//         imprint: b.imprint,
//         status: b.status
//       }
//     })
//   });
// else console.log('Book not found ' + id);
