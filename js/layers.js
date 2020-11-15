

addLayer("e", {
    name: "exponent", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "^", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        softcapped: "",
    }},
    color: "#4BDC13",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "exponents", // Name of prestige currency
    baseResource: "math", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    base: 1,
    exponent: 2, // Prestige currency exponent
    effect(){
        let expon = new Decimal(1).add(player["e"].points).log(8).minus(new Decimal(1).log(3)).add(1)
        if(hasUpgrade("e",12))expon=expon.pow(2)
        if(hasUpgrade("e",13))expon=expon.pow(2)
        if(hasUpgrade("e",21))expon=expon.pow(2)
        expon = expon.tetrate(layers.t.effect())
        if(hasUpgrade("t",22))expon=expon.tetrate(1.1)
        if(expon.gte(15)&&expon.lt("1e7")){
            player.e.softcapped = " {softcapped}"
            let logger = new Decimal(22)
            if(hasUpgrade("e",22))logger = new Decimal(10)
            if(hasUpgrade("e",33))logger = new Decimal(5)
            if(hasUpgrade("e",24))logger = new Decimal(1.5)
            if(hasUpgrade("e",33)){expon = new Decimal(15).mul(expon.log(logger).log(2))}else{expon = new Decimal(15).add(expon.log(logger))}
        }else if(expon.gte("1e7")&&expon.lt("1e20")){
            player.e.softcapped = " {more softcapped}"
            let logger = new Decimal(150)
            if(hasUpgrade("e",22))logger = new Decimal(70)
            if(hasUpgrade("e",33))logger = new Decimal(35)
            if(hasUpgrade("e",24))logger = new Decimal(10)
            if(hasUpgrade("e",33)){expon = new Decimal("1e7").mul(expon.log(logger).log(50).tetrate(0.1))}else{expon = new Decimal(15).add(expon.log(logger))}
        }
        else if(expon.gte("1e30")&&expon.lt("1e300")){
            player.e.softcapped = " {super softcapped}"
            let logger = new Decimal("1e10")
            if(hasUpgrade("e",22))logger = new Decimal("1e7")
            if(hasUpgrade("e",33))logger = new Decimal("5e5")
            if(hasUpgrade("e",24))logger = new Decimal("1e4")
            if(hasUpgrade("e",33)){expon = new Decimal("1e20").mul(expon.log(logger).log("1e4").tetrate(0.001))}else{expon = new Decimal(15).add(expon.log(logger))}
        }
        else if(expon.gte("1e300")&&expon.lt("1e1000")){
            player.e.softcapped = " {ultimately softcapped}"
            let logger = new Decimal("1e150")
            if(hasUpgrade("e",22))logger = new Decimal("1e70")
            if(hasUpgrade("e",33))logger = new Decimal("5e55")
            if(hasUpgrade("e",24))logger = new Decimal("1e40")
            if(hasUpgrade("e",33)){expon = new Decimal("1e300").mul(expon.log(logger).log("1e8").tetrate("1e-10"))}else{expon = new Decimal(15).add(expon.log(logger))}
        }
        else if(expon.gte("1e1000")){
            player.e.softcapped = " {hardcapped}"
            expon=new Decimal("1e100")
        }
        else{player.e.softcapped=""}
        if(inChallenge("t",11))expon=expon.tetrate(0.7)
        return expon
    },
    canBuyMax(){return hasMilestone("t",1)},
    effectDescription(){return `raising your point gain to ^${format(layers[this.layer].effect())}${player.e.softcapped}.`},
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(hasUpgrade("e",14))mult=mult.div(8)
        if(hasUpgrade("e",43))mult=mult.pow(5)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "e", description: "Exponent up!", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades: {
        rows: 4,
        cols: 4,
        11: {
            title: "Make exponents do something",
            description: "Makes exponents do something by adding 1 to point gain.",
            cost: new Decimal(1),
        },
        12: {
            title: "Better effect",
            description: "The exponent effect is now squared.",
            cost: new Decimal(2),
            unlocked(){return hasUpgrade("e",11)}
        },
        13: {
            title: "Even better effect",
            description: "The exponent effect is now squared again.",
            cost: new Decimal(3),
            unlocked(){return hasUpgrade("e",12)}
        },
        21: {
            title: "OP effect",
            description: "The exponent effect is now squared once again.",
            cost: new Decimal(4),
            unlocked(){return hasUpgrade("e",13)}
        },
        22: {
            title: "Softcap reducer",
            description: "Reduces the softcap on the exponent effect.",
            cost: new Decimal(5),
            unlocked(){return hasUpgrade("e",21)}
        },
        31: {
            title: "Super softcap reducer",
            description: "Reduces the softcap on the exponent by even more.",
            cost: new Decimal(5),
            unlocked(){return hasUpgrade("e",22)}
        },
        32: {
            title: "Amazing softcap reducer",
            description: "Reduces the softcap on the exponent by EVEN MORE.",
            cost: new Decimal(5),
            unlocked(){return hasUpgrade("e",23)}
        },
        33: {
            title: "Ultimate softcap reducer",
            description: "Reduces the softcap on the exponent by EVEN MORE.",
            cost: new Decimal(5),
            unlocked(){return hasUpgrade("e",31)}
        },
        23: {
            title: "Softcap improver",
            description: "Makes the softcapped exponent multiply instead of add.",
            cost: new Decimal(5),
            unlocked(){return hasUpgrade("e",32)}
        },
        14: {
            title: "More exponents",
            description: "Divides exponent cost by 8.",
            cost: new Decimal(7),
            unlocked(){return hasUpgrade("e",33)}
        },
        24: {
            title: "The final softcap reducer",
            description: "Makes the softcap do barely anything.",
            cost: new Decimal(8),
            unlocked(){return hasUpgrade("e",14)}
        },
        34: {
            title: "The ultimate upgrade",
            description: "Point gain is increased by 2.",
            cost: new Decimal(8),
            unlocked(){return hasUpgrade("e",24)}
        },
        41: {
            title: "Exponent-izer",
            description: "Gives a nice ^1.2 AFTER the exponent effect.",
            cost: new Decimal(12),
            unlocked(){return hasUpgrade("e",34)}
        },
        42: {
            title: "The Exponent-izer 2.0",
            description: "Gives another nice ^1.2 AFTER the exponent effect.",
            cost: new Decimal(13),
            unlocked(){return hasUpgrade("e",41)}
        },
        43: {
            title: "The Upgrade Exponent-izer",
            description: "Gives a cool ^5 to the upgrade 1;4.",
            cost: new Decimal(14),
            unlocked(){return hasUpgrade("e",42)}
        },
        44: {
            title: "The Ultimate Exponent",
            description: "Squares your math gain BEFORE the exponent effect.",
            cost: new Decimal(14),
            unlocked(){return hasUpgrade("e",43)}
        },
    },
})

addLayer("t", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked(){if(player.e.points.gte(20)||player.t.unlocked===true)return true},                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
        softcapped: "",
    }},
    name: "tetration", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "^^", // This appears on the layer's node. Default is the id with the first letter capitalized
    color: "00ffff",                       // The color for this layer, which affects many elements.
    resource: "tetration",            // The name of this layer's main prestige resource.
    row: 1,                                 // The row this layer is on (0 is the first row).
    effect(){
        let logger = new Decimal(15)
        if(hasUpgrade("t",12))logger=new Decimal(10)
        if(hasUpgrade("t",13))logger=new Decimal(6)
        let expon = new Decimal(1).add(player["t"].points).log(logger).add(1)
        if(hasUpgrade("t",11))expon=expon.tetrate(2)
        if(hasChallenge("t",11))expon=expon.tetrate(1.5)
        if(hasUpgrade("t",31))expon=expon.tetrate(1.3655)
        if(expon.gte(2)){
            player.t.softcapped = " {softcapped}"
            expon=new Decimal(2).add(expon.log(22))
        }else{player.t.softcapped=""}
        return expon
    },
    effectDescription(){return `tetrating your exponent effect to ^^${format(layers[this.layer].effect())}${player.t.softcapped}.`},
    baseResource: "exponents",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.e.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(20),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "static",                         // Determines the formula used for calculating prestige currency.
    exponent: 3,                          // "normal" prestige gain is (currency^exponent).
    base: 1,

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns your exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return true },            // Returns a bool for if this layer's node should be visible in the tree.
    branches:["e"],
    upgrades: {
        rows: 4,
        cols: 4,
        11: {
            title: "Tetration isn't powerful enough",
            description: "Tetrates the tetration effect by 2.",
            cost: new Decimal(25),
            currencyDisplayName: "exponents",
            currencyInternalName: "points",
            currencyLayer: "e",
        },
        12: {
            title: "Again?!",
            description: "Reduces the tetration log() to 10.",
            cost: new Decimal(27),
            currencyDisplayName: "exponents",
            currencyInternalName: "points",
            currencyLayer: "e",
            unlocked(){return hasUpgrade("t",11)},
        },
        13: {
            title: "Yep, again.",
            description: "Reduces the tetration log() to 6.",
            cost: new Decimal(28),
            currencyDisplayName: "exponents",
            currencyInternalName: "points",
            currencyLayer: "e",
            unlocked(){return hasUpgrade("t",12)},
        },
        14: {
            title: "Let's mix it up, shall we?",
            description: "Unlocks a challenge.",
            cost: new Decimal(31),
            currencyDisplayName: "exponents",
            currencyInternalName: "points",
            currencyLayer: "e",
            unlocked(){return hasUpgrade("t",13)},
        },
        21: {
            title: "Addition",
            description: "Adds one to the math generation base.",
            cost: new Decimal(2),
            currencyDisplayName: "exponents",
            currencyInternalName: "points",
            currencyLayer: "e",
            unlocked(){
                if(inChallenge("t",11)){return true}else{return false}
            },
        },
        22: {
            title: "Addition 2.0",
            description: "Adds another one to the math generation base. Also, the exponent effect is tetrated by 1.1.",
            cost: new Decimal(2),
            currencyDisplayName: "exponents",
            currencyInternalName: "points",
            currencyLayer: "e",
            unlocked(){
                if(inChallenge("t",11)&&hasUpgrade("t",21)){return true}else{return false}
            },
        },
        23: {
            title: "Improved Addition",
            description: "Adds two to the math generation base.",
            cost: new Decimal(3),
            currencyDisplayName: "exponents",
            currencyInternalName: "points",
            currencyLayer: "e",
            unlocked(){
                if(inChallenge("t",11)&&hasUpgrade("t",22)){return true}else{return false}
            },
        },
        24: {
            title: "Amazing Addition",
            description: "Adds three to the math generation base.",
            cost: new Decimal(11),
            currencyDisplayName: "exponents",
            currencyInternalName: "points",
            currencyLayer: "e",
            unlocked(){
                if(inChallenge("t",11)&&hasUpgrade("t",23)){return true}else{return false}
            },
        },
        31: {
            title: "Just a bit further....",
            description: "Tetrates the tetration effect by 1.4.",
            cost: new Decimal(34),
            currencyDisplayName: "exponents",
            currencyInternalName: "points",
            currencyLayer: "e",
            unlocked(){return hasUpgrade("t",14)}
        },
    },
    challenges: {
        rows: 1,
        cols: 1,
        11: {
            name: "The Tetrater",
            challengeDescription: "Math gain is tetrated by 0.3, and the exponent effect is tetrated by 0.7.",
            rewardDescription: "The tetration effect is tetrated by 1.5.",
            goal: new Decimal(22),
            currencyDisplayName: "exponents",
            currencyInternalName: "points",
            currencyLayer: "e",
            unlocked(){return hasUpgrade("t",14)},
        },
    },
    milestones: {
        1: {
            requirementDescription: "2 tetrations",
            effectDescription: "Now you can buy max exponents!",
            done() { return player.t.points.gte(2) }
        },
    }
})