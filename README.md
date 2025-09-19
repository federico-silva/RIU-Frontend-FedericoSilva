# Superhero Management Application Challenge

A complete CRUD (Create, Read, Update, Delete) application built with Angular 20 and Angular Material.

## Technologies Used

- **Angular 20**
- **Angular Material 20.2.3**
- **Docker**

## Prerequisites

Before running this project, make sure you have:

- **Node.js 20+**: [Download here](https://nodejs.org/)
- **npm**: Comes with Node.js
- **Angular CLI**: Install globally with `npm install -g @angular/cli`
- **Docker** (optional): [Download here](https://www.docker.com/)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/federico-silva/RIU-Frontend-FedericoSilva
cd riu-frontend-federico-silva
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Development Server

Start the development server:

```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/` in your browser. The application will automatically reload when you make changes to the source files.

### 4. Build for Production

Create a production build:

```bash
npm run build
# or
ng build
```

The build artifacts will be stored in the `dist/` directory.

## Docker Deployment

### Build and Run with Docker

1. **Build the Docker image**:
```bash
docker build -t superheroes-crud .
```

2. **Run the container**:
```bash
docker run -p 8080:80 superheroes-crud
```

3. **Access the application**:
Open your browser and navigate to `http://localhost:8080`

## Testing

### Run Unit Tests

Execute the unit tests via Karma:

```bash
npm test
# or
ng test
```

### Test Coverage

Generate test coverage report:

```bash
ng test --code-coverage
```

Coverage reports will be available in the `coverage/` directory.
