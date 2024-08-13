import { GraphQLError } from "graphql"
export const throwError = (message, code) => {
  if (!message) return new GraphQLError("An error occurred")
  if (!code) return new GraphQLError(message)
  return new GraphQLError(message, { extensions: { code: code } })
}
