addLayer(m, {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                    // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},
    infoboxes: {
        lore: {
            title: "motivation",
            body: "You're barely getting any work done. You're getting tired of seeing barely any progress made in what feels like hours.<br/><br/>You realize you have no motivation. You see a few fans waiting for your game to release, and that motivates you to work more."
        }
    },
    color: "#FE0102",                       // The color for this layer, which affects many elements
    resource: "motivation",            // The name of this layer's main prestige resource
    row: 0,                                 // The row this layer is on (0 is the first row)

    baseResource: "hours of work",                 // The name of the resource your prestige gain is based on
    baseAmount() {return player.points},    // A function to return the current value of that resource

    requires: new Decimal(0.01),            // The amount of the base needed to  gain 1 of the prestige currency.
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
})