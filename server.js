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
    verifyMask(list) {
        for (let i in this.movementMask) {
            for (let j in this.movementMask[i]) {
                if (!this.movementMask[i][j]) {
                    continue
                }
                let testCoverMasks = clearCoverMasks()
                let checkState = copyArray(list)
                checkState, dump = processMove(checkState, generateClonePiece(this), [parseInt(i),parseInt(j)])
                for (let l in checkState) {
                    checkState[l].defineMask(checkState, testCoverMasks)
                }
                for (let l in checkState) {
                    if (checkState[l].type=="King"&&checkState[l].colour == this.colour) {
                        if (checkState[l].isInCheck(testCoverMasks)) {
                            this.movementMask[i][j] = false
                        }
                    }
                }
            }
        }
    }
}

class Bishop extends Piece {
    constructor([row,col], colour) {
        super("Bishop",[row,col],colour)
        this.value = 3
    }
    defineMask(list, coverMasks) {
        let pieceMask = getPieceMask(list)
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
            let postKing = false
            while(row>=0&&col>=0&&row<=7&&col<=7) {
                if (!firstLoop) {
                    if (pieceMask[row][col].colour==this.colour) {
                        coverMasks[this.colour][row][col] = true
                        break
                    }
                    else if (pieceMask[row][col]=="") {
                        coverMasks[this.colour][row][col] = true
                        if (!postKing) {
                            this.movementMask[row][col] = true
                        }
                    }
                    else if (pieceMask[row][col].type=="King") {
                        postKing=true
                        coverMasks[this.colour][row][col] = true
                        this.movementMask[row][col] = true
                    }
                    else if (!postKing) {
                        coverMasks[this.colour][row][col] = true
                        this.movementMask[row][col] = true
                        break
                    }
                    else {
                        coverMasks[this.colour][row][col] = true
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
        this.value = 5
        this.hasMoved = false
    }
    defineMask(list, coverMasks) {
        let pieceMask = getPieceMask(list)
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
            let postKing = false
            while(row>=0&&col>=0&&row<=7&&col<=7) {
                if (!firstLoop) {
                    if (pieceMask[row][col].colour==this.colour) {
                        coverMasks[this.colour][row][col] = true
                        break
                    }
                    else if (pieceMask[row][col]=="") {
                        coverMasks[this.colour][row][col] = true
                        if (!postKing) {
                            this.movementMask[row][col] = true
                        }
                    }
                    else if (pieceMask[row][col].type=="King") {
                        postKing=true
                        coverMasks[this.colour][row][col] = true
                        this.movementMask[row][col] = true
                    }
                    else if (!postKing) {
                        coverMasks[this.colour][row][col] = true
                        this.movementMask[row][col] = true
                        break
                    }
                    else {
                        coverMasks[this.colour][row][col] = true
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
        this.value = 9
        
    }
    defineMask(list, coverMasks) {
        let pieceMask = getPieceMask(list)
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
            let postKing = false
            while(row>=0&&col>=0&&row<=7&&col<=7) {
                if (!firstLoop) {
                    if (pieceMask[row][col].colour==this.colour) {
                        coverMasks[this.colour][row][col] = true
                        break
                    }
                    else if (pieceMask[row][col]=="") {
                        coverMasks[this.colour][row][col] = true
                        if (!postKing) {
                            this.movementMask[row][col] = true
                        }
                    }
                    else if (pieceMask[row][col].type=="King") {
                        postKing=true
                        coverMasks[this.colour][row][col] = true
                        this.movementMask[row][col] = true
                    }
                    else if (!postKing) {
                        coverMasks[this.colour][row][col] = true
                        this.movementMask[row][col] = true
                        break
                    }
                    else {
                        coverMasks[this.colour][row][col] = true
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
            let postKing = false
            while(row>=0&&col>=0&&row<=7&&col<=7) {
                if (!firstLoop) {
                    if (pieceMask[row][col].colour==this.colour) {
                        coverMasks[this.colour][row][col] = true
                        break
                    }
                    else if (pieceMask[row][col]=="") {
                        coverMasks[this.colour][row][col] = true
                        if (!postKing) {
                            this.movementMask[row][col] = true
                        }
                    }
                    else if (pieceMask[row][col].type=="King") {
                        postKing=true
                        coverMasks[this.colour][row][col] = true
                        this.movementMask[row][col] = true
                    }
                    else if (!postKing) {
                        coverMasks[this.colour][row][col] = true
                        this.movementMask[row][col] = true
                        break
                    }
                    else {
                        coverMasks[this.colour][row][col] = true
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
        this.value = 3
    }
    defineMask(list, coverMasks) {
        let pieceMask = getPieceMask(list)
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
                    coverMasks[this.colour][row][col] = true
                    continue
                }
                else {
                    coverMasks[this.colour][row][col] = true
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
        this.value = 0
        this.hasMoved = false
    }
    defineMask(list, coverMasks) {
        let pieceMask = getPieceMask(list)
        this.movementMask = []
        for (let i=0;i<8;i++) {
            this.movementMask.push([])
            for (let j=0;j<8;j++) {
                this.movementMask[i].push(false)
            }
        }
        if (!this.hasMoved) {
            for (let i in list) {
                if (list[i].type=="Rook"&&!list[i].hasMoved&&list[i].colour==this.colour) {
                    if (list[i].location[0]==0&&
                        pieceMask[1][this.location[1]]==""&&
                        pieceMask[2][this.location[1]]==""&&
                        pieceMask[3][this.location[1]]=="") {
                            this.movementMask[parseInt(this.location[0])-2][this.location[1]] = true
                    }
                    else if (list[i].location[0]==7&&
                        pieceMask[5][this.location[1]]==""&&
                        pieceMask[6][this.location[1]]=="") {
                            this.movementMask[parseInt(this.location[0])+2][this.location[1]] = true
                    }
                }
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
            coverMasks[this.colour][row][col] = true
            if (pieceMask[row][col].colour==this.colour) {
                continue
            }
            this.movementMask[row][col] = true
        }
        
        return this.movementMask
    }
    updateMask() {
        for (let i in this.movementMask) {
            for (let j in this.movementMask[i]) {
                if (this.movementMask[i][j]) {
                    if (coverMasks[oppositeColour(this.colour)][i][j]) {
                        this.movementMask[i][j]=false
                    }
                    if (parseInt(i)+1>7||parseInt(i)-1<0) {
                        continue
                    }
                    if (parseInt(this.location[0])-2==parseInt(i)&&(coverMasks[oppositeColour(this.colour)][parseInt(i)+1][j]||coverMasks[oppositeColour(this.colour)][this.location[0]][this.location[1]])) {
                        this.movementMask[i][j]=false
                    }
                    else if (parseInt(this.location[0])+2==parseInt(i)&&(coverMasks[oppositeColour(this.colour)][parseInt(i)-1][j]||coverMasks[oppositeColour(this.colour)][this.location[0]][this.location[1]])) {
                        this.movementMask[i][j]=false
                    }
                }
            }
        }
    }
    isInCheck(coverMasks) {
        if (coverMasks[oppositeColour(this.colour)][this.location[0]][this.location[1]]) {
            return true
        }
        return false
    }
}

class Pawn extends Piece {
    constructor([row,col], colour) {
        super("Pawn",[row,col],colour)
        this.hasMoved = false
        this.justTwoStepped = false
        this.value = 1
    }
    defineMask(list, coverMasks) {
        let pieceMask = getPieceMask(list)
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
            if (this.location[0]+1<=7&&this.location[1]+1<=7) {
                coverMasks[this.colour][this.location[0]+1][this.location[1]+1] = true
                if (pieceMask[this.location[0]+1][this.location[1]+1].colour=="black"||pieceMask[this.location[0]+1][this.location[1]].colour=="black"&&pieceMask[this.location[0]+1][this.location[1]].type=="Pawn"&&pieceMask[this.location[0]+1][this.location[1]].justTwoStepped==true) {
                    this.movementMask[this.location[0]+1][this.location[1]+1]=true
                }
            }
            if (this.location[0]-1>=0&&this.location[1]+1<=7) {
                coverMasks[this.colour][this.location[0]-1][this.location[1]+1] = true
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
                coverMasks[this.colour][this.location[0]+1][this.location[1]-1] = true
                if (pieceMask[this.location[0]+1][this.location[1]-1].colour=="white"||pieceMask[this.location[0]+1][this.location[1]].colour=="white"&&pieceMask[this.location[0]+1][this.location[1]].type=="Pawn"&&pieceMask[this.location[0]+1][this.location[1]].justTwoStepped==true) {
                    this.movementMask[this.location[0]+1][this.location[1]-1]=true
                }
            }
            if (this.location[0]-1>=0&&this.location[1]-1>=0) {
                coverMasks[this.colour][this.location[0]-1][this.location[1]-1] = true
                if (pieceMask[this.location[0]-1][this.location[1]-1].colour=="white"||pieceMask[this.location[0]-1][this.location[1]].colour=="white"&&pieceMask[this.location[0]-1][this.location[1]].type=="Pawn"&&pieceMask[this.location[0]-1][this.location[1]].justTwoStepped==true) {
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
        if (getDictLen(connectionDict)==0) {
            this.colour = 'white'
        }
        else if (getDictLen(connectionDict)==1) {
            this.colour = oppositeColour(getOtherPlayerColour(socket.id))
        }
        else {
            let whiteExists = false
            let blackExists = false
            for (let i in connectionDict) {
                if (connectionDict[i].colour=='white') {
                    whiteExists=true
                }
                else if (connectionDict[i].colour=='black') {
                    blackExists=true
                }
            }
            if (!blackExists) {
                this.colour = 'black'
            }
            else if (!whiteExists) {
                this.colour = 'white'
            }
            else {
                this.colour = 'none'
            }
        }
    }
}
// make datatypes for each class
let gameOver = false
var pieceList = []
let connectionDict = {}
let turn = "white"
let dump
let movedSquares = []
let points = {
    'black':0,
    'white':0
}
let coverMasks = {
    'black':[],
    'white':[]
}

function getOtherPlayerColour(myId) {
    for (let i in connectionDict) {
        if (i!=myId&&connectionDict[i].colour!='none') {
            return connectionDict[i].colour
        }
    }
}
function getDictLen(dict) {
    let len = 0
    for (let i in dict) {
        len++
    }
    return len
}

function processMove(list, piece, location) {
    let pieceMask = getPieceMask(list)
    let indexToTake = false
    let moves = []
    for (let i in list) {
        if (list[i].location[0] == location[0]&&list[i].location[1] == location[1]) {
            // here list[i] refers to the piece being taken (normally)
            points[piece.colour]+=list[i].value
            indexToTake = i
            
        }
        else if (list[i].location[0] == piece.location[0]&&list[i].location[1] == piece.location[1]) {
            // here list[i] refers to the piece moving
            if (piece.type=="Pawn"||piece.type=="Rook"||piece.type=="King") {
                list[i].hasMoved=true
                if (piece.location[1]==location[1]+2||piece.location[1]==location[1]-2&&piece.type=="Pawn") {
                    list[i].justTwoStepped=true
                }
            }
            if (piece.type=="King") {
                for (let j in list) {
                    if (list[j].type=="Rook"&&!list[j].hasMoved&&list[j].colour==piece.colour) {
                        if (parseInt(piece.location[0])-2==parseInt(location[0])&&parseInt(list[j].location[0])==0) {
                            moves.push(list[j].location)
                            moves.push([parseInt(location[0])+1,parseInt(location[1])])
                            list[j].location = [parseInt(location[0])+1,parseInt(location[1])]
                        }
                        else if (parseInt(piece.location[0])+2==parseInt(location[0])&&parseInt(list[j].location[0])==7) {
                            moves.push(list[j].location)
                            moves.push([parseInt(location[0])-1,parseInt(location[1])])
                            list[j].location = [parseInt(location[0])-1,parseInt(location[1])]
                        }
                    }
                }
            }
            moves.push(list[i].location)
            moves.push(location)
            list[i].location = location
        }
        else if (piece.type=="Pawn"&&piece.location[0]!=location[0]&&pieceMask[location[0]][location[1]]=="") {
            if (list[i].location[0]==location[0]&&list[i].location[1]==piece.location[1]) {
                // here list[i] refers to the piece being taken (en passant)
                points[piece.colour]+=list[i].value
                indexToTake = i
            }
        }
    }
    if (indexToTake) {
        list.splice(indexToTake,1)
    }
    return list, moves
}


function getPieceMask(list) {
    let pieceMask = []
    for (let i=0;i<8;i++) {
        pieceMask.push([])
        for (let j=0;j<8;j++) {
            pieceMask[i].push("")
        }
    }
    for (let i in list) {
        pieceMask[list[i].location[0]][list[i].location[1]] = list[i]
    }
    return pieceMask
}

io.on('connection', function(socket) {
    console.log('User '+socket.id+' connected')
    // add connection to the list
    connectionDict[socket.id] = new Connection(socket)

    socket.emit("pieces",pieceList, connectionDict[socket.id].colour)
    socket.on('sendMove', function(piece, location) {
        if (gameOver) {
            gameSetup()
            gameOver = false
            for (let player in connectionDict) {
                if (connectionDict[player].colour!="none") {
                    connectionDict[player].colour = oppositeColour(connectionDict[player].colour)
                }
                connectionDict[player].socket.emit('pieces', pieceList, connectionDict[player].colour, movedSquares)
            }
            return
        }
        let pieceMask = getPieceMask(pieceList)
        if (location[0]>7||location[1]>7||location[0]<0||location[1]<0) {
            socket.emit('pieces', pieceList, connectionDict[socket.id].colour, movedSquares)
            return
        }
        let tmpPieceList = copyArray(pieceList)
        if (connectionDict[socket.id].colour==turn&&piece.colour==turn&&pieceMask[piece.location[0]][piece.location[1]].type == piece.type) {
            if (pieceMask[piece.location[0]][piece.location[1]].movementMask[location[0]][[location[1]]]) {
                for (let i in tmpPieceList) {
                    if (tmpPieceList[i].type=="Pawn") {
                        tmpPieceList[i].justTwoStepped=false
                    }
                }
                //process move
                movedSquares = []
                tmpPieceList, movedSquares = processMove(tmpPieceList, piece, location)
                coverMasks = clearCoverMasks()
                for (let i in tmpPieceList) {
                    tmpPieceList[i].defineMask(tmpPieceList, coverMasks)
                }
                for (let i in tmpPieceList) {
                    if (tmpPieceList[i].type=="King") {
                        tmpPieceList[i].updateMask()
                        if (tmpPieceList[i].colour == turn) {
                            if (!tmpPieceList[i].isInCheck(coverMasks)) {
                                pieceList = copyArray(tmpPieceList)
                            }
                            else {
                                socket.emit('pieces', pieceList, connectionDict[socket.id].colour, movedSquares)
                                return
                            }
                        }
                    }
                    tmpPieceList[i].verifyMask(tmpPieceList)
                }
                let isCheckmate = true
                for (let a in pieceList) {
                    if (pieceList[a].type=="King"&&pieceList[a].colour == oppositeColour(turn)) { // find enemy king
                        if (!pieceList[a].isInCheck(coverMasks)) { // if enemy king not in check then ignore
                            isCheckmate=false
                            break
                        }
                        for (let i in pieceList) {
                            if (pieceList[i].colour==turn) { // if the piece is yours ignore
                                continue
                            }
                            for (let j in pieceList[i].movementMask) {
                                for (let k in pieceList[i].movementMask[j]) {
                                    if (pieceList[i].movementMask[j][k]) { // if the location is possible
                                        let checkState = copyArray(pieceList)
                                        checkState, dump = processMove(checkState, checkState[i], [parseInt(j),parseInt(k)])
                                        let testCoverMasks = clearCoverMasks()
                                        for (let l in checkState) {
                                            checkState[l].defineMask(checkState, testCoverMasks)
                                        }
                                        for (let l in checkState) {
                                            if (pieceList[i].type=="King") {
                                                pieceList[i].updateMask()
                                            }
                                            checkState[l].verifyMask(checkState)
                                        }
                                        for (let l in checkState) {
                                            if (checkState[l].type=="King"&&checkState[l].colour == oppositeColour(turn)) {
                                                if (!checkState[l].isInCheck(testCoverMasks)) { 
                                                    isCheckmate=false
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        
                    }
                }
                let isStaleMate = true
                for (let i in pieceList) {
                    if (pieceList[i].colour==connectionDict[socket.id].colour) {
                        continue
                    }
                    for (let j in pieceList[i].movementMask) {
                        for (let k in pieceList[i].movementMask[j]) {
                            if (pieceList[i].movementMask[j][k]) {
                                isStaleMate = false
                                break
                            }
                        }
                        if (!isStaleMate) {
                            break
                        }
                    }
                    if (!isStaleMate) {
                        break
                    }
                }
                if (turn == "white") {
                    turn = 'black'
                }
                else {
                    turn = 'white'
                }
                for (let player in connectionDict) {
                    connectionDict[player].socket.emit('pieces', pieceList, connectionDict[player].colour, movedSquares)
                    if (isCheckmate) {
                        gameOver = true
                        connectionDict[player].socket.emit('gameOver', connectionDict[socket.id].colour)
                    }
                    else if (isStaleMate) {
                        gameOver = true
                        connectionDict[player].socket.emit('gameOver', 'none')
                    }
                }
            }
            else {
                socket.emit('pieces', pieceList, connectionDict[socket.id].colour, movedSquares)
            }
        }
        else {
            socket.emit('pieces', pieceList, connectionDict[socket.id].colour, movedSquares)
        }
    })
    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', function() {
        console.log('User '+socket.id+' disconnected')
        delete connectionDict[socket.id]
    });
});

function oppositeColour(colour) {
    if (colour=="black") {
        return "white"
    }
    else {
        return "black"
    }
}

function generateClonePiece(piece) {
    let duplicate
    if (piece.type =="Pawn") {
        duplicate = new Pawn(piece.location, piece.colour)
        duplicate.hasMoved = piece.hasMoved
        duplicate.movementMask = piece.movementMask
        duplicate.justTwoStepped = piece.justTwoStepped

    }
    else if (piece.type =="Rook") {
        duplicate = new Rook(piece.location, piece.colour)
        duplicate.movementMask = piece.movementMask
        duplicate.hasMoved = piece.hasMoved
    }
    else if (piece.type =="Knight") {
        duplicate = new Knight(piece.location, piece.colour)
        duplicate.movementMask = piece.movementMask
    }
    else if (piece.type =="Bishop") {
        duplicate = new Bishop(piece.location, piece.colour)
        duplicate.movementMask = piece.movementMask
    }
    else if (piece.type =="King") {
        duplicate = new King(piece.location, piece.colour)
        duplicate.movementMask = piece.movementMask
        duplicate.hasMoved = piece.hasMoved
    }
    else if (piece.type =="Queen") {
        duplicate = new Queen(piece.location, piece.colour)
        duplicate.movementMask = piece.movementMask
    }
    return duplicate
}

function copyArray(arr) {
    tmp = []
    for (let i in arr) {
        tmp.push(generateClonePiece(arr[i]))
    }
    return tmp
}
function clearCoverMasks() {
    let myCoverMasks = {
        'black':[],
        'white':[]
    }
    for (let colour in myCoverMasks) {
        myCoverMasks[colour]=[]
        for (let i=0;i<8;i++) {
            myCoverMasks[colour].push([])
            for (let j=0;j<8;j++) {
                myCoverMasks[colour][i].push(false)
            }
        }
    }
    return myCoverMasks
}

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
    
    // pieceList.push(new Rook([5,7],"black"))
    // pieceList.push(new King([1,7],"black"))
    // pieceList.push(new Rook([7,0],"white"))
    // pieceList.push(new King([4,0],"white"))
    coverMasks = clearCoverMasks()
    for (let i in pieceList) {
        pieceList[i].defineMask(pieceList, coverMasks)
    }
    for (let i in pieceList) {
        if (pieceList[i].type=="King") {
            pieceList[i].updateMask()
        }
        pieceList[i].verifyMask(pieceList)
    }
    turn = 'white'
}
gameSetup()
http.listen(3000, function() {
   console.log('listening on *:3000')
})