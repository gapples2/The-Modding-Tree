function expantaNumArraysToHyperoperatorArrays(expantaNumber){
  let arrayOfArrayOfNumbers = expantaNumber.array
  let returnArray = [[]]
  let collapse = true
  for (let array in arrayOfArrayOfNumbers){
    if(array==0){
      if(arrayOfArrayOfNumbers[array][1]!=1e10){collapse=false;break}
    }
    else if(arrayOfArrayOfNumbers[array][1]!=8){collapse=array;break}
  }
collapse=Number(collapse)-1
  if(!collapse) return arrayOfArrayOfNumbers
  let restOfArray=arrayOfArrayOfNumbers.slice(collapse)
  returnArray[0]=[collapse,9]
  returnArray=returnArray.concat(restOfArray)
  return returnArray
}
function exponentialFormat(num, precision, mantissa = true) {
    return num.toString(precision)
}

function commaFormat(num, precision) {
    if (num === null || num === undefined) return "NaN"
    if (num.array[0][1] < 0.001) return (0).toFixed(precision)
    return num.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
}


function regularFormat(num, precision) {
    if (isNaN(num)) return "NaN"
    if (num.array[0][1] < 0.001) return (0).toFixed(precision)
    return num.toString(Math.max(precision,2))
}

function fixValue(x, y = 0) {
    return x || new ExpantaNum(y)
}

function sumValues(x) {
    x = Object.values(x)
    if (!x[0]) return new ExpantaNum(0)
    return x.reduce((a, b) => ExpantaNum.add(a, b))
}

function format(decimal, precision = 2) {
    decimal = new ExpantaNum(decimal)
    if(decimal.lt(1000)) {
      return decimal.toFixed(precision)  
    }
    if(decimal.lt("10^^6")){
      let powers = decimal.toString().split("e")
      for (let i in powers){
        let x=Number(powers[i])
        if(x > 1000 && !(Number.isNaN(x) || x == Infinity)){
          let st = powers[i]
          powers[i] = commaFormat(new ExpantaNum(st))
        }
      }
      return powers.join("e")
    }
    if(decimal.lt("10^^^6")) {
      if(decimal.slog().lt(1e9)) {
        return ExpantaNum.pow(10, decimal.slog().sub(decimal.slog().floor())).toFixed(3) + "F" + format(decimal.slog().floor(), 0)
      }
      return "F"+format(decimal.slog(),0)
    }
    let output = ""
    let terms = 0
    let done = false
    let arr = expantaNumArraysToHyperoperatorArrays(decimal)
    if (arr.length>=3||arr.length==2&&arr[1][0]>=2){
      for (var i=arr.length-1;i>=2;--i){
        var e = arr[i];
        var q = e[0] >= 5 ? "{"+e[0]+"}":"^".repeat(e[0]);
        if(e[0] == 2) q = "F"
        if (e[1]>2) {
          output+="(10"+q+")^"+e[1]+" ";
          terms++
        }
        else if (e[1]==2) {
          output+=("10"+q).repeat(2)
          terms+=2
        }
        else if (e[1]==1) {
          output+="10"+q;
          terms++
        }
        if(terms >= 7) { // change the 7 to have more or less maximum terms
          done = true
        }
      }
    }
    
    if(!done) {
      let newDec = new ExpantaNum(1)
      newDec.array = decimal.array.slice(0,2)
      output += format(newDec,0)
    } else {
      output += "10"
    }
  return output
}

function formatWhole(decimal) {
    return format(decimal,0)
}

function formatTime(s) {
    if (s < 60) return format(s) + "s"
    else if (s < 3600) return formatWhole(Math.floor(s / 60)) + "m " + format(s % 60) + "s"
    else if (s < 84600) return formatWhole(Math.floor(s / 3600)) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
    else if (s < 31536000) return formatWhole(Math.floor(s / 84600) % 365) + "d " + formatWhole(Math.floor(s / 3600) % 24) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
    else return formatWhole(Math.floor(s / 31536000)) + "y " + formatWhole(Math.floor(s / 84600) % 365) + "d " + formatWhole(Math.floor(s / 3600) % 24) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
}

function toPlaces(x, precision, maxAccepted) {
    x = new ExpantaNum(x)
    let result = x.toString(precision)
    if (new ExpantaNum(result).gte(maxAccepted)) {
        result = new ExpantaNum(maxAccepted - Math.pow(0.1, precision)).toString(precision)
    }
    return result
}
