let gameBoard = document.getElementById("gameBoard");
let ctx = gameBoard.getContext("2d");

const DARKSQUARECOLOUR = "black";
const LIGHTSQUARECOLOUR = "#DDDDDD";

// Setup Options.
let shouldDisplayCoordinates = true;
let checkboxShowCoordinates = document.getElementById("ShowCoordinates");
checkboxShowCoordinates.addEventListener("change", (event) => {
    shouldDisplayCoordinates = checkboxShowCoordinates.checked;
    drawEverything(ctx);
});

// Instantiate all the assets (this will also add them to the assetDict);
new Asset("assets/pieces/BBishop.png", "BlackBishop");
new Asset("assets/pieces/BKing.png", "BlackKing");
new Asset("assets/pieces/BKnight.png", "BlackKnight");
new Asset("assets/pieces/BPawn.png", "BlackPawn");
new Asset("assets/pieces/BQueen.png", "BlackQueen");
new Asset("assets/pieces/BRook.png", "BlackRook");
new Asset("assets/pieces/WBishop.png", "WhiteBishop");
new Asset("assets/pieces/WKing.png", "WhiteKing");
new Asset("assets/pieces/WKnight.png", "WhiteKnight");
new Asset("assets/pieces/WPawn.png", "WhitePawn");
new Asset("assets/pieces/WQueen.png", "WhiteQueen");
new Asset("assets/pieces/WRook.png", "WhiteRook");


let pieceList = [];
drawEverything(ctx);
function drawEverything(ctx) {
    drawSquares(ctx);
    for (let i = 0; i < pieceList.length; i++) {

    }
    drawPiece(ctx, [5,6], "Bishop", "White");
}

function drawSquares(ctx) {
    for (let i = 0; i < 64; i++) {
        const column = i % 8; // the letter
        const row = Math.floor(i / 8);
        const squareSize = ctx.canvas.width / 8;

        // console.log(row, column);

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

function drawPieces(pieceList) {
    // pieceList is a list of objects with:
    //  piece.type => "King" / "Queen"
    //  piece.location => [x,y] 0-7
    //  piece.colour => "Black" / "White"
    //  piece.movementMask => 2D Array, Row -> Column, Boolean : can move there.

}

function drawPiece(ctx, pos, type, colour) {
    const squareSize = ctx.canvas.width / 8;
    // ctx.fillStyle = "red";
    // ctx.fillRect(pos[0] * squareSize, (7 - pos[1]) * squareSize, 64, 64);
    ctx.drawImage(assetDict[colour + type].image, pos[0] * squareSize + 0.1 * squareSize, (7 - pos[1]) * squareSize + 0.1 * squareSize, squareSize * 0.8, squareSize * 0.8);
    // ctx.fillRect(0, 0, 64, 64);
}