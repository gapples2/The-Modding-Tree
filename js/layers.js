function getBUpgCost(id){
    let upgCost = [[1,1,5,20,50,250,2000,5000,30000],[3e6,2e9,1e10,2e11,2e12,2e12,4e13,8e14,1e18]][id%10-1][Math.floor(id/10)-1]
    return new Decimal(upgCost).div(layers.c?layers.c.effect():1).floor().max(1)
}

addLayer("a", {
    startData() { return { 
        unlocked: false,
        points: new Decimal(0),
    }},

    color: "#ffff00",
    resource: "cheapeners",
    row: "side",

    baseResource: "basic points",
    baseAmount() { return player.b.points },
    requires: new Decimal(100),

    type: "static",
    exponent: 2,
    base: 5,
    tooltip(){return ""},

    gainMult() {
        let mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },

    layerShown() { return true },
    tabFormat: [
        ["display-text",function() {return "coming soon"}],
    ],
})

addLayer("b", {
    name: "basic point", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#939192",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "basic points", // Name of prestige currency
    baseResource: "dust", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(hasUpgrade("b",61))mult=mult.mul(upgradeEffect("b",61))
        if(hasUpgrade("b",32))mult=mult.mul(upgradeEffect("b",32))
        if(hasUpgrade("b",92))mult=mult.mul(5)
        mult=mult.mul(layers.c.cPowerEffect())
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "b", description: "B: Reset for basic points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades: {
        rows: 9,
        cols: 5,
        11: {
            title: "+Dust",
            description: "Gain 1 dust per second.",
            cost(){return getBUpgCost(11)},
        },
        21: {
            title: "More Dust",
            description: "Gain more dust based on the amount of basic points you have.",
            cost(){return getBUpgCost(21)},
            unlocked(){return hasUpgrade("b",11)||player.c.unlocked},
            effect(){
                let eff = player.b.points.add(2).log(5).add(1).pow(hasUpgrade("b",91)?2:1)
                if(eff.gte(1e6))eff=eff.div(1e6).pow(0.5).mul(1e6)
                return eff
            },
            effectDisplay(){return format(this.effect())+"x"}
        },
        31: {
            title: "Triple the Dust",
            description: "Gain 2 dust per second.",
            cost(){return getBUpgCost(31)},
            unlocked(){return hasUpgrade("b",21)||player.c.unlocked}
        },
        41: {
            title: "Upgraded Dust",
            description: "Gain dust based on your upgrades. (1.25^upgrades)",
            cost(){return getBUpgCost(41)},
            unlocked(){return hasUpgrade("b",31)||player.c.unlocked},
            effect(){
                let mult = 0
                for(let x=1;x<10;x++){
                    for(let y=1;y<3;y++){
                        if(hasUpgrade("b",x*10+y))mult++
                    }
                }
                return new Decimal(1.25).add(hasUpgrade("b",82)?0.25:0).pow(mult).pow(hasUpgrade("b",81)?2:1)
            },
            effectDisplay(){return format(this.effect())+"x"}
        },
        51: {
            title: "Dust Dimensions",
            description: "Gain more dust based on your dust.",
            cost(){return getBUpgCost(51)},
            unlocked(){return hasUpgrade("b",41)||player.c.unlocked},
            effect(){return player.points.add(1).log(10).add(1).pow(hasUpgrade("b",12)?player.c.points:1)},
            effectDisplay(){return format(this.effect())+"x"}
        },
        61: {
            title: "Basic",
            description: "Gain more basic points based on basic points.",
            cost(){return getBUpgCost(61)},
            unlocked(){return hasMilestone("c",0)||player.d.unlocked},
            effect(){return player.b.points.add(1).log(2).add(1)},
            effectDisplay(){return format(this.effect())+"x"}
        },
        71: {
            title: "Cheapened Dust",
            description: "Gain more dust based on cheapeners.",
            cost(){return getBUpgCost(71)},
            unlocked(){return hasMilestone("c",1)||player.d.unlocked},
            effect(){return new Decimal(2).add(hasUpgrade("b",72)?player.c.points.div(2).minus(1).max(0):0).pow(player.c.points)},
            effectDisplay(){return format(this.effect())+"x"}
        },
        81: {
            title: "Upgrade Dust Here",
            description: "Square 'Upgraded Dust'.",
            cost(){return getBUpgCost(81)},
            unlocked(){return hasMilestone("c",1)||player.d.unlocked},
        },
        91: {
            title: "Extra Dust",
            description: "Square 'More Dust'.",
            cost(){return getBUpgCost(91)},
            unlocked(){return hasMilestone("c",1)||player.d.unlocked},
        },
        12: {
            title: "The 9th Dimension",
            description: "Raise 'Dust Dimensions' to the amount of cheapeners you have.",
            cost(){return getBUpgCost(12)},
            unlocked(){return hasMilestone("c",2)||player.d.unlocked},
        },
        22: {
            title: "C Power+",
            description: "Make the cheapener power effect better.",
            cost(){return getBUpgCost(22)},
            unlocked(){return hasMilestone("c",3)||player.d.unlocked},
        },
        32: {
            title: "Upgraded Basic Points",
            description: "'Upgraded Dust' now effects basic points at a reduced rate.",
            cost(){return getBUpgCost(32)},
            unlocked(){return hasMilestone("c",3)||player.d.unlocked},
            effect(){return upgradeEffect("b",41).pow(0.5)},
            effectDisplay(){return format(this.effect())+"x"}
        },
        42: {
            title: "Dust Cheapeners",
            description: "The cheapener power effect now multiplies dust gain.",
            cost(){return getBUpgCost(42)},
            unlocked(){return hasMilestone("c",3)||player.d.unlocked},
            effect(){return layers.c.cPowerEffect()},
            effectDisplay(){return format(this.effect())+"x"}
        },
        52: {
            title: "Cheapening Cheapeners",
            description: "The cheapener effect now divides from the cheapener requirement.",
            cost(){return getBUpgCost(52)},
            unlocked(){return hasMilestone("c",3)||player.d.unlocked},
            effect(){return layers.c.effect()},
            effectDisplay(){return "/"+format(this.effect())}
        },
        62: {
            title: "Cheapening Cheapeners 2.0",
            description: "Divide the cheapener requirement by the amount of cheapeners you have.",
            cost(){return getBUpgCost(62)},
            unlocked(){return hasMilestone("c",3)||player.d.unlocked},
            effect(){return player.c.points.add(1)},
            effectDisplay(){return "/"+format(this.effect())}
        },
        72: {
            title: "Free Dust",
            description: "Make the 'Cheapened Dust' formula better.",
            cost(){return getBUpgCost(72)},
            unlocked(){return hasMilestone("c",4)||player.d.unlocked},
        },
        82: {
            title: "More Upgrades",
            description: "Make the 'Upgraded Dust' effect base 0.25 higher.",
            cost(){return getBUpgCost(82)},
            unlocked(){return hasMilestone("c",4)||player.d.unlocked},
        },
        92: {
            title: "The Basic Upgrade",
            description: "Multiply basic point gain by 5.",
            cost(){return getBUpgCost(92)},
            unlocked(){return hasMilestone("c",4)||player.d.unlocked},
        },
    },
    update(diff){
        if(hasUpgrade("b",51))player.c.unlocked=true
    }
})

addLayer("c", {
    startData() { return { 
        unlocked: false,
        points: new Decimal(0),
        cPower: new Decimal(0),
    }},

    color: "#938472",
    resource: "cheapeners",
    row: 1,

    baseResource: "basic points",
    baseAmount() { return player.b.points },
    effect(){return player.c.points.add(1).log(2).add(1).pow(hasMilestone("c",3)?2:1)},
    effectDescription(){return "dividing basic upgrade costs by "+format(this.effect())+"."},
    cPowerEffect(){
        return player.c.cPower.add(1).log(hasUpgrade("b",22)?2:3).add(1)
    },
    cPowerGain(){
        if(!hasMilestone("c",2))return new Decimal(0)
        return new Decimal(2).pow(player.c.points).pow(hasMilestone("c",4)?2:1)
    },
    cPowerDisplay(){
        return `You have ${format(player.c.cPower)} cheapener power (${format(tmp.c?tmp.c.cPowerGain:0)}/sec), giving you ${format(tmp.c?tmp.c.cPowerEffect:1)}x more basic points.`
    },
    requires: new Decimal(100),

    type: "static",
    exponent: 2,
    base: 5,

    gainMult() {
        let mult = new Decimal(1)
        if(hasUpgrade("b",52))mult=mult.div(upgradeEffect("b",52))
        if(hasUpgrade("b",62))mult=mult.div(upgradeEffect("b",62))
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },

    layerShown() { return player.c.unlocked },
    branches: ["b"],
    milestones: {
        0: {
            requirementDescription: "1 cheapener",
            effectDescription: "Gain 1 extra upgrade.",
            done() { return player.c.points.gte(1) },
        },
        1: {
            requirementDescription: "2 cheapeners",
            effectDescription: "Gain 3 extra upgrades.",
            done() { return player.c.points.gte(2) },
            unlocked(){return hasMilestone("c",0)||player.d.unlocked}
        },
        2: {
            requirementDescription: "3 cheapeners",
            effectDescription: "Unlock cheapener power and 1 more upgrade.",
            done() { return player.c.points.gte(3) },
            unlocked(){return hasMilestone("c",1)||player.d.unlocked}
        },
        3: {
            requirementDescription: "4 cheapeners",
            effectDescription: "Square the cheapener effect and add 5 more upgrades.",
            done() { return player.c.points.gte(4) },
            unlocked(){return hasMilestone("c",2)||player.d.unlocked}
        },
        4: {
            requirementDescription: "5 cheapeners",
            effectDescription: "Square cheapener power gain and add 3 more upgrades.",
            done() { return player.c.points.gte(5) },
            unlocked(){return hasMilestone("c",3)||player.d.unlocked}
        },
    },
    tabFormat: [
        "main-display",
        "prestige-button",
        "blank",
        ["display-text",function() {return tmp.c&&hasMilestone("c",2)?tmp.c.cPowerDisplay:""}],
        "blank",
        "milestones",
    ],
    update(diff){
        player.c.cPower=player.c.cPower.add(layers.c.cPowerGain().mul(diff))
        if(player.c.points.gte(6))player.d.unlocked=true
    }
})

addLayer("d", {
    startData() { return { 
        unlocked: false,
        points: new Decimal(0),
    }},

    color: "#444444",
    resource: "darkness",
    row: 2,

    baseResource: "cheapeners",
    baseAmount() { return player.c.points },

    requires: new Decimal(6),

    type: "static",
    exponent: 1.25,
    base: 1.1,
    roundUpCost: true,

    gainMult() {
        return new Decimal(1)
    },
    gainExp() {
        return new Decimal(1)
    },

    layerShown() { return player.d.unlocked },
    branches: ["c"]
})