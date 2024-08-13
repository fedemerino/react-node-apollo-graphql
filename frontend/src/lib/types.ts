export interface Author {
  author_id: number
  name: string
}

export interface Book {
  book_id: number
  title: string
  price: number
  image_url: string
  author?: Author
}
