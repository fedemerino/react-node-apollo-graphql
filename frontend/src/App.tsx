import { useQuery } from "@apollo/client"
import { GET_BOOKS } from "./graphql/queries"
import { Book } from "./lib/types"
import { useState, useEffect } from "react"
import { BookCard } from "./components/BookCard"

export default function App() {
  const { loading, error, data } = useQuery(GET_BOOKS)
  const [books, setBooks] = useState<Book[]>([])
  useEffect(() => {
    if (data) {
      setBooks(data.books)
    }
  }, [data])

  return (
    <div className="min-h-screen w-screen flex flex-col items-center mt-10">
      <h1>Books</h1>
      {books && (
        <div className="flex flex-wrap gap-4 mt-5">
          {books.map((book: Book) => (
            <BookCard key={book.book_id} book={book} setBooks={setBooks} />
          ))}
        </div>
      )}
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
    </div>
  )
}
