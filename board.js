class Board {
    setSideSize(sideSize) {
        this.sideSize = sideSize;
    }

    setVisible(visible) {
        this.visible = visible;
    }

    getSideSize() {
        return this.sideSize;
    }

    getBoard() {
        return board;
    }

    setBoard(board) {
        this.board = board;
    }

    isVisible() {
        return visible;
    }

    //Constructor
    constructor(size, visible, ships) {
        this.sideSize = size;
        this.visible = visible;
        this.ships = ships
        this.board = [];
        this.shipI = this.ships.length -1
        this.currShip = this.ships[this.shipI]
        this.squareConstruction();
    }

    squareConstruction() {
        for (let y = 0; y <this.sideSize; y++) {
            this.board.push([]);
            for (let x = 0; x <this.sideSize; x++) {
                this.board[y].push({coord: [y,x], status: GameSettings.squareStatus[0]});
            }
        }
    }

    //Getter position
    getSquare(x, y) {
        if (x < this.sideSize && x >= 0 && y < this.sideSize && y >= 0 && this.board  != null && this.board[x][y] != null){
            return this.board[x][y];
        }
        return null;
    }

    getPositionStatus(x, y) {
        if (x < this.sideSize && x >= 0 && y < this.sideSize && y >= 0 && this.board != null && this.board[x][y] != null){
            return this.board[x][y].status;
        }
        return "none";
    }

    isAnybodyAlive(){
        for (let y = 0; y <this.sideSize; y++) {
            for (let x = 0; x <this.sideSize; x++) {
                if (this.board[x][y].status == GameSettings.squareStatus[3]) return true
            }
        }
        return false
    }

    fire(cell, name){
        let x = +cell.dataset.row;
        let y = +cell.dataset.col;
        if((this.getPositionStatus(x, y) == GameSettings.squareStatus[0]) || (this.getPositionStatus(x, y) == GameSettings.squareStatus[1]) || (this.getPositionStatus(x, y) == GameSettings.squareStatus[3])){
            if (this.getPositionStatus(x, y) == GameSettings.squareStatus[3]){
                let sqr = this.getSquare(x,y)
                sqr.status = GameSettings.squareStatus[4]
                if (this.isAnybodyAlive()) {
                    return 1
                } else {
                    return 2
                }
            } else {
                if ((this.getPositionStatus(x, y) == GameSettings.squareStatus[0]) || (this.getPositionStatus(x, y) == GameSettings.squareStatus[1])){
                    let sqr = this.getSquare(x,y)
                    sqr.status = GameSettings.squareStatus[2]
                    return 0
                }
            }
        }
        else{
            if ((this.getPositionStatus(x, y) == GameSettings.squareStatus[2]) || (this.getPositionStatus(x, y) == GameSettings.squareStatus[4])){
                if (name == "Player")
                    alert("Commader you've already stroke this spot! Choose another")
            }
            return -1
        }
    }

    transient(row, col, shipArray){
        let isNearArr = []
        if (row >= 0 && col >= 0){
            for (let i = -1; i < 2; i++){
                for (let j = -1; j < 2; j++) {
                    if (!shipArray.find(x => x[0] == row + i && x[1] == col + j)){
                        if (row + i >= 0 && col + j >= 0 && row + i < this.sideSize && col + j < this.sideSize){
                            if(this.board[row + i][col + j].status == GameSettings.squareStatus[0] || this.board[row + i][col + j].status == GameSettings.squareStatus[1]){
                                isNearArr.push([row + i, col + j])
                            } else {
                                return
                            }
                        } 
                    } else {
                        if (this.board[row + i][col + j].status != GameSettings.squareStatus[0] || row + i < 0 && col + j < 0 && row + i >= this.sideSize && col + j >= this.sideSize){
                            return
                        }
                    }
                }
            }
            return isNearArr
        }
    }

    shipArray(row0, col0, isHorizontal, length){
        let rowN = isHorizontal ? row0 : row0 + length - 1;
        let colN = isHorizontal ? col0 + length - 1 : col0;
        let shipArray = []
        for (let i  = col0; i <= colN; i++){
            for (let j = row0; j <= rowN; j++){
                shipArray.push([j,i])
            }
        }
        return shipArray
    }

    showPlaces(row, col, isHorizontal, length){
        let rowN = isHorizontal ? row : row + length - 1;
        let colN = isHorizontal ? col + length - 1 : col;
        for (let i  = col; i <= colN; i++){
            for (let j = row; j <= rowN; j++){
                if (i < 0 || j < 0 || i >= this.sideSize || j >= this.sideSize){
                    return false
                } else {
                    if (this.board[j][i].status == GameSettings.squareStatus[3] || this.board[j][i].status == GameSettings.squareStatus[1]){
                        return false
                    }
                }
            }
        }
        return true
    }

    drawPlaces(table, row, col, length){
        const hor = this.showPlaces(row, col, true, length)
        if (hor) {
            for (let i = 0; i < length; i++) {
                table.getElementsByTagName("tr")[row].childNodes[col + i].querySelector('img').setAttribute('src', './images/anchor.png')    
                table.getElementsByTagName("tr")[row].childNodes[col + i].setAttribute('id', 'selected')
            }
        }
        const ver = this.showPlaces(row, col, false, length)
        if (ver) {
            for (let i = 0; i < length; i++) {
                table.getElementsByTagName("tr")[row + i].childNodes[col].querySelector('img').setAttribute('src', './images/anchor.png')  
                table.getElementsByTagName("tr")[row + i].childNodes[col].setAttribute('id', 'selected')  
            }
        }
        if (hor || ver) return true
        else return false
    }


    checkAll(arr){
        let result = []
        if (arr?.length !== 0){
            arr.forEach(item => {
                let transientResult = this.transient(...item, arr) 
                if (transientResult){
                    result.push(transientResult)
                } else {
                    transientResult = null;
                    return false;
                }
            });
            result.forEach(element => {
                element.forEach(item => {
                    this.board[item[0]][item[1]].status = GameSettings.squareStatus[1]
                });
            });
            arr.forEach(item => {
                this.board[item[0]][item[1]].status = GameSettings.squareStatus[3]
            });
            return true
        }
    }

    renderBoard(table){
        for (let row = 0; row < this.sideSize; row++) {
            for (let col = 0; col < this.sideSize; col++) {
                let cell = table.getElementsByTagName("tr")[row].childNodes[col]
                let img_str
                switch (this.board[row][col].status) {
                    case GameSettings.squareStatus[4]:
                        img_str = "./images/hit.png"
                        break;
                    case GameSettings.squareStatus[3]:
                        if (this.visible){
                            img_str = "./images/anchor.png"
                        } else {
                            img_str = "./images/water.png"
                        }
                        break;
                    case GameSettings.squareStatus[2]:
                        img_str = "./images/miss.png"
                        break;
                    default:
                        img_str = "./images/water.png"
                        break;
                    }
                let img = cell.querySelector('img')
                img.setAttribute('src', img_str)
                cell.removeAttribute('id')
            }
        }
    }

    place(row, col, orientation, matrix){
        let coor = []
        if ((orientation && (col + this.currShip.length < this.sideSize) && (col >= 0))|| ((!orientation) && row + this.currShip.length < this.sideSize && row >= 0)){
            let place = this.shipArray(row, col, orientation, this.currShip.length)
            this.checkAll(place)
            this.renderBoard(matrix.table)
            coor.push(...place)
        } else {
            return false
        }
        this.currShip.place(coor)
        this.shipI--
        return true
    }


    boardToString(){
        let bS = " [";
        for (let i = 0; i < this.sideSize; i++) {
            bS += "["
            for (let j = 0; j < this.sideSize; j++) {
                let elem = this.board[i][j].status
                bS += elem + ";" + i + ";" + j;
                if (!(j == this.sideSize - 1)) {
                    bS += ",";
                }
            }
            bS+= "]\n";
        }
        bS += "]"
        return bS;
    }
}
