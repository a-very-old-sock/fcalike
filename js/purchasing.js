// actually buy the slave
function buySlave(n) {
  // console.log("Buy!");
  available = JSON.parse(localStorage.getItem("available") || "[]");
  if (n.toString().length > 5) {
    var purchasedSlave = available.find(slave => slave.id === n);
  } else {
    var purchasedSlave = available[n];
  }
  if (money >= purchasedSlave.price) {
    money -= purchasedSlave.price;
    localStorage.setItem("money", money);
    // console.log(slaves.length)
    // add purchasedSlave to player's slaves
    slaves.push(purchasedSlave);
    purchasedSlave.purchased = purchasedSlave.price
    localStorage.setItem("slaves", JSON.stringify(slaves));

    // remove purchasedSlave from the slaves available for purchase
    if (n > -1) {
      available.splice(n, 1);
    }
    localStorage.setItem("available", JSON.stringify(available));
    // console.log(available);
    shopTableHead();

    //print the array to the page
    listAllSlavesWithPrice(available);
    $("#slave_counter").html("<h2>Slaves: " + slaves.length + "</h2>");
    $("#money_counter").html("<h2>Money: " + money + "</h2>");
  } else {
    alert("Sorry, you don't have enough money to buy this one!");
  }
  // console.log(purchasedSlave.name)
  // console.log(slaves.length)
};

function sellSlave(n) {
  // console.log("Buy!");
  slaves = JSON.parse(localStorage.getItem("slaves") || "[]");
  var soldSlave = slaves.find(slave => slave.id === n);
  // console.log(money + " + " + soldSlave.price)
  money = Math.floor(money)
  money += Math.floor(soldSlave.price);
  localStorage.setItem("money", money);

  // add purchasedSlave to player's slaves
  former_slaves.push(soldSlave);
  localStorage.setItem("former_slaves", JSON.stringify(former_slaves));

  // remove soldSlave from the slaves available for purchase
  soldIndex = slaves.findIndex(slave => slave.id === n)
  slaves.splice(soldIndex, 1);

  localStorage.setItem("slaves", JSON.stringify(slaves));
  //print the array to the page
  showSlaveSaleList()
  $("#slave_counter").html("<h2>Slaves: " + slaves.length + "</h2>");
  $("#money_counter").html("<h2>Money: " + money + "</h2>");
};
