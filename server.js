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
    defineMask() {}
}

class Bishop extends Piece {
    constructor([row,col], colour) {
        super("Bishop",[row,col],colour)
    }
    defineMask() {
        let pieceMask = getPieceMask()
        this.movementMask = []
        for (let i=0;i<8;i++) {
            this.movementMask.push([])
            for (let j=0;j<8;j++) {
                this.movementMask[i].push(false)
            }
        }
        for (let i = 0; i<4; i++) {
            let row = this.location[0]
            let col = this.location[1]
            let firstLoop = true
            while(row>=0&&col>=0&&row<=7&&col<=7) {
                if (!firstLoop) {
                    if (pieceMask[row][col].colour==this.colour) {
                        break
                    }
                    else if (pieceMask[row][col]=="") {
                        this.movementMask[row][col] = true
                    }
                    else {
                        this.movementMask[row][col] = true
                        break
                    }
                }
                if (i<2) {
                    row--
                }
                else {
                    row++
                }
                if (i%2==0) {
                    col--
                }
                else {
                    col++
                }
                firstLoop=false
            }
        }
        return this.movementMask
    }
}
class Rook extends Piece {
    constructor([row,col], colour) {
        super("Rook",[row,col],colour)
    }
    defineMask() {
        let pieceMask = getPieceMask()
        this.movementMask = []
        for (let i=0;i<8;i++) {
            this.movementMask.push([])
            for (let j=0;j<8;j++) {
                this.movementMask[i].push(false)
            }
        }
        for (let i = 0; i<4; i++) {
            let row = this.location[0]
            let col = this.location[1]
            let firstLoop = true
            while(row>=0&&col>=0&&row<=7&&col<=7) {
                if (!firstLoop) {
                    if (pieceMask[row][col].colour==this.colour) {
                        break
                    }
                    else if (pieceMask[row][col]=="") {
                        this.movementMask[row][col] = true
                    }
                    else {
                        this.movementMask[row][col] = true
                        break
                    }
                }
                if (i==0) {
                    row--
                }
                else if (i==1) {
                    row++
                }
                else if (i==2) {
                    col--
                }
                else {
                    col++
                }
                firstLoop=false
            }
        }
        return this.movementMask
    }
}

class Queen extends Piece {
    constructor([row,col], colour) {
        super("Queen",[row,col],colour)
        
    }
    defineMask() {
        let pieceMask = getPieceMask()
        this.movementMask = []
        for (let i=0;i<8;i++) {
            this.movementMask.push([])
            for (let j=0;j<8;j++) {
                this.movementMask[i].push(false)
            }
        }
        for (let i = 0; i<4; i++) {
            let row = this.location[0]
            let col = this.location[1]
            let firstLoop = true
            while(row>=0&&col>=0&&row<=7&&col<=7) {
                if (!firstLoop) {
                    if (pieceMask[row][col].colour==this.colour) {
                        break
                    }
                    else if (pieceMask[row][col]=="") {
                        this.movementMask[row][col] = true
                    }
                    else {
                        this.movementMask[row][col] = true
                        break
                    }
                }
                if (i==0) {
                    row--
                }
                else if (i==1) {
                    row++
                }
                else if (i==2) {
                    col--
                }
                else {
                    col++
                }
                firstLoop=false
            }
        }
        for (let i = 0; i<4; i++) {
            let row = this.location[0]
            let col = this.location[1]
            let firstLoop = true
            while(row>=0&&col>=0&&row<=7&&col<=7) {
                if (!firstLoop) {
                    if (pieceMask[row][col].colour==this.colour) {
                        break
                    }
                    else if (pieceMask[row][col]=="") {
                        this.movementMask[row][col] = true
                    }
                    else {
                        this.movementMask[row][col] = true
                        break
                    }
                }
                if (i<2) {
                    row--
                }
                else {
                    row++
                }
                if (i%2==0) {
                    col--
                }
                else {
                    col++
                }
                firstLoop=false
            }
        }
        return this.movementMask
    }
}
class Knight extends Piece {
    constructor([row,col], colour) {
        super("Knight",[row,col],colour)
    }
    defineMask() {
        let pieceMask = getPieceMask()
        this.movementMask = []
        for (let i=0;i<8;i++) {
            this.movementMask.push([])
            for (let j=0;j<8;j++) {
                this.movementMask[i].push(false)
            }
        }
        for (let i=0; i<4; i++) {
            let row = this.location[0]
            let col = this.location[1]
            if (i==0) {
                row+=2
            }
            else if (i==1) {
                row-=2
            }
            else if (i==2) {
                col+=2
            }
            else {
                col-=2
            }
            for (let j=0;j<2;j++) {
                if (i<2) {
                    col = this.location[1]
                    if (j==0) {
                        col--
                    }
                    else {
                        col++
                    }
                }
                else {
                    row = this.location[0]
                    if (j==0) {
                        row--
                    }
                    else {
                        row++
                    }
                }
                if (row<0||col<0||row>7||col>7) {
                    continue
                }
                if (pieceMask[row][col].colour==this.colour) {
                    continue
                }
                else {
                    this.movementMask[row][col] = true
                }
            }
        }
        return this.movementMask
    }
}
class King extends Piece {
    constructor([row,col], colour) {
        super("King",[row,col],colour)
    }
    defineMask() {
        let pieceMask = getPieceMask()
        this.movementMask = []
        for (let i=0;i<8;i++) {
            this.movementMask.push([])
            for (let j=0;j<8;j++) {
                this.movementMask[i].push(false)
            }
        }
        for (let i=0;i<9;i++) {
            let row = this.location[0]
            let col = this.location[1]
            if (i<3) {
                row++
            }
            else if (i<6) {
                row--
            }
            if (i%3==0) {
                col++
            }
            else if (i%3==1) {
                col--
            }
            if (row<0||col<0||row>7||col>7) {
                continue
            }
            if (row==this.location[0]&&col==this.location[1]) {
                continue
            }
            if (pieceMask[row][col].colour==this.colour) {
                continue
            }
            this.movementMask[row][col] = true
        }
        
        return this.movementMask
    }
}

class Pawn extends Piece {
    constructor([row,col], colour) {
        super("Pawn",[row,col],colour)
        this.hasMoved = false
        this.justTwoStepped = false
    }
    defineMask() {
        let pieceMask = getPieceMask()
        this.movementMask = []
        for (let i=0;i<8;i++) {
            this.movementMask.push([])
            for (let j=0;j<8;j++) {
                this.movementMask[i].push(false)
            }
        }
        if (this.colour=="white") {
            if (pieceMask[this.location[0]][this.location[1]+1]=="") {
                this.movementMask[this.location[0]][this.location[1]+1]=true
                if (pieceMask[this.location[0]][this.location[1]+2]==""&&!this.hasMoved) {
                    this.movementMask[this.location[0]][this.location[1]+2]=true
                }
            }
            
            if (this.location[0]+1<=7&&this.location[1]-1<=7) {
                if (pieceMask[this.location[0]+1][this.location[1]+1].colour=="black"||pieceMask[this.location[0]+1][this.location[1]].colour=="black"&&pieceMask[this.location[0]+1][this.location[1]].type=="Pawn"&&pieceMask[this.location[0]+1][this.location[1]].justTwoStepped==true) {
                    this.movementMask[this.location[0]+1][this.location[1]+1]=true
                }
            }
            if (this.location[0]-1>=0&&this.location[1]-1<=7) {
                if (pieceMask[this.location[0]-1][this.location[1]+1].colour=="black"||pieceMask[this.location[0]-1][this.location[1]].colour=="black"&&pieceMask[this.location[0]-1][this.location[1]].type=="Pawn"&&pieceMask[this.location[0]-1][this.location[1]].justTwoStepped==true) {
                    this.movementMask[this.location[0]-1][this.location[1]+1]=true
                }
            }
        }
        else {
            if (pieceMask[this.location[0]][this.location[1]-1]=="") {
                this.movementMask[this.location[0]][this.location[1]-1]=true
                if (pieceMask[this.location[0]][this.location[1]-2]==""&&!this.hasMoved) {
                    this.movementMask[this.location[0]][this.location[1]-2]=true
                }
            }
            if (this.location[0]+1<=7&&this.location[1]-1>=0) {
                if (pieceMask[this.location[0]+1][this.location[1]-1].colour=="white"||pieceMask[this.location[0]+1][this.location[1]].colour=="white"&&pieceMask[this.location[0]+1][this.location[1]].type=="Pawn"&&pieceMask[this.location[0]+1][this.location[1]].justTwoStepped==true) {
                    this.movementMask[this.location[0]+1][this.location[1]-1]=true
                }
            }
            if (this.location[0]-1>=0&&this.location[1]-1>=0) {
                if (pieceMask[this.location[0]-1][this.location[1]-1].colour=="white"||pieceMask[this.location[0]-1][this.location[1]].colour=="blac"&&pieceMask[this.location[0]-1][this.location[1]].type=="Pawn"&&pieceMask[this.location[0]-1][this.location[1]].justTwoStepped==true) {
                    this.movementMask[this.location[0]-1][this.location[1]-1]=true
                }
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
        pieceMask[pieceList[i].location[0]][pieceList[i].location[1]] = pieceList[i]
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
    pieceList.push(new Rook([0,0],"white"))
    pieceList.push(new Knight([1,0],"white"))
    pieceList.push(new Bishop([2,0],"white"))
    pieceList.push(new Queen([3,0],"white"))
    pieceList.push(new King([4,0],"white"))
    pieceList.push(new Bishop([5,0],"white"))
    pieceList.push(new Knight([6,0],"white"))
    pieceList.push(new Rook([7,0],"white"))
    for (let i=0;i<8;i++) {
        pieceList.push(new Pawn([i,1],"white"))
    }
    let a = new Pawn([5,3],"white")
    a.justTwoStepped=true
    a.hasMoved=true
    pieceList.push(a)
    pieceList.push(new Pawn([4,3],"black"))
    pieceList.push(new Rook([0,7],"black"))
    pieceList.push(new Knight([1,7],"black"))
    pieceList.push(new Bishop([2,7],"black"))
    pieceList.push(new Queen([3,7],"black"))
    pieceList.push(new King([4,7],"black"))
    pieceList.push(new Bishop([5,7],"black"))
    pieceList.push(new Knight([6,7],"black"))
    pieceList.push(new Rook([7,7],"black"))
    for (let i=0;i<8;i++) {
        pieceList.push(new Pawn([i,6],"black"))
    }
    for (piece in pieceList) {
        pieceList[piece].defineMask()
    }
}
gameSetup()
getPieceMask()
http.listen(3000, function() {
   console.log('listening on *:3000')
})
   