const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

app.use(express.static("webpage"))

// define a piece for ease of creation
class Piece {
    constructor(type, [row,col], colour) {
        this.type = type
        this.location = [row,col]
        this.colour = colour
        this.movementMask = []
    }
    defineMask() {
        let pieceMask = getPieceMask()
        this.movementMask = []
        let row = -1;
        for (let i=0;i<64;i++) {
            let column = i%8
            if (column==0) {
                row++
                this.movementMask.push([])
            }
            this.movementMask[row][column] = false
        }
        let vectors = {
            'type':this.type,
            'colour':this.colour,
            'location':this.location
        }
        if (this.type=="Rook"||this.type=="Queen") {
            //current location of the piece
            let startX = this.location[0]
            let startY = this.location[1]
            // -row
            let x = startX
            let y = startY
            vectors["-row"] = []
            let cont = true
            // while the vector is on the board and has not hit a piece
            while (x>0&&cont) {
                x--
                if (pieceMask[x][y]=="") {
                    vectors["-row"].push([x,y])
                }
                else if (pieceMask[x][y]!=this.colour) {
                    vectors["-row"].push([x,y])
                    cont = false
                }
                else {
                    cont = false
                }
            }
            // -col
            x = startX
            y = startY
            vectors["-col"] = []
            while (y>0&&cont) {
                y--
                if (pieceMask[x][y]=="") {
                    vectors["-col"].push([x,y])
                }
                else if (pieceMask[x][y]!=this.colour) {
                    vectors["-col"].push([x,y])
                    cont = false
                }
                else {
                    cont = false
                }
            }
            // +row
            x = startX
            y = startY
            vectors["+row"] = []
            while (x<7&&cont) {
                x++
                if (pieceMask[x][y]=="") {
                    vectors["+row"].push([x,y])
                }
                else if (pieceMask[x][y]!=this.colour) {
                    vectors["+row"].push([x,y])
                    cont = false
                }
                else {
                    cont = false
                }
            }
            // +col
            x = startX
            y = startY
            vectors["+col"] = []
            while (y<7&&cont) {
                y++
                if (pieceMask[x][y]=="") {
                    vectors["+col"].push([x,y])
                }
                else if (pieceMask[x][y]!=this.colour) {
                    vectors["+col"].push([x,y])
                    cont = false
                }
                else {
                    cont = false
                }
            }
        }
        if (this.type=="Bishop"||this.type=="Queen") {
            //current location of the piece
            let startX = this.location[0]
            let startY = this.location[1]
            // -row -col
            let x = startX
            let y = startY
            vectors["-row -col"] = []
            let cont = true
            // while the vector is on the board and has not hit a piece
            while (y>0&&x>0&&cont) {
                x--
                y--
                if (pieceMask[x][y]=="") {
                    vectors["-row -col"].push([x,y])
                }
                else if (pieceMask[x][y]!=this.colour) {
                    vectors["-row -col"].push([x,y])
                    cont = false
                }
                else {
                    cont = false
                }
            }
            // -col
            x = startX
            y = startY
            vectors["+row -col"] = []
            while (x<7&&y>0&&cont) {
                y--
                x++
                if (pieceMask[x][y]=="") {
                    vectors["+row -col"].push([x,y])
                }
                else if (pieceMask[x][y]!=this.colour) {
                    vectors["+row -col"].push([x,y])
                    cont = false
                }
                else {
                    cont = false
                }
            }
            // +row
            x = startX
            y = startY
            vectors["+row +col"] = []
            while (x<7&&y<7&&cont) {
                x++
                y++
                if (pieceMask[x][y]=="") {
                    vectors["+row +col"].push([x,y])
                }
                else if (pieceMask[x][y]!=this.colour) {
                    vectors["+row +col"].push([x,y])
                    cont = false
                }
                else {
                    cont = false
                }
            }
            // +col
            x = startX
            y = startY
            vectors["-row +col"] = []
            while (x>0&&y<7&&cont) {
                x--
                y++
                if (pieceMask[x][y]=="") {
                    vectors["-row +col"].push([x,y])
                }
                else if (pieceMask[x][y]!=this.colour) {
                    vectors["-row +col"].push([x,y])
                    cont = false
                }
                else {
                    cont = false
                }
            }
        }
        for (let vec in vectors) {
            for (let i in vec) {
                
            }
        }
        console.log(vectors)
        if (this.type=="Knight") {

        }
        if (this.type=="Pawn") {

        }
        if (this.type=="King") {
            
        }
        for (let piece in pieceList) {
            if (piece.colour == this.colour) {
                
            }
        }
        return this.movementMask
    }
}
// make Connection class to send outputs to when things change
class Connection {
    constructor(socket) {
        this.socket = socket
    }
}
// make datatypes for each class
let pieceList = []
let connectionDict = {}

function getPieceMask() {
    let pieceMask = []
    for (let i=0;i<8;i++) {
        pieceMask.push([])
        for (let j=0;j<8;j++) {
            pieceMask[i].push("")
        }
    }
    for (let i in pieceList) {
        pieceMask[pieceList[i].location[0]][pieceList[i].location[1]] = pieceList[i].colour
    }
    return pieceMask
}

io.on('connection', function(socket) {
    console.log('User '+socket.id+' connected')
    socket.emit("pieces",pieceList)
    // add connection to the list
    connectionDict[socket.id] = new Connection(socket)

    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', function () {
        console.log('User '+socket.id+' disconnected')
        delete connectionDict[socket.id]
    });
});

function gameSetup() {
    // clear pieceList
    pieceList = []
    // push all the pieces to the list
    pieceList.push(new Piece('Rook',[0,2],"white"))
    pieceList.push(new Piece('Knight',[1,0],"white"))
    pieceList.push(new Piece('Bishop',[2,0],"white"))
    pieceList.push(new Piece('Queen',[3,0],"white"))
    pieceList.push(new Piece('King',[4,0],"white"))
    pieceList.push(new Piece('Bishop',[5,0],"white"))
    pieceList.push(new Piece('Knight',[6,0],"white"))
    pieceList.push(new Piece('Rook',[7,0],"white"))
    for (let i=0;i<8;i++) {
        pieceList.push(new Piece('Pawn',[i,1],"white"))
    }
    pieceList.push(new Piece('Rook',[0,7],"black"))
    pieceList.push(new Piece('Knight',[1,7],"black"))
    pieceList.push(new Piece('Bishop',[2,7],"black"))
    pieceList.push(new Piece('Queen',[3,7],"black"))
    pieceList.push(new Piece('King',[4,7],"black"))
    pieceList.push(new Piece('Bishop',[5,7],"black"))
    pieceList.push(new Piece('Knight',[6,7],"black"))
    pieceList.push(new Piece('Rook',[7,7],"black"))
    for (let i=0;i<8;i++) {
        pieceList.push(new Piece('Pawn',[i,6],"black"))
    }
    for (let piece in pieceList) {
        pieceList[piece].defineMask()
    }
}
gameSetup()
console.log(getPieceMask())
http.listen(3000, function() {
   console.log('listening on *:3000')
})
   