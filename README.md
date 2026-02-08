# DrawBoard

DrawBoard is a collaborative real-time whiteboard and chat application built with a modern monorepo architecture. It features a scalable backend system with separate services for HTTP requests and WebSocket connections, ensuring high performance for real-time interactions.

## Key Features

- **Real-time Collaboration**: WebSocket-based communication for instant chat and room updates.
- **Room Management**: Create and join specific rooms for focused collaboration.
- **Secure Authentication**: User sign-up and sign-in with JWT authentication and password hashing.
- **Scalable Architecture**: Monorepo structure using Turborepo, separating concerns between HTTP and WebSocket services.
- **Type Safety**: Shared TypeScript types and Zod schemas across frontend and backend.

## Tech Stack

- **Monorepo Tool**: [Turborepo](https://turbo.build/)
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Frontend**: [Next.js 16](https://nextjs.org/) (React 19)
- **Backend (HTTP)**: [Express.js](https://expressjs.com/)
- **Backend (WebSocket)**: [ws](https://github.com/websockets/ws)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Validation**: [Zod](https://zod.dev/)
- **Authentication**: JWT & Bcrypt

## Architecture Overview

The project is structured as a monorepo containing multiple applications and shared packages:

- **HTTP Backend**: Handles REST API requests for user authentication, room creation, and retrieving message history.
- **WebSocket Backend**: Manages real-time connections, handling events like joining rooms, leaving rooms, and broadcasting chat messages.
- **Web Frontend**: A Next.js application (currently in initial setup phase) to interact with the backends.
- **Database**: A shared PostgreSQL instance managed via Prisma in a dedicated package.

## Folder Structure

```
├── apps
│   ├── http-backend    # Express server for REST API
│   ├── ws-backend      # WebSocket server for real-time events
│   └── web             # Next.js frontend application
├── packages
│   ├── db              # Prisma client and schema
│   ├── common          # Shared Zod schemas and types
│   ├── backend-common  # Shared backend configurations (e.g., secrets)
│   ├── ui              # Shared React component library
│   ├── eslint-config   # Shared ESLint configurations
│   └── typescript-config # Shared TS configurations
└── package.json        # Root configuration
```

## Installation & Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) (v9.0.0 or higher recommended)
- [PostgreSQL](https://www.postgresql.org/) database

### Steps

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Rushi-04/DrawBoard.git
    cd DrawBoard
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Environment Setup:**
    Configure the environment variables. You will need `.env` files in specific directories.

    **`packages/db/.env`** (Required for Database connection)
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/drawboard"
    ```

    **`apps/http-backend/.env`** (Optional, defaults exist in config)
    ```env
    # JWT_SECRET is imported from @repo/backend-common
    ```

4.  **Database Migration:**
    Push the Prisma schema to your PostgreSQL database.
    ```bash
    # Run from the root or within packages/db
    pnpm db:push
    # Or generate the client
    pnpm db:generate
    ```

5.  **Run the Project:**
    To run all applications (HTTP backend, WS backend, Web frontend) simultaneously:
    ```bash
    pnpm dev
    ```

    This command uses Turbo to run the `dev` script in all apps.

## Environment Variables

| Variable Name | Description | Required | Location |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string | Yes | `packages/db/.env` |
| `JWT_SECRET` | Secret key for signing tokens | Yes (Managed in `backend-common`) | `packages/backend-common/run-time` |

*Note: The `JWT_SECRET` is currently hardcoded with a fallback in `packages/backend-common/src/config.ts` if `process.env.JWT_SECRET` is not set. For production, ensure `JWT_SECRET` is set in your environment.*

## Running the Project

-   **Development Mode:**
    ```bash
    pnpm dev
    ```
    -   HTTP Backend: `http://localhost:3001`
    -   WS Backend: `ws://localhost:8080`
    -   Web Frontend: `http://localhost:3000`

-   **Build:**
    ```bash
    pnpm build
    ```

## API Documentation

### HTTP Endpoints (Port 3001)

#### Auth
-   **POST** `/signup`
    -   **Body**: `{ "username": "user", "password": "Password123", "email": "user@example.com" }`
    -   **Response**: `{ "msg": "User created successfully", "user": <id> }`
-   **POST** `/signin`
    -   **Body**: `{ "username": "user", "password": "Password123" }`
    -   **Response**: `{ "msg": "User signedIn", "token": "<jwt_token>" }`

#### Rooms
-   **POST** `/room` (Headers: `Authorization: <token>`)
    -   **Body**: `{ "room": "my-room-name" }`
    -   **Response**: `{ "msg": "Room created successfully", "roomId": <id> }`
-   **GET** `/chats/:roomId`
    -   **Response**: Returns the last 30 messages for the room.

### WebSocket Events (Port 8080)

Connect URL: `ws://localhost:8080?token=<jwt_token>`

#### Server Messages
-   **Chat**: Received when a user sends a message in a room.
    ```json
    {
      "type": "chat",
      "payload": {
        "message": "Hello World",
        "roomId": 123
      }
    }
    ```

#### Client Messages
-   **Join Room**:
    ```json
    {
      "type": "join_room",
      "payload": { "roomId": "123" }
    }
    ```
-   **Leave Room**:
    ```json
    {
      "type": "leave_room",
      "payload": { "roomId": "123" }
    }
    ```
-   **Send Chat**:
    ```json
    {
      "type": "chat",
      "payload": { "message": "Hello", "roomId": "123" }
    }
    ```

## Database Schema

The core models defined in `packages/db/prisma/schema.prisma`:

-   **User**: Stores user credentials and profile.
-   **Room**: Represents a collaborative space/channel.
-   **Message**: Stores chat history linked to a User and a Room.

## Contributing

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add some amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.

## License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).
