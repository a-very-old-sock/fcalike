//get an random number from a range, min max inclusive
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
};

// get a random item from an Array
function getRandom(array) {
  // console.log("get random" + array);
  var thing = array[Math.floor(Math.random() * array.length)];
  return thing;
};

// reset all localStorage
$(document).ready(function() {
  $("#reset").click(function(){
    var reset = window.confirm("Warning! This will reset your game and destroy all your saved data.  This is not reversible.  Are you sure you want to continue?")
    if (reset == true ){
      window.localStorage.clear();
      location.reload(true);
    }
  });
});

function isTrue() {
  var is_true = function() {
    if (randomNumber(0,100) > 50 + known_mod) {
      var v = true
    } else {
      var v = false
    }
    return v
  }
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function lowercase(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

function charismaAssessment(slave) {
  var assessment = ""
  var adj = slave.charisma_desc;
  // console.log(slave.charisma_desc);
  var charisma = slave.stats.find(function(stat) {if(stat.name == "Charisma") return stat}).level
  // console.log(charisma);
  if (charisma <= 20) {
    assessment = "<span class='badge badge-warning'>" + capitalize(adj) + "</span>"
  } else if (charisma > 20 && charisma <= 50) {
    assessment = "<span class='badge badge-secondary'>" + capitalize(adj) + "</span>"
  } else if (charisma > 50 && charisma <= 80) {
    assessment = "<span class='badge badge-info'>" + capitalize(adj) + "</span>"
  } else {
    assessment = "<span class='badge badge-success'>" + capitalize(adj) + "</span>"
  }
  return assessment
};

function listAllSlavesWithPrice(available) {
  available.forEach(function(item, i) {
    $("#buy_list_start").after("<tr id='row-" + item.name + i + "'><td class='bust-5 bust' id='slave_bust_" + item.id + "'></td><td><a onclick='inspectSlave(" + item.id + ")' href='#' data-toggle='modal' data-target='#generic-modal'>" + item.name + ", " + item.age + "</a></td><td>" + charismaAssessment(item) + "</td><td><button id='btn-" + item.name + i + "' onclick='buySlave("+ i + ")' type='button' class='btn btn-sm btn-secondary" + disableBtn(item.price) + "'>Buy: $" + item.price + "</td></tr>");
    makePortrait("#slave_bust_" + item.id, item.id, 5, "available");
  });
}

function disableBtn(item_price) {
  var disabled = ""
  if (item_price > money) {
    disabled = "disabled"
  }
  return disabled
}

function listAllSlaves(slaves) {
  //print the array to the page
  slaves.forEach(function(slave, i) {
    $("#list_start").after("<tr id='row-" + slave.name + i + "'><td class='bust-5 bust' id='slave_bust_" + slave.id + "'></td><td><a onclick='viewSlave(" + slave.id + ")' href='#'>" + slave.name + ", " + slave.age + "</a></td><td>" + charismaAssessment(slave) + "</td><td>" + capitalize(slave.assignment.name) + "</td><td>"+ capitalize(slave.living) +"</td></tr>");
    // console.log(slave.id)
    makePortrait("#slave_bust_" + slave.id, slave.id, 5, "slaves");
  });
}

function shopTableHead() {
  $("#buy_slave_list").empty();
  $("#buy_slave_list").append("<table class='table'><thead><th></th><th>Name</th><th>Your assessment</th><th>Price</th></thead><tbody id='buy_list_start'></tbody></table>");
};

function homeTableHead() {
  $("#slave_list").empty();
  $("#slave_list").append("<table class='table'><thead><th></th><th>Name</th><th>Your assessment</th><th>Current Assignment</th><th>Living conditions</th></thead><tbody id='list_start'></tbody></table>");
};

function scaleColor(number) {
  var scalecolor = ""
  if (number <= -50) {
    scalecolor = "worst-scale-color"
  } else if (number > -50 && number <= 0) {
    scalecolor = "bad-scale-color"
  } else if (number > 0 && number <= 50) {
    scalecolor = "good-scale-color"
  } else {
    scalecolor = "best-scale-color"
  }
  return scalecolor
};
