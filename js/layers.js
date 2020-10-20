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
    exponent(){
        let log = 2
        return new Decimal(0.5).add(player.e.points.div(100).add(1).log(log))
    },                          

    gainExp() {       
        let mult = new Decimal(1)

        if (hasMilestone("d",1)) mult.mul(2)
        return mult              
    },
    gainMult() {       
        let mult = new Decimal(1)

        if (hasMilestone("d",1)) return new Decimal(2)
        return new Decimal(1)          
    },

    layerShown() {return true},  
    upgrades: {
        rows: 3,
        cols: 5,
        11: {
            title: "Add",
            description: "Gain 1 dust per second.",
            const: base11 = 1,
            cost() {if (player["c"].points > 0) {
               if(base11-(player["c"].points) > 0) {
                   return base11-(player["c"].points)
               }else{
                   return 1}
               }else{return base11}
           },
            unlocked: true,
        },
        21: {
            title: "More Dust",
            description() {return `Gain more dust per second, based on your basic points.`},
            effect(){return player["b"].points.pow(0.45).add(1)},
            const: base21 = 1,
            cost() {if (player["c"].points > 0) {
               if(base21-(player["c"].points) > 0) {
                   return base21-(player["c"].points)
               }else{
                   return 1}
               }else{return base21}
           },
            unlocked() {
                return hasUpgrade("b", 11)
            }
        },
        31: {
            title: "Double the Dust",
            description: "Gain 2 dust per second.",
            const: base31 = 2,
            cost() {if (player["c"].points > 0) {
                if(base31-(player["c"].points) > 0) {
                    return base31-(player["c"].points)
                }else{
                    return 1}
                }else{return base31}
            },
            unlocked() {
                return hasUpgrade("b", 21)
            }
        },
        12: {
            title: "Multiply",
            description: "Gain 1.5x more dust per second.",
            const: base12 = 4,
            cost() {if (player["c"].points > 0) {
                if(base12-(player["c"].points) > 0) {
                    return base12-(player["c"].points)
                }else{
                    return 1}
                }else{return base12}
            },
            unlocked() {
                return player["c"].points > 0
            }
        },
        22: {
            title: "More Multiplication",
            description(){return `Gain a multiplier to your dust based on your dust.`},
            effect(){return player.points.pow(0.18).add(1)},
            const: base22 = 7,
            cost() {if (player["c"].points > 0) {
                if(base22-(player["c"].points) > 0) {
                    return base22-(player["c"].points)
                }else{
                    return 1}
                }else{return base22}
            },
            unlocked() {
                return hasUpgrade("b", 12)
            }
        },
        32: {
            title: "Multiplying Trend",
            description: "A nice 2.0x multiplier to dust per second.",
             const: base32 = 15,
             cost() {if (player["c"].points > 0) {
                if(base32-(player["c"].points) > 0) {
                    return base32-(player["c"].points)
                }else{
                    return 1}
                }else{return base32}
            },
            unlocked() {
                return hasUpgrade("b", 22)
            }
        },
        13: {
            title: "Exponent",
            description: "Dust gain is now ^1.05.",
            const: base13 = 20,
            cost() {if (player["c"].points > 0) {
                if(base13-(player["c"].points) > 0) {
                    return base13-(player["c"].points)
                }else{
                    return 1}
                }else{return base13}
            },
            unlocked() {
                return hasMilestone("c",3)
            }
        },
        23: {
            title: "Better Exponent",
            description: `Dust gain is now ^1.10.`,
            const: base23 = 35,
            cost() {if (player["c"].points > 0) {
                if(base23-(player["c"].points) > 0) {
                    return base23-(player["c"].points)
                }else{
                    return 1}
                }else{return base23}
            },
            unlocked() {
                return hasUpgrade("b", 13)
            }
        },
        33: {
            title: "Amazing Exponent",
            description(){return `Dust gain has an even better exponent, based on your cheapeners.`},
            effect(){return player.c.points.div(100).mul(2).add(1.05)},
            const: base33 = 50,
            cost() {if (player["c"].points > 0) {
                if(base33-(player["c"].points) > 0) {
                    return base33-(player["c"].points)
                }else{
                    return 1}
                }else{return base33}
            },
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
    effectDescription(){return `cheapening your Basic Upgrades by ${player.c.points} Basic Point(s).`},
    color: "#938472",                       // The color for this layer, which affects many elements
    resource: "basic cheapeners",            // The name of this layer's main prestige resource
    row: 1,                                 // The row this layer is on (0 is the first row)

    baseResource: "basic points",                 // The name of the resource your prestige gain is based on
    baseAmount() {return player.b.points},    // A function to return the current value of that resource
    
    requires(){if (hasMilestone("d",0)){return new Decimal(4)}else{return new Decimal(5)}}, 
    base: 5,           // The amount of the base needed to  gain 1 of the prestige currency.
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
    layerShown() {
       if(player.b.points>=5 || player.c.points>=1 || player.d.points>=1){return true}
    },             // Returns a bool for if this layer's node should be visible in the tree.
    branches() {
        return ["b","c"]
    },
    milestones: {
        0: {
            requirementDescription: "1 cheapener",
            effectDescription: "Autobuy upgrades that cost 1 basic point!",
            toggles() {
                if (player.c.points>=1){
                [[buyUpg("b",11),"auto"],[buyUpg("b",21),"auto"],[buyUpg("b",31),"auto"]]
                }
            },
            done(){
                if (player["c"].points >= 1) {return true}else{return false}
            }
        },
        1: {
            requirementDescription: "2 cheapeners",
            effectDescription: "Double the points!",
            done(){
                if (player["c"].points >= 2) {return true}else{return false}
            }
        },
        2: {
            requirementDescription: "3 cheapeners",
            effectDescription: "Double the multiply path's effects!",
            done(){
                if (player["c"].points >= 3) {return true}else{return false}
            },
            toggles() {
                if (player.c.points>=3){
                [[buyUpg("b",12),"auto"]]
                }
            },
            unlocked() {
                return hasMilestone("c",1)
            },
        },
        3: {
            requirementDescription: "4 cheapeners",
            effectDescription: "Fine. Here's 3 more upgrades.",
            done(){
                if (player["c"].points >= 4) {return true}else{return false}
            },
            unlocked() {
                return hasMilestone("c",2)
            },
        },
        4: {
            requirementDescription: "5 cheapeners",
            effectDescription: "Ugh. I'll take you to the darkness, I guess.",
            done(){
                if (player["c"].points >= 5) {return true}else{return false}
            },
            unlocked() {
                return hasMilestone("c",3)
            },
        },
        5: {
            requirementDescription: "6 cheapeners",
            effectDescription: "This does nothing. Don't get more cheapeners.",
            done(){
                if (player["c"].points >= 6) {return true}else{return false}
            },
            toggles() {
                if (player.c.points>=6){
                    [[buyUpg("b",22),"auto"]]
                    }
            },
            unlocked() {
                return hasMilestone("c",3)
            },
        },
    },
    hotkeys: [
        {key: "c", // What the hotkey button is. Use uppercase if it's combined with shift, or "ctrl+x" if ctrl is.
        desc: "c: reset your basic points for a cheapener", // The description of the hotkey used in the How To Play
        onPress(){if (player.c.unlocked) doReset("c")}}, // This function is called when the hotkey is pressed.
    ],           
},)
addLayer("d", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                    // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},
    effectDescription: "",
    color: "#303030",                       // The color for this layer, which affects many elements
    resource: "darkness",            // The name of this layer's main prestige resource
    row: 2,                                 // The row this layer is on (0 is the first row)

    baseResource: "basic cheapeners",                 // The name of the resource your prestige gain is based on
    baseAmount() {return player.c.points},    // A function to return the current value of that resource

    requires: new Decimal(5), 
    base: 1.5,           // The amount of the base needed to  gain 1 of the prestige currency.
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
    layerShown() {
       if (hasMilestone("c",3) || player.d.points >=1) return true; else{return false}
    },             // Returns a bool for if this layer's node should be visible in the tree.
    branches() {
        return ["c","d"]
    },
    milestones: {
        0: {
            requirementDescription: "1 darkness",
            effectDescription: "The cheapener's base is down by 1! Amazing!",
            done(){
                if (player["d"].points >= 1) {return true}else{return false}
            },
            unlocked(){
                if(player["d"].points>=0){return true}
            },
        },
        1: {
            requirementDescription: "2 darkness",
            effectDescription: "This has been delayed for too long. A cool 2x multiplier to your basic points. Also, you get an autobuyer for ALL of the basic upgrades!",
            done(){
                if (player["d"].points >= 2) {return true}else{return false}
            },
            unlocked(){
                if(player["d"].points>=1){return true}
            },
            toggles(){
                if (player.d.points >= 2){
                [[buyUpg("b",11),"auto"],[buyUpg("b",21),"auto"],[buyUpg("b",31),"auto"],[[buyUpg("b",12),"auto"],[buyUpg("b",22),"auto"],[buyUpg("b",32),"auto"],[[buyUpg("b",13),"auto"],[buyUpg("b",23),"auto"],[buyUpg("b",33),"auto"]]]]
                }
            }
        },
        2: {
            requirementDescription: "3 darkness",
            effectDescription: "There's not enough exponents in this game. Unlocks a new layer called Exponent.",
            done(){
                if (player["d"].points >= 3) {return true}else{return false}
            },
            unlocked(){
                if(player["d"].points>=2){return true}
            },
        },
    },
    
},)
addLayer("e", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                    // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},
    effectDescription(){return `giving a ^${player.e.points.div(50).add(1).log2().add(1).mul(100).floor().div(100)} to upgrade effects, and an added ^${player.e.points.div(100).add(1).log2().mul(100).floor().div(100)} to the dust to basic point conversion.`},
    color: "#948203",                       // The color for this layer, which affects many elements
    resource: "exponent",            // The name of this layer's main prestige resource
    row: 1,                                 // The row this layer is on (0 is the first row)

    baseResource: "basic points",                 // The name of the resource your prestige gain is based on
    baseAmount() {return player.b.points},    // A function to return the current value of that resource

    requires: new Decimal(5000),
    base: new Decimal(5000),        // The amount of the base needed to  gain 1 of the prestige currency.
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
    layerShown() {
       if (hasAchievement("a",33)) return true; else{return false}
    },             // Returns a bool for if this layer's node should be visible in the tree.
    branches() {
        return [["b","e"],["d","e"]]
    },
    milestones: {
        0: {
            requirementDescription: "1 exponent",
            effectDescription: "Gain 10% of your basic point gain per second.",
            done(){
                if (player["e"].points >= 1) {return true}else{return false}
            },
            unlocked(){
                if(player["d"].points>=1){return true}
            },
        },
    },
    update(diff) {
        if (hasMilestone("d",0)) 
          player.b.points = player.b.points.add(getResetGain("b").mul(0.1).mul(diff))
      },
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
            rows: 3,
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
                done() {return player.c.points.gte(1)},
                goalTooltip: "Buy 1 cheapener.", // Shows when achievement is not completed
                doneTooltip: "Buy 1 cheapener."
            },
            22: {
                name: "Cheaper.",
                done() {return player.c.points.gte(4)},
                goalTooltip: "Buy 4 cheapeners.", // Shows when achievement is not completed
                doneTooltip: "Buy 4 cheapeners."
            },
            23: {
                name: "Cheapest.",
                done() {return player.c.points.gte(10)},
                goalTooltip: "Buy 10 cheapeners.", // Shows when achievement is not completed
                doneTooltip: "Buy 10 cheapeners."
            },
            31: {
                name: "Welcome to the darkness.",
                done() {return player.d.points.gte(1)},
                goalTooltip: "Buy 1 darkness. Reward: 2x dust.", // Shows when achievement is not completed
                doneTooltip: "Buy 1 darkness. Reward: 2x dust."
            },
            32: {
                name: "The darkness says hi.",
                done() {return player.d.points.gte(2)},
                goalTooltip: "Buy 2 darkness.", // Shows when achievement is not completed
                doneTooltip: "Buy 2 darkness."
            },
            33: {
                name: "The darkness wants to help.",
                done() {return player.d.points.gte(3)},
                goalTooltip: "Buy 3 darkness. Reward: Another 2x to dust.", // Shows when achievement is not completed
                doneTooltip: "Buy 3 darkness. Reward: Another 2x to dust."
            },
        },
        midsection: [
            "achievements",
        ]
    }, 
)