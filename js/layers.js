addLayer("b", {
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "#939192", 
    resource: "basic points",            
    row: 0,                                 

    baseResource: "dust",                 
    baseAmount() {return player.points},    

    requires: new Decimal(10),            
                                            
    effectDescription: "",
    type: "normal",                         
    exponent: 0.5,                          

    gainMult() {                            
        return new Decimal(1)               
    },
    gainExp() {                             
        return new Decimal(1)
    },

    layerShown() {return true},  
    upgrades: {
        rows: 3,
        cols: 5,
        11: {
            title: "Add",
            description: "Gain 1 dust per second.",
            cost: 1,
            unlocked: true,
        },
        21: {
            title: "More Dust",
            description: "Gain ANOTHER 1 dust per second.",
            cost: 1,
            unlocked() {
                return hasUpgrade("b", 11)
            }
        },
        31: {
            title: "Double the Dust",
            description: "Gain 2 dust per second.",
            const: base31 = 2,
            cost() {if (player["c"].points > 0 && Math.floor(base31/(player["c"].points+1)^2)>=1) {
                return Math.floor(base31 / player["c"].points)
            }else{
                return base31
            }},
            unlocked() {
                return hasUpgrade("b", 21)
            }
        },
        13: {
            title: "Multiply",
            description: "Gain 1.2x more dust per second.",
            const: base13 = 4,
            cost() {if (player["c"].points > 0 && Math.floor(base13/(player["c"].points+1)^2)>=1) {
                return Math.floor(base13 / player["c"].points)
            }else{
                return base13
            }},
            unlocked() {
                return hasUpgrade("b", 31)
            }
        },
        23: {
            title: "More Multiplication",
            description: "Gain a second bonus of 1.2x dust per second.",
            const: base23 = 8,
            cost() {if (player["c"].points > 0 && Math.floor(base23/(player["c"].points+1)^2)>=1) {
                return Math.floor(base23 / player["c"].points)
            }else{
                return base23
            }},
            unlocked() {
                return hasUpgrade("b", 13)
            }
        },
        33: {
            title: "Multiplying Trend",
            description: "A nice 1.5x multiplier to dust per second.",
             const: base33 = 20,
            cost() {if (player["c"].points > 0 && Math.floor(base33/(player["c"].points+1)^2)>=1) {
                return Math.floor(base33 / player["c"].points)
            }else{
                return base33
            }},
            unlocked() {
                return hasUpgrade("b", 23)
            }
        },
    },
    hotkeys: [
        {key: "b", // What the hotkey button is. Use uppercase if it's combined with shift, or "ctrl+x" if ctrl is.
        desc: "b: reset your dust for basic points", // The description of the hotkey used in the How To Play
        onPress(){if (player.b.unlocked) doReset("b")}}, // This function is called when the hotkey is pressed.
    ],           
},
)
addLayer("c", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                    // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},
    effectDescription: "cheapening your Basic Upgrades.",
    color: "#938472",                       // The color for this layer, which affects many elements
    resource: "basic cheapeners",            // The name of this layer's main prestige resource
    row: 0,                                 // The row this layer is on (0 is the first row)

    baseResource: "points",                 // The name of the resource your prestige gain is based on
    baseAmount() {return player.points},    // A function to return the current value of that resource

    requires: new Decimal(50),            // The amount of the base needed to  gain 1 of the prestige currency.
                                               // Also the amount required to unlock the layer.
    canBuyMax(){return false},
    type: "static",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.5,                          // "normal" prestige gain is (currency^exponent)

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource
        return new Decimal(1)               // Factor in any bonuses multiplying gain here
    },
    gainExp() {                             // Returns your exponent to your gain of the prestige resource
        return new Decimal(1)
    },

    layerShown() {return true},             // Returns a bool for if this layer's node should be visible in the tree.
},)
addLayer("a", {
        startData() { return {
            unlocked: true,
			points: new Decimal(0),
        }},
        color: "yellow",
        resource: "achievement power", 
        type: "none",
        row: "side",
        layerShown() {return true}, 
        tooltip() { // Optional, tooltip displays when the layer is locked
            return ("Achievements")
        },
        achievements: {
            rows: 2,
            cols: 3,
            11: {
                name: "The beginning...",
                done() {return [player.points.gte(1)]}, // This one is a freebie
                goalTooltip: "you shouldn't be able to see this", // Shows when achievement is not completed
                doneTooltip: "You started the game!", // Showed when the achievement is completed
            },
            12: {
                name: "This is basic.",
                done() {return player.b.points.gte(1)},
                goalTooltip: "Get a basic point.", // Shows when achievement is not completed
                doneTooltip: "Get a basic point.", // Showed when the achievement is completed
            },
            13: {
                name: "Even more basic.",
                done() {return player.b.points.gte(10)},
                goalTooltip: "Basic * 10.", // Shows when achievement is not completed
                doneTooltip: "Basic * 10."
            },
            21: {
                name: "Cheap.",
                done() {return player.b.points.gte(10)},
                goalTooltip: "Buy 1 cheapener.", // Shows when achievement is not completed
                doneTooltip: "Buy 1 cheapener."
            },
            22: {
                name: "Cheaper.",
                done() {return player.b.points.gte(10)},
                goalTooltip: "Buy 4 cheapeners.", // Shows when achievement is not completed
                doneTooltip: "Buy 4 cheapeners."
            },
            23: {
                name: "Cheapest.",
                done() {return player.b.points.gte(10)},
                goalTooltip: "Buy 10 cheapeners.", // Shows when achievement is not completed
                doneTooltip: "Buy 10 cheapeners."
            },
        },
        midsection: [
            "achievements",
        ]
    }, 
)

