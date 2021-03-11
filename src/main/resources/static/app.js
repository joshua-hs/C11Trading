
"use strict";

let tradeInfo;


const coinbaseApiEndpoint = "https://api.coinbase.com/v2/"

const availableAssets = ["Bitcoin", "Ethereum", "Uniswap"]

const assetsTicker = {
    "Bitcoin": "BTC",
    "Ethereum": "ETH",
    "Uniswap": "UNI"
}

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
            axios.get(coinbaseApiEndpoint + `prices/${assetsTicker[asset]}-usd/spot`)
            .then(res => {
                lastTradedPrice.innerText = `Current price of ${asset}: $` + res.data.data.amount; 
            })
            .catch(err => console.log(err));
        })

        dropDownMenu.appendChild(dropdownOption);
    })
    
}


const loadModal = (assetJson) => {
    const asset = assetJson.base;
    const price = assetJson.amount;
    let units;
    
    if (document.getElementById("quantityBox").value !== null) {
        units = document.getElementById("quantityBox").value;
    } else {
        units = document.getElementById("cashBox").value / price;
    };

    const cost = price * units;

    document.getElementById("modalAssetName").innerText = "Asset: " + asset;
    document.getElementById("modalQuantity").innerText = "Units: " + units;
    document.getElementById("modalPrice").innerText = "Price per unit: $" + price;
    document.getElementById("modalCost").innerText = "Total order cost: $" + cost;

}


const obtainQuoteButton = document.getElementById("obtain-quote").addEventListener("click", () => {
    const assetName = document.getElementById("assetDropdownHeader").innerText;
    axios.get(coinbaseApiEndpoint + `prices/${assetsTicker[assetName]}-usd/spot`)
    .then(res => {
        loadModal(res.data.data);
    })
    .catch(err => console.log(err));
})

const placeTrade = document.getElementById("placeTrade").addEventListener("click", () => {
    insertNewTrade(tradeInfo);
})




let myPositionsCols = ["Asset", "Units held", "Current price per unit", "Value", "Cost", "Unrealised profit/loss"];

let myPositions = [
    // {
    //     "Ticker": "BA",
    //     "Stock": "BAE Systems",
    //     "Shares held": "200",
    //     "Current share price": "6.01",
    //     "Value": "£570.55",
    //     "Cost": "£369.00",
    //     "Unrealised profit/loss": "201.55"
    // },
    // {
    //     "Ticker": "BP",
    //     "Stock": "BP",
    //     "Shares held": "600",
    //     "Current share price": "10.91",
    //     "Value": "£1000",
    //     "Cost": "£500",
    //     "Unrealised profit/loss": "500"
    // }
]

function loadTableData(items) {

    const positionsTable = document.getElementById("positions-table");

    positionsTable.innerHTML = "";

    for (let i = 0; i < myPositions.length; i++) {
        let currentRow = positionsTable.insertRow();
        for (let j = 0; j < myPositionsCols.length; j++) {
            let currentCell = currentRow.insertCell(j);
            currentCell.innerHTML = myPositions[i][myPositionsCols[j]];
        }
        currentCell = currentRow.insertCell(6);
        currentCell.innerHTML = '<button type="button" class="btn btn-success">Buy</button> <button type="button" class="btn btn-danger">Sell</button>'

        
    }

}

loadDropDownMenu();
loadTableData(myPositions);
