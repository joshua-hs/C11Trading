"use strict";

//App begins
const localhostApiEndpoint = "http://localhost:8080/"
const coinbaseApiEndpoint = "https://api.pro.coinbase.com/products/"
const coinbaseSpotApiEndpoint = "https://api.coinbase.com/v2/prices/"

const availableAssets = ["Bitcoin", "Ethereum", "Uniswap"]

const assetsTicker = {
    "Bitcoin": "BTC",
    "Ethereum": "ETH",
    "Uniswap": "UNI"
}

let userId = localStorage.getItem("userId");

console.log("userId: " + userId);

let tradeInfo;

let globalPositionInfo;

let modificationAssetPrice;


//Load coin selection dropdown
function loadDropDownMenu() {
    const dropDownMenu = document.getElementById("assetDropdownMenu");
    const dropDownHeader = document.getElementById("assetDropdownHeader");
    const lastTradedPrice = document.getElementById("lastTradedPrice");

    availableAssets.forEach(asset => {
        const dropdownOption = document.createElement("button");
        dropdownOption.className = "dropdown-item";
        dropdownOption.type = "button";
        dropdownOption.innerText = asset;

        dropdownOption.addEventListener("click", () => {
            dropDownHeader.innerText = dropdownOption.innerText;
            axios.get(coinbaseApiEndpoint + `/${assetsTicker[asset]}-usd/ticker`)
            .then(res => {
                lastTradedPrice.innerText = `Current price of ${asset}: ` + toUSD(res.data.price); 
            })
            .catch(err => console.log(err));
        })

        dropDownMenu.appendChild(dropdownOption);
    })
    
}


//Load trade confirmation modal
function loadModal(assetJson) {
    $('#quoteModal').modal('show');
    const asset = assetJson.base;
    const price = parseFloat(assetJson.amount);
    let units;
    let cost;
    console.log("price " + price);
    console.log(document.getElementById("quantityBox").value);
    console.log(document.getElementById("cashBox").value);
    
    if (document.getElementById("quantityBox").value !== "") {
        units = parseFloat(document.getElementById("quantityBox").value);
        cost = price * units;
    } else {
        units = parseFloat((document.getElementById("cashBox").value) / price).toFixed(9);
        cost = parseFloat(document.getElementById("cashBox").value);
    };

    document.getElementById("modalAssetName").innerHTML = "Asset: " + asset.bold();
    document.getElementById("modalQuantity").innerHTML = "Units: " + units.toString().bold();
    document.getElementById("modalPrice").innerHTML = "Price per unit: " + toUSD(price).bold();
    document.getElementById("modalCost").innerHTML = "Total order cost: " + toUSD(cost).bold();

    tradeInfo = {
        "name": asset,
        "unitsHeld": units,
        "cost": cost,
        "owner": userId
    }

}

// WHY DOESN'T THIS WORK???
// async function getAvailableCapital() {
//     await axios.get(localhostApiEndpoint + "getAvailableCapital/" + userId)
//     .then(res => {
//         console.log(res.data);
//         return res.data;
//     }).catch(err => console.log(err));
// }


function modifyAvailableCapital(capitalAdjustment) {
    const adjustmentJson = {
        "availableCapital": capitalAdjustment
    };
    axios.put(localhostApiEndpoint + "modifyAvailableCapital/" + userId, adjustmentJson)
    .then(res => {
        return res.data.availableCapital;
    }).catch(err => console.log(err));
}


function insertNewTrade(trade) {
    $('#quoteModal').modal('hide');

    modifyAvailableCapital(trade.cost * -1);

    axios.post(localhostApiEndpoint + "createPosition", trade)
    .then(res => {
        loadTableData();
    }).catch(err => console.log(err));
    
}


function loadIncreasePositionModal(positionInfo) {
    console.log(positionInfo.value);
    $('#increasePositionModal').modal('show')
    document.getElementById("increasePositionAssetLastTradedPrice").innerText = 
    axios.get(coinbaseApiEndpoint + `${positionInfo.name}-usd/ticker`)
    .then(res => {
        document.getElementById("increasePositionAssetLastTradedPrice").innerText = `Current price of ${positionInfo.name}: ` + toUSD(res.data.price); 
        modificationAssetPrice = res.data.price;
        document.getElementById("increasePositionCurrentValue").innerText = "Current value of units: " + toUSD(positionInfo.unitsHeld * modificationAssetPrice);
    }).catch(err => console.log(err));

    document.getElementById("increasePositionCurrentUnits").innerText = "Current units held: " + positionInfo.unitsHeld;
    
    globalPositionInfo = positionInfo;

}


function loadDecreasePositionModal(positionInfo) {
    $('#decreasePositionModal').modal('show')
    document.getElementById("sellEntireHoldingCheckBox").checked = false;
    document.getElementById("decreasePositionAssetLastTradedPrice").innerText = 
    axios.get(coinbaseApiEndpoint + `${positionInfo.name}-usd/ticker`)
    .then(res => {
        document.getElementById("decreasePositionAssetLastTradedPrice").innerText = `Current price of ${positionInfo.name}: ` + toUSD(res.data.price); 
        modificationAssetPrice = res.data.price;
        document.getElementById("decreasePositionCurrentValue").innerText = "Current value of units: " + toUSD(positionInfo.unitsHeld * modificationAssetPrice);
    }).catch(err => console.log(err));

    document.getElementById("decreasePositionCurrentUnits").innerText = "Current units held: " + positionInfo.unitsHeld;
    
    globalPositionInfo = positionInfo;

}

document.getElementById("sellEntireHoldingCheckBox").addEventListener("change", () => {
    if (document.getElementById("sellEntireHoldingCheckBox").checked) {
        console.log(globalPositionInfo.unitsHeld);
        document.getElementById("decreasePositionQuantityBox").value = globalPositionInfo.unitsHeld;
        document.getElementById("decreasePositionQuantityBox").disabled = true;
    } else {
        document.getElementById("decreasePositionQuantityBox").disabled = false;
    }
})
    


function executeIncreasePosition() {
    const price = modificationAssetPrice;
    let additionalUnits;
    let additionalCost;
    if (document.getElementById("increasePositionQuantityBox").value !== "") {
        additionalUnits = parseFloat(document.getElementById("increasePositionQuantityBox").value);
        additionalCost = price * additionalUnits;
    } else {
        additionalUnits = parseFloat(document.getElementById("increasePositionQuantityBox").value) / price;
        additionalCost = parseFloat(document.getElementById("increasePositionCashBox").value);
    };

    const positionIncreaseJSON = {
        "name": globalPositionInfo.name,
        "unitsHeld": additionalUnits,
        "cost": additionalCost
    }

    $('#increasePositionModal').modal('hide');

    modifyAvailableCapital(positionIncreaseJSON.cost * -1);

    axios.put(localhostApiEndpoint + "increasePosition/" + globalPositionInfo.id, positionIncreaseJSON)
    .then(res => {
        loadTableData();
    }).catch(err => console.log(err));
}


function executeDecreasePosition() {
    const price = modificationAssetPrice;
    let unitsToSell;
    let cashToRealize;
    if (document.getElementById("decreasePositionQuantityBox").value !== "") {
        unitsToSell = parseFloat(document.getElementById("decreasePositionQuantityBox").value);
        cashToRealize = price * unitsToSell;
    } else {
        unitsToSell = parseFloat(document.getElementById("decreasePositionQuantityBox").value) / price;
        cashToRealize = parseFloat(document.getElementById("decreasePositionCashBox").value);
    };

    if (unitsToSell == globalPositionInfo.unitsHeld) {
        sellAllUnits();
        return;
    }

    const positionDecreaseJSON = {
        "name": globalPositionInfo.name,
        "unitsHeld": unitsToSell,
        "cost": cashToRealize
    }
    

    $('#decreasePositionModal').modal('hide');

    modifyAvailableCapital(positionDecreaseJSON.cost);

    axios.put(localhostApiEndpoint + "decreasePosition/" + globalPositionInfo.id, positionDecreaseJSON)
    .then(res => {
        loadTableData();
    }).catch(err => console.log(err));
}


function sellAllUnits () {
    let cashToRealize = globalPositionInfo.unitsHeld * modificationAssetPrice;
    console.log(cashToRealize);

    $('#decreasePositionModal').modal('hide');

    modifyAvailableCapital(cashToRealize);

    axios.delete(localhostApiEndpoint + "removePosition/" + globalPositionInfo.id)
    .then(res => {
        loadTableData();
    }).catch(err => console.log(err));



}


//Obtain quote
document.getElementById("obtain-quote").addEventListener("click", () => {
    const assetName = document.getElementById("assetDropdownHeader").innerText;

    if (assetName == "Select asset") {
        alert("Please choose an asset.")
    } else if ((document.getElementById("quantityBox").value !== "") && (document.getElementById("cashBox").value !== "")) {
        alert("Cannot input both unit and cash amount. Please use one or the other.")
    } else {
        axios.get(coinbaseSpotApiEndpoint + `${assetsTicker[assetName]}-usd/spot`)
        .then(res => {
            loadModal(res.data.data);
        })
        .catch(err => console.log(err));
    }

})


//Send new position to backend (CREATE)
document.getElementById("placeTrade").addEventListener("click", () => {
    insertNewTrade(tradeInfo);
})


//Send position increase instruction to backend (UPDATE)
document.getElementById("increasePositionExecute").addEventListener("click", () => {
    executeIncreasePosition();

})


//Send position decrease instruction to backend (UPDATE)
document.getElementById("decreasePositionExecute").addEventListener("click", () => {
    if (document.getElementById("decreasePositionQuantityBox").value > globalPositionInfo.unitsHeld) {
        alert("You cannot sell more units than you hold.")
        return;
    } else {
        executeDecreasePosition();
    }
})


//Load main positions table (READ)
async function loadTableData() {
    const positionsTable = document.getElementById("positions-table");

    axios.get(localhostApiEndpoint + "getPositions")
    .then(res => {
        positionsTable.innerHTML = "";
        const myPositions = res.data;
        myPositions.forEach(position => {
            if (position.owner == userId) {
                const newPosition = renderPosition(position);
                positionsTable.appendChild(newPosition);
            }
        })
    }).catch(err => console.log(err));


    axios.get(localhostApiEndpoint + "getAvailableCapital/" + userId)
    .then(res => {
        document.getElementById("userCashBalance").innerHTML = "Available capital: " + toUSD(res.data).toString().bold();
    }).catch(err => console.log(err));


}


//Load each position within main table
function renderPosition(position) {
    const newRow = document.createElement("tr");

    const positionAssetName = document.createElement("td");
    positionAssetName.innerText = position.name;

    const positionUnitsHeld = document.createElement("td");
    positionUnitsHeld.innerText = position.unitsHeld;

    const positionCost = document.createElement("td");
    positionCost.innerText = toUSD(position.cost);

    const positionCurrentPrice = document.createElement("td");
    const positionValue = document.createElement("td");
    const positionUnrealized = document.createElement("td");

    axios.get(coinbaseApiEndpoint + `${position.name}-usd/ticker`)
    .then(res => {
        positionCurrentPrice.innerText = toUSD(res.data.price);
        positionValue.innerText = toUSD(res.data.price * positionUnitsHeld.innerText);
        positionUnrealized.innerText = toUSD(res.data.price * positionUnitsHeld.innerText - position.cost);
        if (res.data.price * positionUnitsHeld.innerText - position.cost > 0) {
            positionUnrealized.className = "gains";
        } else {
            positionUnrealized.className = "loss";
        }
    }).catch(err => console.log(err));

    const positionIncrease = document.createElement("button");
    positionIncrease.className = "btn btn-success";
    positionIncrease.innerText = "Buy";
    positionIncrease.addEventListener("click", () => {
        loadIncreasePositionModal(position);
    })

    const positionDecrease = document.createElement("button");
    positionDecrease.className = "btn btn-danger";
    positionDecrease.innerText = "Sell";
    positionDecrease.addEventListener("click", () => {
        loadDecreasePositionModal(position);
    })

    const positionActions = document.createElement("td");
    positionActions.appendChild(positionIncrease);
    positionActions.appendChild(positionDecrease);

    newRow.appendChild(positionAssetName);
    newRow.appendChild(positionUnitsHeld);
    newRow.appendChild(positionCurrentPrice);
    newRow.appendChild(positionValue);
    newRow.appendChild(positionCost);
    newRow.appendChild(positionUnrealized);
    newRow.appendChild(positionActions);

    return newRow;
}


//Format values to resemble currency
function toUSD(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

loadDropDownMenu();
loadTableData();