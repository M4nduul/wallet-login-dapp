# WALLET LOGIN DAPP


## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine.
- [Docker](https://www.docker.com/) installed for running the database.

## Download required packages
### Frontend
```bash
cd frontend
yarn install # or npm install
```
### Backend
```bash
cd /backend
yarn install # or npm install
```
## Running the Application
### Backend
Start the database and backend services using Docker Compose:
```bash
cd /backend
docker-compose up
```

### Frontend
Start the frontend application:
```bash
cd /frontend
yarn start
```
This will run the app locally, and you can access it at http://localhost:3000 in your web browser.
