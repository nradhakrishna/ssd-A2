# 3D Bowling Alley Game

A fully-featured 3D bowling game built with Three.js and Cannon.js, implementing official bowling rules and multiple game modes.

## Features

### 🎳 Realistic 3D Graphics
- **Three.js powered 3D graphics** with realistic bowling lane
- **10 bowling pins** in standard triangular formation
- **Dynamic lighting** and shadows
- **Smooth physics simulation** using Cannon.js
- **Realistic ball and pin collision** detection

### 🎮 Game Modes
1. **Traditional Singles Bowling**
   - 1 player
   - 3 games
   - Calculate 3-game average
   - Maximum score: 300 per game

2. **Unified Doubles Bowling**
   - Athlete + Unified Partner
   - Combined scores
   - Maximum score: 600 per game

3. **Unified Team Bowling**
   - 4 players (2 Athletes + 2 Partners)
   - Combined scores
   - Maximum score: 1200 per game

### 📊 Official Bowling Rules Implemented

#### Scoring
- **Strike (X)**: Knock down all 10 pins with first ball
  - Score = 10 + next 2 balls
- **Spare (/)**: Knock down remaining pins with second ball
  - Score = 10 + next 1 ball
- **Open Frame**: No strike or spare
  - Score = Total pins knocked down

#### Special 10th Frame Rules
- **Strike in 10th frame**: Get 2 bonus balls
- **Spare in 10th frame**: Get 1 bonus ball
- **Open frame in 10th**: No bonus balls

#### Game Structure
- **10 frames per game**
- **2 balls per frame** (except 10th frame)
- **3 games total** with average calculation
- **Foul line enforcement** (simulated)

### 🎯 Controls

#### Mouse Controls
- **Drag Mouse Left/Right**: Aim ball direction
- **Click & Hold**: Build power (longer hold = more power)
- **Release**: Throw ball

#### Keyboard Shortcuts
- **Space**: Reset camera view
- **R**: Start new game

#### Buttons
- **Throw Ball**: Execute throw
- **New Game**: Reset entire game
- **Next Game**: Start next game in 3-game series

## How to Play

### 1. Select Game Mode
Choose from the dropdown menu:
- Traditional Singles
- Unified Doubles
- Unified Team (4 Players)

### 2. Aim Your Shot
- Move your mouse left/right to aim
- The ball will move to show your aim direction
- Ball position indicates where it will start

### 3. Set Power
- Click and hold to build power
- Power meter increases with hold time
- Release to throw with that power level

### 4. Watch the Results
- Ball rolls down lane with realistic physics
- Pins knocked down are counted automatically
- Strike/Spare messages appear for special scores

### 5. Continue Playing
- Play through all 10 frames
- In multi-player modes, switch between players
- Complete 3 games for final average

## Scoring Examples

### Strike
```
Frame 1: X (all 10 pins first ball)
Frame 2: 7, 2 (7 pins, then 2 pins)
Frame 1 Score: 10 + 7 + 2 = 19
Frame 2 Score: 19 + 7 + 2 = 28
```

### Spare
```
Frame 1: 7, / (7 pins, then 3 pins)
Frame 2: 5, 3 (5 pins, then 3 pins)
Frame 1 Score: 10 + 5 = 15
Frame 2 Score: 15 + 5 + 3 = 23
```

### Open Frame
```
Frame 1: 7, 2 (7 pins, then 2 pins)
Frame 1 Score: 7 + 2 = 9
```

### Perfect Game (300)
```
12 strikes in a row (10 frames + 2 bonus in 10th)
X X X X X X X X X X X X
Score: 300
```

## Technical Details

### Technologies Used
- **Three.js r128**: 3D graphics rendering
- **Cannon.js 0.6.2**: Physics simulation
- **HTML5 Canvas**: Rendering target
- **CSS3**: Modern UI styling
- **Vanilla JavaScript**: Game logic

### Physics Implementation
- **Gravity**: -20 m/s² for realistic ball motion
- **Ball mass**: 7 kg (standard bowling ball)
- **Pin mass**: 1.5 kg (standard bowling pin)
- **Friction**: 0.3 for lane surface
- **Restitution**: 0.5 for bouncing
- **Collision detection**: Precise AABB and sphere collisions

### 3D Scene Components
1. **Bowling Lane**: 20 units long, wood texture
2. **Side Walls**: Prevent ball from going off lane
3. **10 Pins**: Cylindrical geometry in triangular formation
4. **Ball**: Spherical geometry with metallic material
5. **Lighting**: Ambient + directional + point lights
6. **Camera**: Perspective view from behind ball

### Game Logic Classes
- `BowlingGame`: Main game controller
- `Player`: Manages individual player state and scoring
- `Frame`: Represents a single frame with throws and score

## Official Rules Reference

### Lane Etiquette
- Bowl on your own lane
- Wait for adjacent lanes to finish
- Don't cross foul line (enforced in-game)
- Wear appropriate attire (visual theme applied)

### Scoring Validation
- Automatic calculation of strikes and spares
- Correct bonus ball handling
- Accurate 10th frame special rules
- Proper score accumulation across frames

### Game Modes Compliance
All three Special Olympics of Oklahoma (SOOK) bowling events are implemented:
1. ✅ Traditional Singles Bowling
2. ✅ Unified Doubles Bowling
3. ✅ Unified Team Bowling

## Tips for High Scores

1. **Aim for the Pocket**: Target between pin 1 and 3 (or 1 and 2)
2. **Consistent Power**: Use similar power levels for predictability
3. **Watch the Angle**: Small angle changes affect pin action greatly
4. **Practice Spares**: Converting spares is key to high scores
5. **Stay Behind Foul Line**: Foul line violations result in 0 pins

## Browser Compatibility

- ✅ Chrome 90+ (recommended)
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

**Note**: WebGL support required. Enable hardware acceleration for best performance.

## Performance Optimization

- Efficient physics simulation (60 FPS)
- Shadow map optimization
- Selective rendering updates
- Collision detection optimization
- Memory management for long play sessions

## Troubleshooting

### Ball Won't Throw
- Ensure you're clicking and holding, then releasing
- Check that current player hasn't completed their game
- Try clicking "Throw Ball" button

### Physics Looks Wrong
- Refresh the page to reset physics world
- Check that browser supports WebGL
- Ensure hardware acceleration is enabled

### Low FPS
- Close other browser tabs
- Reduce browser zoom level
- Check system resources
- Update graphics drivers

## Future Enhancements

Potential improvements:
- Ball spin controls for curves
- Multiple camera angles
- Replay system
- Statistics tracking across sessions
- Multiplayer over network
- Tournament mode
- Custom ball and pin designs
- Sound effects and music
- VR support

## Educational Value

This game demonstrates:
- **3D Graphics Programming**: Three.js scene management
- **Physics Simulation**: Cannon.js rigid body dynamics
- **Game Logic**: State machines and rule enforcement
- **Score Calculation**: Complex bowling scoring algorithm
- **UI/UX Design**: Intuitive controls and feedback
- **Object-Oriented Programming**: Classes and inheritance

## Credits

- **Three.js**: 3D graphics library
- **Cannon.js**: Physics engine
- **Bowling Rules**: Special Olympics of Oklahoma (SOOK)

## License

Free to use for educational purposes.

---

**🎳 Strike! Enjoy the game!** 🎳


