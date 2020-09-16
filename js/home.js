var paidMoney = 0;

$(document).ready(function () {

    loadVendingItems();

    $('#add-dollar-button').on('click', function () {
        paidMoney += 1;
        messageBox("You added a Dollar");
        updateMoneyBox(paidMoney);
    });

    $('#add-quarter-button').on('click', function () {
        paidMoney += .25;
        messageBox("You added a Quarter");
        updateMoneyBox(paidMoney);
    });

    $('#add-dime-button').on('click', function () {
        paidMoney += .10;
        messageBox("You added a Dime");
        updateMoneyBox(paidMoney);
    });

    $('#add-nickel-button').on('click', function () {
        paidMoney += .05;
        messageBox("You added a Nickel");
        updateMoneyBox(paidMoney);
    });

    $('#purchase-button').click(function () {
        makePurchase();
    });

    $('#return-change').on('click', function () {
        returnChange();
    });
})

function loadVendingItems() {
    var vendingDiv = $('#vending-items');
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/items',
        success: function (vendingItemsArray) {
            vendingDiv.empty();

            $.each(vendingItemsArray, function (index, item) {
                var id = item.id;
                var name = item.name;
                var price = item.price;
                var quantity = item.quantity;
                var vendingInfo = '<button class="vending-items col-sm-4" onclick="selectedItem(id,name)" style="text-align: center; margin-bottom: 30px; margin-top 30px">';
                vendingInfo += '<p style ="text-align: left">' + id + '</p>';
                vendingInfo += '<p><b>' + name + '</b></p>';
                vendingInfo += '<p>$' + price + '</p>';
                vendingInfo += '<p> Quantity Left: ' + quantity + '</p>';
                vendingInfo += '</button>';
                vendingDiv.append(vendingInfo);
            });
        },
        error: function () {
            alert("Failure Calling The Web Service. Please try again later.");
        }
    });
}

function selectedItem(id,name) {
    $('#item-to-vend').val(id,name);
}

function messageBox(message) {
    $('#vending-message').val(message);
}

function updateMoneyBox(money) {
    $('#money-input').empty();
    $('#money-input').val(money.toFixed(2));
}

function makePurchase() {
    var money = $('#money-input').val();
    var item = $('#item-to-vend').val();

    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/money/' + money + '/item/' + item,
        success: function (returnMoney) {
            var change = $('#change-input-box');
            $('#vending-message').val("Thank you!!!");
            var pennies = returnMoney.pennies;
            var nickels = returnMoney.nickels;
            var quarters = returnMoney.quarters;
            var dimes = returnMoney.dimes;
            var returnMessage = "";
            if (quarters != 0) {
                returnMessage += quarters + ' Quarter/s ';
            }
            if (dimes != 0) {
                returnMessage += dimes + ' Dime/s ';
            }
            if (nickels != 0) {
                returnMessage += nickels + ' Nickel/s ';
            }
            if (pennies != 0) {
                returnMessage += pennies + ' Penny/ies ';
            }
            if (quarters == 0 && dimes == 0 && nickels == 0 && pennies == 0) {
                returnMessage += "There is no change";
            }
            change.val(returnMessage);
            $('#money-input').val('');
            loadVendingItems();
            paidMoney = 0;
        },
        error: function (error) {
            var errorMessage = "SOLD OUT!!!!";
            messageBox(errorMessage);
        }
    });
}

function returnChange() {
    var paidMoney = $('#money-input').val();
    var money = $('#money-input').val();

    var quarter = Math.floor(money / 0.25);
    money = (money - quarter * 0.25).toFixed(2);
    var dime = Math.floor(money / 0.10);
    money = (money - dime * 0.10).toFixed(2);
    var nickel = Math.floor(money / 0.05);
    money = (money - nickel * 0.05).toFixed(2);
    var penny = Math.floor(money / 0.01);
    money = (money - penny * 0.01).toFixed(2);

    var returnMessage = "";
    var vendingMessage = "";

    if (quarter != 0) {
        returnMessage += quarter + ' Quarter/s ';
    }
    if (dime != 0) {
        returnMessage += dime + ' Dime/s ';
    }
    if (nickel != 0) {
        returnMessage += nickel + ' Nickel/s ';
    }
    if (penny != 0) {
        returnMessage += penny + ' Penny/ies ';
    }
    if (quarter == 0 && dime == 0 && nickel == 0 && penny == 0) {
        returnMessage += "There is no change.";
        vendingMessage = "No money was inputted.";
    } else {
        vendingMessage = "Transaction cancelled.($" + paidMoney + ") is returned.";
    }

    paidMoney = 0;
    messageBox("");
    $('#vending-message').val(vendingMessage);
    $('#change-input-box').val(returnMessage);
    $('#item-to-vend').val('');
    $('#money-input').val('');
}