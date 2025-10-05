# Stoplight Game - Nash Equilibrium Demonstration

A two-player game (Human vs Computer) that demonstrates Game Theory concepts, specifically **Nash Equilibrium**, through an interactive stoplight scenario.

## Game Overview

The Stoplight Game is a classic example in Game Theory where two players (cars at an intersection) must decide whether to **Go** or **Stop**. The game illustrates how strategic decision-making leads to different outcomes and demonstrates the concept of Nash Equilibrium.

## Game Rules

### Players
- **Human**: You, the player making conscious choices
- **Computer**: AI player making random choices

### Choices
Each player can choose:
- **Go**: Proceed through the intersection
- **Stop**: Wait at the intersection

### Payoff Matrix

The outcomes are determined by the combination of both players' choices:

| Human \ Computer | Computer: Go | Computer: Stop |
|------------------|--------------|----------------|
| **Human: Go**    | (-10, -10) Collision 💥 | (5, 2) Human goes safely ✅ |
| **Human: Stop**  | (2, 5) Computer goes safely ✅ | (0, 0) Deadlock ⏸️ |

**Notation**: (Human Payoff, Computer Payoff)

### Outcomes Explained

1. **Collision (Go, Go)**: Both players go - they crash! Both receive -10 points (worst outcome)
2. **Human Goes (Go, Stop)**: Human goes while Computer waits - Human gets 5 points, Computer gets 2
3. **Computer Goes (Stop, Go)**: Computer goes while Human waits - Computer gets 5 points, Human gets 2
4. **Deadlock (Stop, Stop)**: Both players stop - no one moves, both get 0 points

## Nash Equilibrium

### What is Nash Equilibrium?

A **Nash Equilibrium** is a situation where no player can improve their payoff by unilaterally changing their strategy while the other player keeps their strategy unchanged.

### Nash Equilibria in This Game

This game has **two pure strategy Nash Equilibria**:

1. **(Go, Stop)** - Human goes, Computer stops: Payoff (5, 2)
   - If Human changes to Stop: payoff becomes (0, 0) - worse for Human ❌
   - If Computer changes to Go: payoff becomes (-10, -10) - worse for Computer ❌
   - Neither player benefits from changing alone ✓

2. **(Stop, Go)** - Human stops, Computer goes: Payoff (2, 5)
   - If Human changes to Go: payoff becomes (-10, -10) - worse for Human ❌
   - If Computer changes to Stop: payoff becomes (0, 0) - worse for Computer ❌
   - Neither player benefits from changing alone ✓

### Why Other Outcomes Are NOT Nash Equilibria

- **(Go, Go)**: Both would benefit by changing to Stop (0 > -10)
- **(Stop, Stop)**: Either player would benefit by changing to Go (5 > 0 or 2 > 0)

## Features

### Gameplay
- **Manual Choice**: Click "Go" or "Stop" buttons to make your choice
- **Auto-Play**: Let the computer randomly choose for you
- **Visual Feedback**: See both choices and outcomes with emojis and colors
- **Nash Indicator**: Special highlight when Nash Equilibrium is achieved

### Statistics Tracking
- **Total Rounds**: Number of games played
- **Nash Equilibria**: How many times Nash Equilibrium was achieved
- **Collisions**: Number of (Go, Go) outcomes
- **Deadlocks**: Number of (Stop, Stop) outcomes
- **Cumulative Scores**: Running total of points for both players

### User Interface
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Color-Coded Results**: Easy-to-read outcome displays
- **Animated Feedback**: Smooth transitions and visual effects
- **Reset Options**: Reset individual rounds or all statistics

## How to Play

1. **Open the Game**: Open `index.html` in any modern web browser
2. **Read the Rules**: Review the payoff matrix and Nash Equilibrium explanation
3. **Make Your Choice**: 
   - Click "Go" (🟢) to proceed
   - Click "Stop" (🔴) to wait
   - Or click "Let Computer Decide for Me" for random choice
4. **View Results**: See the outcome, payoffs, and whether it's a Nash Equilibrium
5. **Play Again**: Click "Play Again" to start a new round
6. **Track Progress**: Monitor statistics to see patterns and strategies

## Technical Details

### Technologies Used
- **HTML5**: Semantic structure and accessibility
- **CSS3**: Modern styling with gradients, animations, and responsive design
- **Vanilla JavaScript**: Game logic, DOM manipulation, and event handling

### Code Structure

#### HTML (`index.html`)
- Comprehensive comments explaining each element
- Semantic HTML5 tags
- Accessible form controls

#### CSS (`styles.css`)
- Detailed comments for each style rule
- Responsive design with media queries
- CSS animations and transitions

#### JavaScript (`script.js`)
- Extensive line-by-line comments
- Object-oriented game state management
- Pure functions for game logic
- Event-driven architecture

### Key Functions

- `getRandomChoice()`: Generates random computer choices
- `playRound(humanChoice)`: Executes a game round
- `calculatePayoffs()`: Computes payoffs using the matrix
- `checkNashEquilibrium()`: Determines if outcome is Nash Equilibrium
- `updateStatistics()`: Tracks and displays game statistics

## Learning Objectives

### Game Theory Concepts
1. **Strategic Interaction**: Understanding how one player's decision affects another
2. **Payoff Matrix**: Visual representation of all possible outcomes
3. **Nash Equilibrium**: Finding stable strategy combinations
4. **Dominant Strategies**: Analyzing best responses
5. **Mixed Strategies**: Understanding probabilistic choices

### Insights from Playing

- **Coordination Problem**: Players must coordinate to avoid collision and deadlock
- **Multiple Equilibria**: Two Nash Equilibria create uncertainty
- **No Pure Dominant Strategy**: Neither Go nor Stop is always best
- **Random Outcomes**: With random computer choices, observe equilibrium frequency

## Educational Value

This game demonstrates:
- How rational players make decisions in competitive situations
- Why Nash Equilibrium is important in economics, politics, and social behavior
- Real-world applications: traffic management, resource allocation, business competition
- The difference between Pareto optimal and Nash equilibrium outcomes

## Extensions and Variations

Potential enhancements for further learning:
1. **Mixed Strategy Calculator**: Show optimal randomization probabilities
2. **Best Response Analysis**: Highlight best responses to each strategy
3. **Repeated Games**: Implement multiple rounds with memory
4. **Learning AI**: Computer that adapts to human patterns
5. **Three Players**: Extend to more complex scenarios
6. **Custom Payoffs**: Allow users to modify the payoff matrix

## File Structure

```
Q4/
├── index.html          # Main HTML structure with comments
├── styles.css          # CSS styling with detailed comments
├── script.js           # JavaScript game logic with line-by-line comments
└── README.md          # This documentation file
```

## Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## References

- Nash, J. (1950). "Equilibrium points in n-person games"
- Osborne, M. J. (2004). "An Introduction to Game Theory"
- Traffic game examples in behavioral economics

## Author Notes

This implementation uses pure JavaScript with extensive comments to make the code accessible for learning. Every line is explained to help students understand both the programming concepts and the game theory principles being demonstrated.

---

**Have fun exploring Nash Equilibrium!** 🎮✨



