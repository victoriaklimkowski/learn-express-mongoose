import { Response } from 'express';
import BookInstance, { IBookInstance } from '../models/bookinstance';

// Function to show all books with status "Available"
export const showAllBooksStatus = (res: Response): void => {
  // Available is a specific mongoose query/status term
  // Google for more info
  BookInstance.find({ status: { $eq: 'Available' } })
    .populate('book')
    .exec()
    .then((listBookInstances: IBookInstance[]) => {
      const results = listBookInstances.map((bookInstance: IBookInstance) => {
        return `${bookInstance.book.title} : ${bookInstance.status}`;
      });
      res.send(results);
    })
    .catch(err => res.send('Status not found'));
};
