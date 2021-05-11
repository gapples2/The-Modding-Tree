var layoutInfo = {
    startTab: "none",
	showTree: true,

    treeLayout: ""

    
}

let D = ExpantaNum


// A "ghost" layer which offsets other layers in the tree
addNode("blank", {
    layerShown: "ghost",
}, 
)


addLayer("tree-tab", {
    tabFormat: {
        "Energy": {
            embedLayer: "e"
        },
        "Batteries": {
            embedLayer: "b",
            unlocked(){return layers.b.layerShown()}
        }
        //[["tree", function() {return (layoutInfo.treeLayout ? layoutInfo.treeLayout : TREE_LAYERS)}]]
    }
})