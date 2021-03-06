function endWeek() {
  console.log(getFuncName())
  // location.reload(true);
  makeEvents();
  showHomePage();
  end_of_week_report = [];
  slaves.forEach((slave, i) => {
    slave.end_of_week_report = []
    // console.log(slave.name + ":" + slave.end_of_week_report)
  });
  pcXpChange(1)
  stam = localStorage.getItem("pc_stamina");
  action_pts = Math.round(stam/4);
  localStorage.setItem("action_pts", action_pts);
  localStorage.setItem("slaves", JSON.stringify(slaves));
  applyRules();
  pcStatCheck();
  money = Math.floor(money);
  old_money = money
  money += interest();
  expenses();
  localStorage.setItem("money", money);
  if (slaves.length > 1) {
    slave_scales.forEach((item, i) => {
      averageChange(item);
    });
  }

  checkBeds();
  checkSlaves();
  passageOfTime();
  incomeReport(old_money)
  localStorage.setItem("slaves", JSON.stringify(slaves));

  homeTableHead();
  listAllSlaves(slaves);
  var week_div = $("#week_counter").html("Week: " + week);
  var money_div = $("#money_counter").html("Money: " + money);
  var reputation_div = $("#reputation_counter").html("Reputation: " + reputation);
  var slaves_div = $("#slave_counter").html("Slaves: " + slaves.length);
  modalReport();
};

function modalReport() {
  console.log(getFuncName())
  $('#generic-modal').modal({show: true});
  $("#modalLabel").html("<h5>End of Week Report</h5>");
  $("#modal-body").html("<p>" + end_of_week_report.join('  ') + "</p>");
  $("#modal-body").append("</hr>");
  reverse = slaves.reverse()
  slaves.forEach((slave, i) => {
    $("#modal-body").append("<td class='bust-5 bust' id='modal_slave_bust_" + slave.id + "'></td><td>" + slave.end_of_week_report.join('  ') + "</td>");
    $("#modal-body").append("<br />");
    makePortrait("#modal_slave_bust_" + slave.id, slave.id, 5, "slaves");
  });
  $('#generic-modal-btn').attr('data-target', '#event-modal');
  $('#generic-modal-btn').attr('data-toggle', 'modal');
  document.querySelector('#generic-modal-btn').innerHTML = 'Continue';
  getEvents();
  // document.getElementById('generic-modal').setAttribute('data', "target: '#event-modal'")
};

function expenses() {
  console.log(getFuncName())
  var costs = 0
  costs += checkLivingExpenses(slaves);
  money = parseInt(localStorage.getItem("money"))
  var taxes = Math.floor(money * taxRate())
  pcMoneyChange((taxes + costs) * -1)
  end_of_week_report.push($.i18n("report-maintaining", slaves.length, costs));
  end_of_week_report.push($.i18n("report-taxes", taxes));
}

function taxRate() {
  taxed = parseInt(localStorage.getItem("money"))
  tax_rate = 0
  if (taxed <= 0) {
    tax_rate = 0
  } else if (between(taxed, 0, 10000)) {
    tax_rate = 0.02
  } else if (between(taxed, 10001, 50000)) {
    tax_rate = 0.05
  } else if (between(taxed, 50001, 200000)) {
    tax_rate = 0.8
  } else if (between(taxed, 200001, 1000000)) {
    tax_rate = 0.12
  } else if (taxed >= 1000001) {
    tax_rate = 0.18
  }
  return tax_rate
}

function incomeReport(old_money) {
  console.log(getFuncName())
  income = Math.floor(money) - Math.floor(old_money)
  income_record = localStorage.getItem("income_record")
  income_array = (income_record) ? JSON.parse(income_record) : [];
  // console.log(income_array)
  income_array.push(income)
  localStorage.setItem("income_record", JSON.stringify(income_array))
}

function checkLivingExpenses(slaves) {
  console.log(getFuncName())
  var costs = 0
  slaves.forEach((slave, i) => {
    // console.log("before living status " + JSON.stringify(slave.scales))
    if (slave.living == "luxurious") {
      slave_cost = 200
    } else if (slave.living == "comfortable") {
      slave_cost = 50
    } else if (slave.living == "adequate") {
      slave_cost = 10
    } else if (slave.living == "sparse") {
      slave_cost = 3
    } else {
      slave_cost = 1
    }
    costs += slave_cost
    if (slave_cost >= 50) {
      if (slave.responds_to == "kindness") {
        var stats = ["Love", "Loyalty", "Obedience", "Libido"]
        stats.forEach((item, i) => {
          changeStat(slave, item, Math.round(slave_cost / 10))
        });
      } else if (slave.responds_to == "severity") {
        var stats = ["Obedience", "Loyalty"]
        slave_cost = slave_cost * -1
        stats.forEach((item, i) => {
          changeStat(slave, item, Math.round(slave_cost / 10))
        });
      }
      changeStat(slave, "Happiness", Math.round(slave_cost / 10))
    }

    if (slave_cost <= 3) {
      if (slave_cost == 3) {var effect = 2}
      else {var effect = 5}
      if (slave.responds_to == "kindness") {
        var stats = ["Obedience", "Loyalty", "Love", "Happiness", "Libido"]
        stats.forEach((item, i) => {
          changeStat(slave, item, (effect * -1))
        });
      } else if (slave.responds_to == "severity") {
        var stats = ["Obedience", "Loyalty", "Love"]
        stats.forEach((item, i) => {
          changeStat(slave, item, (effect * -2))
        });
      }
    }
  });
  return costs
}

function checkSlaves() {
  console.log(getFuncName())
  slaves.forEach((slave, i) => {
    var old_stats = []
    old_stats = makeOldStats(slave)
    healthCheck(slave);
    incrementWeeks(slave);
    checkAssignment(slave);
    checkCollar(slave);
    checkClothing(slave);
    statsInteraction(slave);
    checkNames(slave);
    checkStats(slave);
    checkLiteracy(slave);
    var stat_changes = checkOldStats(slave, old_stats)
    printStatChanges(slave, stat_changes)
  });
  localStorage.setItem("slaves", JSON.stringify(slaves))
}

function checkNames(slave) {
  console.log(getFuncName())
  if (slave.name != slave.true_name && ( statLevel(slave, "Loyalty") < 20 || statLevel(slave, "Obedience") < 20) ) {
    changeStat(slave, "Happiness", -1)
    if (randomNumber(-200,20) > statLevel(slave, "Obedience")) {
      slave.end_of_week_report.push($.i18n(slave.name + " has <span class='text-danger'>disobeyed you</span> and changed {{gender:$1|his|her}} name back to " + slave.true_name + ".", slave.gender))
      slave.name = slave.true_name
    }
  }
}

function statsInteraction(slave) {
  console.log(getFuncName())
  var int = statLevel(slave, "Intelligence")
  var love = statLevel(slave, "Love")
  var happiness = statLevel(slave, "Happiness")
  var health = statLevel(slave, "Health")
  var libido = statLevel(slave, "Libido")
  if (libido >= 50 && randomNumber(1,5) == 1) {
    kink = getRandom(slave_kinks)
    if (kinkLevel(slave, kink) >= 0) {
      change = 20
    } else {
      change = kinkLevel(slave, kink) * -1
    }
    changeKink(slave, kink, change)
  } else if (libido <= -50 && randomNumber(1,5) == 1) {
    kink = getRandom(slave_kinks)
    changeKink(slave, kink, -2)
  }
  if (int >= 50 && love < 0) {
    changeStat(slave, "Obedience", (Math.floor(int/50) * -1))
  } else if (int > 50) {
    changeStat(slave, "Obedience", randomNumber(-3, -1))
  }
  if (happiness >= 50 || happiness <= -50) {
    changeStat(slave, "Obedience", Math.floor(happiness/50))
    changeStat(slave, "Loyalty", Math.floor(happiness/50))
    changeStat(slave, "Libido", Math.floor(happiness/50))
  }
  weeks = slave.weeks_owned
  luck = parseInt(localStorage.getItem("pc_luck"))
  if (happiness >= 80 && slave.responds_to == "kindness") {
    if (randomNumber(1,100) + luck < weeks) {
      slave.responds_to = "severity";
      slave.responds_known = false
    }
  } else if (happiness <= -80 && slave.responds_to == "severity") {
    if (randomNumber(1,100) + luck < weeks) {
      slave.responds_to = "kindness";
      slave.responds_known = false
    }
  }
  if (love >= 50 || love <= -50) {
    changeStat(slave, "Obedience", Math.floor(love/50))
    changeStat(slave, "Loyalty", Math.floor(love/50))
    changeStat(slave, "Happiness", Math.floor(love/50))
  }
  if (happiness >= 50 && health >= 50) {
    changeStat(slave, "Love", Math.floor(happiness/50))
    changeStat(slave, "Loyalty", Math.floor(happiness/50))
    changeStat(slave, "Libido", Math.floor(happiness/50))
  }
}

function printStatChanges(slave, stat_changes) {
  console.log(getFuncName())
  var phrases = []
  stat_changes.sort(function (a, b) {
    return a.change - b.change;
  });
  stat_changes.forEach((item, i) => {
    if (item.change >= 5) {
      if (item.type == "stat" || item.type == "scale") {
        phrases.push("<span class='text-success'>" + lowercase(item.name) + " improved</span>")
      } else if (item.type == "skills") {
        phrases.push("<span class='text-success'>skill in " + lowercase(item.name) + " improved</span>")
      } else if (item.type == "jobs") {
        phrases.push("<span class='text-success'>skill as a " + lowercase(item.name) + " improved</span>")
      }
    } else if (item.change <= -5) {
      if (item.type == "stat" || item.type == "scale") {
        phrases.push("<span class='text-danger'>" + lowercase(item.name) + " got worse</span>")
      } else if (item.type == "skills") {
        phrases.push("<span class='text-danger'>skill in " + lowercase(item.name) + " got worse</span>")
      } else if (item.type == "jobs") {
        phrases.push("<span class='text-danger'>skill as a " + lowercase(item.name) + " got worse</span>")
      }
    }
  });

  if (phrases.length > 0) {
    var report = slave.name + "'s " + phrases.join(', ') + "."
    slave.end_of_week_report.push(report)
  }
}

function checkOldStats(slave, old_stats) {
  console.log(getFuncName())
  var stat_changes = []
  old_stats.forEach((item, i) => {
    if (item.level > 100) {item.level = 100}
    else if (item.level < -100) {item.level = -100}
  });

  slave.stats.forEach((item, i) => {
    old_stat = old_stats.find(stat => stat.name == item.name)
    if (old_stat.level > item.level || old_stat.level < item.level) {
      var change = item.level - old_stat.level
      // console.log("new level " + item.level + " minus old level " + old_stat.level)
      stat_changes.push({"name": item.name, "change": change, "type": "stat"})
    }
  });
  slave.scales.forEach((item, i) => {
    old_stat = old_stats.find(stat => stat.name == item.name)
    if (old_stat.level > item.level || old_stat.level < item.level) {
      var change = item.level - old_stat.level
      stat_changes.push({"name": item.name, "change": change, "type": "scale"})
    }
  });
  slave.skills.forEach((item, i) => {
    old_stat = old_stats.find(stat => stat.name == item.name)
    if (old_stat.type == "skills") {
      if (old_stat.level > item.level || old_stat.level < item.level) {
        var change = item.level - old_stat.level
        stat_changes.push({"name": item.name, "change": change, "type": "skills"})
      }
    }
  });
  slave.kinks.forEach((item, i) => {
    old_stat = old_stats.find(stat => stat.name == item.name)
    if (old_stat.type == "kinks") {
      if (old_stat.level > item.level || old_stat.level < item.level) {
        var change = item.level - old_stat.level
        stat_changes.push({"name": item.name, "change": change, "type": "kinks"})
      }
    }
  });
  slave.jobs.forEach((item, i) => {
    old_stat = old_stats.find(stat => stat.name == item.name)
    if (old_stat.level > item.level || old_stat.level < item.level) {
      var change = item.level - old_stat.level
      stat_changes.push({"name": item.name, "change": change, "type": "jobs"})
    }
  });
  return stat_changes
}

function checkClothing(slave) {
  console.log(getFuncName())
  var phrases = []
  if (slave.clothing == "jeans and a tshirt" || slave.clothing == "a flattering business suit") {
    changeStat(slave, "Happiness", 5)
    changeStat(slave, "Obedience", -10)
    if (slave.clothing == "a flattering business suit") {
      changeStat(slave, "Dominating", 5)
    }
    phrases.push(slave.name + " loved passing as a free person wearing " + slave.clothing + " this week")
  } else {
    phrases.push(nakedClothing(slave))
    phrases.push(domClothing(slave))
    phrases.push(liveryClothing(slave))
    phrases.push(otherClothing(slave))
    phrases.push(punishingClothing(slave))
  }
  var report = phrases.join("") + "."

  if (Math.floor(slave.clothing_weeks) < 2) {
    slave.end_of_week_report.push(report)
  }

  localStorage.setItem("slaves", JSON.stringify(slaves))
}

function checkCollar(slave) {
  console.log(getFuncName())
  var phrases = []
  if (slave.collar == "none") {
    changeStat(slave, "Happiness", 5)
    changeStat(slave, "Obedience", -10)
    changeKink(slave, "Dominating", 1)
    phrases.push(" was <span class='text-success'>overjoyed</span> to go without a collar this week")
  } else {
    phrases.push(humiliatingCollar(slave))
    phrases.push(punishingCollar(slave))
  }
  var report = slave.name + phrases.join("") + "."
  if (Math.floor(slave.collar_weeks) < 2) {
    slave.end_of_week_report.push($.i18n(report, slave.gender, slave.collar))
  }
  localStorage.setItem("slaves", JSON.stringify(slaves))
}

function checkAssignment(slave) {
  console.log(getFuncName(), slave.assignment.name)
  slave.assignment_weeks += 1
  pf = ["kitchens", "guardhouse", "bathhouse", "gardens", "training room", "library", "office", "workshop", "clinic"]
  if (pf.includes(slave.assignment.name)) {checkJob(slave)}
  else if (slave.assignment.name == "whore") {checkWhoring(slave);}
  else if (slave.assignment.name == "work a gloryhole") {checkGloryHole(slave);}
  else if (slave.assignment.name == "public use") {checkPublicUse(slave);}
  else if (slave.assignment.name == "serve the household") {checkServeHousehold(slave);}
  else if (slave.assignment.name == "please you") {checkPleaseYou(slave);}
  else if (slave.assignment.name == "stay confined") {checkConfinement(slave)}
  else if (slave.assignment.name == "exercise") {checkExercise(slave)}
  else {checkResting(slave);}
}

function aptitudeFor(stat_name) {
  console.log(getFuncName())
  var word = ""
  if (stat_name == "Charisma") {word = "skill for seduction"}
  else if (stat_name == "Strength") { word = "skill for hard physical work" }
  else if (stat_name == "Intelligence") { word = "skill for intellectual work" }
  return word
}

function kindnessAction(slave) {
  console.log(getFuncName())
  var slave_stats = ["Love", "Loyalty", "Obedience", "Happiness"]
  if (slave.responds_to == "kindness") {
    slave_stats.forEach((thing, i) => {
      changeStat(slave, thing, 2)
    });
    if (slave.responds_known == true) {
      slave.end_of_week_report.push($.i18n("action-response-grateful", slave.gender));
    }
  } else if (slave.responds_to == "severity") {
    slave_stats.forEach((thing, i) => {
      changeStat(slave, thing, -2)
    });
    if (slave.responds_known == true) {
      slave.end_of_week_report.push($.i18n("action-response-ungrateful", slave.gender));
    }
  }
}

function harshAction(slave) {
  console.log(getFuncName())
  var slave_stats = ["Love", "Loyalty", "Happiness", "Obedience"]
  if (slave.responds_to == "severity") {
    slave_stats.forEach((thing, i) => {
      changeStat(slave, thing, 2)
    });
    if (slave.responds_known == true) {
      slave.end_of_week_report.push($.i18n("action-response-disciplined", slave.gender));
    }
  } else if (slave.responds_to == "kindness") {
    slave_stats.forEach((thing, i) => {
      changeStat(slave, thing, -2)
    });
    if (slave.responds_known == true) {
      slave.end_of_week_report.push($.i18n("action-response-hurt", slave.gender));
    }
  }
}

function passageOfTime(){
  console.log(getFuncName())
  week = Math.floor(week);
  week += 1;
  localStorage.setItem("week", week);
  slaves.forEach((slave, i) => {
    slave.weeks_owned = Math.floor(slave.weeks_owned);
    slave.weeks_owned += 1;
    if (Number.isInteger(slave.weeks_owned / 52)) {
      slave.age = Math.floor(slave.age);
      slave.age += 1;
    }
  });
}

function healthCheck(slave) {
  console.log(getFuncName())
  var slave_health = statLevel(slave, "Health")
  if (slave_health < -100) {
    slave.status = "dead";
    former_slaves.push(slave);
    localStorage.setItem("former_slaves", JSON.stringify(former_slaves));

    // remove slave from slaves
    slaves.splice(slaves.indexOf(slave), 1);
    localStorage.setItem("slaves", JSON.stringify(slaves));
    pcKindnessChange(-10)
    pcMoneyChange(-50)
    pcRepChange(-5)
    end_of_week_report.push($.i18n("warning-died", slave.name));
  }
}

function interest() {
  console.log(getFuncName())
//   if (money <= 5000) {
//     var gains = money * 0.04;
//     gains = Math.round(gains);
//     end_of_week_report.push($.i18n("report-investments", gains));
//   } else if (money <= 20000) {
//     var gains = money * 0.01;
//     gains = Math.round(gains);
//     end_of_week_report.push($.i18n("report-investments", gains));
//   } else {
//     var gains = 0;
//   }
  gains = 0
  // console.log(gains);
  return gains
}

function reputationChange() {
  console.log(getFuncName())
  change = 0
  slaves.forEach((slave, i) => {
    slave.stats.forEach((item, i) => {
      change += Math.floor(item.level)
    });
    slave.skills.forEach((item, i) => {
      change += Math.floor(item.level)
    });
  });
  change = Math.round((change / slaves.length)/ 40);
  change = Math.floor(change)
  if (isNaN(change)) {
    change = 0
  }
  if (change > 0) {
    end_of_week_report.push($.i18n("report-reputation", "well", "improved", change));
  } else if (change < 0) {
    end_of_week_report.push($.i18n("report-reputation", "poorly", "damaged", change));
  }

  return change;
}

// check effect of pc's stats on slaves
function pcStatCheck() {
  console.log(getFuncName())
  money = Math.floor(localStorage.getItem("money"))
  pcProfession = localStorage.getItem("pcProfession")
  var invest = 0
  if (pcProfession == "tech") {
    invest = Math.floor(money * 0.01)
    money += invest
    end_of_week_report.push($.i18n("pc-career", "a tech bro", invest))
  } else if (pcProfession == "banker") {
    invest = Math.floor(money * 0.05)
    money += invest
    end_of_week_report.push($.i18n("pc-career", "an investment banker", invest))
  }

  pc_kindness = localStorage.getItem("pc_kindness")
  if (pc_kindness > 100) {
    pc_kindness = 100
  } else if (pc_kindness < -100) {
    pc_kindness = -100
  }
  if (pc_kindness >= 51) {
    end_of_week_report.push("Your neighbors have been gossiping about how much you coddle your slaves, <span class='text-danger=>damaging your reputation</span>.")
    pcRepChange(Math.round(pc_kindness/50))
  } else if (pc_kindness <= -51) {
    end_of_week_report.push("Your neighbors have been gossiping about how harshly you treat your slaves, <span class='text-danger=>damaging your reputation</span>.")
    pcRepChange(Math.round(pc_kindness/50))
  }

  var modifier = Math.floor(pc_kindness / 20)

  slaves = JSON.parse(localStorage.getItem("slaves"))
  var slave_stats = ["Love", "Loyalty", "Obedience"]
  var adj = ""
  var response = ""
  slaves.forEach((slave, i) => {
    adj = "bork"
    response = "bork"

    if (modifier >= 2) {
      if (slave.responds_to == "kindness") {
        slave_stats.forEach((slave_stat, i) => {
          changeStat(slave, slave_stat, modifier)
        })
        adj = "<span class='text-success'>well</span>";
        response = "improved";
      } else if (slave.responds_to == "severity") {
        slave_stats.forEach((slave_stat, i) => {
          changeStat(slave, slave_stat, (modifier * -1))
        })
        adj = "<span class='text-danger'>poorly</span>";
        response = "got worse";
      }
      slave.end_of_week_report.push($.i18n("pc-rep-responds", slave.gender, slave.name, adj, "kindness", response));
    } else if (modifier <= -2) {
      if (slave.responds_to == "kindness") {
        slave_stats.forEach((slave_stat, i) => {
          changeStat(slave, slave_stat, (modifier))
        })
        adj = "<span class='text-danger'>poorly</span>";
        response = "got worse";
        rep = "brutality"
      } else if (slave.responds_to == "severity") {
        slave_stats.forEach((slave_stat, i) => {
          changeStat(slave, slave_stat, (modifier * -1))
        })
        adj = "<span class='text-success'>well</span>";
        response = "improved";
        rep = "brutality"
      }
      slave.end_of_week_report.push($.i18n("pc-rep-responds", slave.gender, slave.name, adj, rep, response));
    }
    });
}

function averageChange(thing) {
  console.log(getFuncName())
  var average = 0
  var change = 0
  slaves.forEach((slave, i) => {
    var a = statLevel(slave, thing);
    average += a
  });
  average = average / slaves.length
  if (average <= -1) {
    change = -1
  } else if (average >= 1) {
    change = 1
  }
  if (change != 0) {
    slaves.forEach((slave, i) => {
      changeStat(slave, thing, change)
    });
  }
  localStorage.setItem("slaves", JSON.stringify(slaves))
}

function checkNumBeds() {
  console.log(getFuncName())
  lvl = bldgLevel("dormitories")
  if (lvl == 0) {
    beds = 5
  } else if (lvl == 1) {
    beds = 10
  } else if (lvl == 2) {
    beds = 15
  } else if (lvl == 3) {
    beds = 20
  } else if (lvl == 4) {
    beds = 25
  } else if (lvl == 5) {
    beds = 30
  } else {
    beds = Math.floor(localStorage.getItem("beds"))
  }
  return beds
}

function checkBeds() {
  console.log(getFuncName())
  checkNumBeds()
  if (slaves.length > beds) {
    // var effect = Math.floor(slaves.length / beds) * 4
    slaves.forEach((slave, i) => {
      changeStat(slave, "Health", -5)
    });
    end_of_week_report.push($.i18n("warning-crowded", slaves.length, beds))
  }
}

function incrementWeeks(slave) {
  console.log(getFuncName())
  slave.living_weeks = Math.floor(slave.living_weeks) + 1
  slave.clothing_weeks = Math.floor(slave.clothing_weeks) + 1
  slave.collar_weeks = Math.floor(slave.collar_weeks) + 1
  localStorage.setItem("slaves", JSON.stringify(slaves))
}

function makeOldStats(slave) {
  console.log(getFuncName())
  var old_stats = []
  slave.stats.forEach((item, i) => {
    old_stats.push({"name": item.name, "level": item.level, "type": "stat"})
  });
  slave.scales.forEach((item, i) => {
    old_stats.push({"name": item.name, "level": item.level, "type": "scale"})
  });
  slave.skills.forEach((item, i) => {
    old_stats.push({"name": item.name, "level": item.level, "type": "skills"})
  });
  slave.kinks.forEach((item, i) => {
    old_stats.push({"name": item.name, "level": item.level, "type": "kinks"})
  });
  slave.jobs.forEach((item, i) => {
    old_stats.push({"name": item.name, "level": item.level, "type": "jobs"})
  });
  return old_stats
}

// make sure slave stats aren't over or under 100
function checkStats(slave) {
  console.log(getFuncName())
  var check_these = [slave.stats, slave.scales, slave.skills, slave.kinks, slave.jobs]
  check_these.forEach((thing, i) => {
    thing.forEach((stat, i) => {
      // console.log(stat)
      if (stat.level > 100) {
        stat.level = 100
      } else if (stat.level < -100) {
        stat.level = -100
      }
      stat.level
    });
  });
}

function checkLiteracy(slave) {
  if (slave.literacy == true) {
    changeStat(slave, "Obedience", -1)
  }
}
