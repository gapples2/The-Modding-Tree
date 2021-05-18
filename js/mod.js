let modInfo = {
	name: "The Fuel Tree",
	id: "vdasvdsvdasv",
	author: "gapples2",
	pointsName: "points",
	discordName: "",
	discordLink: "",
	initialStartPoints: new ExpantaNum (0), // Used for hard resets and new players
	
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.003",
	name: "crafting",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.0</h3><br>
		- first 2 layers`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything","refundUpgs"]

function getStartPoints(){
    return new ExpantaNum(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return hasUpgrade("e",11)
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new ExpantaNum(0)

	let gain = (player.e.points.lt(1)?player.e.points:player.e.points.pow(0.5).pow(hasUpgrade("e",24)?1.2:1))
	if(hasUpgrade("b",11))gain=gain.mul(upgradeEffect("b",11))
	if(hasUpgrade("e",13))gain=gain.mul(hasUpgrade("e",22)?4:2)
	if(hasUpgrade("b",21)&&gain.gte(1))gain=gain.pow(2)
	if(player.e.getFuel&&!player.e.fuel.eq(player.e.bestFuel))gain=gain.minus(player.points.div(1000))
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	function(){return player.b.total.lt(0.5)?"if you don't see anything to do just grind a little more energy":""}
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte("1.8ee308")
}



// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}