import { Book } from "../lib/types"
import { useSubscription, useMutation } from "@apollo/client"
import { BOOK_PRICE_CHANGED } from "../graphql/subscriptions"
import { UPDATE_BOOK } from "../graphql/mutations"
import { useState } from "react"

export const BookCard = ({
  book,
  setBooks,
}: {
  book: Book
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>
}) => {
  const [edit, setEdit] = useState<boolean>(false)
  const [bookPrice, setBookPrice] = useState<number>(book.price)
  const [updateBook] = useMutation(UPDATE_BOOK)
  useSubscription(BOOK_PRICE_CHANGED, {
    variables: { book_id: book.book_id },
    onSubscriptionData: ({ subscriptionData }) => {
      const updatedBook = subscriptionData.data.bookPriceChanged
      setBooks((prevBooks) => {
        const updatedBooks = prevBooks.map((book) => {
          if (book.book_id === updatedBook.book_id) {
            return { ...book, price: updatedBook.price }
          }
          return book
        })
        return updatedBooks
      })
    },
  })

  const handleEdit = () => {
    if (edit) {
      updateBook({
        variables: {
          book_id: book.book_id,
          price: bookPrice,
        },
      })
    }
    setEdit(!edit)
  }

  return (
    <div className="bg-gray-100 p-4 rounded-md">
      <div className="flex justify-center">
        <img
          src={book.image_url}
          alt={book.title}
          className="w-48 h-48 object-cover"
        />
      </div>
      <h2 className="pt-2">{book.title}</h2>
      <p>${book.price}</p>
      {book.author && <p>{book.author.name}</p>}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
        onClick={() => handleEdit()}
      >
        {edit ? "Guardar" : "Editar Precio"}
      </button>
      {edit && (
        <input
          type="number"
          value={bookPrice}
          onChange={(e) => setBookPrice(parseFloat(e.target.value))}
          className="w-full p-2 mt-2"
        />
      )}
    </div>
  )
}
