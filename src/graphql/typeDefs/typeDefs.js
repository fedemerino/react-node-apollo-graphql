export const typeDefs = `#graphql

#Books types
type Book {
  book_id: Int!
  title: String
  price: Float
  image_url: String
  author: Author
}

#Author types
type Author {
  id: Int!
  name: String
}

#Create a suscription for when a book changes its price
type BookPriceChanged {
  book_id: Int!
  price: Float!
}

type Subscription {
  bookPriceChanged(book_id: Int!): BookPriceChanged
}

type Query {
    books: [Book]
    book(id: Int!): Book
    authors: [Author]
    author(id: Int!): Author
}

type Mutation {
    createBook(title: String!, price: Float!, image_url: String, author_id: Int!): Book
    updateBook(book_id: Int!, title: String, price: Float, image_url: String, author_id: Int): Book
    deleteBook(book_id: Int!): Book
}

`
