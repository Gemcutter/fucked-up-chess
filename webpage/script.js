const socket = io();
let gameState = [];
socket.on('pieces', function(pieceList) {
    gameState = pieceList;
})

// let ctx;
$(document).ready(function() {
    let gameBoard = document.getElementById("gameBoard");
    let ctx = gameBoard.getContext("2d");

    const DARKSQUARECOLOUR = "black";
    const LIGHTSQUARECOLOUR = "#DDDDDD";

    // Setup Options.
    let shouldDisplayCoordinates = false;
    let checkboxShowCoordinates = document.getElementById("ShowCoordinates");
    checkboxShowCoordinates.addEventListener("change", (event) => {
        shouldDisplayCoordinates = checkboxShowCoordinates.checked;
        drawEverything(ctx);
    });

    // Instantiate all the assets (this will also add them to the assetDict);
    new Asset("assets/pieces/BBishop.png", "blackBishop");
    new Asset("assets/pieces/BKing.png", "blackKing");
    new Asset("assets/pieces/BKnight.png", "blackKnight");
    new Asset("assets/pieces/BPawn.png", "blackPawn");
    new Asset("assets/pieces/BQueen.png", "blackQueen");
    new Asset("assets/pieces/BRook.png", "blackRook");
    new Asset("assets/pieces/WBishop.png", "whiteBishop");
    new Asset("assets/pieces/WKing.png", "whiteKing");
    new Asset("assets/pieces/WKnight.png", "whiteKnight");
    new Asset("assets/pieces/WPawn.png", "whitePawn");
    new Asset("assets/pieces/WQueen.png", "whiteQueen");
    new Asset("assets/pieces/WRook.png", "whiteRook");

    // gameState.push({
    //     pos : [0,0],
    //     type : "Bishop",
    //     colour : "Black"
    // });
    
    drawEverything(ctx);
    function drawEverything(ctx) {
        console.log(gameState);
        drawSquares(ctx);
        // gameState is a list of objects with:
        //  piece.type => "King" / "Queen"
        //  piece.location => [x,y] 0-7
        //  piece.colour => "Black" / "White"
        //  piece.movementMask => 2D Array, Row -> Column, Boolean : can move there.
        for (let i = 0; i < gameState.length; i++) {
            drawPiece(ctx, gameState[i].location, gameState[i].type, gameState[i].colour);
        }
    }
    
    function drawSquares(ctx) {
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
    
        for (let i = 0; i < 64; i++) {
            const column = i % 8; // the letter
            const row = Math.floor(i / 8);
            const squareSize = ctx.canvas.width / 8;
    
    
            ctx.fillStyle = (i % 2) - (row % 2) !== 0 ? "black" : "white";
            // ctx.fillStyle = "red";
            ctx.font = (ctx.canvas.width * 3 / 64) + "px Verdana";
            ctx.fillText(`${"abcdefgh"[column]}${row+1}`, column * squareSize + 0.27 * squareSize, (8-row) * squareSize - 0.3 * squareSize);
        }
    }
    
    function drawPiece(ctx, pos, type, colour) {
        const squareSize = ctx.canvas.width / 8;
        // ctx.fillStyle = "red";
        // ctx.fillRect(pos[0] * squareSize, (7 - pos[1]) * squareSize, 64, 64);
        ctx.drawImage(assetDict[colour + type].image, pos[0] * squareSize + 0.1 * squareSize, (7 - pos[1]) * squareSize + 0.1 * squareSize, squareSize * 0.8, squareSize * 0.8);
        // ctx.fillRect(0, 0, 64, 64);
    }
});