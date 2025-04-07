let gameBoard = document.getElementById("gameBoard");
let ctx = gameBoard.getContext("2d");

const DARKSQUARECOLOUR = "black";
const LIGHTSQUARECOLOUR = "white";

// Setup Options.
let shouldDisplayCoordinates = true;
let checkboxShowCoordinates = document.getElementById("ShowCoordinates");
checkboxShowCoordinates.addEventListener("change", (event) => {
    shouldDisplayCoordinates = checkboxShowCoordinates.checked;
    drawSquares(ctx);
});

// document.onload(drawSquares(ctx);)
drawSquares(ctx);
drawPiece(ctx, [5,6], "Bishop", "White");

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
    ctx.fillStyle = "red";
    ctx.fillRect(pos[0] * squareSize, (7 - pos[1]) * squareSize, 64, 64);
    // ctx.fillRect(0, 0, 64, 64);
}