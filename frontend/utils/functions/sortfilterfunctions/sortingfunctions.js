const sortByDexNum = (order='NatDexNumL2H', list) => {
    if (order === 'NatDexNumL2H') {
        const sortedList = list.slice().sort((a, b) =>  {
            if (a.natDexNum > b.natDexNum) {
                return 1
            }
            if (a.natDexNum < b.natDexNum) {
                return -1
            }
            return 0
        }).sort((a, b) => {
            const num1 = a.natDexNum
            const num2 = b.natDexNum
            if (num1 === num2) {
                if (a.name.includes(" ") && b.name.includes(" ")) {
                    return a.name === "Mr. Mime" ? -1 : a.name.localeCompare(b.name)
                } else if (b.name.includes(" ")){
                    return -1
                } else {
                    return 1
                }
            } 
        }) //ensures regional and alternate form pokemon are listed after their regular forms
        return sortedList
    } else {
        const sortedList = list.slice().sort((a, b) =>  {
            if (a.natDexNum > b.natDexNum) {
                return -1
            }
            if (a.natDexNum < b.natDexNum) {
                return 1
            }
            return 0
        })
        return sortedList
    }
}

const sortByName = (order='A2Z', list) => {
    if (order === 'A2Z') {
        return list.slice().sort(function (a, b) {
            if (a.name < b.name) {
              return -1;
            }
            if (a.name > b.name) {
              return 1;
            }
            return 0;
        });
    } else {
        return list.slice().sort(function (a, b) {
            if (a.name < b.name) {
              return 1;
            }
            if (a.name > b.name) {
              return -1;
            }
            return 0;
        });
    }
}

const sortList = (sortKey, list) => {
    if (sortKey === 'A2Z' || sortKey === 'Z2A') {
        return sortByName(sortKey, list)
    } else {
        return sortByDexNum(sortKey, list)
    }
}

export {sortList}