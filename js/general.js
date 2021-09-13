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
  // console.log(getFuncName())
  var assessment = ""
  var adj = slave.charisma_desc;
  // console.log(slave.charisma_desc);
  var charisma = statLevel(slave, "Charisma")
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
  // console.log(getFuncName())
  available.forEach(function(item, i) {
    $("#buy_list_start").after("<tr id='row-" + item.name + i + "'><td class='bust-5 bust' id='slave_bust_" + item.id + "'></td><td><a onclick='inspectSlave(" + item.id + ")' href='#' data-toggle='modal' data-target='#generic-modal'>" + item.name + ", " + item.age + "</a></td><td>" + charismaAssessment(item) + "</td><td><button id='btn-" + item.name + i + "' onclick='buySlave("+ i + ")' type='button' class='btn btn-sm btn-secondary" + disableBtn(item.price) + "'>Buy: $" + item.price + "</td></tr>");
    makePortrait("#slave_bust_" + item.id, item.id, 5, "available");
  });
}

function disableBtn(item_price) {
  // console.log(getFuncName())
  var disabled = ""
  if (item_price > money) {
    disabled = "disabled"
  }
  return disabled
}

function listAllSlaves(slaves) {
  // console.log(getFuncName())
  //print the array to the page
  slaves.forEach(function(slave, i) {
    $("#list_start").after("<tr id='row-" + slave.name + i + "'><td class='bust-5 bust' id='slave_bust_" + slave.id + "'></td><td><a onclick='viewSlave(" + slave.id + ")' href='#'>" + slave.name + ", " + slave.age + "</a></td><td class=' d-none d-sm-table-cell'>" + charismaAssessment(slave) + "</td><td class=' d-none d-sm-table-cell'>" + capitalize(slave.assignment.name) + "</td><td>"+ statBadge(slave, "Health") +"</td><td>"+ attitudeWord(slave) +"</td></tr>");
    // console.log(slave.id)
    makePortrait("#slave_bust_" + slave.id, slave.id, 5, "slaves");
  });
}

function bathhouseAttendantTableHead() {
  // console.log(getFuncName())
  $("#bathhouse_list").append("<h2>Attendants</h2>")
  $("#bathhouse_list").append("<table class='table'><thead><th></th><th>Name</th><th>Skill level</th></thead><tbody id='bathhouse_list_start'></tbody></table>");
};

function listAttendantsBathhouse(group) {
  // console.log(getFuncName())
  //print the array to the page
  group.forEach(function(slave, i) {
    $("#bathhouse_list_start").after("<tr id='row-" + slave.name + i + "'><td class='bust-5 bust' id='slave_bust_" + slave.id + "'></td><td><a onclick='viewSlaveSalon(" + slave.id + ")' href='#'>" + slave.name + ", " + slave.age + "</a></td><td>"+ statBadge(slave, "Aesthetician") +"</td></tr>");
    // console.log(slave.id)
    makePortrait("#slave_bust_" + slave.id, slave.id, 5, "slaves");
  });
}

function bathhouseTableHead() {
  // console.log(getFuncName())
  $("#slave_bathhouse_list").append("<h2>Other Slaves</h2>")
  $("#slave_bathhouse_list").append("<table class='table'><thead><th></th><th>Name</th><th>Charisma</th><th>Health</th></thead><tbody id='slave_bathhouse_list_start'></tbody></table>");
}

function listslavesBathhouse(group) {
  // console.log(getFuncName())
  //print the array to the page
  group.forEach(function(slave, i) {
    $("#slave_bathhouse_list_start").after("<tr id='row-" + slave.name + i + "'><td class='bust-5 bust' id='slave_bust_" + slave.id + "'></td><td><a onclick='viewSlaveSalon(" + slave.id + ")' href='#'>" + slave.name + ", " + slave.age + "</a></td><td>"+ statBadge(slave, "Charisma") +"</td><td>"+ statBadge(slave, "Health") +"</td></tr>");
    // console.log(slave.id)
    makePortrait("#slave_bust_" + slave.id, slave.id, 5, "slaves");
  });
}

function shopTableHead() {
  // console.log(getFuncName())
  $("#buy_slave_list").empty();
  $("#buy_slave_list").append("<table class='table'><thead><th></th><th>Name</th><th>Your assessment</th><th>Price</th></thead><tbody id='buy_list_start'></tbody></table>");
};

function homeTableHead() {
  // console.log(getFuncName())
  $("#slave_list").empty();
  $("#slave_list").append("<table class='table'><thead><th></th><th>Name</th><th class='d-none d-sm-table-cell'>Your assessment</th><th class ='d-none d-sm-table-cell'>Current Assignment</th><th>Health</th><th>Attitude</th></thead><tbody id='list_start'></tbody></table>");
};

function statWord(slave, stat) {
  // console.log(getFuncName())
  if (statKnown(slave, stat)) {
    if (statLevel(slave, stat) <= -50) {
      word = "Very poor"
    } else if (statLevel(slave, stat) > -50 && statLevel(slave, stat) <= 0) {
      word = "Poor"
    } else if (statLevel(slave, stat) > 0 && statLevel(slave, stat) <= 50) {
      word = "Fine"
    } else if (statLevel(slave, stat) >= 50) {
      word = "Good"
    }
  } else {
    word = "Unknown"
  }
  return word
}

function statBadge(slave, stat) {
  // console.log(getFuncName())
  statWord(slave, stat)
  if (statKnown(slave, stat)) {
    if (statLevel(slave, stat) <= -50) {
      badge = "<span class='badge badge-danger'>" + word + "</span>"
    } else if (statLevel(slave, stat) > -50 && statLevel(slave, stat) <= 0) {
      badge = "<span class='badge badge-warning'>" + word + "</span>"
    } else if (statLevel(slave, stat) > 0 && statLevel(slave, stat) <= 50) {
      badge = "<span class='badge badge-info'>" + word + "</span>"
    } else if (statLevel(slave, stat) >= 50) {
      badge = "<span class='badge badge-success'>" + word + "</span>"
    }
  } else {
    badge = "<span class='badge'>" + word + "</span>"
  }
  return badge
}

function attitudeWord(slave) {
  // console.log(getFuncName())
  if (statKnown(slave, "Loyalty") || statKnown(slave, "Obedience") || statKnown(slave, "Love" || statKnown(slave, "Happiness"))) {
    lvl = Math.floor((statLevel(slave, "Loyalty") + statLevel(slave, "Obedience") + statLevel(slave, "Love") + statLevel(slave, "Happiness")) / 4)
    if (lvl <= -50) {
      word = "<span class='badge badge-warning'>Very poor</span>"
    } else if (lvl > -50 && lvl <= 0) {
      word = "<span class='badge badge-secondary'>Poor</span>"
    } else if (lvl > 0 && lvl <= 50) {
      word = "<span class='badge badge-info'>Fine</span>"
    } else if (lvl >= 50) {
      word = "<span class='badge badge-success'>Good</span>"
    }
  } else {
    word = "<span class='badge'>Unknown</span>"
  }
  return word
}

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

function shuffle(array) {
  // console.log(getFuncName())
  var currentIndex = array.length,  randomIndex;
  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}

function getFuncName() {
    return getFuncName.caller.name
}
