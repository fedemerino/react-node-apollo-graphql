import { pool } from "../../config/db.js"
import { MISING_INPUT_FIELDS } from "../../utils/errors.js"
import { throwError } from "../../utils/throwError.js"
import { logger } from "../../config/logger.js"
import { PubSub } from "graphql-subscriptions"

const pubsub = new PubSub()
export const resolvers = {
  Query: {
    books: async (parent, args) => {
      try {
        const [rows] = await pool.query("SELECT * FROM books")
        return rows
      } catch (error) {
        logger.error(error)
      }
    },
    book: async (parent, args) => {
      try {
        const [rows] = await pool.query("SELECT * FROM books WHERE id = ?", [
          args.id,
        ])
        return rows[0]
      } catch (error) {
        logger.error(error)
      }
    },
    authors: async (parent, args) => {
      try {
        const [rows] = await pool.query("SELECT * FROM authors")
        return rows
      } catch (error) {
        logger.error(error)
      }
    },
  },
  Mutation: {
    createBook: async (parent, args) => {
      try {
        const { title, price, image_url, author_id } = args
        if (!title || !price || !author_id) {
          throwError("Please provide all required fields", MISING_INPUT_FIELDS)
        }
        const [rows] = await pool.query(
          "INSERT INTO books(title, price, image_url, fk_author_id) VALUES(?,?,?,?)",
          [title, price, image_url, author_id]
        )
        return {
          book_id: rows.insertId,
          title,
          price,
          image_url,
          author_id,
        }
      } catch (error) {
        logger.error(error)
      }
    },
    updateBook: async (parent, args) => {
      try {
        const { title, price, image_url, author_id, book_id } = args
        if (!book_id) {
          throwError("Please provide a book id", MISING_INPUT_FIELDS)
        }
        const params = []
        let query = "UPDATE books SET "
        if (title) {
          query += "title = ?, "
          params.push(title)
        }
        if (price) {
          query += "price = ?, "
          params.push(price)
          pubsub.publish(`BOOK_PRICE_CHANGED${book_id}`, {
            bookPriceChanged: {
              book_id,
              price,
            },
          })
        }
        if (image_url) {
          query += "image_url = ?, "
          params.push(image_url)
        }
        if (author_id) {
          query += "fk_author_id = ?, "
          params.push(author_id)
        }
        query = query.slice(0, -2)
        query += " WHERE book_id = ?"
        params.push(book_id)

        await pool.query(query, params)
        return {
          book_id,
          title,
          price,
          image_url,
          author_id,
        }
      } catch (error) {
        logger.error(error)
      }
    },
    deleteBook: async (parent, args) => {
      try {
        const { book_id } = args
        if (!book_id) {
          throwError("Please provide a book id", MISING_INPUT_FIELDS)
        }
        await pool.query("DELETE FROM books WHERE book_id = ?", [book_id])
        return {
          book_id,
        }
      } catch (error) {
        logger.error(error)
      }
    },
  },
  Subscription: {
    bookPriceChanged: {
      subscribe: async (parent, { book_id }) =>
        pubsub.asyncIterator(`BOOK_PRICE_CHANGED${book_id}`),
    },
  },
}
