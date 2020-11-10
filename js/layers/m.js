addLayer("m", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                    // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},
    infoboxes: {
        lore: {
            title: "motivation",
            body: "You're barely getting any work done. You're getting tired of seeing barely any progress made in what feels like hours.<br/><br/>"+"You're about to give up when you realize you never had motivation. You see a few fans waiting for your game to release, and that motivates you to work more."
        }
    },
    tabFormat: [
        ["infobox", "lore"],
        "main-display",
        "prestige-button",
        "blank",
        "buyables",
        "blank",
        "upgrades"
    ],
    color: "#FE0102",                       // The color for this layer, which affects many elements
    resource: "motivation",            // The name of this layer's main prestige resource
    row: 0,
    position: 0,                                 // The row this layer is on (0 is the first row)

    baseResource: "hours of work",                 // The name of the resource your prestige gain is based on
    baseAmount() {return player.points},    // A function to return the current value of that resource
    effect(){
        let mult = new Decimal(1)
        if(hasUpgrade("m",11))mult=mult.mul(1.5)
        if(hasUpgrade("m",12))mult=mult.pow(2)
        if(hasUpgrade("m",21))mult=mult.pow(2)
        let power = new Decimal(0.25)
        if(hasUpgrade("m",31))power=0.333333
        return player["m"].points.add(1).pow(power).minus(new Decimal(1).pow(power)).add(1).mul(mult)
    },
    effectDescription(){
        return `multiplying your work speed (after bad developer nerfs!) by ${format(layers.m.effect(),2)}.`
    },
    requires: new Decimal(0.01),         // The amount of the base needed to  gain 1 of the prestige currency.
    resetDescription: "Restart your project for ",
                                            // Also the amount required to unlock the layer.
    
    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.3,                          // "normal" prestige gain is (currency^exponent)
    base: 1,
    gainMult() {                            // Returns your multiplier to your gain of the prestige resource
        let mult = new Decimal(1)
        let soft = new Decimal(1)
        mult = mult.mul(new Decimal(1.25).pow(getBuyableAmount("m",11)))
        mult = mult.mul(new Decimal(1.5).pow(getBuyableAmount("m",12)))
        mult = mult.mul(new Decimal(2).pow(getBuyableAmount("m",13)))
        mult = mult.pow(layers.m.gainExp())
        if(mult.gte(10)){
            soft = mult
            mult = mult.minus(mult).add(10).add(soft.log(3).minus(2))
        }
        return mult
    },
    gainExp() {
        let mult = new Decimal(1)                             // Returns your exponent to your gain of the prestige resource
        if(hasUpgrade("m",22))mult=mult.mul(2)
        return mult
    },
    canBuyMax(){return true},

    layerShown() {return true},
    branches: ["u"],             // Returns a bool for if this layer's node should be visible in the tree.
    buyables: {
        rows: 1,
        cols: 3,
        showRespecButton(){return false}, //**optional**, a function determining whether or not to show the button. Defaults to true if absent.
        11: {
            display() {return `<h1>Trailers</h1><br/><br/><h3>Description: </h3>Create trailers for your game, giving you more waiting fans, which results in giving you more motivation!<br/><br/><h3>Effect: </h3>Multiplies your motivation gain by 1.25^x<br/><br/><h3>Cost: </h3>${format(layers.m.buyables[11].cost(),2)} motivation<br/><br/><h3>Amount: </h3>${getBuyableAmount("m",11)}`},
            cost(){
                let expon = new Decimal(1)
                expon = expon.add(getBuyableAmount("m",11).add(1).div(3))
                return getBuyableAmount("m",11).add(1).pow(expon).ceil()
            },
            canAfford(){
                if(player.m.points.gte(layers.m.buyables[11].cost())){return true}else{return false}
            },
            buy(){
                let cost = layers.m.buyables[11].cost()
                if (player.m.points.lt(cost)) return
                player.m.buyables[11] = player.m.buyables[11].plus(1)
                player.m.points = player.m.points.minus(cost)
            }
        },
        12: {
            display() {return `<h1>Banner Ads</h1><br/><br/><h3>Description: </h3>You make banner ads, and people click on them! Your happiness makes it easier to gain motivation!<br/><br/><h3>Effect: </h3>Multiplies your motivation gain by 1.5^x<br/><br/><h3>Cost: </h3>${format(layers.m.buyables[12].cost(),2)} motivation<br/><br/><h3>Amount: </h3>${getBuyableAmount("m",12)}`},
            cost(){
                let expon = new Decimal(1)
                expon = expon.add(getBuyableAmount("m",12).add(1.5).div(2))
                return getBuyableAmount("m",12).add(1.5).pow(expon).ceil()
            },
            canAfford(){
                if(player.m.points.gte(layers.m.buyables[12].cost())){return true}else{return false}
            },
            buy(){
                let cost = layers.m.buyables[12].cost()
                if (player.m.points.lt(cost)) return
                player.m.buyables[12] = player.m.buyables[12].plus(1)
                player.m.points = player.m.points.minus(cost)
            }
        },
        13: {
            display() {return `<h1>Youtube Ads</h1><br/><br/><h3>Description: </h3>You put ads on Youtube, and the amount of people make it so much easier to gain motivation!<br/><br/><h3>Effect: </h3>Multiplies your motivation gain by 2^x<br/><br/><h3>Cost: </h3>${format(layers.m.buyables[13].cost(),2)} motivation<br/><br/><h3>Amount: </h3>${getBuyableAmount("m",13)}`},
            cost(){
                let expon = new Decimal(1)
                expon = expon.add(getBuyableAmount("m",13).add(1.5).div(1.5))
                return getBuyableAmount("m",13).add(2).pow(expon).ceil()
            },
            canAfford(){
                if(player.m.points.gte(layers.m.buyables[13].cost())){return true}else{return false}
            },
            buy(){
                let cost = layers.m.buyables[13].cost()
                if (player.m.points.lt(cost)) return
                player.m.buyables[13] = player.m.buyables[13].plus(1)
                player.m.points = player.m.points.minus(cost)
            }
        },
    },
    upgrades: {
        rows: 3,
        cols: 2,
        11: {
            title: "Motivation-Up",
            description: "Motivating yourself takes too long. Let's shorten it. (Boost to Motivation effect). You also get a 1.5x boost to hours of work.",
            cost: new Decimal(2),
        },
        12: {
            title: "Motivation Upgrade",
            description: "You don't gain enough motivation atm. You need to work more. Squares your motivation's effect AFTER the multiplier.",
            cost: new Decimal(8),
        },
        21: {
            title: "Super Motivation",
            description: "Your motivation is WEAK. It needs to be POWERFUL! Squares motivation's effect AGAIN.",
            cost: new Decimal(25),
        },
        22: {
            title: "Ultimate Motivation",
            description: "This is the only motivation booster. Your motivation has insane power, but you can increase that by spending a bit more motivation. Squares motivation gain.",
            cost: new Decimal(50),
        },
        31: {
            title: "Gogon's Sword",
            description: "This thing can slice one part of the log() for the motivation effect like it's butter. (Hint: Get 20,000 Motivation after you buy this.)",
            cost: new Decimal(150),
        },
        32: {
            title: "Release the update already!",
            description: "You need to release the update. You need this upgrade.",
            cost: new Decimal(20000),
            unlocked(){if(hasUpgrade("m",32) || player.points.gte(5)){return true}else{return false}},
        },
    },
    hotkeys: [
        {
            key: "m",
            description: "Press M to get motivated",
            onPress() { if (canReset(this.layer)) doReset(this.layer) },
        },
    ],
})