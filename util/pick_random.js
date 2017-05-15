function rnd(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
}

module.exports = function pickRandom(arr) {
    return arr[rnd(0, arr.length)]
}
