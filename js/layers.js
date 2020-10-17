// This layer is mostly minimal but it uses a custom prestige type and a clickable
addLayer("b", {
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "brown",
    resource: "Basic Points", 
    type: "none",
    row: 0,
    layerShown() {return true}, 
    tooltip() { // Optional, tooltip displays when the layer is locked
        return ("Basic Points")
    },
}, 
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

