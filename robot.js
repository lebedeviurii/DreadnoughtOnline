class Robot{
    
    constructor(){
        console.log("System initialized");
        this.name = "AI bot";
        this.robot;
        this.enemy;
        this.enemyBoardTable;
        this.playerBoardTable;
        this.intellegence;
        this.gameState = GameSettings.gameStates[0]
        this.save = []
        this.ships = []
        this.clicked;
    }

    choosedDifficulty(difficulty){
        this.intellegence = difficulty;
    }

    getIntellegence(){
        return this.intellegence;
    }
    
    load(intellegence, enemy, robot, state){
        this.choosedDifficulty(intellegence);

        const enemyRows = enemy.slice(1, -1).split('\n');

        // Parse each row as an array
        const enemyBoard = enemyRows.map(row => {
            // Remove leading/trailing whitespace and split by commas
            const values = row.trim().split(',');
            
            // Parse each value by extracting the coordinates
            return values.map(value => {
                const match = value.split(";");
                const status = match[0];
                const x = parseInt(match[1]);
                const y = parseInt(match[2]);
                return [x, y, status];
                });
        });
        const robotRows = robot.slice(1, -1).split('\n');

        // Parse each row as an array
        const robotBoard = robotRows.map(row => {
            // Remove leading/trailing whitespace and split by commas
            const values = row.trim().split(',');
            
            // Parse each value by extracting the coordinates
            return values.map(value => {
                const match = value.split(";");
                const status = match[0];
                const x = parseInt(match[1]);
                const y = parseInt(match[2]);
                return [x, y, status];
                });
        });
        this.robotGame()
        for (let row = 0; row < enemy.length; row++) {
            for (let col = 0; col < enemy[row].length; col++) {
                this.enemy.content.board[row][col].coord = [enemy[row][col][0], enemy[row][col][1]]
                this.enemy.content.board[row][col].status = enemy[row][col][2]
                this.robot.content.board[row][col].coord = [robot[row][col][0], robot[row][col][1]]
                this.robot.content.board[row][col].status = robot[row][col][2]
            }
        }
        this.gameState = state
    }

    robotGame(){
        let difIdx = GameModes.modeText.indexOf(this.intellegence);
        let robotName = GameModes.modeAiStrength[difIdx];
        console.log(robotName);
        for (let i = 0; i < GameModes.modeShipsAmount[difIdx].ships.length; i++) {
            for (let j = 0; j < GameModes.modeShipsAmount[difIdx].ships[i]; j++) {
                this.ships.push(new Ship(i+1))
            }
        }
        let body = document.getElementsByTagName('body')[0]
        let instr = document.createElement('div')
        instr.innerText = GameSettings.gameStatesIsntructions[0]
        instr.className = 'instr'
        body.insertBefore(instr, document.getElementsByClassName('content')[0])
        let game = document.getElementById('gameBoardContainer');
        let title = document.getElementsByClassName('title')[0];
        title.style.display = "none";
        let playerBoardTable = this.createGameBoard("Player", GameModes.modeBoardSizes[difIdx], true);
        let enemyBoardTable = this.createGameBoard(robotName, GameModes.modeBoardSizes[difIdx], false);
        this.robot = enemyBoardTable
        this.enemy = playerBoardTable
        this.placeAllShips()
        for (let row = 0; row < playerBoardTable.content.sideSize; row++) {
            for (let col = 0; col < playerBoardTable.content.sideSize; col++) {
                this.onClick(playerBoardTable.name, playerBoardTable.table.getElementsByTagName("tr")[row].childNodes[col])
                this.onClick(enemyBoardTable.name, enemyBoardTable.table.getElementsByTagName("tr")[row].childNodes[col])
            }
        }
        let sound = document.querySelector('#soundMenu');
        let save = document.createElement('button');
        save.className = 'btn';
        save.innerText = "SAVE";
        save.addEventListener("click", (event) => {
            localStorage.setItem("gameState", this.gameState);
            localStorage.setItem("intellegence", this.intellegence);
            localStorage.setItem("robot", this.robot.content.boardToString());
            localStorage.setItem("player", this.enemy.content.boardToString());
        });
        sound.appendChild(save)
        game.insertBefore(enemyBoardTable.table, sound);
        game.appendChild(playerBoardTable.table);
        game.style.display = 'flex';
    }

    placeAllShips() {
        let target = [0, 0];
        let orient;
        for (let i = 0; i < this.ships.length; i++) {
            let rep = 0
            let result = false
            do {
                // Set Random Orientation
                orient = Math.random() < 0.5;
                target[0] = Math.floor(Math.random() * this.robot.content.sideSize);
                target[1] = Math.floor(Math.random() * this.robot.content.sideSize);
                rep++;
                if (rep === 100){
                    alert("Robot can't place a ship")
                }
                if (this.robot.content.showPlaces(+target[0], +target[1], orient, this.robot.content.currShip.length)){
                    result = this.robot.content.place(+target[0], +target[1], orient, this.robot)
                }
                if (result && this.robot.content.shipI >= 0){
                    this.robot.content.currShip = this.robot.content.ships[this.robot.content.shipI]
                }
            } while (!result && rep < 100);
        }
        return true;
    }

    easyModeShoot(){
        while (true) {
            let target = [0,0];
            let fired
            target[0] = Math.floor(Math.random() * this.robot.content.sideSize);
            target[1] = Math.floor(Math.random() * this.robot.content.sideSize);
            let cell = this.enemy.table.getElementsByTagName("tr")[target[0]].childNodes[target[1]]
            setTimeout(() => {}, 1000)
            fired = this.enemy.content.fire(cell, this.robot.name)
            if (fired === 0){
                this.gameState = GameSettings.gameStates[1]
                this.changeInstruction(this.gameState)
                let fire_result = new Audio('./music/miss.wav')
                fire_result.volume = 0.3;
                fire_result.play
                return
            }
            if (fired === 2){
                this.gameState = GameSettings.gameStates[3]
                this.changeInstruction(this.gameState)
                setTimeout(() => {
                    let instruction = document.getElementsByClassName('instr')[0]
                    instruction.innerText = "You LOSE!"
                    let lose = new Audio("./music/Directed by Robert B Weide Sound Effect.mp3");
                    lose.volume = 0.3;
                    lose.play();
                    setTimeout(() => {
                        location.reload()
                    }, 8000);
                }, 2000)
                return
            } if (fired == 1) {
                let fire_result = new Audio('./music/shot.mp3')
                fire_result.volume = 0.2;
                fire_result.play()
            }
        }
    }

    createGameBoard(name, size, visible) {
        console.log("Board Created")
        const bSize = size;
        const gameBoard = new Board(bSize, visible, this.ships);
        console.log(gameBoard.boardToString());
        const table = document.createElement('table');
        table.classList.add('gameBoard');
        let head = table.createTHead();
        head.innerText = name;
        for (let i = 0; i < bSize; i++) {
            const row = document.createElement('tr');
            for (let j = 0; j < bSize; j++) {
                const cell = document.createElement('td');
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.dataset.status = gameBoard.board[i][j].status
                let img = document.createElement('img');
                img.setAttribute
                img.setAttribute('src', './images/water.png');
                img.addEventListener('load', (event) => {
                    img.style.width = (img.naturalWidth * 8 / size) + "px";
                    img.style.height = (img.naturalHeight * 8 / size) + "px";
                });
                cell.appendChild(img);
                row.appendChild(cell);
            }
            table.appendChild(row);
        }
        this.save.push({name: head.innerText, content: gameBoard})
        return {name: head.innerText, table: table, content: gameBoard};
    }

    changeInstruction(state){
        let instruction = document.getElementsByClassName('instr')[0]
        let stateIdx = GameSettings.gameStates.indexOf(state)
        instruction.innerText = GameSettings.gameStatesIsntructions[stateIdx]
    }

    shoot(){
        this.easyModeShoot()
        setTimeout(() => {this.enemy.content.renderBoard(this.enemy.table)}, 1000)
    }

    restore(){
        for (let i = 0; i < this.enemy.content.currShip.length; i++) {
            if (this.enemy.table.getElementsByTagName("tr")[+this.clicked.dataset.row]?.childNodes[+this.clicked.dataset.col + i].dataset.status !== GameSettings.squareStatus[3])
                this.enemy.table.getElementsByTagName("tr")[+this.clicked.dataset.row]?.childNodes[+this.clicked.dataset.col + i].querySelector('img').setAttribute('src', './images/water.png')
            this.enemy.table.getElementsByTagName("tr")[+this.clicked.dataset.row]?.childNodes[+this.clicked.dataset.col + i].removeAttribute('id')
            if (this.enemy.table.getElementsByTagName("tr")[+this.clicked.dataset.row + i]?.childNodes[+this.clicked.dataset.col].dataset.status !== GameSettings.squareStatus[3])
                this.enemy.table.getElementsByTagName("tr")[+this.clicked.dataset.row + i]?.childNodes[+this.clicked.dataset.col].querySelector('img').setAttribute('src', './images/water.png')
            this.enemy.table.getElementsByTagName("tr")[+this.clicked.dataset.row + i]?.childNodes[+this.clicked.dataset.col].removeAttribute('id')
        }
    }

    onClick(name, cell){
        if (name == "Player"){
            cell.addEventListener('click', ((event) => {
                if (this.gameState == GameSettings.gameStates[0]){
                    let col = +cell.dataset.col;
                    let row = +cell.dataset.row;
                    if (this.clicked === undefined){
                        if (this.enemy.content.drawPlaces(this.enemy.table, row, col, this.enemy.content.currShip.length)){   
                            this.clicked = cell;      
                        } else {
                            alert("Ship cannot be placed! Choose another spot please.")
                            event.preventDefault()
                        }
                    } else {
                        const orientation = (
                            row == this.clicked.dataset.row) ? true : col == this.clicked.dataset.col ? false : this.restore()
                        this.enemy.content.place(+this.clicked.dataset.row, +this.clicked.dataset.col, orientation, this.enemy)
                        this.clicked = undefined

                        if (this.enemy.content.shipI >= 0){
                            this.enemy.content.currShip = this.enemy.content.ships[this.enemy.content.shipI]
                        } else {

                            this.gameState = GameSettings.gameStates[1]
                            this.changeInstruction(this.gameState)
                        }
                    }
                }
            }).bind(this));
        } else {
            cell.addEventListener('click',((event)=>{
                let fire_result
                if (this.gameState == GameSettings.gameStates[1]){
                    let strike = this.robot.content.fire(cell, this.enemy.name)
                    if (strike === 0){
                        this.gameState = GameSettings.gameStates[2]
                        fire_result = new Audio('./music/miss.wav')
                        fire_result.volume = 0.3;
                        this.robot.content.renderBoard(this.robot.table)
                        this.changeInstruction(this.gameState)
                        this.shoot();
                    } else {
                        if (strike === 1 || strike === 2) {
                            if (strike === 2){
                                let instruction = document.getElementsByClassName('instr')[0]
                                instruction.innerText = "You WIN!"
                                setTimeout(() => {
                                    let win = new Audio("./music/abba_-_fanfary.mp3");
                                    win.volume = 0.3;
                                    win.play();
                                    setTimeout(() => {
                                        location.reload()
                                    }, 10000);
                                }, 2000)
                            } else {
                                this.changeInstruction(this.gameState)
                                fire_result = new Audio('./music/shot.mp3')
                                fire_result.volume = 0.2;
                            }
                            this.robot.content.renderBoard(this.robot.table)
                        } else {
                            fire_result = new Audio('./music/jam.wav')
                            fire_result.volume = 0.1;
                        }
                    }
                    fire_result.play()
                } else {
                    alert("Wait your turn, commander!")
                }
            }).bind(this));
        }
    }
}