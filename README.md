# Pet Media Manager

A full-stack application for managing pet media files.

## Backend

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=4000
   MONGODB_URI=mongodb://localhost:27017/pet-media-manager
   JWT_SECRET=your-secret-key
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

### API Documentation

The GraphQL API is available at `http://localhost:4000/graphql`.

#### Queries

- `files`: Get all files for the authenticated user
- `file(id: ID!)`: Get a specific file by ID
- `me`: Get the current authenticated user

#### Mutations

- `signUp(email: String!, password: String!)`: Register a new user
- `signIn(email: String!, password: String!)`: Login a user
- `uploadFile(file: Upload!)`: Upload a new file
- `deleteFile(id: ID!)`: Delete a file

## Frontend

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## License

MIT 