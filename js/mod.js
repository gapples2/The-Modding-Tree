let modInfo = {
	name: "The Basic Tree: Revamped",
	id: "nadauciduasudcbasuicdbnascu",
	author: "gapples2",
	pointsName: "dust",
	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.0",
	name: "the beginnning",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.0</h3><br>
		- Added basic points.<br>
		- Added cheapeners.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return hasUpgrade("b",11)||hasUpgrade("b",21)||hasUpgrade("b",31)
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(hasUpgrade("b",11)?1:(hasUpgrade("b",21)&&!hasUpgrade("b",31)?0.1:0))
	if(hasUpgrade("b",31))gain=gain.add(2)
	if(hasUpgrade("b",21))gain=gain.mul(upgradeEffect("b",21))
	if(hasUpgrade("b",41))gain=gain.mul(upgradeEffect("b",41))
	if(hasUpgrade("b",51))gain=gain.mul(upgradeEffect("b",51))
	if(hasUpgrade("b",71))gain=gain.mul(upgradeEffect("b",71))
	if(hasUpgrade("b",42))gain=gain.mul(upgradeEffect("b",42))
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	function(){if(hasUpgrade("b",12)&&player.c.points.eq(3)&&!player.d.unlocked)return "yes, the grind is painful. deal with it"},
	function(){if(player.d.unlocked)return "you've reached endgame, darkness does nothing yet"}
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
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