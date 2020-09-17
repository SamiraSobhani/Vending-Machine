var paidMoney = 0;

$(document).ready(function () {

   loadVendingItems();

function loadVendingItems() {
    var vendingDiv = $('#items');
    $.ajax({
      type: 'GET',
      url: 'http://localhost:8080/items',
      success: function (vendingItemsArray) {
         vendingDiv.empty();

        $.each(vendingItemsArray, function (index, item) {
             var id = item.id;
             var name = item.name;
             var price = item.price.toFixed(2);
             var quantity = item.quantity;
             var itemInfo = '<button class="items col-sm-4" onclick="selectedItem('+id+')" style="text-align: center; margin-bottom: 30px; margin-top 30px">';
                 itemInfo += '<p style ="text-align: left">' + id + '</p>';
                 itemInfo += '<p><b>' + name + '</b></p>';
                 itemInfo += '<p>$' + price + '</p>';
                 itemInfo += '<p> Quantity Left: ' + quantity + '</p>';
                 itemInfo += '</button>';
                    vendingDiv.append(itemInfo);
                });
            },
            error: function () {
            alert("Failure Calling The Web Service. Please try again later.");
   }
 });
}

$('#addDollar').on('click', function () {
   paidMoney += 1;
   messageBox("You added a Dollar.");
   updateMoneyBox(paidMoney);
});

$('#addQuarter').on('click', function () {
   paidMoney += .25;
   messageBox("You added a Quarter.");
   updateMoneyBox(paidMoney);
});

$('#addDime').on('click', function () {
   paidMoney += .10;
   messageBox("You added a Dime.");
   updateMoneyBox(paidMoney);
});

$('#addNickel').on('click', function () {
   paidMoney += .05;
   messageBox("You added a Nickel.");
   updateMoneyBox(paidMoney);
});

$('#purchaseButton').click(function () {
  makePurchase();
});

$('#returnMoney').on('click', function () {
  Return();
});
})

function selectedItem(id) {
    $('#itemToVend').val(id);
}

function messageBox(message) {
    $('#Message').val(message);
}

function updateMoneyBox(money) {
    $('#moneyInput').empty();
    $('#moneyInput').val(money.toFixed(2));
}

function makePurchase() {
    var money = $('#moneyInput').val();
    var item = $('#itemToVend').val();

    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/money/' + money + '/item/' + item,
        success: function (returnMoney) {
            var change = $('#changeBox');
            $('#Message').val("Thank you!!!");
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
            $('#moneyInput').val('');
            loadVendingItems();
            paidMoney = 0;
        },
        error: function (error) {
            var errorMessage = "SOLD OUT!!!!";
            messageBox(errorMessage);
        }
    });
}

function Return() {
    var paidMoney = $('#moneyInput').val();
    var money = $('#moneyInput').val();

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
    $('#Message').val(vendingMessage);
    $('#changeBox').val(returnMessage);
    $('#itemToVend').val('');
    $('#moneyInput').val('');
}