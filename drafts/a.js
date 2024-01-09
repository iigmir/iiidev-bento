function GenerateRandomArray(length = 10, limition = 100) {
    if (length < 1 || limition < 2) {
        return [];
    }
    let result = [];
    while (result.length < length) {
        let randnum = Math.floor(Math.random() * limition);
        if (result.indexOf(randnum) === -1) {
            result.push(randnum);
        }
    }
    return result;
}
