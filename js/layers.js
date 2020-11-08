addLayer("b", {
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "#939192", 
    resource: "basic points",            
    row: 0,                                 
    automate() {
        if (player["c"].autoCoinUpgrade) {
            for (let x = 10; x <= 30; x += 10){ for (let y = 1; y <= 3; y++) {
                var z = x + y
                if (!hasUpgrade("b", z) && canAffordUpgrade("b", z) && layers["b"].upgrades[z].cost()===1 && hasMilestone("c",0) && layers["b"].upgrades[z].unlocked()===true) {
                    buyUpg("b", z)
                }
            }
        }}
    },
    automate2() {
        if (player["d"].autoCoinUpgrade) {
            for (let x = 10; x <= 30; x += 10){ for (let y = 1; y <= 3; y++) {
                var z = x + y
                if (!hasUpgrade("b", z) && canAffordUpgrade("b", z) && hasMilestone("d",1) && layers["b"].upgrades[z].unlocked()===true) {
                    buyUpg("b", z)
                }
            }
        }}
    },
    baseResource: "dust",                 
    baseAmount() {return player.points},    

    requires: new Decimal(10),            
                                            
    effectDescription: "",
    type: "normal",                         
    exponent(){
        let log = 2
        return new Decimal(0.5).add(player.e.points.div(200).add(1).log(log))
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
            unlocked(){return true},
        },
        21: {
            title: "More Dust",
            description() {return `Gain more dust per second, based on your basic points.`},
            effect(){
                let pow = 1
                if(player.e.points>0){pow=player.e.points.div(100).add(1).log2().add(1)}
                let effect = player["b"].points.pow(0.45).add(1).pow(pow)
                if(effect>1000000){effect=new Decimal("1e6").mul(effect.log(1.5))}
                return effect
            },
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
                if(player["c"].points>0 && hasUpgrade("b",11)){
                    return true
                }else{return false}
            }
        },
        22: {
            title: "More Multiplication",
            description(){return `Gain a multiplier to your dust based on your dust.`},
            effect(){
                let pow = 1
                if(player.e.points>0){pow=player.e.points.div(100).add(1).log2().add(1)}
                let effect = player["b"].points.pow(0.18).add(1).pow(pow)
                if(effect>1000000){effect=new Decimal("1e6").mul(effect.log(1.5))}
                return effect
            },
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
            effect(){
                let expon = player.e.points.div(100).add(1).log2().add(1)
                return player.c.points.div(500).add(1).pow(expon).log2().add(1.1)
            },
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
        points: new Decimal(0),
        autoCoinUpgrade: false,             // "points" is the internal name for the main resource of the layer.
    }},
    effectDescription(){return `cheapening your Basic Upgrades by ${player.c.points} Basic Point(s).`},
    color: "#938472",                       // The color for this layer, which affects many elements
    resource: "basic cheapeners",            // The name of this layer's main prestige resource
    row: 1,                                 // The row this layer is on (0 is the first row)

    baseResource: "basic points",                 // The name of the resource your prestige gain is based on
    baseAmount() {return player.b.points},    // A function to return the current value of that resource
    
    requires(){if (hasMilestone("d",0)){return new Decimal(4)}else{return new Decimal(5)}}, 
    base(){return new Decimal(5).add(player.c.points.add(1).log10().floor())},           // The amount of the base needed to  gain 1 of the prestige currency.
                                               // Also the amount required to unlock the layer.
    canBuyMax(){
        if(hasMilestone("d",4)){return true}else{return false}
    },
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
            if(){},
            toggles: [
                ["c","autoCoinUpgrade"]
            ],
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
            effectDescription: "You want a boost? Here's a nice 1x boost to help you progress (not really).",
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
        points: new Decimal(0), 
        autoCoinUpgrade: false,            // "points" is the internal name for the main resource of the layer.
    }},
    effectDescription: "",
    color: "#303030",                       // The color for this layer, which affects many elements
    resource: "darkness",            // The name of this layer's main prestige resource
    row: 2,                                 // The row this layer is on (0 is the first row)

    baseResource: "basic cheapeners",                 // The name of the resource your prestige gain is based on
    baseAmount() {return player.c.points},    // A function to return the current value of that resource
    roundUpCost(){return "d"},
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
            toggles: [
                ["d","autoCoinUpgrade"]
            ],
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
        3: {
            requirementDescription: "5 darkness",
            effectDescription: "Darkness isn't going to get reset now! That'll be for later. For now, here's a row 0 layer. Unlocks a new layer called Funity.",
            done(){
                if (player["d"].points >= 5) {return true}else{return false}
            },
            unlocked(){
                if(player["d"].points>=3){return true}
            },
        },
        4: {
            requirementDescription: "6 darkness",
            effectDescription: "Ugh. Fine. You can now buy max cheapeners. Just don't ask for exponent, though....",
            done(){
                if (player["d"].points >= 6) {return true}else{return false}
            },
            unlocked(){
                if(player["d"].points>=5){return true}
            },
        },
    },
    
},)
addLayer("e", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                    // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},
    effectDescription(){
        return `giving a ^${player.e.points.div(100).add(1).log2().add(1).mul(100).floor().div(100)} to upgrade effects, and an added ^${player.e.points.div(200).add(1).log2().mul(100).floor().div(100)} to the dust to basic point conversion.`
    },
    color: "#948203",                       // The color for this layer, which affects many elements
    resource: "exponent",            // The name of this layer's main prestige resource
    row: 1,                                 // The row this layer is on (0 is the first row)

    baseResource: "basic points",                 // The name of the resource your prestige gain is based on
    baseAmount() {return player.b.points},    // A function to return the current value of that resource

    requires: new Decimal(1000),
    base(){
        if(player.e.points>=25){return new Decimal("1e20")}
        return new Decimal(1000)
    },        // The amount of the base needed to  gain 1 of the prestige currency.
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
                if(player["e"].points>=0){return true}
            },
        },
    },
    update(diff) {
        if (hasMilestone("e",0)) 
          player.b.points = player.b.points.add(getResetGain("b").mul(0.1).mul(diff))
      },
},)
addLayer("f", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                    // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},
    effectDescription(){
        let mul = 1

        if (hasUpgrade("f",11)) mul++
        return `giving a ${player.f.points.add(1).log10().add(1).mul(100).floor().div(100).pow(mul)}x boost to dust, and ${player.f.points.add(1).log10().floor()}% more funity per second.`
    },
    effect(){player.f.points.add(1).log10().add(1)},
    color: "#00FF00",                       // The color for this layer, which affects many elements
    resource: "funity",            // The name of this layer's main prestige resource
    row: 0,                                 // The row this layer is on (0 is the first row)

    baseResource: "dust",                 // The name of the resource your prestige gain is based on
    baseAmount() {return player.points},    // A function to return the current value of that resource

    requires: new Decimal("1e6"),       // The amount of the base needed to  gain 1 of the prestige currency.
                                               // Also the amount required to unlock the layer.
    canBuyMax(){return false},
    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.5,                          // "normal" prestige gain is (currency^exponent)

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource
        return new Decimal(1)               // Factor in any bonuses multiplying gain here
    },
    gainExp() {                             // Returns your exponent to your gain of the prestige resource
        return new Decimal(1)
    },
    layerShown() {
       if (hasAchievement("a",34)) return true; else{return false}
    },             // Returns a bool for if this layer's node should be visible in the tree.
    milestones: {
        0: {
            requirementDescription: "10 funity",
            effectDescription: "Gain 10% of your current funity per second.",
            done(){
                if (player["f"].points >= 10) {return true}else{return false}
            },
            unlocked(){
                if(player["f"].points>=0){return true}
            },
        },
    },
    update(diff) {
        if (hasMilestone("f",0)) 
          player.f.points = player.f.points.add(player.f.points.mul(new Decimal(0.1).add(player.f.points.add(1).log10().floor().div(100))).mul(diff))
      },
      upgrades: {
        rows: 1,
        cols: 1,
        11: {
            title: "Powerful Fun",
            description: "The dust multiplier for funity is now ^2.",
            cost: new Decimal("1e10"),
            unlocked: true,
        },
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
            rows: 5,
            cols: 4,
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
            14: {
                name: "WAY too basic.",
                done() {return player.b.points.gte(1000)},
                goalTooltip: "1,000 BP.", // Shows when achievement is not completed
                doneTooltip: "1,000 BP."
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
            24: {
                name: "Cheapener Life.",
                done() {return player.c.points.gte(25)},
                goalTooltip: "Buy 25 cheapeners.", // Shows when achievement is not completed
                doneTooltip: "Buy 25 cheapeners."
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
            34: {
                name: "Deep in the darkness.",
                done() {return player.d.points.gte(5)},
                goalTooltip: "Get 5 darkness.", // Shows when achievement is not completed
                doneTooltip: "Get 5 darkness."
            },
            41: {
                name: "Exponental.",
                done() {return player.e.points.gte(1)},
                goalTooltip: "Own 1 exponent.", // Shows when achievement is not completed
                doneTooltip: "Own 1 exponent."
            },
            42: {
                name: "Exponent Up.",
                done() {return player.e.points.gte(2)},
                goalTooltip: "Own 2 exponent.", // Shows when achievement is not completed
                doneTooltip: "Own 2 exponent."
            },
            43: {
                name: "More Exponent.",
                done() {return player.e.points.gte(3)},
                goalTooltip: "Own 3 exponent.", // Shows when achievement is not completed
                doneTooltip: "Own 3 exponent."
            },
            44: {
                name: "Absurd Exponent.",
                done() {return player.e.points.gte(5)},
                goalTooltip: "Own 5 exponent.", // Shows when achievement is not completed
                doneTooltip: "Own 5 exponent."
            },
            51: {
                name: "Should be in Antimatter Dimensions.",
                done() {return player.f.points.gte(1)},
                goalTooltip: "Buy 1 funity.", // Shows when achievement is not completed
                doneTooltip: "Buy 1 funity."
            },
            52: {
                name: "This is multiplying!",
                done() {return player.f.points.gte("1e10")},
                goalTooltip: "Get 1e10 funity.", // Shows when achievement is not completed
                doneTooltip: "Get 1e10 funity."
            },
            53: {
                name: "Light speed multiplication.",
                done() {return player.f.points.gte("1e50")},
                goalTooltip: "Get 1e50 funity.", // Shows when achievement is not completed
                doneTooltip: "Get 1e50 funity."
            },
            54: {
                name: "Infinity is no longer a goal.",
                done() {return player.f.points.gte("1.81e308")},
                goalTooltip: "Get 1.81e308 funity.", // Shows when achievement is not completed
                doneTooltip: "Get 1.81e308 funity."
            },
        },
        midsection: [
            "achievements",
        ]
    }, 
)
