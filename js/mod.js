let modInfo = {
	name: "The Basic Tree",
	id: "gapples2",
	pointsName: "dust",
	discordName: "",
	discordLink: "",
	changelogLink: "https://github.com/Acamaeda/The-Modding-Tree/blob/master/changelog.md",
    offlineLimit: 1,  // In hours
    initialStartPoints: new Decimal (10) // Used for hard resets and new players
}

// Set your version in num and name
let VERSION = {
	num: "1.2.0",
	name: "cheapener update",
	pre: true,
}

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	if (hasUpgrade("b",11)){
	return true
	} else {return false}
}
// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(0)
	let mult = new Decimal(1)
	if (hasUpgrade("b", 11)) gain = gain.add(1)
	if (hasUpgrade("b", 21)) gain = gain.add(1)
	if (hasUpgrade("b", 31)) gain = gain.add(2)
	if (hasMilestone("c",1)) {mult = mult*2}
	if (hasUpgrade("b", 12)) gain = gain.mul(1.5*mult)
	if (hasUpgrade("b", 22)) gain = gain.mul(1.5*mult)
	if (hasUpgrade("b", 32)) gain = gain.mul(2.0*mult)
	if (hasUpgrade("b", 33)) gain = gain.pow(1.15);else{
		if (hasUpgrade("b", 23)) gain = gain.pow(1.1);else{
			if (hasUpgrade("b", 13)) gain = gain.pow(1.05);
		}
	}
	if (hasMilestone("c",0)) gain = gain.mul(2.0)
	if (hasMilestone("d",0)) gain = gain.mul(1000000000000000)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
	let: cUnlocked = false,
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e15"))
}



// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600000) // Default is 1 hour which is just arbitrarily large
}