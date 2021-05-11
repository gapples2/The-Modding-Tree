function unlockedBatteryUpg(id){
    if(hasUpgrade("b",id)||hasMilestone("b",1))return true
    let row = Math.floor(id/10)
    if(row!=1&&!hasUpgrade("b",id-10))return false
    let amt = 0
    for(let x=1;x<layers.b.upgrades.cols+1;x++){
        if(hasUpgrade("b",row*10+x))amt++
    }
    if(amt>=1&&!hasMilestone("b",0))return false
    if(amt>=2)return false
    return true
}

addLayer("e", {
    name: "energy", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "E", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
		points: new ExpantaNum(0),
        fuel: D(1),
        bestFuel: D(1),
        getFuel: false,
        burnFuel: false,
        gainfuelauto: D(0),
        buyMax: false,
    }},
    color: "#ffff00",
    requires: new ExpantaNum(10), // Can be a function that takes requirement increases into account
    resource: "energy", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(0.1).add(buyableEffect("e",12)).times(this.burnSpeed()).times(buyableEffect("e",21))
        if(hasUpgrade("b",14))mult=mult.mul(2)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new ExpantaNum(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
    tabFormat: {
        "Fuel": {
            content: [
                "main-display",
                ["bar","fuel"],
                "blank",
                ["row",[["clickable",11],["clickable",12]]]
            ],
        },
        "Upgrades":{
            content: [
                "main-display",
                "upgrades"
            ]
        },
        "Energy Buyables":{
            content: [
                "main-display",
                ["row",[["buyable",11],["buyable",12]]],
                "blank",
                ["clickable",21]
            ],
            unlocked(){return (hasUpgrade("e",13)||player.b.unlocked)&&!hasUpgrade("e",31)}
        },
        "Point Buyables":{
            content: [
                ["row",[["buyable",21],["buyable",22]]],
                "blank",
                ["clickable",21]
            ],
            unlocked(){return (hasUpgrade("e",22)||player.b.best.gte(2))&&!hasUpgrade("e",31)}
        },
        "Challenges": {
            content: [],
            unlocked: false
        },
    },
    bars: {
        fuel: {
            direction: RIGHT,
            width: 200,
            height: 50,
            progress() {
                if(player.e.bestFuel.eq(0))return 0
                if(player.e.bestFuel.lt(1e9))return player.e.fuel.div(player.e.bestFuel).min(1)
                return player.e.fuel.log10().div(player.e.bestFuel.log10()).min(1)
            },
            display(){
                return format(player.e.fuel)+" / "+format(player.e.bestFuel)+" fuel"
            },
            borderStyle:{"border-color":"#aaaaaa"},
            fillStyle:{"background-color":"#654321"},
        },
    },
    update(diff){
        player.e.bestFuel=this.fuelCapacity()
        if(!hasUpgrade("e",32)){
            if(player.e.getFuel){
                let amt = 0.999**diff
                player.e.fuel = player.e.fuel.add(player.points.mul(1-amt).times(this.fuelMult())).min(player.e.bestFuel)
                if(player.e.fuel.eq(player.e.bestFuel))player.e.getFuel=false
                else player.points = player.points.mul(amt)
            }
            if(player.e.burnFuel){
                let amt = D(diff).times(this.burnSpeed())
                if(player.e.fuel.minus(amt).lte(0)){
                    amt=player.e.fuel
                    player.e.burnFuel=false
                }
                player.e.points = player.e.points.add(amt.times(layers.e.gainMult()))
                player.e.fuel = player.e.fuel.minus(amt)
            }
        }
        else{
            player.e.points = player.e.points.add(layers.e.gainMult())
            player.e.fuel = player.e.fuel.add(player.points.times(this.fuelMult())).min(player.e.bestFuel)
        }
        if(player.e.points.lt(0.01)&&hasUpgrade("e",11)&&player.e.fuel.eq(0)&&player.points.lt(1))player.e.points=D(0.01)
        if(hasUpgrade("e",31)){
            for(let x=1;x<3;x++){
                for(let y=1;y<3;y++)buyMaxBuyable("e",x*10+y)
            }
        }
    },
    clickables: {
        rows: 2,
        cols: 2,
        11: {
            display() {return (player.e.getFuel?"Stop gaining fuel.":"Start gaining fuel.")+`\n(+${format(player.points.mul(0.001).times(layers.e.fuelMult()))} fuel/sec, -${format(player.points.mul(0.001))} points/sec)`},
            onClick() {player.e.getFuel = !player.e.getFuel},
            canClick(){return player.points.gte(1)&&player.e.bestFuel.gt(player.e.fuel)},
        },
        12: {
            display() {return (player.e.burnFuel?"Stop burning fuel.":"Start burning fuel.")+`\n(+${format(layers.e.gainMult().times(layers.e.burnSpeed()))} energy/sec, -${format(layers.e.burnSpeed())} fuel/sec)`},
            onClick() {player.e.burnFuel = !player.e.burnFuel},
            canClick(){return player.e.fuel.gte(0.1)},
        },
        21: {
            display() {return (player.e.buyMax?"Mode: Buy Max":"Mode: Buy Single")},
            onClick() {player.e.buyMax = !player.e.buyMax},
            canClick(){return true},
        }
    },
    upgrades: {
        rows: 3,
        cols: 4,
        11: {
            title: "Pointy",
            description: "Generate points based on the amount of energy you have.",
            cost(){return new ExpantaNum(0.09/(hasUpgrade("b",12)?2:1))},
        },
        12: {
            title: "Extra Fuel",
            description: "Triple fuel capacity and gain 2x more of it.",
            cost(){return new ExpantaNum(1/(hasUpgrade("b",12)?2:1))},
            unlocked(){return player.e.points.gt(0.8)||hasUpgrade("e",12)||player.b.unlocked}
        },
        13: {
            title: "Buyers",
            description: "Unlock 2 buyables and double point gain.",
            cost(){return new ExpantaNum(10/(hasUpgrade("b",12)?2:1))},
            unlocked(){return player.e.points.gt(8)||hasUpgrade("e",13)||player.b.unlocked}
        },
        14: {
            title: "Burners",
            description: "Burn fuel 3x faster.",
            cost(){return new ExpantaNum(10/(hasUpgrade("b",12)?2:1))},
            unlocked(){return player.e.points.gt(8)&&getBuyableAmount("e",11).gte(1)||hasUpgrade("e",14)||player.b.unlocked}
        },
        21: {
            title: "Burners II",
            description: "Burn fuel faster based on the amount of fuel you have.",
            cost(){return new ExpantaNum(25)},
            unlocked(){return player.b.best.gte(1)},
            effect(){return player.e.fuel.add(1).log10().times(3).max(1)},
            effectDisplay(){return format(this.effect())+"x"}
        },
        22: {
            title: "Buyers II",
            description: "Square 'Buyers'.",
            cost(){return new ExpantaNum(50)},
            unlocked(){return player.b.best.gte(1)},
        },
        23: {
            title: "Extra Fuel II",
            description: "Increase the first buyable's base by 1 and gain 1.5x more fuel.",
            cost(){return new ExpantaNum(500)},
            unlocked(){return player.b.best.gte(1)},
        },
        24: {
            title: "Pointy II",
            description: "Raise 'Pointy' to 1.2.",
            cost(){return new ExpantaNum(1e10)},
            unlocked(){return player.b.best.gte(1)},
        },
        31: {
            title: "Autobuyer",
            description: "Buy all 4 buyables every tick.",
            cost(){return new ExpantaNum("1e308308")},
            unlocked(){return player.e.points.gt("1e308308")||hasUpgrade("e",31)},
        },
        32: {
            title: "Autobuyer II",
            description: "Automatically gain energy and fuel.",
            cost(){return new ExpantaNum("1ee20")},
            unlocked(){return player.e.points.gt("1ee20")||hasUpgrade("e",32)},
        },
    },
    fuelMult(){
        let mult = D(1)
        if(hasUpgrade("e",12))mult=mult.times(2)
        if(hasUpgrade("e",23))mult=mult.times(1.5)
        return mult
    },
    fuelCapacity(){
        let cap = D(1).mul(buyableEffect("e",11)).mul(D(hasUpgrade("b",22)?3:2).pow(player.b.best))
        if(hasUpgrade("e",12))cap=cap.times(3)
        if(hasUpgrade("b",23))cap=cap.times(2)
        return cap
    },
    burnSpeed(){
        let speed = D(1).times(buyableEffect("e",22))
        if(hasUpgrade("e",14))speed=speed.mul(3)
        if(hasUpgrade("b",13))speed=speed.mul(2)
        if(hasUpgrade("e",21))speed=speed.mul(upgradeEffect("e",21))
        if(hasUpgrade("b",23))speed=speed.mul(4)
        if(hasUpgrade("b",33))speed=speed.mul(player.e.fuel.mul(0.01))
        return speed.max(1)
    },
    buyables: {
        rows: 2,
        cols: 2,
        11: {
            cost(x) { return new ExpantaNum(3).pow(getBuyableAmount(this.layer, this.id)||x).mul(5) },
            display() { return "<h3>Multiply fuel cap by "+format(hasUpgrade("e",23)?3:2)+".\n\nCost: "+format(this.cost())+" energy\n\nAmount: "+getBuyableAmount(this.layer, this.id)+"\n\nEffect: "+format(buyableEffect(this.layer, this.id))+"</h3>" },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if(player.e.buyMax)return this.buyMax()
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(){return D(hasUpgrade("e",23)?3:2).pow(getBuyableAmount(this.layer, this.id))},
            unlocked(){return hasUpgrade("e",13)||player.b.unlocked},
            buyMax(){
                let maxAmt = player.e.points.div(5).add(0.001).logBase(3).max(0).floor().minus(getBuyableAmount(this.layer, this.id))
                if(this.canAfford()){
                    maxAmt=maxAmt.add(1)
                    player[this.layer].points = player[this.layer].points.sub(this.cost(maxAmt.add(getBuyableAmount(this.layer, this.id).minus(1))))
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(maxAmt))
                }
            }
        },
        12: {
            cost(x) { return new ExpantaNum(5).pow(getBuyableAmount(this.layer, this.id)||x).mul(10) },
            display() { return "<h3>Get "+format(player.b.best.div(100).add(0.01).mul(hasUpgrade("b",24)?3:1))+" more energy per fuel.\n\nCost: "+format(this.cost())+" energy\n\nAmount: "+getBuyableAmount(this.layer, this.id)+"\n\nEffect: "+format(buyableEffect(this.layer, this.id))+"</h3>" },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if(player.e.buyMax)return this.buyMax()
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(){return getBuyableAmount(this.layer, this.id).div(100).mul(player.b.best.add(1)).mul(hasUpgrade("b",24)?3:1)},
            unlocked(){return hasUpgrade("e",13)||player.b.unlocked},
            buyMax(){
                let maxAmt = player.e.points.div(10).add(0.001).logBase(5).max(0).floor().minus(getBuyableAmount(this.layer, this.id))
                if(this.canAfford()){
                    maxAmt=maxAmt.add(1)
                    player[this.layer].points = player[this.layer].points.sub(this.cost(maxAmt.add(getBuyableAmount(this.layer, this.id).minus(1))))
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(maxAmt))
                }
            }
        },
        21: {
            cost(x) { return new ExpantaNum(15).pow(getBuyableAmount(this.layer, this.id)||x).mul(1000) },
            display() { return "<h3>Gain "+format(hasUpgrade("b",34)?1.25:1.1)+"x more energy.\n\nCost: "+format(this.cost())+" points\n\nAmount: "+getBuyableAmount(this.layer, this.id)+"\n\nEffect: "+format(buyableEffect(this.layer, this.id))+"</h3>" },
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                if(player.e.buyMax)return this.buyMax()
                player.points = player.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(){return D(hasUpgrade("b",34)?1.25:1.1).pow(getBuyableAmount(this.layer, this.id))},
            buyMax(){
                let maxAmt = player.points.div(1000).add(0.001).logBase(15).max(0).floor().minus(getBuyableAmount(this.layer, this.id))
                if(this.canAfford()){
                    maxAmt=maxAmt.add(1)
                    player.points = player.points.sub(this.cost(maxAmt.add(getBuyableAmount(this.layer, this.id).minus(1))))
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(maxAmt))
                }
            }
        },
        22: {
            cost(x) { return new ExpantaNum(7).pow(getBuyableAmount(this.layer, this.id)||x).mul(5000) },
            display() { return "<h3>Burn fuel "+format(hasUpgrade("b",32)?2.25:1.5)+"x faster.\n\nCost: "+format(this.cost())+" points\n\nAmount: "+getBuyableAmount(this.layer, this.id)+"\n\nEffect: "+format(buyableEffect(this.layer, this.id))+"</h3>" },
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                if(player.e.buyMax)return this.buyMax()
                player.points = player.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(){return D(hasUpgrade("b",32)?2.25:1.5).pow(getBuyableAmount(this.layer, this.id))},
            buyMax(){
                let maxAmt = player.points.div(5000).add(0.001).logBase(7).max(0).floor().minus(getBuyableAmount(this.layer, this.id))
                if(this.canAfford()){
                    maxAmt=maxAmt.add(1)
                    player.points = player.points.sub(this.cost(maxAmt.add(getBuyableAmount(this.layer, this.id).minus(1))))
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(maxAmt))
                }
            }
        },
    },
    canReset: false
})

addLayer("b", {
    startData() { return { 
        unlocked: false,
        points: D(0),
    }},

    color: "#aaaa00",
    resource: "batteries",
    row: 1,

    baseResource: "points",
    baseAmount() { return player.points },

    requires: D(10),

    type: "custom",
    exponent: 0.5,

    gainMult() {
        return D(1)
    },
    gainExp() {
        return D(1)
    },

    layerShown() { return player.e.points.gte(30)||player.b.unlocked },
    update(diff){
        if(player.e.points.gte(50))player.b.unlocked=true
        player.b.best=player.b.points.add(layers.b.upgCosts())
    },
    getResetGain(){
        return player.e.points.add(0.0001).logBase(50).minus(player.b.points.add(layers.b.upgCosts())).max(0).floor()
    },
    getNextAt(){
        return D(50).pow(player.b.points.add(this.getResetGain()).add(1).add(layers.b.upgCosts()))
    },
    prestigeButtonText(){
        if(!this.canReset())return "Get "+format(this.getNextAt().minus(player.e.points))+" more energy to get a"+(player.b.points.eq(0)?"":"nother")+" battery."
        return "Put all your energy into "+format(this.getResetGain())+(player.b.points.eq(0)?"":" more")+" batter"+(this.getResetGain().eq(1)?"y":"ies")+".\n\nNext at "+format(this.getNextAt())+" energy."
    },
    canReset(){
        return player.e.points.gte(D(50).pow(player.b.points.add(1).add(layers.b.upgCosts())))
    },
    tabFormat:{
        "Reset":{
            content: [
                ["display-text",function(){return "You have <h2 style='color: rgb(170, 170, 0);text-shadow: rgb(170 170 0) 0px 0px 10px;'>"+format(player.b.points,0)+"</h2> batter"+(player.b.points.eq(1)?"y":"ies")+", "+layers.b.effectDesc()}],
                "blank",
                "prestige-button",
            ]
        },
        "Upgrades":{
            content: [
                ["display-text",function(){return "You have <h2 style='color: rgb(170, 170, 0);text-shadow: rgb(170 170 0) 0px 0px 10px;'>"+format(player.b.points,0)+"</h2> batter"+(player.b.points.eq(1)?"y":"ies")+", "+layers.b.effectDesc()}],
                "upgrades",
                ["clickable",11]
            ]
        },
        "Milestones":{
            content: [
                ["display-text",function(){return "You have <h2 style='color: rgb(170, 170, 0);text-shadow: rgb(170 170 0) 0px 0px 10px;'>"+format(player.b.points,0)+"</h2> batter"+(player.b.points.eq(1)?"y":"ies")+", "+layers.b.effectDesc()}],
                "milestones",
            ],
            unlocked(){return player.b.best.gte(2)}
        }
    },
    effectDesc(){
        return `multiplying fuel cap by ${format(D(hasUpgrade("b",22)?3:2).pow(player.b.best))} and increasing the second buyable's base by ${format(player.b.best.div(100))}.`
    },
    upgrades: {
        rows: 3,
        cols: 4,
        11: {
            title: "Pointed",
            description: "Multiply point gain based on the best amount of batteries you got.",
            cost: new ExpantaNum(1),
            effect(){return D(hasUpgrade("b",31)?10:2).pow(player.b.best)},
            effectDisplay(){return format(this.effect())+"x"},
            unlocked(){return unlockedBatteryUpg(this.id)}
        },
        12: {
            title: "Upgraded",
            description: "Divide the first 4 energy upgrade costs by 2.",
            cost: new ExpantaNum(1),
            unlocked(){return unlockedBatteryUpg(this.id)}
        },
        13: {
            title: "Less Fuel",
            description: "Burn fuel 2x faster.",
            cost: new ExpantaNum(1),
            unlocked(){return unlockedBatteryUpg(this.id)}
        },
        14: {
            title: "Energized",
            description: "Double energy gain per fuel.",
            cost: new ExpantaNum(1),
            unlocked(){return unlockedBatteryUpg(this.id)}
        },
        21: {
            title: "Pointed II",
            description: "Square point gain when it's above 1.",
            cost: new ExpantaNum(1),
            unlocked(){return unlockedBatteryUpg(this.id)}
        },
        22: {
            title: "Upgraded II",
            description: "Increase the first battery effect's base by 1.",
            cost: new ExpantaNum(1),
            unlocked(){return unlockedBatteryUpg(this.id)}
        },
        23: {
            title: "Less Fuel II",
            description: "Burn fuel 4x faster and double fuel capacity.",
            cost: new ExpantaNum(1),
            unlocked(){return unlockedBatteryUpg(this.id)}
        },
        24: {
            title: "Energized II",
            description: "Multiply the second buyables base by 3.",
            cost: new ExpantaNum(1),
            unlocked(){return unlockedBatteryUpg(this.id)}
        },
        31: {
            title: "Pointed III",
            description: "'Pointed' base is 10.",
            cost: new ExpantaNum(3),
            unlocked(){return unlockedBatteryUpg(this.id)}
        },
        32: {
            title: "Upgraded III",
            description: "Square the second point buyable's base effect.",
            cost: new ExpantaNum(3),
            unlocked(){return unlockedBatteryUpg(this.id)}
        },
        33: {
            title: "Less Fuel III",
            description: "Burn 1% of fuel per second.",
            cost: new ExpantaNum(3),
            unlocked(){return unlockedBatteryUpg(this.id)}
        },
        34: {
            title: "Energized III",
            description: "Increase the first point buyable's base by 0.15.",
            cost: new ExpantaNum(3),
            unlocked(){return unlockedBatteryUpg(this.id)}
        },
    },
    refundUpgs(){
        player.b.points=player.b.points.add(this.upgCosts())
        player.b.upgrades=[]
    },
    upgCosts(){
        let amt = D(0)
        for(let x=1;x<layers.b.upgrades.rows+1;x++){
            for(let y=1;y<layers.b.upgrades.cols+1;y++){
                if(hasUpgrade("b",x*10+y))amt=amt.add(tmp.b.upgrades[x*10+y].cost)
            }
        }
        return amt
    },
    clickables: {
        rows: 1,
        cols: 1,
        11: {
            display() {return "Click here to refund your upgrades\n(+"+format(layers.b.upgCosts())+" batter"+(layers.b.upgCosts().eq(1)?"y":"ies")+")\n\nDoes <b>NOT</b> reset anything!"},
            onClick() {layers.b.refundUpgs()},
            canClick(){return player.b.best.gt(player.b.points)},
        }
    },
    milestones: {
        0: {
            requirementDescription: "3 batteries",
            effectDescription: "You can pick another path.",
            done() { return player.b.points.gte(3) }
        },
        1: {
            requirementDescription: "100 batteries",
            effectDescription: "You can pick all 4 paths.",
            done() { return player.b.points.gte(100) }
        }
    }
})