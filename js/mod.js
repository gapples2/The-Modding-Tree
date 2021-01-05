let modInfo = {
	name: "The Exponental Growth Tree",
	id: "exponents",
	author: "gapples2",
	pointsName: "math",
	discordName: "",
	discordLink: "",
	changelogLink: "https://github.com/Acamaeda/The-Modding-Tree/blob/master/changelog.md",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.2",
	name: "actually updated",
}

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything","giveStuff"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}
function giveStuff(){
    player.t.points = new Decimal(1)
    player.e.points = new Decimal(31)
}
// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	if(hasUpgrade("e",11))gain=gain.add(1)
	let gainAdd = new Decimal(0)
	if(hasUpgrade("e",31))gainAdd=gainAdd.add(0.2)
	if(hasUpgrade("e",32))gainAdd=gainAdd.pow(0.6)
	gain=gain.add(gainAdd)
	if(hasUpgrade("t",21)&&inChallenge("t",11))gain=gain.add(1)
	if(hasUpgrade("t",22)&&inChallenge("t",11))gain=gain.add(1)
	if(hasUpgrade("t",23)&&inChallenge("t",11))gain=gain.add(2)
	if(hasUpgrade("t",24)&&inChallenge("t",11))gain=gain.add(3)
	if(hasUpgrade("e",34))gain=gain.add(2)
	if(hasUpgrade("e",44))gain=gain.pow(2)
	gain = gain.pow(layers.e.effect())
	if(hasUpgrade("e",41))gain=gain.pow(1.2)
	if(hasUpgrade("e",42))gain=gain.pow(1.2)
	gain=gain.mul(layers.me.effect2())
	if(inChallenge("t",11))gain=gain.tetrate(0.3)

	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	"Current endgame: 20 exponents"
]

// Determines when the game "ends"
function isEndgame() {
	return player.me.points=="(e^NaN)NaN"
}



// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600000) // Default is 1 hour which is just arbitrarily large
}