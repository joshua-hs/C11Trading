
"use strict";

const coinbaseApiEndpoint = "https://api.pro.coinbase.com/products/"
const localhostApiEndpoint = "http://localhost:8080/"

const availableAssets = ["Bitcoin", "Ethereum", "Uniswap"]

let tradeInfo;

let globalPositionInfo;

let modificationAssetPrice;

const assetsTicker = {
    "Bitcoin": "BTC",
    "Ethereum": "ETH",
    "Uniswap": "UNI"
}

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
        units = parseFloat(document.getElementById("cashBox").value) / price;
        cost = parseFloat(document.getElementById("cashBox").value);
    };

    document.getElementById("modalAssetName").innerHTML = "Asset: " + asset.bold();
    document.getElementById("modalQuantity").innerHTML = "Units: " + units.toFixed(9).toString().bold();
    document.getElementById("modalPrice").innerHTML = "Price per unit: " + toUSD(price).bold();
    document.getElementById("modalCost").innerHTML = "Total order cost: " + toUSD(cost).bold();

    tradeInfo = {
        "name": asset,
        "unitsHeld": units,
        "cost": cost
    }

}


function insertNewTrade(trade) {
    $('#quoteModal').modal('hide');
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
    }).catch(err => console.log(err));

    document.getElementById("increasePositionCurrentUnits").innerText = "Current units held: " + positionInfo.unitsHeld;
    document.getElementById("increasePositionCurrentValue").innerText = positionInfo.value;
    
    globalPositionInfo = positionInfo;

}


function executeIncreasePosition() {
    const price = modificationAssetPrice;
    let additionalUnits;
    let additionalCost;
    if (document.getElementById("increasePositionQuantityBox").value !== "") {
        additionalUnits = parseFloat(document.getElementById("increasePositionQuantityBox").value);
        additionalCost = price * additionalUnits;
    } else {
        units = parseFloat(document.getElementById("increasePositionQuantityBox").value) / price;
        additionalCost = parseFloat(document.getElementById("increasePositionCashBox").value);
    };

    let positionIncreaseJSON = {
        "name": globalPositionInfo.name,
        "unitsHeld": additionalUnits,
        "cost": additionalCost
    }
    $('#increasePositionModal').modal('hide');
    axios.put(localhostApiEndpoint + "increasePosition/" + globalPositionInfo.id, positionIncreaseJSON)
    .then(res => {
        loadTableData();
    }).catch(err => console.log(err));
}


//Obtain quote
document.getElementById("obtain-quote").addEventListener("click", () => {
    const assetName = document.getElementById("assetDropdownHeader").innerText;

    if (assetName == "Select asset") {
        alert("Please choose an asset")
    } else {
        axios.get(coinbaseApiEndpoint + `prices/${assetsTicker[assetName]}-usd/spot`)
        .then(res => {
            loadModal(res.data.data);
        })
        .catch(err => console.log(err));
    }

})


//Send new position to backend
document.getElementById("placeTrade").addEventListener("click", () => {
    insertNewTrade(tradeInfo);
})


//Send position increase instruction to backend
document.getElementById("increasePositionExecute").addEventListener("click", () => {
    executeIncreasePosition();
})


//Load main positions table
function loadTableData() {
    const positionsTable = document.getElementById("positions-table");

    axios.get("http://localhost:8080/getPositions")
    .then(res => {
        positionsTable.innerHTML = "";
        const myPositions = res.data;
        myPositions.forEach(position => {
            const newPosition = renderPosition(position);
            positionsTable.appendChild(newPosition);
        })
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
            console.log("it true");
            positionUnrealized.className = "gains";
        } else {
            console.log("it false");
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

function toUSD(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

loadDropDownMenu();
loadTableData();
