let gridIdToId = {101:0,102:1}

addLayer("craftinginvgrid",{
    startData() { return {
        points: new ExpantaNum(0)
    }},
    grid: {
        rows: 9,
        cols: 9,
        getStartData(id) {
            return 0
        },
        getUnlocked(id) {
            if(!((typeof gridIdToId[id])=="number"))return false
            return player.r.itemUnlocks.includes(gridIdToId[id])
        },
        getCanClick(data, id) {
            if(!((typeof gridIdToId[id])=="number"))return false
            return D(inventoryItem(gridIdToId[id])).gt(0.5)
        },
        onClick(data, id) { 
            player.r.cSelected[0]=parseInt(id.toString().split("0").join("")-11)
        },
        getDisplay(data, id) {
            return format(inventoryItem(gridIdToId[id]))+"x "+idToRecipe[gridIdToId[id]]
        },
        getStyle(){
            return {"backgroundColor":"#999999","borderRadius":"0px","borderColor":"#333333","borderWidth":"2px"}
        }
    },
})