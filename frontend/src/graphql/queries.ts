import { gql } from "@apollo/client"

export const GET_BOOKS = gql`
  query GetBooks {
    books {
      book_id
      title
      price
      image_url
    }
  }
`
