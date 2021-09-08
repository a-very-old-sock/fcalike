function showRulesManager() {
  hideAll();
  var ids = ["assig_name", "living_name", "clothing_name", "collar_name"]
  ids.forEach((id, i) => {
    // console.log("clear " + id + "!")
    $('#' + id).not(':first').remove()
  });
  $('#rules_list_start').empty();
  // removeOptions(document.getElementById('assig_name'))
  // removeOptions(document.getElementById('living_name'))
  // removeOptions(document.getElementById('clothing_name'))
  // removeOptions(document.getElementById('collar_name'))

  document.getElementById("rules_manager").classList.remove("hidden");
  var current_page = "rules_manager";
  localStorage.setItem("current_page", current_page);
  // console.log("bork")
  var rules = localStorage.getItem("rules")
  if (rules.length > 0) {
    rules = JSON.parse(rules)
    // console.log(rules)
    printRules(rules)
  } else {
    // console.log("bork")
    $('#rules_list_start').append("No rules have been set yet")
  }

  slave_scales.forEach((item, i) => {
    option = document.createElement("option")
    option.text = item
    document.getElementById("stat_name").add(option)
  });

  basic_assignments.forEach((item, i) => {
    option = document.createElement("option")
    option.text = item
    document.getElementById("assig_name").add(option)
  });

  basic_clothing.forEach((item, i) => {
    option = document.createElement("option")
    option.text = item
    document.getElementById("clothing_name").add(option)
  });

  collars.forEach((item, i) => {
    option = document.createElement("option")
    option.text = item
    document.getElementById("collar_name").add(option)
  });

  living.forEach((item, i) => {
    option = document.createElement("option")
    option.text = item
    document.getElementById("living_name").add(option)
  });

}

function printRules(rules) {
  rules.forEach((rule, i) => {
    if (rule.assignment.length > 0 || rule.clothing.length > 0 || rule.collar.length > 0 || rule.living.length > 0) {
      var changes = printRuleChanges(rule)
      if (rule.responds.length <= 0 && rule.stat_name.length > 0) {
        $('#rules_list_start').append("<tbody><td>If any slave's " + rule.stat_name + " is " + rule.condition + " " + rule.level + ", " + changes.join() + "</td><td><a href='#' onclick='removeRule("+rule.id+")'>Remove rule</a></td></tbody>")
      } else if (rule.responds.length > 0 && rule.stat_name.length > 0) {
        $('#rules_list_start').append("<tbody><td>If the slave responds to " + rule.responds + " and " + rule.stat_name + " is " + rule.condition + " " + rule.level + ", " + changes.join() + "</td><td><a href='#' onclick='removeRule("+rule.id+")'>Remove rule</a></td></tbody>")
      } else if (rule.responds.length > 0) {
        $('#rules_list_start').append("<tbody><td>If the slave responds to " + rule.responds + ", " + changes.join() + "</td><td><a href='#' onclick='removeRule("+rule.id+")'>Remove rule</a></td></tbody>")
      } else {
        // console.log(rule)
        $('#rules_list_start').append("<tbody><td>For all slaves, " + changes.join(', ') + "</td><td><a href='#' onclick='removeRule("+rule.id+")'>Remove rule</a></td></tbody>")
      }
    } else {
      // console.log("nothing here!")
      // console.log(rule)
    }
    // console.log(rule)
  });
}

function printRuleChanges(rule) {
  var changes = []
  if (rule.assignment.length > 0) {
    changes.push("change assignment to " + rule.assignment)
  }
  if (rule.clothing.length > 0) {
    changes.push("change clothing to " + rule.clothing)
  }
  if (rule.collar.length > 0) {
    changes.push("change collar to " + rule.collar)
  }
  if (rule.living.length > 0) {
    changes.push("change living conditions to " + rule.living)
  }
  return changes
}

//save rule changes
$(document).ready(function() {
  document.getElementById("cond_level").oninput = function() {
    var new_level = document.getElementById("cond_level").value
    document.getElementById('level_at').innerHTML = new_level
  }
  $("#save_rules").click(function(){
    var r_dropdown = document.getElementById("responds");
    var new_responds = r_dropdown.options[r_dropdown.selectedIndex].value

    var stat_dropdown = document.getElementById("stat_name");
    var new_stat = stat_dropdown.options[stat_dropdown.selectedIndex].value

    var cond_dropdown = document.getElementById("cond");
    var new_cond = cond_dropdown.options[cond_dropdown.selectedIndex].value

    var new_level = document.getElementById("cond_level").value

    var assig_dropdown = document.getElementById("assig_name");
    var new_assig = assig_dropdown.options[assig_dropdown.selectedIndex].value

    var clothing_dropdown = document.getElementById("clothing_name");
    var new_clothing = clothing_dropdown.options[clothing_dropdown.selectedIndex].value

    var collar_dropdown = document.getElementById("collar_name");
    var new_collar = collar_dropdown.options[collar_dropdown.selectedIndex].value

    var living_dropdown = document.getElementById("living_name");
    var new_living = living_dropdown.options[living_dropdown.selectedIndex].value

    var rule_id = Date.now() + randomNumber(0,10000);
    var new_rule = {"id": rule_id, "responds": new_responds, "stat_name": new_stat, "condition": new_cond, "level": new_level, "assignment": new_assig, "clothing": new_clothing, "collar": new_collar, "living": new_living}
    var rules = localStorage.getItem("rules")
    if (rules.length > 0) {
      rules = JSON.parse(rules)
    } else {
      rules = []
    }
    if (new_rule != null) {
      // console.log(new_rule)
      if (new_rule.assignment === "" && new_rule.clothing === "" && new_rule.collar === "" && new_rule.living === "") {
        $('#rule-notif').append("Sorry, that's not a valid rule!  Check your settings and try again.")
        // console.log("empty rule!")
      } else {
        // console.log(new_rule)
        rules.push(new_rule)
        localStorage.setItem("rules", JSON.stringify(rules))
        $('#rules_list_start').empty()
        // location.reload(true);
      }
    } else {
      // console.log(new_rule)
      $('#rule-notif').append("Sorry, that's not a valid rule!  Check your settings and try again.")
      // console.log("empty rule!")
    }
    saveButton("save_rules");
    $('#rules_list_start').empty()
    printRules(rules);
  })
});

function removeRule(rule_id) {
  rules = JSON.parse(localStorage.getItem("rules"))
  var remove_this = rules.find(function(rule) {if(rule.id == rule_id) return rule})
  rules.splice(rules.indexOf(remove_this), 1)
  localStorage.setItem("rules", JSON.stringify(rules))
  $('#rules_list_start').empty()
  printRules(rules);
}

// apply rules at end of week
function applyRules() {
  rules = JSON.parse(localStorage.getItem("rules") || "[]")
  slaves = JSON.parse(localStorage.getItem("slaves") || "[]")
  rules.forEach((rule, i) => {
    if (rule.assignment.length > 0 || rule.clothing.length > 0 || rule.collar.length > 0 || rule.living.length > 0) {
      if (rule.responds.length > 0 && rule.stat_name > 0) {
        if (slave.responds == rule.responds && slave.scales.find(function(stat) {if(stat.name == rule.stat_name) return stat}).known == true) {
          applyConditionalRule(rule)
        }
      } else if (rule.responds.length <= 0 && rule.stat_name.length > 0) {
        applyConditionalRule(rule)
      } else if (rule.stat_name.length > 0) {
        applyConditionalRule(rule)
      } else {
        //applies to all slaves no matter what
        slaves.forEach((slave, i) => {
          applyOneRule(rule, slave)
        });

      }
    } else {
      // console.log("nothing here!")
      // console.log(rule)
    }
  });
  localStorage.setItem("slaves", JSON.stringify(slaves))
}

function applyConditionalRule(rule) {
  if (rule.condition == "more than") {
    slaves.forEach((slave, i) => {
      if (slave.scales.find(function(stat) {if(stat.name == rule.stat_name) return stat}).level >= rule.level && slave.scales.find(function(stat) {if(stat.name == rule.stat_name) return stat}).known == true) {
        applyOneRule(rule, slave)
      }
    });
  } else {
    slaves.forEach((slave, i) => {
      if (slave.scales.find(function(stat) {if(stat.name == rule.stat_name) return stat}).level <= rule.level && slave.scales.find(function(stat) {if(stat.name == rule.stat_name) return stat}).known == true) {
        applyOneRule(rule, slave)
      }
    });
  }
}

function applyOneRule(rule, slave) {
  // console.log(slave.name)
  if (slave.follows_rules == true) {
    // console.log(slave.name)
    if (rule.assignment.length > 0) {
      slave.assignment.name = rule.assignment
    }
    if (rule.clothing.length > 0) {
      if (slave.clothing != rule.clothing) {
        slave.clothing = rule.clothing
        slave.clothing_weeks = 0
      }
    }
    if (rule.collar.length > 0) {
      if (slave.collar != rule.collar) {
        slave.collar = rule.collar
        slave.collar_weeks = 0
      }
    }
    if (rule.living.length > 0) {
      if (slave.living != rule.living) {
        slave.living = rule.living;
        slave.living_weeks = 0
      }
    }
  }
}
