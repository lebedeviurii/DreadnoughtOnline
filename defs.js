/**
 * Strings to display while choosing a Gamemode
 */

const GameModes = {
    modeText : ["Easy mode", "Hard mode", "Hardest mode"],
    modeBoardSizes : [8, 10, 12],
    modeShipsAmount : [ {
        total: 5,
        ships:[2,2,1,0,0]
    },
    {
        total: 7,
        ships: [2,2,2,0,1]
    },
    {   
        total: 6,
        ships: [5,1,0,0,0]
    } ],
    algorithms: [{
        strength: 0,
        will: 0
    },{
        strength: 1,
        will: 1
    },{
        strength: 1,
        will: 2
    }],
    modeAiStrength: ["Randomized Baby", "Fleet Admiral", "Unstoppable Warmashine"]
}


/**
 * Constant to use for appropriated game functional
 */

const GameSettings = {
    shipSizes : {
        submarine: 1,
        convoj: 2,
        destroyer: 3,
        battleship: 4,
        carrier: 5
    },
    button : [
        { name : "Local", id : "local"},
        { name : "Saved", id : "saved"}
    ],
    gameStates : [
        "start",
        "first",
        "second",
        "final"
    ],
    gameStatesIsntructions :[
        "Please place your ships",
        "Everithing is ready to strike!",
        "Realoading",
        "Thank You"
    ],
    squareStatus : [
        "empty",
        "near",
        "miss",
        "ship",
        "hit"
    ]
}