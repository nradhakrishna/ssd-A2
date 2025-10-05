// 3D Bowling Alley Game using Three.js and Cannon.js
// Complete implementation with physics, scoring, and multiple game modes

class BowlingGame {
    constructor() {
        // Game state
        this.gameMode = 'singles'; // singles, doubles, team
        this.currentPlayerIndex = 0;
        this.players = [];
        this.currentGameNumber = 1;
        this.maxGames = 3;
        
        // Three.js scene elements
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.ball = null;
        this.pins = [];
        
        // Cannon.js physics world
        this.world = null;
        this.ballBody = null;
        this.pinBodies = [];
        
        // Game control
        this.isThrowing = false;
        this.ballThrown = false;
        this.powerLevel = 0;
        this.aimAngle = 0;
        this.mouseDown = false;
        this.mouseDownTime = 0;
        
        this.init();
    }
    
    init() {
        this.setupPlayers();
        this.setupThreeJS();
        this.setupPhysics();
        this.createLane();
        this.createPins();
        this.createBall();
        this.setupLights();
        this.setupControls();
        this.updateScoreboard();
        this.animate();
        
        // Hide loading screen
        document.getElementById('loadingScreen').style.display = 'none';
    }
    
    setupPlayers() {
        // Get game mode
        const mode = document.getElementById('gameModeSelect').value;
        this.gameMode = mode;
        
        this.players = [];
        
        // Create players based on mode
        if (mode === 'singles') {
            this.players = [new Player('Player 1')];
        } else if (mode === 'doubles') {
            this.players = [
                new Player('Athlete'),
                new Player('Partner')
            ];
        } else if (mode === 'team') {
            this.players = [
                new Player('Athlete 1'),
                new Player('Athlete 2'),
                new Player('Partner 1'),
                new Player('Partner 2')
            ];
        }
        
        // Setup player selector for multi-player modes
        if (this.players.length > 1) {
            const selector = document.getElementById('playerSelector');
            selector.style.display = 'block';
            
            const select = document.getElementById('currentPlayerSelect');
            select.innerHTML = '';
            this.players.forEach((player, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = player.name;
                select.appendChild(option);
            });
            
            select.addEventListener('change', (e) => {
                this.currentPlayerIndex = parseInt(e.target.value);
            });
        } else {
            document.getElementById('playerSelector').style.display = 'none';
        }
    }
    
    setupThreeJS() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e);
        this.scene.fog = new THREE.Fog(0x1a1a2e, 10, 50);
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 3, -8);
        this.camera.lookAt(0, 0, 0);
        
        // Create renderer
        const canvas = document.getElementById('gameCanvas');
        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    setupPhysics() {
        // Create physics world
        this.world = new CANNON.World();
        this.world.gravity.set(0, -20, 0);
        this.world.broadphase = new CANNON.NaiveBroadphase();
        this.world.solver.iterations = 10;
        
        // Add contact material for realistic collisions
        const defaultMaterial = new CANNON.Material('default');
        const contactMaterial = new CANNON.ContactMaterial(
            defaultMaterial,
            defaultMaterial,
            {
                friction: 0.3,
                restitution: 0.5
            }
        );
        this.world.addContactMaterial(contactMaterial);
    }
    
    createLane() {
        // Create bowling lane floor
        const laneGeometry = new THREE.PlaneGeometry(2, 20);
        const laneMaterial = new THREE.MeshStandardMaterial({
            color: 0xd4a574,
            roughness: 0.3,
            metalness: 0.1
        });
        const lane = new THREE.Mesh(laneGeometry, laneMaterial);
        lane.rotation.x = -Math.PI / 2;
        lane.receiveShadow = true;
        this.scene.add(lane);
        
        // Add lane markings
        this.addLaneMarkings();
        
        // Create side walls
        this.createWalls();
        
        // Create physics floor
        const floorShape = new CANNON.Plane();
        const floorBody = new CANNON.Body({ mass: 0 });
        floorBody.addShape(floorShape);
        floorBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
        this.world.addBody(floorBody);
    }
    
    addLaneMarkings() {
        // Add arrows and dots on lane
        for (let i = 0; i < 5; i++) {
            const markerGeometry = new THREE.CircleGeometry(0.05, 16);
            const markerMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
            const marker = new THREE.Mesh(markerGeometry, markerMaterial);
            marker.rotation.x = -Math.PI / 2;
            marker.position.set((i - 2) * 0.4, 0.01, i * 2 - 3);
            this.scene.add(marker);
        }
        
        // Foul line
        const foulLineGeometry = new THREE.PlaneGeometry(2, 0.05);
        const foulLineMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const foulLine = new THREE.Mesh(foulLineGeometry, foulLineMaterial);
        foulLine.rotation.x = -Math.PI / 2;
        foulLine.position.set(0, 0.01, -7);
        this.scene.add(foulLine);
    }
    
    createWalls() {
        // Left wall
        const wallGeometry = new THREE.BoxGeometry(0.2, 0.5, 20);
        const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x16213e });
        
        const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
        leftWall.position.set(-1.1, 0.25, 0);
        leftWall.castShadow = true;
        this.scene.add(leftWall);
        
        const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
        rightWall.position.set(1.1, 0.25, 0);
        rightWall.castShadow = true;
        this.scene.add(rightWall);
        
        // Physics walls
        const wallShape = new CANNON.Box(new CANNON.Vec3(0.1, 0.5, 10));
        const leftWallBody = new CANNON.Body({ mass: 0 });
        leftWallBody.addShape(wallShape);
        leftWallBody.position.set(-1.1, 0.25, 0);
        this.world.addBody(leftWallBody);
        
        const rightWallBody = new CANNON.Body({ mass: 0 });
        rightWallBody.addShape(wallShape);
        rightWallBody.position.set(1.1, 0.25, 0);
        this.world.addBody(rightWallBody);
    }
    
    createPins() {
        // Standard 10-pin bowling setup
        const pinPositions = [
            [0, 0, 8],         // Pin 1 (head pin)
            [-0.3, 0, 8.5],    // Pin 2
            [0.3, 0, 8.5],     // Pin 3
            [-0.6, 0, 9],      // Pin 4
            [0, 0, 9],         // Pin 5
            [0.6, 0, 9],       // Pin 6
            [-0.9, 0, 9.5],    // Pin 7
            [-0.3, 0, 9.5],    // Pin 8
            [0.3, 0, 9.5],     // Pin 9
            [0.9, 0, 9.5]      // Pin 10
        ];
        
        this.pins = [];
        this.pinBodies = [];
        
        pinPositions.forEach((pos, index) => {
            const pin = this.createPin(pos[0], pos[1], pos[2]);
            this.pins.push(pin);
            this.scene.add(pin.mesh);
            this.world.addBody(pin.body);
            this.pinBodies.push(pin.body);
        });
    }
    
    createPin(x, y, z) {
        // Create pin mesh
        const pinGeometry = new THREE.CylinderGeometry(0.06, 0.08, 0.4, 16);
        const pinMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.5
        });
        const pinMesh = new THREE.Mesh(pinGeometry, pinMaterial);
        pinMesh.position.set(x, y + 0.2, z);
        pinMesh.castShadow = true;
        pinMesh.receiveShadow = true;
        
        // Create pin physics body
        const pinShape = new CANNON.Cylinder(0.06, 0.08, 0.4, 16);
        const pinBody = new CANNON.Body({
            mass: 1.5,
            shape: pinShape,
            linearDamping: 0.3,
            angularDamping: 0.3
        });
        pinBody.position.set(x, y + 0.2, z);
        
        return { mesh: pinMesh, body: pinBody, standing: true };
    }
    
    createBall() {
        // Create ball mesh
        const ballGeometry = new THREE.SphereGeometry(0.15, 32, 32);
        const ballMaterial = new THREE.MeshStandardMaterial({
            color: 0xe94560,
            roughness: 0.4,
            metalness: 0.6
        });
        this.ball = new THREE.Mesh(ballGeometry, ballMaterial);
        this.ball.position.set(0, 0.15, -7);
        this.ball.castShadow = true;
        this.scene.add(this.ball);
        
        // Create ball physics body
        const ballShape = new CANNON.Sphere(0.15);
        this.ballBody = new CANNON.Body({
            mass: 7,
            shape: ballShape,
            linearDamping: 0.1,
            angularDamping: 0.1
        });
        this.ballBody.position.set(0, 0.15, -7);
        this.world.addBody(this.ballBody);
    }
    
    setupLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);
        
        // Directional light (main light)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, -5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        this.scene.add(directionalLight);
        
        // Point lights for ambiance
        const pointLight1 = new THREE.PointLight(0x4ecca3, 0.5, 20);
        pointLight1.position.set(-2, 3, 0);
        this.scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0xe94560, 0.5, 20);
        pointLight2.position.set(2, 3, 8);
        this.scene.add(pointLight2);
    }
    
    setupControls() {
        const canvas = document.getElementById('gameCanvas');
        
        // Create power bar and aim indicator overlays
        this.createPowerBar();
        this.createAimIndicator();
        
        // Mouse controls for aiming and power
        canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
        canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
        
        // Button controls - simplified throw button
        document.getElementById('throwBtn').addEventListener('click', () => {
            // Auto-throw with medium power if not already thrown
            if (!this.ballThrown && !this.isThrowing) {
                this.powerLevel = 1.5; // Medium-high power
                this.throwBall();
            }
        });
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
        document.getElementById('nextGameBtn').addEventListener('click', () => this.nextGame());
        
        // Game mode change
        document.getElementById('gameModeSelect').addEventListener('change', () => {
            this.resetGame();
        });
    }
    
    createPowerBar() {
        // Create power bar overlay
        const powerBar = document.createElement('div');
        powerBar.id = 'powerBar';
        powerBar.style.cssText = `
            position: absolute;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            width: 300px;
            height: 30px;
            background: rgba(0, 0, 0, 0.7);
            border: 2px solid #4ecca3;
            border-radius: 15px;
            display: none;
            overflow: hidden;
        `;
        
        const powerFill = document.createElement('div');
        powerFill.id = 'powerFill';
        powerFill.style.cssText = `
            width: 0%;
            height: 100%;
            background: linear-gradient(90deg, #4ecca3 0%, #e94560 100%);
            transition: width 0.05s linear;
        `;
        
        const powerText = document.createElement('div');
        powerText.id = 'powerText';
        powerText.textContent = 'HOLD TO BUILD POWER';
        powerText.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-weight: bold;
            font-size: 0.9rem;
            z-index: 10;
        `;
        
        powerBar.appendChild(powerFill);
        powerBar.appendChild(powerText);
        document.querySelector('.canvas-container').appendChild(powerBar);
    }
    
    createAimIndicator() {
        // Create aim indicator
        const aimIndicator = document.createElement('div');
        aimIndicator.id = 'aimIndicator';
        aimIndicator.textContent = '◄ AIM ►';
        aimIndicator.style.cssText = `
            position: absolute;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            color: #4ecca3;
            font-weight: bold;
            font-size: 1.2rem;
            text-shadow: 0 0 10px rgba(78, 204, 163, 0.8);
            pointer-events: none;
        `;
        document.querySelector('.canvas-container').appendChild(aimIndicator);
    }
    
    showPowerIndicator() {
        const powerBar = document.getElementById('powerBar');
        if (powerBar) {
            powerBar.style.display = 'block';
        }
    }
    
    hidePowerIndicator() {
        const powerBar = document.getElementById('powerBar');
        if (powerBar) {
            powerBar.style.display = 'none';
        }
        
        // Reset power fill
        const powerFill = document.getElementById('powerFill');
        if (powerFill) {
            powerFill.style.width = '0%';
        }
    }
    
    updatePowerBar(power) {
        const powerFill = document.getElementById('powerFill');
        const powerText = document.getElementById('powerText');
        if (powerFill) {
            powerFill.style.width = (power * 100) + '%';
        }
        if (powerText) {
            const percentage = Math.round(power * 100);
            powerText.textContent = `POWER: ${percentage}%`;
        }
    }
    
    updateAimIndicator(x) {
        const aimIndicator = document.getElementById('aimIndicator');
        if (aimIndicator) {
            // Move aim indicator with ball
            const screenX = (x / 0.8) * 50; // Convert to percentage
            aimIndicator.style.left = `calc(50% + ${screenX}%)`;
        }
    }
    
    onMouseDown(e) {
        if (this.ballThrown || this.isThrowing) return;
        
        const canvas = document.getElementById('gameCanvas');
        const rect = canvas.getBoundingClientRect();
        
        // Check if click is on canvas
        if (e.clientX < rect.left || e.clientX > rect.right || 
            e.clientY < rect.top || e.clientY > rect.bottom) {
            return;
        }
        
        this.mouseDown = true;
        this.mouseDownTime = Date.now();
        
        // Show power indicator
        this.showPowerIndicator();
    }
    
    onMouseUp(e) {
        if (!this.mouseDown || this.ballThrown) return;
        this.mouseDown = false;
        
        // Calculate power based on hold time
        const holdTime = Date.now() - this.mouseDownTime;
        this.powerLevel = Math.min(holdTime / 1000, 2); // Max 2 seconds
        
        // Hide power indicator
        this.hidePowerIndicator();
        
        // Throw ball
        this.throwBall();
    }
    
    onMouseMove(e) {
        if (this.ballThrown) return;
        
        const canvas = document.getElementById('gameCanvas');
        const rect = canvas.getBoundingClientRect();
        
        // Check if mouse is over canvas
        if (e.clientX < rect.left || e.clientX > rect.right || 
            e.clientY < rect.top || e.clientY > rect.bottom) {
            return;
        }
        
        // Calculate normalized x position (-1 to 1, left to right)
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        
        // Calculate aim angle (INVERTED to match mouse direction)
        this.aimAngle = -x * Math.PI / 6; // NEGATIVE for correct direction
        
        // Update ball position for aiming (INVERTED to match mouse)
        if (!this.isThrowing && !this.ballThrown) {
            const newX = -x * 0.8; // NEGATIVE - now moves with mouse correctly!
            this.ball.position.x = newX;
            this.ballBody.position.x = newX;
            
            // Update aim indicator
            this.updateAimIndicator(newX);
        }
        
        // Update power bar if holding
        if (this.mouseDown) {
            const holdTime = Date.now() - this.mouseDownTime;
            const power = Math.min(holdTime / 2000, 1); // 0-1 over 2 seconds
            this.updatePowerBar(power);
        }
    }
    
    onKeyDown(e) {
        if (e.code === 'Space') {
            // Reset camera
            this.camera.position.set(0, 3, -8);
            this.camera.lookAt(0, 0, 0);
        } else if (e.code === 'KeyR') {
            this.resetGame();
        }
    }
    
    throwBall() {
        if (this.ballThrown || this.isThrowing) return;
        
        const player = this.players[this.currentPlayerIndex];
        if (player.currentFrame >= 10 && player.isFrameComplete(9)) {
            return; // Game over for this player
        }
        
        this.isThrowing = true;
        this.ballThrown = true;
        
        // Calculate throw velocity
        const power = this.powerLevel > 0 ? this.powerLevel : 1;
        const forwardSpeed = 10 + (power * 5);
        const sideSpeed = Math.sin(this.aimAngle) * 3;
        
        // Apply velocity to ball
        this.ballBody.velocity.set(sideSpeed, 0, forwardSpeed);
        this.ballBody.angularVelocity.set(5, 0, 0);
        
        // Wait for pins to settle
        setTimeout(() => {
            this.checkPinsDown();
        }, 3000);
        
        // Reset power
        this.powerLevel = 0;
    }
    
    checkPinsDown() {
        let pinsDownThisThrow = 0;
        
        this.pins.forEach((pin, index) => {
            // Check if pin is knocked down (tilted significantly or off position)
            const pos = pin.body.position;
            const quat = pin.body.quaternion;
            
            // Convert quaternion to euler to check tilt
            const euler = new CANNON.Vec3();
            quat.toEuler(euler);
            
            const tiltThreshold = Math.PI / 6; // 30 degrees
            const isDown = Math.abs(euler.x) > tiltThreshold || 
                          Math.abs(euler.z) > tiltThreshold ||
                          pos.y < 0.1;
            
            if (isDown && pin.standing) {
                pin.standing = false;
                pinsDownThisThrow++;
                
                // Change pin color to indicate it's down
                pin.mesh.material.color.set(0x888888);
            }
        });
        
        const totalPinsDown = this.pins.filter(p => !p.standing).length;
        
        // Update pins knocked display
        document.getElementById('pinsKnocked').textContent = totalPinsDown;
        
        // Process score with pins knocked THIS throw only
        this.processThrow(pinsDownThisThrow);
    }
    
    processThrow(pinsKnockedThisThrow) {
        const player = this.players[this.currentPlayerIndex];
        const frame = player.frames[player.currentFrame];
        
        frame.throws.push(pinsKnockedThisThrow);
        
        const isFrame10 = player.currentFrame === 9;
        
        // Check for strike
        if (frame.throws.length === 1 && pinsKnockedThisThrow === 10) {
            frame.isStrike = true;
            this.showResult('STRIKE!', 'strike');
            
            // Move to next frame (unless 10th frame)
            if (!isFrame10) {
                player.currentFrame++;
            }
        }
        // Check for spare
        else if (frame.throws.length === 2 && 
                 frame.throws[0] + frame.throws[1] === 10) {
            frame.isSpare = true;
            this.showResult('SPARE!', 'spare');
            
            // Move to next frame (unless 10th frame)
            if (!isFrame10) {
                player.currentFrame++;
            }
        }
        // Check if frame is complete (not 10th frame)
        else if (frame.throws.length === 2 && !isFrame10) {
            // Open frame - move to next frame
            player.currentFrame++;
        }
        
        // Special 10th frame completion check
        if (isFrame10) {
            // Check if 10th frame is complete
            if (frame.isStrike && frame.throws.length >= 3) {
                // Strike + 2 bonus balls = complete
                this.finishPlayerTurn();
                return;
            } else if (frame.isSpare && frame.throws.length >= 3) {
                // Spare + 1 bonus ball = complete
                this.finishPlayerTurn();
                return;
            } else if (!frame.isStrike && !frame.isSpare && frame.throws.length >= 2) {
                // Open frame in 10th = complete after 2 balls
                this.finishPlayerTurn();
                return;
            }
        }
        
        // Calculate scores
        player.calculateScores();
        
        // Update UI
        this.updateScoreboard();
        
        // Reset for next throw
        setTimeout(() => {
            // Determine what to do based on frame state
            if (player.currentFrame >= 10) {
                // Player completed all frames
                return;
            }
            
            if (isFrame10) {
                // 10th frame logic
                if (frame.throws.length === 1) {
                    if (frame.isStrike) {
                        // Strike on first ball - reset pins for second ball
                        this.resetPins();
                        this.resetBall();
                    } else {
                        // Not a strike - remove knocked pins for second ball
                        this.removeKnockedPins();
                        this.resetBall();
                    }
                } else if (frame.throws.length === 2) {
                    if (frame.isStrike || frame.isSpare) {
                        // Got strike or spare - reset pins for bonus ball
                        this.resetPins();
                        this.resetBall();
                    }
                    // If open frame, finishPlayerTurn already called above
                }
            } else {
                // Frames 1-9 logic
                if (frame.throws.length === 1 && !frame.isStrike) {
                    // Second ball of frame - remove knocked pins only
                    this.removeKnockedPins();
                    this.resetBall();
                } else {
                    // New frame or after strike - reset all pins
                    this.resetPins();
                    this.resetBall();
                }
            }
            
            this.isThrowing = false;
            this.ballThrown = false;
        }, 2000);
    }
    
    finishPlayerTurn() {
        // Move to next player or finish game
        this.currentPlayerIndex++;
        
        if (this.currentPlayerIndex >= this.players.length) {
            // All players finished this game
            this.finishGame();
        } else {
            // Next player's turn
            const select = document.getElementById('currentPlayerSelect');
            if (select) {
                select.value = this.currentPlayerIndex;
            }
            
            this.resetPins();
            this.resetBall();
            this.isThrowing = false;
            this.ballThrown = false;
            this.updateScoreboard();
        }
    }
    
    finishGame() {
        // Record game scores
        this.players.forEach(player => {
            player.gameScores.push(player.getTotalScore());
        });
        
        // Check if all 3 games are complete
        if (this.currentGameNumber >= this.maxGames) {
            this.showGameSummary();
        } else {
            // Show next game button
            document.getElementById('nextGameBtn').style.display = 'block';
        }
    }
    
    nextGame() {
        this.currentGameNumber++;
        
        // Reset players for new game
        this.players.forEach(player => {
            player.reset();
        });
        
        this.currentPlayerIndex = 0;
        document.getElementById('nextGameBtn').style.display = 'none';
        
        this.resetPins();
        this.resetBall();
        this.updateScoreboard();
    }
    
    showGameSummary() {
        const summary = document.getElementById('gameSummary');
        const content = document.getElementById('summaryContent');
        
        let html = '<h4>3-Game Series Complete!</h4>';
        
        if (this.gameMode === 'singles') {
            const player = this.players[0];
            const average = player.getAverage();
            html += `<div class="summary-item">`;
            html += `<div class="summary-label">Game 1:</div>`;
            html += `<div class="summary-value">${player.gameScores[0]}</div>`;
            html += `</div>`;
            html += `<div class="summary-item">`;
            html += `<div class="summary-label">Game 2:</div>`;
            html += `<div class="summary-value">${player.gameScores[1]}</div>`;
            html += `</div>`;
            html += `<div class="summary-item">`;
            html += `<div class="summary-label">Game 3:</div>`;
            html += `<div class="summary-value">${player.gameScores[2]}</div>`;
            html += `</div>`;
            html += `<div class="summary-item" style="border-top: 2px solid #ffd700; margin-top: 10px; padding-top: 10px;">`;
            html += `<div class="summary-label">3-Game Average:</div>`;
            html += `<div class="summary-value">${average.toFixed(1)}</div>`;
            html += `</div>`;
        } else {
            // Team scoring
            let totalAverage = 0;
            this.players.forEach(player => {
                const average = player.getAverage();
                totalAverage += average;
                html += `<div class="summary-item">`;
                html += `<div class="summary-label">${player.name} Average:</div>`;
                html += `<div class="summary-value">${average.toFixed(1)}</div>`;
                html += `</div>`;
            });
            html += `<div class="summary-item" style="border-top: 2px solid #ffd700; margin-top: 10px; padding-top: 10px;">`;
            html += `<div class="summary-label">Team Average:</div>`;
            html += `<div class="summary-value">${totalAverage.toFixed(1)}</div>`;
            html += `</div>`;
        }
        
        content.innerHTML = html;
        summary.style.display = 'block';
    }
    
    removeKnockedPins() {
        // Remove only the knocked down pins from scene and physics
        this.pins = this.pins.filter(pin => {
            if (!pin.standing) {
                // Remove knocked down pin
                this.scene.remove(pin.mesh);
                this.world.removeBody(pin.body);
                return false; // Remove from array
            }
            return true; // Keep standing pin
        });
        
        // Update pin bodies array
        this.pinBodies = this.pins.map(p => p.body);
        
        // Don't reset the pins knocked counter - it shows cumulative for the frame
    }
    
    resetPins() {
        // Remove old pins
        this.pins.forEach(pin => {
            this.scene.remove(pin.mesh);
            this.world.removeBody(pin.body);
        });
        
        // Create new pins
        this.createPins();
        
        document.getElementById('pinsKnocked').textContent = '0';
    }
    
    resetBall() {
        // Reset ball position
        this.ball.position.set(0, 0.15, -7);
        this.ballBody.position.set(0, 0.15, -7);
        this.ballBody.velocity.set(0, 0, 0);
        this.ballBody.angularVelocity.set(0, 0, 0);
        this.ballBody.quaternion.set(0, 0, 0, 1);
    }
    
    resetGame() {
        // Reset all game state
        this.currentGameNumber = 1;
        this.currentPlayerIndex = 0;
        
        // Setup new players
        this.setupPlayers();
        
        // Reset scene
        this.resetPins();
        this.resetBall();
        
        // Hide summary
        document.getElementById('gameSummary').style.display = 'none';
        document.getElementById('nextGameBtn').style.display = 'none';
        
        // Update UI
        this.updateScoreboard();
        
        this.isThrowing = false;
        this.ballThrown = false;
    }
    
    updateScoreboard() {
        const player = this.players[this.currentPlayerIndex];
        
        // Update frame and ball indicators
        document.getElementById('currentFrame').textContent = player.currentFrame + 1;
        const currentFrameThrows = player.frames[player.currentFrame].throws.length;
        document.getElementById('currentBall').textContent = currentFrameThrows + 1;
        
        // Render scoreboard
        const scoreTable = document.getElementById('scoreTable');
        let html = '';
        
        this.players.forEach((p, index) => {
            html += '<div class="player-score">';
            html += `<div class="player-name">${p.name}</div>`;
            html += '<div class="frames-container">';
            
            // Render each frame
            for (let i = 0; i < 10; i++) {
                const frame = p.frames[i];
                const isActive = index === this.currentPlayerIndex && i === p.currentFrame;
                
                html += `<div class="frame ${isActive ? 'active' : ''}">`;
                html += `<div class="frame-number">${i + 1}</div>`;
                html += '<div class="frame-throws">';
                
                // Show throws
                frame.throws.forEach((pins, throwIndex) => {
                    let display = pins.toString();
                    if (frame.isStrike && throwIndex === 0) {
                        display = 'X';
                    } else if (frame.isSpare && throwIndex === 1) {
                        display = '/';
                    } else if (pins === 0) {
                        display = '-';
                    }
                    
                    const throwClass = frame.isStrike ? 'strike' : frame.isSpare && throwIndex === 1 ? 'spare' : '';
                    html += `<div class="throw ${throwClass}">${display}</div>`;
                });
                
                // Empty throw slots
                const maxThrows = i === 9 ? 3 : 2;
                for (let j = frame.throws.length; j < maxThrows; j++) {
                    html += '<div class="throw"></div>';
                }
                
                html += '</div>';
                html += `<div class="frame-score">${frame.score !== null ? frame.score : ''}</div>`;
                html += '</div>';
            }
            
            html += '</div>';
            html += `<div class="total-score">Total: ${p.getTotalScore()}</div>`;
            html += '</div>';
        });
        
        scoreTable.innerHTML = html;
    }
    
    showResult(message, type) {
        const resultMsg = document.getElementById('resultMessage');
        resultMsg.textContent = message;
        resultMsg.className = `result-message show ${type}`;
        
        setTimeout(() => {
            resultMsg.classList.remove('show');
        }, 2000);
    }
    
    onWindowResize() {
        const canvas = document.getElementById('gameCanvas');
        this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Update physics
        this.world.step(1 / 60);
        
        // Update ball mesh from physics
        this.ball.position.copy(this.ballBody.position);
        this.ball.quaternion.copy(this.ballBody.quaternion);
        
        // Update pins
        this.pins.forEach(pin => {
            pin.mesh.position.copy(pin.body.position);
            pin.mesh.quaternion.copy(pin.body.quaternion);
        });
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
    }
}

// Player class
class Player {
    constructor(name) {
        this.name = name;
        this.frames = [];
        this.currentFrame = 0;
        this.gameScores = [];
        
        // Initialize 10 frames
        for (let i = 0; i < 10; i++) {
            this.frames.push(new Frame());
        }
    }
    
    reset() {
        this.frames = [];
        this.currentFrame = 0;
        
        for (let i = 0; i < 10; i++) {
            this.frames.push(new Frame());
        }
    }
    
    calculateScores() {
        for (let i = 0; i < 10; i++) {
            const frame = this.frames[i];
            
            if (frame.score !== null) continue; // Already calculated
            
            if (i < 9) {
                // Regular frames (1-9)
                if (frame.isStrike) {
                    // Strike: wait for next 2 balls
                    const next1 = this.frames[i + 1].throws[0];
                    const next2 = this.frames[i + 1].throws.length > 1 
                        ? this.frames[i + 1].throws[1]
                        : this.frames[i + 2]?.throws[0];
                    
                    if (next1 !== undefined && next2 !== undefined) {
                        const previousScore = i > 0 ? this.frames[i - 1].score : 0;
                        frame.score = previousScore + 10 + next1 + next2;
                    }
                } else if (frame.isSpare) {
                    // Spare: wait for next 1 ball
                    const next1 = this.frames[i + 1].throws[0];
                    
                    if (next1 !== undefined) {
                        const previousScore = i > 0 ? this.frames[i - 1].score : 0;
                        frame.score = previousScore + 10 + next1;
                    }
                } else if (frame.throws.length === 2) {
                    // Open frame
                    const previousScore = i > 0 ? this.frames[i - 1].score : 0;
                    frame.score = previousScore + frame.throws[0] + frame.throws[1];
                }
            } else {
                // 10th frame
                if (this.isFrameComplete(9)) {
                    const previousScore = this.frames[8].score || 0;
                    const total = frame.throws.reduce((sum, pins) => sum + pins, 0);
                    frame.score = previousScore + total;
                }
            }
        }
    }
    
    isFrameComplete(frameIndex) {
        const frame = this.frames[frameIndex];
        
        if (frameIndex < 9) {
            return frame.throws.length === 2 || frame.isStrike;
        } else {
            // 10th frame
            if (frame.isStrike || frame.isSpare) {
                return frame.throws.length === 3;
            } else {
                return frame.throws.length === 2;
            }
        }
    }
    
    getTotalScore() {
        return this.frames[9].score || 0;
    }
    
    getAverage() {
        if (this.gameScores.length === 0) return 0;
        const sum = this.gameScores.reduce((a, b) => a + b, 0);
        return sum / this.gameScores.length;
    }
}

// Frame class
class Frame {
    constructor() {
        this.throws = [];
        this.score = null;
        this.isStrike = false;
        this.isSpare = false;
    }
}

// Initialize game when page loads
let game;
window.addEventListener('load', () => {
    game = new BowlingGame();
});

