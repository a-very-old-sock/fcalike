function endWeek() {
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
  money -= expenses();
  localStorage.setItem("money", money);
  if (slaves.length > 1) {
    slave_scales.forEach((item, i) => {
      averageChange(item);
    });
  }
  // console.log("first " + reputation)
  // reputation = Math.floor(reputation);
  // // console.log("second " + reputation)
  // reputation += Math.floor(reputationChange());
  // localStorage.setItem("reputation", reputation);
  // console.log("third " + reputation)
  // console.log(money);
  checkBeds();
  checkSlaves();
  passageOfTime();
  incomeReport(old_money)
  localStorage.setItem("slaves", JSON.stringify(slaves));
  // console.log(end_of_week_report);
  // slaves.forEach((slave, i) => {
  //   // console.log(slave.end_of_week_report);
  // });
  homeTableHead();
  listAllSlaves(slaves);
  var week_div = $("#week_counter").html("<h2>Week: " + week + "</h2>");
  var money_div = $("#money_counter").html("<h2>Money: " + money + "</h2>");
  var reputation_div = $("#reputation_counter").html("<h2>Reputation: " + reputation + "</h2>");
  var slaves_div = $("#slave_counter").html("<h2>Slaves: " + slaves.length + "</h2>");
  modalReport();
};

function modalReport() {
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
  var costs = 0
  costs += checkLivingExpenses(slaves);
  var money = Math.floor(localStorage.getItem("money"))
  var taxes = Math.floor(money * 0.13)
  money -= taxes
  localStorage.setItem("money", money)
  end_of_week_report.push($.i18n("report-maintaining", slaves.length, costs));
  end_of_week_report.push($.i18n("report-taxes", taxes));
  return costs
}

function incomeReport(old_money) {
  income = Math.floor(money) - Math.floor(old_money)
  income_record = localStorage.getItem("income_record")
  income_array = (income_record) ? JSON.parse(income_record) : [];
  // console.log(income_array)
  income_array.push(income)
  localStorage.setItem("income_record", JSON.stringify(income_array))
}

function checkLivingExpenses(slaves) {
  var costs = 0
  slaves.forEach((slave, i) => {
    // console.log("before living status " + JSON.stringify(slave.scales))
    if (slave.living == "luxurious") {
      slave_cost = 500
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
          positiveEffect(slave, slave.scales, item, Math.round(slave_cost / 10))
        });
        // console.log(slave.name + " responds to kindness, increase " + stats + " " + (slave_cost / 10))
      } else if (slave.responds_to == "severity") {
        var stats = ["Obedience", "Loyalty"]
        slave_cost = slave_cost * -1
        stats.forEach((item, i) => {
          negativeEffect(slave, slave.scales, item, Math.round(slave_cost / 10))
        });
        // console.log(slave.name + " responds to severity, decrease " + stats + " " + (slave_cost / 10))
      }
      positiveEffect(slave, slave.scales, "Happiness", Math.round(slave_cost / 10))
    }

    if (slave_cost <= 3) {
      if (slave_cost == 3) {var effect = 2}
      else {var effect = 5}
      if (slave.responds_to == "kindness") {
        var stats = ["Obedience", "Loyalty", "Love", "Happiness", "Libido"]
        stats.forEach((item, i) => {
          // console.log(item)
          negativeEffect(slave, slave.scales, item, effect)
        });
        // console.log(slave.name + " responds to kindness, decrease " + stats + " " + effect)
      } else if (slave.responds_to == "severity") {
        var stats = ["Obedience", "Loyalty", "Love"]
        stats.forEach((item, i) => {
          negativeEffect(slave, slave.scales, item, (effect * 2))
        });
        // console.log(slave.name + " responds to severity, increase " + stats + " " + effect)
      }
    }
    // console.log("after living status cost: "+ slave_cost + JSON.stringify(slave.scales))
  });
  return costs
}

function checkSlaves() {
  slaves.forEach((slave, i) => {
    var old_stats = []
    old_stats = makeOldStats(slave)
    healthCheck(slave);
    incrementWeeks(slave);
    checkAssignment(slave);
    checkCollar(slave);
    checkClothing(slave);
    statsInteraction(slave);
    // console.log("check slaves:" + i)
    checkStats(slave);
    var stat_changes = checkOldStats(slave, old_stats)
    printStatChanges(slave, stat_changes)
  });
  localStorage.setItem("slaves", JSON.stringify(slaves))
}

function statsInteraction(slave) {
  var int = slave.stats.find(function(stat) {if(stat.name == "Intelligence") return stat}).level
  var love = slave.scales.find(function(stat) {if(stat.name == "Love") return stat}).level
  var happiness = slave.scales.find(function(stat) {if(stat.name == "Happiness") return stat}).level
  if (int >= 50 && love < 0) {
    slave.scales.find(function(stat) {if(stat.name == "Obedience") return stat}).level -= Math.floor(int/50)
  }
  if (happiness >= 50 || happiness <= -50) {
    slave.scales.find(function(stat) {if(stat.name == "Obedience") return stat}).level += Math.floor(happiness/50)
    slave.scales.find(function(stat) {if(stat.name == "Libido") return stat}).level += Math.floor(happiness/50)
  }
  if (love >= 50 || love <= -50) {
    slave.scales.find(function(stat) {if(stat.name == "Obedience") return stat}).level += Math.floor(love/50)
  }
}

function printStatChanges(slave, stat_changes) {
  var phrases = []
  stat_changes.sort(function (a, b) {
    return a.change - b.change;
  });
  // console.log("printStatChanges " + slave.name + " " + slave.responds_to + " and changed: " + JSON.stringify(stat_changes))
  stat_changes.forEach((item, i) => {
    if (item.change >= 5) {
      // console.log(item.name)
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
      // console.log("new level " + item.name + " " + item.level + " minus old level " + old_stat.level + " equals " + (item.level - old_stat.level))
      stat_changes.push({"name": item.name, "change": change, "type": "scale"})
    }
  });
  slave.skills.forEach((item, i) => {
    old_stat = old_stats.find(stat => stat.name == item.name)
    if (old_stat.type == "skills") {
      if (old_stat.level > item.level || old_stat.level < item.level) {
        var change = item.level - old_stat.level
        // console.log(item.level + " minus " + old_stat.level)
        stat_changes.push({"name": item.name, "change": change, "type": "skills"})
      }
    }
  });
  slave.kinks.forEach((item, i) => {
    old_stat = old_stats.find(stat => stat.name == item.name)
    if (old_stat.type == "kinks") {
      if (old_stat.level > item.level || old_stat.level < item.level) {
        var change = item.level - old_stat.level
        // console.log(item.level + " minus " + old_stat.level)
        stat_changes.push({"name": item.name, "change": change, "type": "kinks"})
      }
    }
  });
  slave.jobs.forEach((item, i) => {
    old_stat = old_stats.find(stat => stat.name == item.name)
    if (old_stat.level > item.level || old_stat.level < item.level) {
      var change = item.level - old_stat.level
      // console.log(item.level + " minus " + old_stat.level)
      stat_changes.push({"name": item.name, "change": change, "type": "jobs"})
    }
  });
  return stat_changes
}

function checkClothing(slave) {
  // console.log(slave.name + " before clothing: " + slave.clothing + JSON.stringify(slave.scales))
  var phrases = []
  if (slave.clothing == "jeans and a tshirt" || slave.clothing == "a flattering business suit") {
    slave.scales.find(function(stat) {if(stat.name == "Happiness") return stat}).level += 5
    slave.scales.find(function(stat) {if(stat.name == "Obedience") return stat}).level -= 10
    if (slave.clothing == "a flattering business suit") {
      slave.kinks.find(function(stat) {if(stat.name == "Dominating") return stat}).level += 5
    }
    phrases.push(slave.name + " loved passing as a free person wearing " + slave.clothing + " this week")
  } else {
    phrases.push(nakedClothing(slave))
    phrases.push(domClothing(slave))
    phrases.push(liveryClothing(slave))
    phrases.push(otherClothing(slave))
  }
  var report = phrases.join("") + "."
  // console.log(slave.name + ":" + slave.clothing_weeks)
  if (Math.floor(slave.clothing_weeks) < 2) {
    slave.end_of_week_report.push(report)
  }

  localStorage.setItem("slaves", JSON.stringify(slaves))
  // console.log(slave.name + " after clothing: " + slave.clothing + JSON.stringify(slave.scales))
}

function checkCollar(slave) {
  // var slaves = JSON.parse(localStorage.getItem("slaves") || "[]");
  // var objIndex = slaves.findIndex((obj => obj.id == slave_id));
  // var slave = slaves[objIndex]
  var phrases = []
  // console.log(slave.name + " before collar: " + slave.collar + JSON.stringify(slave.scales))
  if (slave.collar == "none") {
    slave.scales.find(function(stat) {if(stat.name == "Happiness") return stat}).level += 5
    slave.scales.find(function(stat) {if(stat.name == "Obedience") return stat}).level -= 10
    phrases.push(" was <span class='text-success'>overjoyed</span> to go without a collar this week")
  } else {
    phrases.push(humiliatingCollar(slave))
    phrases.push(punishingCollar(slave))
    // phrases.push()
  }
  // console.log(slave.name + ":" + phrases)
  var report = slave.name + phrases.join("") + "."
  // console.log(slave.name + ":" + slave.collar_weeks)
  if (Math.floor(slave.collar_weeks) < 2) {
    slave.end_of_week_report.push($.i18n(report, slave.gender, slave.collar))
  }
  localStorage.setItem("slaves", JSON.stringify(slaves))
  // console.log(slave.name + " after collar: " + slave.collar + JSON.stringify(slave.scales))
}

function checkAssignment(slave) {
  // console.log(slave.name + " before assignment " + JSON.stringify(slave.scales))
  slave.assignment_weeks += 1
  if (slave.assignment.name == "whore") {checkWhoring(slave);}
  else if (slave.assignment.name == "work a gloryhole") {checkGloryHole(slave);}
  else if (slave.assignment.name == "public use") {checkPublicUse(slave);}
  else if (slave.assignment.name == "serve the household") {checkServeHousehold(slave);}
  else if (slave.assignment.name == "please you") {checkPleaseYou(slave);}
  else if (slave.assignment.name == "stay confined") {checkConfinement(slave)}
  else if (slave.assignment.name == "exercise") {checkExercise(slave)}
  else {checkResting(slave);}
  // console.log(slave.name + " after assignment " + JSON.stringify(slave.scales))
}

function negativeEffect(slave, array, thing, degree) {
  array.find(function(stat) {if(stat.name == thing) return stat}).level -= degree
}

function positiveEffect(slave, array, thing, degree) {
  array.find(function(stat) {if(stat.name == thing) return stat}).level += degree
}

function aptitudeFor(stat_name) {
  var word = ""
  if (stat_name == "Charisma") {word = "skill for seduction"}
  else if (stat_name == "Strength") { word = "skill for hard physical work" }
  else if (stat_name == "Intelligence") { word = "skill for intellectual work" }
  return word
}

function kindnessAction(slave) {
  var slave_stats = ["Love", "Loyalty", "Obedience", "Happiness"]
  if (slave.responds_to == "kindness") {
    slave_stats.forEach((thing, i) => {
      var to_change = slave.scales.find(function(stat) {if(stat.name == thing) return stat}).level
      to_change += 2
    });
    if (slave.responds_known == true) {
      slave.end_of_week_report.push($.i18n("action-response-grateful", slave.gender));
    }
  } else if (slave.responds_to == "severity") {
    slave_stats.forEach((thing, i) => {
      var to_change = slave.scales.find(function(stat) {if(stat.name == thing) return stat}).level
      to_change -= 2
    });
    if (slave.responds_known == true) {
      slave.end_of_week_report.push($.i18n("action-response-ungrateful", slave.gender));
    }
  }
}

function harshAction(slave) {
  var slave_stats = ["Love", "Loyalty", "Happiness", "Obedience"]
  if (slave.responds_to == "severity") {
    slave_stats.forEach((thing, i) => {
      var to_change = slave.scales.find(function(stat) {if(stat.name == thing) return stat}).level
      to_change += 2
    });
    if (slave.responds_known == true) {
      slave.end_of_week_report.push($.i18n("action-response-disciplined", slave.gender));
    }
  } else if (slave.responds_to == "kindness") {
    slave_stats.forEach((thing, i) => {
      var to_change = slave.scales.find(function(stat) {if(stat.name == thing) return stat}).level
      to_change -= 2
    });
    if (slave.responds_known == true) {
      slave.end_of_week_report.push($.i18n("action-response-hurt", slave.gender));
    }
  }
}

function passageOfTime(){
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
  var slave_health = slave.scales.find(function(stat) {if(stat.name == "Health") return stat}).level
  if (slave_health < -100) {
    slave.status = "dead";
    // add dead slave to former_slaves
    former_slaves.push(slave);
    localStorage.setItem("former_slaves", JSON.stringify(former_slaves));

    // remove slave from slaves
    slaves.splice(slaves.indexOf(slave), 1);
    localStorage.setItem("slaves", JSON.stringify(slaves));
    pc_kindness = Math.floor(pc_kindness)
    pc_kindness -= 10;
    localStorage.setItem("pc_kindness", pc_kindness)
    money = Math.floor(money);
    money -= 50
    localStorage.setItem("money", money);
    reputation = Math.floor(reputation);
    reputation -= 50
    localStorage.setItem("reputation", reputation);
    end_of_week_report.push($.i18n("warning-died", slave.name));
  }
}

function interest() {
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
  // console.log(change)
  return change;
}

// check effect of pc's stats on slaves
function pcStatCheck() {
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
  var modifier = Math.floor(pc_kindness / 20)
  // console.log("modifier " + modifier)
  slaves = JSON.parse(localStorage.getItem("slaves"))
  var slave_stats = ["Love", "Loyalty", "Obedience"]
  var adj = ""
  var response = ""
  slaves.forEach((slave, i) => {
    adj = "bork"
    response = "bork"
    // console.log(slave.name + " " + slave_stat + " before pc rep effect: " + modifier + JSON.stringify(slave.scales))
    if (modifier >= 2) {
      if (slave.responds_to == "kindness") {
        slave_stats.forEach((slave_stat, i) => {positiveEffect(slave, slave.scales, slave_stat, modifier)})
        adj = "well";
        response = "improved";
      } else if (slave.responds_to == "severity") {
        slave_stats.forEach((slave_stat, i) => {negativeEffect(slave, slave.scales, slave_stat, modifier)})
        adj = "poorly";
        response = "got worse";
      }
      slave.end_of_week_report.push($.i18n("pc-rep-responds", slave.gender, slave.name, adj, slave.responds_to, response));
    } else if (modifier <= -2) {
      if (slave.responds_to == "kindness") {
        slave_stats.forEach((slave_stat, i) => {negativeEffect(slave, slave.scales, slave_stat, modifier)})
        adj = "poorly";
        response = "got worse";
        rep = "brutality"
      } else if (slave.responds_to == "severity") {
        slave_stats.forEach((slave_stat, i) => {positiveEffect(slave, slave.scales, slave_stat, modifier)})
        adj = "well";
        response = "improved";
        rep = "brutality"
      }
      slave.end_of_week_report.push($.i18n("pc-rep-responds", slave.gender, slave.name, adj, rep, response));
    }
      // console.log(slave.name + " " + slave_stat + " after pc rep effect: " + modifier + JSON.stringify(slave.scales))
    });
}

function averageChange(thing) {
  // console.log(thing);
  var average = 0
  var change = 0
  slaves.forEach((slave, i) => {
    var a = slave.scales.find(function(stat) {if(stat.name == thing) return stat}).level;
    average += a
    // console.log(health);
  });
  // console.log("average:" + average);
  average = average / slaves.length
  // console.log(average);
  if (average <= -1) {
    change = -1
  } else if (average >= 1) {
    change = 1
  }
  if (change != 0) {
    slaves.forEach((slave, i) => {
      // console.log("averageChange" + slave.name + " " + thing + " " + change)
      slave.scales.find(function(stat) {if(stat.name == thing) return stat}).level += change;
      // console.log(slave.stats.find(function(stat) {if(stat.name == "Health") return stat}).level );
    });
  }
  localStorage.setItem("slaves", JSON.stringify(slaves))
  // console.log(thing + ": " + change);
}

function checkBeds() {
  var beds = Math.floor(localStorage.getItem("beds"))
  // console.log(beds)
  if (slaves.length > beds) {
    var effect = Math.floor(slaves.length / beds) * 4
    slaves.forEach((slave, i) => {
      negativeEffect(slave, slave.scales, "Health", 5)
    });
    end_of_week_report.push($.i18n("warning-crowded", slaves.length))
  }
}

function incrementWeeks(slave) {
  // var slaves = JSON.parse(localStorage.getItem("slaves") || "[]");
  // var objIndex = slaves.findIndex((obj => obj.id == slave_id));
  // var inc_these = [slaves[objIndex].living_weeks, slaves[objIndex].clothing_weeks, slaves[objIndex].collar_weeks]
  // console.log(slave.collar_weeks)
  slave.living_weeks = Math.floor(slave.living_weeks) + 1
  slave.clothing_weeks = Math.floor(slave.clothing_weeks) + 1
  slave.collar_weeks = Math.floor(slave.collar_weeks) + 1
  // console.log(slave.collar_weeks)
  localStorage.setItem("slaves", JSON.stringify(slaves))
}

function makeOldStats(slave) {
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