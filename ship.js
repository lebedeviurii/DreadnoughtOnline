class Ship{
    constructor(length){
        this.length = length;
        this.coordinates = [];
        this.alive = true
    }

    place(coor){
        for(let i = 0; i < coor.length; i++){
            this.coordinates.push(coor[i]);
        }
    }

    isAlive(){
        this.alive = false
        for(let i = 0; i < this.coordinates.length; i++){
            if (this.coordinates[i].status == GameSettings.squareStatus[3]) this.alive = true
        }
        return this.alive
    }
}