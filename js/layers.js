const D = x=>new Decimal(x)

function getRebuyableEffect(layer,id){
    let base = getRebuyableBase(layer,id)
    let amt = getBuyableAmt(layer,id).add(getFreeRebuyables(layer,id))
    if(layer=="a"){
        if(id==11){
            let boost = base.pow(amt)
            if(boost.gte(1e10))boost=D(1e8).mul(boost.pow(0.25))
            return boost
        }
        if(id==12){
            let boost = base.mul(amt)
            if(boost.gte(50))boost=D(7.5).mul(boost.pow(hasUpgrade("a",22)?0.6:0.5))
            return boost
        }
        if(id==21){
            let boost = base.mul(amt)
            return boost
        }
        if(id==22){
            let boost = base.mul(amt)
            return boost
        }
    }
}
function getRebuyableBase(layer,id){
    if(layer=="a"){
        if(id==11){
            return D(1.5).add(getRebuyableEffect("a",12)).add(hasUpgrade("a",11)?1:0)
        }
        if(id==12){
            return D(0.25).add(getRebuyableEffect("a",21))
        }
        if(id==21){
            return D(0.075).add(getRebuyableEffect("a",22)).mul(hasUpgrade("a",14)?2:1)
        }
        if(id==22){
            return D(0.025)
        }
    }
}
function getBuyableAmt(layer,id){
    return getBuyableAmount(layer,id)
}
function getRebuyableDisplay(displays){
    let s = ""
    for(y in displays){
        let x = displays[y]
        if(typeof x =="object"){
            if(shiftDown){s=s+x[1];continue}
            else {s=s+x[0];continue}
        }
        else s=s+x
    }
    if(!shiftDown)s=s+"<br><br><h3>Hold shift for more details!</h3>"
    return s
}
function getFreeRebuyables(layer,id){
    if(layer=="a"){
        if(id==11){
            let free = D(0)
            if(hasUpgrade("a",13))free=free.add(getBuyableAmt("a",12))
            return free
        }
        if(id==12){
            let free = D(0)
            if(hasUpgrade("a",21))free=free.add(getBuyableAmt("a",21))
            return free
        }
        if(id==21){
            let free = D(0)
            if(hasUpgrade("a",24))free=free.add(getBuyableAmt("a",22))
            return free
        }
        if(id==22){
            let free = D(0)
            if(hasUpgrade("a",12))free=free.add(4)
            if(hasUpgrade("a",23))free=free.add(getBuyableAmt("a",11).pow(0.5).floor())
            return free
        }
    }
}
addLayer("a", {
    name: "apples", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#EE4444",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "apples", // Name of prestige currency
    baseResource: "_", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.55, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        mult=mult.mul(layers.b.effect())
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "a", description: "A: Reset for apples", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    buyables: {
        rows: 2,
        cols: 2,
        11: {
            cost() { return new Decimal(getBuyableAmt(this.layer, this.id)).add(2).pow(getBuyableAmt(this.layer, this.id).div(2).add(1)).div(2).floor() },
            display() {
                return getRebuyableDisplay([`<h1>Eat the Apples!<br>____________</h1><br><br><h2>Amount:</h2> <b>${getBuyableAmt(this.layer, this.id)}${getFreeRebuyables(this.layer, this.id).gte(1)?`+${getFreeRebuyables(this.layer, this.id)}`:""}.</b><br><br><h2>Cost:</h2> <b>`,[`${format(this.cost())}`,`floor(((x+2)^(x/2))/2)`],` apples.</b><br><br><h2>Effect:</h2> <b>+`,[`${format(getRebuyableEffect(this.layer, this.id))}`,`(${format(getRebuyableBase(this.layer, this.id))}^x)`],`* more points${getRebuyableEffect(this.layer, this.id).gte(1e10)?" {softcapped}":""}.</b>`])
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmt(this.layer, this.id).add(1))
            },
            unlocked(){return player.a.total.gte(1)||player.unlocks.b}
        },
        12: {
            cost() { return new Decimal(getBuyableAmt(this.layer, this.id)).add(2).mul(1.25).pow(getBuyableAmt(this.layer, this.id)).add(2).floor() },
            display() {
                return getRebuyableDisplay([`<h1>Wash the Apples!<br>____________</h1><br><br><h2>Amount:</h2> <b>${getBuyableAmt(this.layer, this.id)}${getFreeRebuyables(this.layer, this.id).gte(1)?`+${getFreeRebuyables(this.layer, this.id)}`:""}.</b><br><br><h2>Cost:</h2> <b>`,[`${format(this.cost())}`,`floor((((x+2)*1.5)^x)+2)`],` apples.</b><br><br><h2>Effect:</h2> <b>+`,[`${format(getRebuyableEffect(this.layer, this.id))}`,`(x*${format(getRebuyableBase(this.layer, this.id))})`],` "Eat the Apples" base${getRebuyableEffect(this.layer, this.id).gte(50)?" {softcapped}":""}.</b>`])
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmt(this.layer, this.id).add(1))
            },
            unlocked(){return getBuyableAmt("a",11).gte(1)||player.unlocks.b}
        },
        21: {
            cost() { return new Decimal(getBuyableAmt(this.layer, this.id)).add(2).mul(1.25).pow(getBuyableAmt(this.layer, this.id)).pow(1.5).add(34).floor() },
            display() {
                return getRebuyableDisplay([`<h1>Purify the Apples!<br>____________</h1><br><br><h2>Amount:</h2> <b>${getBuyableAmt(this.layer, this.id)}${getFreeRebuyables(this.layer, this.id).gte(1)?`+${getFreeRebuyables(this.layer, this.id)}`:""}.</b><br><br><h2>Cost:</h2> <b>`,[`${format(this.cost())}`,`floor((((x+2)*1.5)^x)^1.5+34)`],` apples.</b><br><br><h2>Effect:</h2> <b>+`,[`${format(getRebuyableEffect(this.layer, this.id),3)}`,`(x*${format(getRebuyableBase(this.layer, this.id),3)})`],` "Wash the Apples" base.</b>`])
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmt(this.layer, this.id).add(1))
            },
            unlocked(){return getBuyableAmt("a",11).gte(3)||player.unlocks.b}
        },
        22: {
            cost() { return new Decimal(getBuyableAmt(this.layer, this.id)).add(3).mul(2).pow(getBuyableAmt(this.layer, this.id)).pow(2).add(99).floor() },
            display() {
                return getRebuyableDisplay([`<h1>Pick the Apples!<br>____________</h1><br><br><h2>Amount:</h2> <b>${getBuyableAmt(this.layer, this.id)}${getFreeRebuyables(this.layer, this.id).gte(1)?`+${getFreeRebuyables(this.layer, this.id)}`:""}.</b><br><br><h2>Cost:</h2> <b>`,[`${format(this.cost())}`,`floor((((x+3)*2)^x)^2+99)`],` apples.</b><br><br><h2>Effect:</h2> <b>+`,[`${format(getRebuyableEffect(this.layer, this.id),3)}`,`(x*${format(getRebuyableBase(this.layer, this.id),3)})`],` "Purify the Apples" base.</b>`])
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmt(this.layer, this.id).add(1))
            },
            unlocked(){return player.a.best.gte(75)||player.unlocks.b}
        },
    },
    upgrades: {
        rows: 9,
        cols: 9,
        11: {
            title: "Apple Eater",
            description: `"Eat the Apples" base is +1.`,
            cost: new Decimal(250),
            unlocked(){return getBuyableAmt("a",22).gte(1)||player.unlocks.b}
        },
        12: {
            title: "Apple Picker",
            description: `Gain 4 free "Pick the Apples".`,
            cost: new Decimal(1e7),
            unlocked(){return upgradeUnlocked("a",11)||player.unlocks.b}
        },
        13: {
            title: "Washing helps Eating",
            description: `"Wash the Apples" gives free levels to "Eat the Apples".`,
            cost: new Decimal(1e8),
            unlocked(){return upgradeUnlocked("a",12)||player.unlocks.b}
        },
        14: {
            title: "Better Purification Methods",
            description: `"Purify the Apples" base is *2.`,
            cost: new Decimal(1e10),
            unlocked(){return upgradeUnlocked("a",13)||player.unlocks.b}
        },
        21: {
            title: "Purification is Washing",
            description: `"Purify the Apples" gives free levels to "Wash the Apples".`,
            cost: new Decimal(1e13),
            unlocked(){return upgradeUnlocked("a",14)||player.unlocks.b}
        },
        22: {
            title: "C'mon! Clean better!",
            description: `"Wash the Apples" softcap is weakened.`,
            cost: new Decimal(1e14),
            unlocked(){return upgradeUnlocked("a",21)||player.unlocks.b}
        },
        23: {
            title: "Gluttony",
            description: `"Eat the Apples" gives free levels to "Pick the Apples", but not many levels.`,
            cost: new Decimal(1e17),
            unlocked(){return upgradeUnlocked("a",22)||player.unlocks.b}
        },
        24: {
            title: "Picking helps Purifying",
            description: `"Pick the Apples" gives free levels to "Purify the Apples".`,
            cost: new Decimal(1e18),
            unlocked(){return upgradeUnlocked("a",23)||player.unlocks.b}
        },
    },
    tabFormat: {
        "Main": {
            content: ["main-display",["prestige-button",function(){return "Somehow create "}],"blank","upgrades"],
        },
        "Rebuyables": {
            content: ["buyables"],
        }
    }
})
addLayer("b", {
    startData() { return { 
        unlocked:true,
        points: new Decimal(0),
    }},

    color: "#AAAAAA",
    resource: "balls",
    row: 1,

    baseResource: "apples",
    baseAmount() { return player.a.points },

    requires: new Decimal(1e20),

    type: "normal",
    exponent: 0.45,

    gainMult() {
        return new Decimal(1)
    },
    gainExp() {
        return new Decimal(1)
    },

    layerShown() { return player.unlocks.b},
    effect(){
        let boost=player.b.points
        boost=boost.mul(10).pow(0.25).mul(2)
        boost=boost.add(1)
        return boost
    },
    effectDescription(){
        return `boosting point and apple gain by ${format(this.effect())}*.`
    },
    update(diff){
        if(player.a.points.gte(5e19))player.unlocks.b=true
    },
    branches:["a"],
})
addLayer("goals", {
    startData() { return { 
        unlocked: true,
        points: new Decimal(0),
    }},
    symbol: "a1",
    color: "#4BDC13",
    resource: "achievements",
    row: "side",

    baseResource: "points",
    baseAmount() { return player.points },

    requires: new Decimal(10),

    type: "normal",
    exponent: 0.5,

    gainMult() {
        return new Decimal(1)
    },
    gainExp() {
        return new Decimal(1)
    },

    layerShown() { return true },
    achievements: {
        rows: 9,
        cols: 10,
        11: {
            name: "1",
            tooltip: "Get 1 apple",
            done(){return player.a.points.gte(1)}
        },
        12: {
            name: "2",
            tooltip: "Get 10 apples",
            done(){return player.a.points.gte(10)}
        },
        13: {
            name: "3",
            tooltip: "Pick 1 apple",
            done(){return getBuyableAmt("a",22).gte(1)}
        },
        14: {
            name: "4",
            tooltip: "Eat 15 apples",
            done(){return getBuyableAmt("a",11).gte(15)}
        },
        15: {
            name: "5",
            tooltip: "Get 1 ball",
            done(){return player.b.points.gte(1)}
        },
    },
    tabFormat: {
        "Main": {
            content: ["main-display","blank","achievements"],
        },
    }
})