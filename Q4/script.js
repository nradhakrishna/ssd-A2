// Stoplight Game - Nash Equilibrium Demonstration
// This program implements a two-player game (Human vs Computer) to demonstrate Nash Equilibrium concepts

// Game state object to store all game-related data
const gameState = {
    // Player choices: 'go' or 'stop'
    humanChoice: null,
    computerChoice: null,
    
    // Game statistics counters
    totalRounds: 0,        // Total number of rounds played
    nashCount: 0,          // Number of times Nash Equilibrium was achieved
    collisionCount: 0,     // Number of collision outcomes (both Go)
    deadlockCount: 0,      // Number of deadlock outcomes (both Stop)
    humanScore: 0,         // Cumulative score for human player
    computerScore: 0       // Cumulative score for computer player
};

// Payoff matrix defining outcomes for all strategy combinations
// Format: [humanPayoff, computerPayoff]
const payoffMatrix = {
    // When human chooses 'go'
    go: {
        go: [-10, -10],    // Both go: Collision! Negative payoff for both
        stop: [5, 2]       // Human goes, Computer stops: Human gets 5, Computer gets 2
    },
    // When human chooses 'stop'
    stop: {
        go: [2, 5],        // Human stops, Computer goes: Human gets 2, Computer gets 5
        stop: [0, 0]       // Both stop: Deadlock! Zero payoff for both
    }
};

// Nash Equilibrium outcomes (where neither player can improve by changing strategy alone)
// In this game: (Go, Stop) and (Stop, Go) are Nash Equilibria
const nashEquilibria = [
    { human: 'go', computer: 'stop' },     // Human goes, Computer stops
    { human: 'stop', computer: 'go' }      // Human stops, Computer goes
];

// DOM element references for easy access
const elements = {
    // Choice buttons
    goBtn: document.getElementById('choiceGo'),           // "Go" button
    stopBtn: document.getElementById('choiceStop'),       // "Stop" button
    autoPlayBtn: document.getElementById('autoPlay'),     // "Auto-play" button
    
    // Results section elements
    resultsSection: document.getElementById('resultsSection'),     // Results container
    humanChoiceDisplay: document.getElementById('humanChoice'),    // Display human's choice
    computerChoiceDisplay: document.getElementById('computerChoice'), // Display computer's choice
    outcomeText: document.getElementById('outcomeText'),           // Outcome description
    humanPayoffDisplay: document.getElementById('humanPayoff'),    // Human's payoff value
    computerPayoffDisplay: document.getElementById('computerPayoff'), // Computer's payoff value
    nashIndicator: document.getElementById('nashIndicator'),       // Nash Equilibrium indicator
    playAgainBtn: document.getElementById('playAgain'),            // "Play Again" button
    
    // Statistics elements
    totalRoundsDisplay: document.getElementById('totalRounds'),       // Total rounds counter
    nashCountDisplay: document.getElementById('nashCount'),           // Nash count
    collisionCountDisplay: document.getElementById('collisionCount'), // Collision count
    deadlockCountDisplay: document.getElementById('deadlockCount'),   // Deadlock count
    humanScoreDisplay: document.getElementById('humanScore'),         // Human total score
    computerScoreDisplay: document.getElementById('computerScore'),   // Computer total score
    resetStatsBtn: document.getElementById('resetStats')              // Reset stats button
};

// Initialize the game when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Call initialization function
    initializeGame();
});

/**
 * Initialize game by setting up event listeners
 */
function initializeGame() {
    // Add click event listener to "Go" button
    elements.goBtn.addEventListener('click', function() {
        // When clicked, play round with human choosing 'go'
        playRound('go');
    });
    
    // Add click event listener to "Stop" button
    elements.stopBtn.addEventListener('click', function() {
        // When clicked, play round with human choosing 'stop'
        playRound('stop');
    });
    
    // Add click event listener to "Auto-play" button
    elements.autoPlayBtn.addEventListener('click', function() {
        // Generate random choice for human
        const randomChoice = getRandomChoice();
        // Play round with random choice
        playRound(randomChoice);
    });
    
    // Add click event listener to "Play Again" button
    elements.playAgainBtn.addEventListener('click', function() {
        // Reset the round to play again
        resetRound();
    });
    
    // Add click event listener to "Reset Statistics" button
    elements.resetStatsBtn.addEventListener('click', function() {
        // Reset all game statistics
        resetStatistics();
    });
}

/**
 * Generate a random choice for a player
 * @returns {string} Either 'go' or 'stop'
 */
function getRandomChoice() {
    // Generate random number between 0 and 1
    const random = Math.random();
    
    // If random < 0.5, return 'go', otherwise return 'stop'
    // This gives 50% probability for each choice
    return random < 0.5 ? 'go' : 'stop';
}

/**
 * Play a round of the game
 * @param {string} humanChoice - The human player's choice ('go' or 'stop')
 */
function playRound(humanChoice) {
    // Store human's choice in game state
    gameState.humanChoice = humanChoice;
    
    // Computer makes random choice
    gameState.computerChoice = getRandomChoice();
    
    // Disable choice buttons to prevent multiple clicks
    disableChoiceButtons();
    
    // Calculate payoffs based on both players' choices
    calculatePayoffs();
    
    // Display the results to the user
    displayResults();
    
    // Update game statistics
    updateStatistics();
}

/**
 * Disable all choice buttons
 */
function disableChoiceButtons() {
    // Disable "Go" button
    elements.goBtn.disabled = true;
    
    // Disable "Stop" button
    elements.stopBtn.disabled = true;
    
    // Disable "Auto-play" button
    elements.autoPlayBtn.disabled = true;
}

/**
 * Enable all choice buttons
 */
function enableChoiceButtons() {
    // Enable "Go" button
    elements.goBtn.disabled = false;
    
    // Enable "Stop" button
    elements.stopBtn.disabled = false;
    
    // Enable "Auto-play" button
    elements.autoPlayBtn.disabled = false;
}

/**
 * Calculate payoffs based on player choices using the payoff matrix
 */
function calculatePayoffs() {
    // Get human's choice from game state
    const humanChoice = gameState.humanChoice;
    
    // Get computer's choice from game state
    const computerChoice = gameState.computerChoice;
    
    // Look up payoffs in the payoff matrix
    // payoffMatrix[humanChoice][computerChoice] returns [humanPayoff, computerPayoff]
    const payoffs = payoffMatrix[humanChoice][computerChoice];
    
    // Extract human payoff (first element of array)
    const humanPayoff = payoffs[0];
    
    // Extract computer payoff (second element of array)
    const computerPayoff = payoffs[1];
    
    // Add payoffs to cumulative scores
    gameState.humanScore += humanPayoff;
    gameState.computerScore += computerPayoff;
    
    // Store current round payoffs in game state for display
    gameState.currentHumanPayoff = humanPayoff;
    gameState.currentComputerPayoff = computerPayoff;
}

/**
 * Display the results of the current round
 */
function displayResults() {
    // Show the results section (make it visible)
    elements.resultsSection.style.display = 'block';
    
    // Display human's choice with appropriate emoji
    elements.humanChoiceDisplay.textContent = gameState.humanChoice === 'go' ? '🟢 Go' : '🔴 Stop';
    
    // Display computer's choice with appropriate emoji
    elements.computerChoiceDisplay.textContent = gameState.computerChoice === 'go' ? '🟢 Go' : '🔴 Stop';
    
    // Display human's payoff for this round
    elements.humanPayoffDisplay.textContent = gameState.currentHumanPayoff;
    
    // Display computer's payoff for this round
    elements.computerPayoffDisplay.textContent = gameState.currentComputerPayoff;
    
    // Determine and display the outcome description
    displayOutcome();
    
    // Check if this outcome is a Nash Equilibrium
    checkNashEquilibrium();
    
    // Scroll to results section smoothly
    elements.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Display the outcome description based on player choices
 */
function displayOutcome() {
    // Get both player choices
    const human = gameState.humanChoice;
    const computer = gameState.computerChoice;
    
    // Variable to store outcome message
    let outcomeMessage = '';
    
    // Determine outcome based on combination of choices
    if (human === 'go' && computer === 'go') {
        // Both players chose to go - Collision!
        outcomeMessage = '💥 Collision! Both players went and crashed. Both lose points.';
    } else if (human === 'go' && computer === 'stop') {
        // Human went, Computer stopped - Human benefits more
        outcomeMessage = '✅ Human went safely while Computer waited. Human gains more!';
    } else if (human === 'stop' && computer === 'go') {
        // Computer went, Human stopped - Computer benefits more
        outcomeMessage = '✅ Computer went safely while Human waited. Computer gains more!';
    } else {
        // Both players chose to stop - Deadlock!
        outcomeMessage = '⏸️ Deadlock! Both players stopped and waited. No progress made.';
    }
    
    // Display the outcome message
    elements.outcomeText.textContent = outcomeMessage;
}

/**
 * Check if the current outcome is a Nash Equilibrium
 * Nash Equilibrium: Neither player can improve their payoff by unilaterally changing strategy
 */
function checkNashEquilibrium() {
    // Get current choices
    const human = gameState.humanChoice;
    const computer = gameState.computerChoice;
    
    // Flag to track if current outcome is Nash Equilibrium
    let isNash = false;
    
    // Check each Nash Equilibrium in our list
    for (let i = 0; i < nashEquilibria.length; i++) {
        // Get current Nash Equilibrium to check
        const nash = nashEquilibria[i];
        
        // Check if current choices match this Nash Equilibrium
        if (nash.human === human && nash.computer === computer) {
            // Match found - this is a Nash Equilibrium
            isNash = true;
            break; // Exit loop early since we found a match
        }
    }
    
    // Show or hide Nash Equilibrium indicator based on result
    if (isNash) {
        // This is a Nash Equilibrium - show indicator
        elements.nashIndicator.style.display = 'block';
        
        // Increment Nash Equilibrium counter
        gameState.nashCount++;
    } else {
        // Not a Nash Equilibrium - hide indicator
        elements.nashIndicator.style.display = 'none';
    }
}

/**
 * Update game statistics displays
 */
function updateStatistics() {
    // Increment total rounds counter
    gameState.totalRounds++;
    
    // Update specific outcome counters based on current choices
    if (gameState.humanChoice === 'go' && gameState.computerChoice === 'go') {
        // Collision occurred - increment collision counter
        gameState.collisionCount++;
    } else if (gameState.humanChoice === 'stop' && gameState.computerChoice === 'stop') {
        // Deadlock occurred - increment deadlock counter
        gameState.deadlockCount++;
    }
    
    // Update all statistics displays with current values
    elements.totalRoundsDisplay.textContent = gameState.totalRounds;
    elements.nashCountDisplay.textContent = gameState.nashCount;
    elements.collisionCountDisplay.textContent = gameState.collisionCount;
    elements.deadlockCountDisplay.textContent = gameState.deadlockCount;
    elements.humanScoreDisplay.textContent = gameState.humanScore;
    elements.computerScoreDisplay.textContent = gameState.computerScore;
}

/**
 * Reset the current round to play again
 */
function resetRound() {
    // Clear player choices from game state
    gameState.humanChoice = null;
    gameState.computerChoice = null;
    
    // Hide results section
    elements.resultsSection.style.display = 'none';
    
    // Re-enable choice buttons for next round
    enableChoiceButtons();
    
    // Scroll back to choice buttons
    elements.goBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Reset all game statistics to initial values
 */
function resetStatistics() {
    // Ask user for confirmation before resetting
    const confirmed = confirm('Are you sure you want to reset all statistics?');
    
    // Only proceed if user confirmed
    if (confirmed) {
        // Reset all counters to zero
        gameState.totalRounds = 0;
        gameState.nashCount = 0;
        gameState.collisionCount = 0;
        gameState.deadlockCount = 0;
        gameState.humanScore = 0;
        gameState.computerScore = 0;
        
        // Update all display elements with reset values
        elements.totalRoundsDisplay.textContent = '0';
        elements.nashCountDisplay.textContent = '0';
        elements.collisionCountDisplay.textContent = '0';
        elements.deadlockCountDisplay.textContent = '0';
        elements.humanScoreDisplay.textContent = '0';
        elements.computerScoreDisplay.textContent = '0';
        
        // Show confirmation message to user
        alert('Statistics have been reset!');
    }
}



