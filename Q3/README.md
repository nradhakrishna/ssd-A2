# Jigsaw Puzzle Game

A single-player jigsaw puzzle maker built with JavaScript, HTML, and CSS. Users can upload their own images and solve puzzles with varying difficulty levels.

## Features

- **Image Upload**: Upload any image file to use as a puzzle
- **Multiple Difficulty Levels**:
  - 5 Pieces (Easy)
  - 20 Pieces (Medium)
  - 40 Pieces (Hard)
  - 80 Pieces (Expert)
  - 100 Pieces (Master)
- **Drag and Drop Interface**: Intuitive drag and drop gameplay
- **Timer**: Track your solving time
- **Progress Tracking**: See how many pieces you've placed
- **Game Controls**:
  - Shuffle pieces randomly
  - Reset game to start over
  - Visual feedback for correct placements
- **Responsive Design**: Works on desktop and mobile devices

## How to Play

1. **Upload an Image**: Click on the file input and select an image from your device
2. **Choose Difficulty**: Select one of the five difficulty levels (5, 20, 40, 80, or 100 pieces)
3. **Start the Game**: Click "Start Puzzle" to begin
4. **Solve the Puzzle**: Drag pieces from the pieces area to their correct positions on the puzzle board
5. **Complete the Puzzle**: When all pieces are correctly placed, you'll see a completion message with your time

## Game Controls

- **Shuffle Pieces**: Randomly rearranges the remaining pieces in the pieces area
- **Reset Game**: Starts the game over with a fresh shuffle
- **Timer**: Automatically tracks your solving time

## Technical Details

### Technologies Used
- **HTML5**: Game structure and semantic markup
- **CSS3**: Styling, animations, and responsive design
- **Vanilla JavaScript**: Game logic, drag-and-drop functionality, and DOM manipulation

### Key Features Implemented
- Canvas-free image manipulation using CSS background positioning
- Dynamic puzzle piece generation based on image dimensions
- Collision detection for correct piece placement
- Real-time progress tracking and timer
- Mobile-responsive design with touch-friendly controls

### Browser Compatibility
- Modern browsers with HTML5 File API support
- Drag and Drop API support
- CSS Grid and Flexbox support

## File Structure

```
Q3/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and responsive design
├── script.js           # Game logic and functionality
└── README.md          # This documentation file
```

## Usage

Simply open `index.html` in a web browser to start playing. No server setup required - this is a client-side application that runs entirely in the browser.

## Tips for Better Performance

- Use images with reasonable dimensions (recommended: 800x600 or smaller for 100-piece puzzles)
- Clear your browser cache if you experience performance issues
- The game works best in modern browsers like Chrome, Firefox, Safari, or Edge

## Future Enhancements

Potential improvements for future versions:
- Puzzle piece rotation for increased difficulty
- Save/load game state using localStorage
- Multiple puzzle images and categories
- Hint system for struggling players
- Sound effects and background music
- Online leaderboard functionality
