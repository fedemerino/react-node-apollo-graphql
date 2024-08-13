import { gql } from "@apollo/client"

export const UPDATE_BOOK = gql`#graphql
  mutation UpdateBook($book_id: Int!, $price: Float!) {
    updateBook(book_id: $book_id, price: $price) {
      book_id
      title
      price
    }
  }
`

