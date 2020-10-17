// This layer is mostly minimal but it uses a custom prestige type and a clickable
addLayer("b", {
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "#FE0102",                       // The color for this layer, which affects many elements
    resource: "basic points",            // The name of this layer's main prestige resource
    row: 0,                                 // The row this layer is on (0 is the first row)

    baseResource: "dust",                 // The name of the resource your prestige gain is based on
    baseAmount() {return player.points},    // A function to return the current value of that resource

    requires: new Decimal(10),            // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.
    
    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.5,                          // "normal" prestige gain is (currency^exponent)

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource
        return new Decimal(1)               // Factor in any bonuses multiplying gain here
    },
    gainExp() {                             // Returns your exponent to your gain of the prestige resource
        return new Decimal(1)
    },

    layerShown() {return true},             // Returns a bool for if this layer's node should be visible in the tree.
    }, 
    upgrades, {
        rows: 1,
        cols: 1,
        11: {
            desc: "Blah",
            
        },
        etc
    }
)


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
                doneTooltip: "Easy.", // Showed when the achievement is completed
            },
            12: {
                name: "This is basic.",
                done() {return player.b.points.gte(1)},
                goalTooltip: "This is EASY. Complete it now.", // Shows when achievement is not completed
                doneTooltip: "Very basic.", // Showed when the achievement is completed
            },
            13: {
                name: "Even more basic.",
                done() {return player.b.points.gte(10)},
                goalTooltip: "Basic*10.", // Shows when achievement is not completed
                doneTooltip: "Get a farm point.\n\nReward: The dinosaur is now your friend (you can max Farm Points).", // Showed when the achievement is completed
                onComplete() {console.log("Bork bork bork!")}
            },
        },
        midsection: [
            "achievements",
        ]
    }, 
)

