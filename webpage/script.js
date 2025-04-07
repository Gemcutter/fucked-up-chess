const socket = io();
const SCREENSPACECONVERSION = 4; // Multiply your screenspace co-ords by this to get the Canvas Co-ords.
let gameState = [];
socket.on('pieces', function(pieceList) {
    gameState = buildGameState(pieceList);

    // can delete later. Just test data for first white rook.
    gameState[0].movementMask[0] = [false, true, true, true, true, false, false, false];
    gameState[0].movementMask[1] = [false, false, false, false, false, true, false, false];
    gameState[0].movementMask[2] = [false, false, false, false, false, true, false, false];
    gameState[0].movementMask[3] = [false, false, false, false, false, true, false, false];
    gameState[0].movementMask[4] = [false, false, false, false, false, true, false, false];
    gameState[0].movementMask[5] = [false, false, false, false, false, true, false, false];
    gameState[0].movementMask[6] = [false, false, false, false, false, true, false, false];
    gameState[0].movementMask[7] = [false, false, false, false, false, true, false, false];
    
    function buildGameState(pieces) {
        for (let i = 0; i < pieces.length; i++) {
            pieces[i].held = false;
        }
        return pieces;
    }
    
    $(document).ready(function() {
        let gameBoard = document.getElementById("gameBoard");
        let ctx = gameBoard.getContext("2d");

        let continuouslyRender = false;

        let possibleMoves = [ // (row, col)
            [false, false, false, false, false, false, false, false], 
            [false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false],
            [false, false, false, true, true, false, false, false],
            [false, false, false, true, true, false, false, false],
            [false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false]
        ];
    
        const DARKSQUARECOLOUR = "#664039";
        const LIGHTSQUARECOLOUR = "#a7887c";
    
        // Setup Options.
        let shouldDisplayCoordinates = false;
        let checkboxShowCoordinates = document.getElementById("ShowCoordinates");
        checkboxShowCoordinates.addEventListener("change", (event) => {
            shouldDisplayCoordinates = checkboxShowCoordinates.checked;
            drawEverything();
        });

        // Wait for all the assets to load in, then draw everything.
        let loadedCount = 0;
        const totalAssets = 12;
        const onAssetLoaded = function() {
            loadedCount++;
            if (loadedCount >= totalAssets) {
                drawEverything();
            }
        }

        // Instantiate all the assets (this will also add them to the assetDict);
        new Asset("assets/pieces/BBishop.png", "blackBishop", onAssetLoaded);
        new Asset("assets/pieces/BKing.png", "blackKing", onAssetLoaded);
        new Asset("assets/pieces/BKnight.png", "blackKnight", onAssetLoaded);
        new Asset("assets/pieces/BPawn.png", "blackPawn", onAssetLoaded);
        new Asset("assets/pieces/BQueen.png", "blackQueen", onAssetLoaded);
        new Asset("assets/pieces/BRook.png", "blackRook", onAssetLoaded);
        new Asset("assets/pieces/WBishop.png", "whiteBishop", onAssetLoaded);
        new Asset("assets/pieces/WKing.png", "whiteKing", onAssetLoaded);
        new Asset("assets/pieces/WKnight.png", "whiteKnight", onAssetLoaded);
        new Asset("assets/pieces/WPawn.png", "whitePawn", onAssetLoaded);
        new Asset("assets/pieces/WQueen.png", "whiteQueen", onAssetLoaded);
        new Asset("assets/pieces/WRook.png", "whiteRook", onAssetLoaded);

        gameBoard.addEventListener("mousedown", (event) => {
            const bounds = gameBoard.getBoundingClientRect();
            const mouseX = event.clientX - bounds.x - 2;
            const mouseY = event.clientY - bounds.y - 2;
            const columnClicked = Math.floor(((mouseX * SCREENSPACECONVERSION) / ctx.canvas.width) * 8);
            const rowClicked = 7 - Math.floor(((mouseY * SCREENSPACECONVERSION) / ctx.canvas.height) * 8);
            // console.log("(col, row): ", columnClicked, rowClicked);
            for (let i = 0; i < gameState.length; i++) {
                if (gameState[i].location[0] === columnClicked &&
                    gameState[i].location[1] === rowClicked) {
                    // console.log("piece clicked: ", gameState[i].colour, gameState[i].type);

                    const thisPiece = gameState[i];
                    gameState[i].held = true;                    
                    possibleMoves = thisPiece.movementMask;

                    let piece = gameState[i];
                    gameState.splice(i, 1);
                    gameState.push(piece);


                    // console.log(gameState);
                    console.log(thisPiece.movementMask);
                    // MAKE IT ONLY SHOW THE PLACES IT CAN MOVE TO, AND ALSO ONLY ACCEPT THOSE WHEN IT GETS PUT DOWN.

                    continuouslyRender = true;
                    drawEverything();
                }
            }
        });

        let mouseX = 0;
        let mouseY = 0;
        document.addEventListener("mousemove", (event) => {
            mouseX = event.clientX;
            mouseY = event.clientY;
        });
        
        document.addEventListener("mouseup", (event) => {
            continuouslyRender = false;
            const bounds = gameBoard.getBoundingClientRect();
            const mouseX = event.clientX - bounds.x - 2;
            const mouseY = event.clientY - bounds.y - 2;
            const columnClicked = Math.floor(((mouseX * SCREENSPACECONVERSION) / ctx.canvas.width) * 8);
            const rowClicked = 7 - Math.floor(((mouseY * SCREENSPACECONVERSION) / ctx.canvas.height) * 8);
            console.log("(col, row)", columnClicked, rowClicked);

            // ADD A THING HERE THAT:
            // checks if the dropped position is valid.
            // if it is, just let the function go on.
            // but if it isn't, then it should just set the piece's "held" to 
            //  false and then exit the function early.

            // If there is another piece already occupying this square, delete it.
            for (let i = 0; i < gameState.length; i++) {
                if (gameState[i].location[0] === columnClicked &&
                    gameState[i].location[1] === rowClicked &&
                    !gameState[i].held) {

                    gameState.splice(i, 1);
                    break;
                }
            }

            // Change this piece's location to be where it was dropped.
            for (let i = 0; i < gameState.length; i++) {
                if (gameState[i].held) {
                    gameState[i].held = false;
                    gameState[i].location = [columnClicked, rowClicked];
                    break;
                }
            }
        });

        function drawEverything() {
            if (continuouslyRender) {
                requestAnimationFrame(drawEverything);
                // console.log("LOOPING");
            }
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            // console.log(gameState);
            drawSquares();
            // gameState is a list of objects with:
            //  piece.type => "King" / "Queen"
            //  piece.location => [x,y] 0-7
            //  piece.colour => "Black" / "White"
            //  piece.movementMask => 2D Array, Row -> Column, Boolean : can move there.

            // Draw possible moves
            for (let i = 0; i < possibleMoves.length; i++) {
                for (let j = 0; j < possibleMoves[i].length; j++) {
                    if (possibleMoves[i][j] === true) {
                        const squareSize = ctx.canvas.width / 8;
                        const row = i;
                        const col = j;
                        ctx.fillStyle = "rgba(255,0,0,0.5)";
                        ctx.fillRect(row * squareSize, col * squareSize, squareSize, squareSize);
                    }
                }
            }

            // Draw all the pieces. Including the held piece (if existent).
            for (let i = 0; i < gameState.length; i++) {
                // console.log(gameState[i].location[0], mouseX);
                if (gameState[i].held) {
                    const bounds = gameBoard.getBoundingClientRect();
                    let posX = mouseX - bounds.x;
                    posX *= SCREENSPACECONVERSION;
                    let posY = mouseY - bounds.y;
                    posY *= SCREENSPACECONVERSION;
                    drawPieceUnbound([posX, posY], gameState[i].type, gameState[i].colour)
                } else {
                    drawPiece(gameState[i].location, gameState[i].type, gameState[i].colour);
                }
            }
        }
        
        function drawSquares() {
            for (let i = 0; i < 64; i++) {
                const column = i % 8; // the letter
                const row = Math.floor(i / 8);
                const squareSize = ctx.canvas.width / 8;
        
                ctx.fillStyle = (i % 2) - (row % 2) === 0 ? DARKSQUARECOLOUR : LIGHTSQUARECOLOUR;
                ctx.fillRect(column * squareSize, (7-row) * squareSize, squareSize, squareSize);
            }
        
            if (!shouldDisplayCoordinates) {
                return;
            }
            
            // Get a list of which squares are currently occupied.
            let isOccupied = [];
            for (let i = 0; i < gameState.length; i++) {
                if (gameState[i].held) {
                    continue;
                }
                const index = gameState[i].location[0] + gameState[i].location[1] * 8;
                isOccupied[index] = true;
            }

            for (let i = 0; i < 64; i++) {                
                if (isOccupied[i] === true) {
                    continue;
                }

                const column = i % 8; // the letter
                const row = Math.floor(i / 8);
                const squareSize = ctx.canvas.width / 8;
        
                ctx.fillStyle = (i % 2) - (row % 2) !== 0 ? DARKSQUARECOLOUR : LIGHTSQUARECOLOUR;
                ctx.font = (ctx.canvas.width * 3 / 64) + "px Verdana";
                ctx.fillText(`${"abcdefgh"[column]}${row+1}`, column * squareSize + 0.27 * squareSize, (8-row) * squareSize - 0.3 * squareSize);
            }
        }
        
        function drawPiece(pos, type, colour) {
            const squareSize = ctx.canvas.width / 8;
            const pieceImage = assetDict[colour + type].image;
            const pieceWidth = pieceImage.width / pieceImage.height * squareSize * 0.8;
            const pieceHeight = squareSize * 0.8;
            ctx.drawImage(
                pieceImage, 
                pos[0] * squareSize + (squareSize - pieceWidth) / 2, 
                (7 - pos[1]) * squareSize + (squareSize - pieceHeight) / 2, 
                pieceWidth, 
                pieceHeight
            );
        }

        function drawPieceUnbound(pos, type, colour) {
            const squareSize = ctx.canvas.width / 8;
            const pieceImage = assetDict[colour + type].image;
            const pieceWidth = pieceImage.width / pieceImage.height * squareSize * 0.8;
            const pieceHeight = squareSize * 0.8;
            ctx.drawImage(
                pieceImage, 
                pos[0] - pieceWidth / 2,
                pos[1] - pieceHeight / 2, 
                pieceWidth, 
                pieceHeight
            );
        }
    });
})

// let ctx;
