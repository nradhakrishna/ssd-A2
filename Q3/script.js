// Jigsaw Puzzle Game JavaScript
class JigsawPuzzle {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.image = null;
        this.pieces = [];
        this.placedPieces = new Set();
        this.totalPieces = 0;
        this.gameStarted = false;
        this.timer = null;
        this.secondsElapsed = 0;
        this.currentDifficulty = null;

        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.imageUpload = document.getElementById('imageUpload');
        this.previewImage = document.getElementById('previewImage');
        this.puzzleBoard = document.getElementById('puzzleBoard');
        this.piecesArea = document.getElementById('piecesArea');
        this.startGameBtn = document.getElementById('startGame');
        this.shuffleBtn = document.getElementById('shufflePieces');
        this.resetBtn = document.getElementById('resetGame');
        this.piecesPlacedSpan = document.getElementById('piecesPlaced');
        this.totalPiecesSpan = document.getElementById('totalPieces');
        this.timerSpan = document.getElementById('timer');
    }

    bindEvents() {
        // Image upload
        this.imageUpload.addEventListener('change', (e) => this.handleImageUpload(e));

        // Difficulty selection
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectDifficulty(e));
        });

        // Game controls
        this.startGameBtn.addEventListener('click', () => this.startGame());
        this.shuffleBtn.addEventListener('click', () => this.shufflePieces());
        this.resetBtn.addEventListener('click', () => this.resetGame());

        // Drag and drop events
        this.puzzleBoard.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.puzzleBoard.addEventListener('drop', (e) => this.handleDrop(e));
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file || !file.type.startsWith('image/')) {
            alert('Please select a valid image file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.previewImage.src = e.target.result;
            this.previewImage.style.display = 'block';

            // Create image object for processing
            this.image = new Image();
            this.image.onload = () => {
                this.startGameBtn.disabled = false;
            };
            this.image.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    selectDifficulty(event) {
        // Remove previous selection
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.classList.remove('selected');
        });

        // Add selection to clicked button
        event.target.classList.add('selected');
        this.currentDifficulty = parseInt(event.target.dataset.pieces);
    }

    startGame() {
        if (!this.image || !this.currentDifficulty) {
            alert('Please upload an image and select a difficulty level.');
            return;
        }

        this.gameStarted = true;
        this.placedPieces.clear();
        this.secondsElapsed = 0;

        // Start timer
        this.startTimer();

        // Generate puzzle pieces
        this.generatePuzzlePieces();

        // Update UI
        this.startGameBtn.disabled = true;
        this.shuffleBtn.disabled = false;
        this.resetBtn.disabled = false;
        this.totalPiecesSpan.textContent = this.totalPieces;
        this.updatePiecesPlaced();

        // Shuffle pieces initially
        this.shufflePieces();
    }

    startTimer() {
        if (this.timer) {
            clearInterval(this.timer);
        }

        this.timer = setInterval(() => {
            this.secondsElapsed++;
            this.updateTimerDisplay();
        }, 1000);
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.secondsElapsed / 60);
        const seconds = this.secondsElapsed % 60;
        this.timerSpan.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    generatePuzzlePieces() {
        this.pieces = [];
        this.piecesArea.innerHTML = '';
        this.puzzleBoard.innerHTML = '';

        const boardRect = this.puzzleBoard.getBoundingClientRect();
        const containerSize = Math.min(boardRect.width, boardRect.height);
        const padding = 20;
        const boardSize = containerSize - (padding * 2);

        // Calculate grid dimensions
        const gridSize = Math.sqrt(this.currentDifficulty);
        const cols = Math.ceil(gridSize);
        const rows = Math.ceil(this.currentDifficulty / cols);

        // Calculate piece dimensions for perfect fit
        const pieceWidth = Math.floor(boardSize / cols);
        const pieceHeight = Math.floor(boardSize / rows);

        this.totalPieces = this.currentDifficulty;

        // Create a canvas to slice the image precisely
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Create drop zones and generate piece images using canvas
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (this.pieces.length >= this.totalPieces) break;

                const pieceIndex = i * cols + j;
                
                // Calculate exact pixel positions in the source image
                const srcX = Math.floor((j / cols) * this.image.width);
                const srcY = Math.floor((i / rows) * this.image.height);
                const srcWidth = Math.floor(((j + 1) / cols) * this.image.width) - srcX;
                const srcHeight = Math.floor(((i + 1) / rows) * this.image.height) - srcY;

                // Set canvas size to match the piece dimensions
                canvas.width = srcWidth;
                canvas.height = srcHeight;

                // Draw the piece from the source image
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(
                    this.image,
                    srcX, srcY, srcWidth, srcHeight,  // Source rectangle
                    0, 0, srcWidth, srcHeight          // Destination rectangle
                );

                // Convert canvas to data URL
                const pieceImageURL = canvas.toDataURL('image/png');

                const piece = {
                    id: pieceIndex,
                    correctRow: i,
                    correctCol: j,
                    currentRow: i,
                    currentCol: j,
                    x: j * pieceWidth,
                    y: i * pieceHeight,
                    width: pieceWidth,
                    height: pieceHeight,
                    imageURL: pieceImageURL,
                    srcWidth: srcWidth,
                    srcHeight: srcHeight
                };

                this.pieces.push(piece);

                // Create drop zone
                const dropZone = document.createElement('div');
                dropZone.className = 'drop-zone';
                dropZone.dataset.pieceId = pieceIndex;
                dropZone.style.left = piece.x + 'px';
                dropZone.style.top = piece.y + 'px';
                dropZone.style.width = piece.width + 'px';
                dropZone.style.height = piece.height + 'px';

                this.puzzleBoard.appendChild(dropZone);
            }
        }

        // Create draggable pieces using the sliced images
        this.pieces.forEach(piece => {
            const pieceElement = document.createElement('div');
            pieceElement.className = 'puzzle-piece';
            pieceElement.id = `piece-${piece.id}`;
            pieceElement.dataset.pieceId = piece.id;
            pieceElement.draggable = true;

            // Use the sliced image as background
            pieceElement.style.backgroundImage = `url(${piece.imageURL})`;
            pieceElement.style.backgroundSize = `${piece.width}px ${piece.height}px`;
            pieceElement.style.backgroundPosition = 'center';
            pieceElement.style.backgroundRepeat = 'no-repeat';
            pieceElement.style.width = piece.width + 'px';
            pieceElement.style.height = piece.height + 'px';

            // Add drag event listeners
            pieceElement.addEventListener('dragstart', (e) => this.handleDragStart(e, piece));
            pieceElement.addEventListener('dragend', (e) => this.handleDragEnd(e));

            this.piecesArea.appendChild(pieceElement);
        });
    }

    handleDragStart(event, piece) {
        event.dataTransfer.setData('pieceId', piece.id);
        event.target.classList.add('dragging');
    }

    handleDragEnd(event) {
        event.target.classList.remove('dragging');
    }

    handleDragOver(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';

        // Highlight drop zones
        const dropZones = document.querySelectorAll('.drop-zone');
        dropZones.forEach(zone => {
            zone.classList.remove('highlight');
        });

        const rect = this.puzzleBoard.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const dropZone = document.elementFromPoint(event.clientX, event.clientY);
        if (dropZone && dropZone.classList.contains('drop-zone')) {
            dropZone.classList.add('highlight');
        }
    }

    handleDrop(event) {
        event.preventDefault();

        const pieceId = parseInt(event.dataTransfer.getData('pieceId'));
        const rect = this.puzzleBoard.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Find which drop zone was targeted
        const dropZone = document.elementFromPoint(event.clientX, event.clientY);
        if (!dropZone || !dropZone.classList.contains('drop-zone')) {
            return;
        }

        const targetPieceId = parseInt(dropZone.dataset.pieceId);

        // Check if this is the correct position
        if (pieceId === targetPieceId) {
            this.placePiece(pieceId, targetPieceId);
            dropZone.classList.add('correct');
        }
    }

    placePiece(pieceId, targetPieceId) {
        const pieceElement = document.getElementById(`piece-${pieceId}`);
        if (!pieceElement) return;

        // Remove from pieces area
        pieceElement.remove();

        // Find the piece data
        const piece = this.pieces.find(p => p.id === pieceId);
        if (!piece) return;

        // Create placed piece element
        const placedPiece = document.createElement('div');
        placedPiece.className = 'puzzle-piece correct';
        placedPiece.id = `placed-${pieceId}`;
        placedPiece.style.left = piece.x + 'px';
        placedPiece.style.top = piece.y + 'px';
        placedPiece.style.width = piece.width + 'px';
        placedPiece.style.height = piece.height + 'px';
        placedPiece.style.backgroundImage = `url(${piece.imageURL})`;
        placedPiece.style.backgroundSize = `${piece.width}px ${piece.height}px`;
        placedPiece.style.backgroundPosition = 'center';
        placedPiece.style.backgroundRepeat = 'no-repeat';

        this.puzzleBoard.appendChild(placedPiece);

        // Update game state
        this.placedPieces.add(pieceId);
        this.updatePiecesPlaced();

        // Check for completion
        if (this.placedPieces.size === this.totalPieces) {
            this.gameComplete();
        }
    }

    updatePiecesPlaced() {
        this.piecesPlacedSpan.textContent = this.placedPieces.size;
    }

    shufflePieces() {
        const pieces = Array.from(this.piecesArea.children);
        const container = this.piecesArea;

        // Fisher-Yates shuffle
        for (let i = pieces.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
        }

        // Clear and re-append in shuffled order
        container.innerHTML = '';
        pieces.forEach(piece => container.appendChild(piece));
    }

    resetGame() {
        if (confirm('Are you sure you want to reset the game?')) {
            this.gameStarted = false;
            this.placedPieces.clear();

            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }

            this.secondsElapsed = 0;
            this.updateTimerDisplay();

            this.piecesArea.innerHTML = '';
            this.puzzleBoard.innerHTML = '';

            this.startGameBtn.disabled = false;
            this.shuffleBtn.disabled = true;
            this.resetBtn.disabled = true;

            this.piecesPlacedSpan.textContent = '0';
            this.totalPiecesSpan.textContent = '0';
        }
    }

    gameComplete() {
        if (this.timer) {
            clearInterval(this.timer);
        }

        const minutes = Math.floor(this.secondsElapsed / 60);
        const seconds = this.secondsElapsed % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        setTimeout(() => {
            alert(`Congratulations! You completed the puzzle in ${timeString}!`);
        }, 500);
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new JigsawPuzzle();
});
