# React-Node-Apollo-GraphQL

## Overview

The goal of this project is to try out GraphQL subscriptions with Node.js and Apollo Server, accompanied by a React frontend using Apollo Client. The main feature of this application is the ability to display a list of books and dynamically update their prices, which automatically refreshes across all connected clients.

## Technologies

- **Backend**: Node.js, Express, GraphQL, Apollo Server
- **Frontend**: React, Apollo Client
- **Database**: MySQL (using Docker)
- **Other**: Docker, Docker Compose

## Requirements

- **Node.js**: v20+
- **Docker**
- **Docker Compose**

## Installation

1. **Clone the repository**:
 ```bash
   git clone https://github.com/fedemerino/react-node-apollo-graphql.git
   cd react-node-apollo-graphql
```
2. **Install backend dependencies**:
 ```bash
   npm install
```
3. **Install backend dependencies**:
 ```bash
   npm install
```
4. **Run the development servers**:
- Backend:
 ```bash
   npm run dev
```
- Frontend:
 ```bash
   cd frontend/
   npm run dev
```
5. **Start MySQL container with Docker**:
 ```bash
   docker compose up -d
```

## Seeders

Database seeders are coming soon. You can create you own tables based on the typeDefs and Resolvers logic.