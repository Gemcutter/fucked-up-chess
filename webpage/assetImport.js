class Asset {
    constructor (path, name) {
        const img = document.createElement("img");
        img.src = path;
        this.image = img;
        this.name = name;
    }
}


let pieceArt = [];

const pieceArtSRCs = [
    "assets/pieces/BBishop",
    "assets/pieces/BKing",
    "assets/pieces/BKnight",
    "assets/pieces/BPawn",
    "assets/pieces/BQueen",
    "assets/pieces/BRook",
    "assets/pieces/WBishop",
    "assets/pieces/WKing",
    "assets/pieces/WKnight",
    "assets/pieces/WPawn",
    "assets/pieces/WQueen",
    "assets/pieces/WRook"
];

for (let i = 0; i < 12; i++) {
    let img = document.createElement("img");
    img.src = pieceArtSRCs[i];
    pieceArt.push(img);
}

const indices = [];


console.log(pieceArt);
