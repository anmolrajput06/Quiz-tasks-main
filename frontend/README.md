# Quiz Application Frontend

A React-based frontend for the Quiz Application with modern UI/UX design.

## Features

- User authentication (Login/Register)
- Interactive quiz interface with timer
- Real-time progress tracking
- Result summary with detailed review
- Quiz history and statistics
- Responsive design for all devices
- Modern UI with smooth animations

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running on port 5000

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will open in your browser at `http://localhost:3000`

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App

## Project Structure

```
src/
├── components/          # React components
│   ├── Login.js        # User login component
│   ├── Register.js     # User registration component
│   ├── Dashboard.js    # Main dashboard
│   ├── Quiz.js         # Quiz interface
│   ├── QuestionCard.js # Individual question display
│   ├── Timer.js        # Countdown timer
│   ├── Navigation.js   # Quiz navigation
│   ├── Result.js       # Quiz results display
│   ├── History.js      # Quiz history
│   └── ProtectedRoute.js # Route protection
├── contexts/           # React contexts
│   ├── AuthContext.js  # Authentication state
│   └── QuizContext.js  # Quiz state management
├── App.js             # Main app component
├── App.css            # App-specific styles
├── index.js           # App entry point
└── index.css          # Global styles
```

## Key Components

### Authentication
- **Login**: User login with email/password
- **Register**: New user registration
- **Protected Routes**: Authentication-required routes

### Quiz Interface
- **QuestionCard**: Displays question and answer options
- **Timer**: 10-minute countdown with visual indicators
- **Navigation**: Previous/Next/Submit buttons
- **Progress Bar**: Visual progress indicator

### Results & History
- **Result**: Detailed quiz results with answer review
- **History**: Past quiz attempts with statistics
- **Dashboard**: User statistics and quick access

## State Management

### AuthContext
- User authentication state
- Login/logout functionality
- Token management

### QuizContext
- Quiz questions and answers
- Timer state
- Navigation state
- Quiz submission

## Styling

- Modern CSS with flexbox and grid
- Responsive design for mobile/tablet/desktop
- Smooth animations and transitions
- Color-coded feedback (correct/incorrect answers)
- Gradient backgrounds and modern UI elements

## API Integration

- Axios for HTTP requests
- Automatic token handling
- Error handling and user feedback
- Proxy configuration for development

## Features

### Quiz Functionality
- 10 random questions per quiz
- 10-minute timer with auto-submit
- Answer selection and navigation
- Real-time progress tracking
- Immediate result calculation

### User Experience
- Intuitive navigation
- Visual feedback for all actions
- Responsive design
- Loading states and error handling
- Confirmation dialogs for important actions

### Data Management
- Local storage for authentication
- Context-based state management
- Automatic data synchronization
- History and statistics tracking

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

The app uses Create React App with the following features:
- Hot reloading in development
- ESLint for code quality
- Automatic browser opening
- Build optimization for production

## Production Build

To create a production build:

```bash
npm run build
```

This creates an optimized build in the `build` folder ready for deployment.
