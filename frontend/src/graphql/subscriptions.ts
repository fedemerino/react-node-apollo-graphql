import { gql } from '@apollo/client';

export const BOOK_PRICE_CHANGED = gql`
  subscription BookPriceChanged($book_id: Int!) {
    bookPriceChanged(book_id: $book_id) {
      book_id
      price
    }
  }
`;
