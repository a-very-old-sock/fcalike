// view an owned slave
function viewSlave(id){
  // console.log(id)
  console.log(getFuncName())
  $(".save_slave").attr("id", id);
  $("#slave_bust").empty()
  $("#slave_name_input").attr("placeholder", "Change name here").val("");
  clearthese = document.getElementsByClassName("bust");
  a = [...clearthese]
  a.forEach((item, i) => {
    // console.log(item)
    elem = document.getElementsByClassName("bust")[i]
    $(elem).empty()
  });

  current_page = "view_slave";
  localStorage.setItem("current_page", current_page);
  localStorage.setItem("current_slave_id", id);
  hideAll();
  document.getElementById("view_slave").classList.remove("hidden");
  var these_ones = JSON.parse(localStorage.getItem("slaves") || "[]");
  // console.log(these_ones)
  var inspected = these_ones.find(slave => slave.id == id);

  $("#slave_name").html("<h4>" + inspected.name + ", " + inspected.age + "</h4>");

  makePortrait("#slave_bust", inspected.id, 2, "slaves");
  // slaveStatsRadar(inspected)
  // slaveKinksRadar(inspected)
  // slaveJobsRadar(inspected)

  // physical description
  modalDescription(inspected, "#slave_details");
  if (inspected.responds_known) {
    $("#slave_details").append("<br>");
    $("#slave_details").append($.i18n("description-responds", inspected.name, inspected.responds_to))
  }
  $("#slave_details").append("<hr>");

  // order details
  $('#follows_rules').val(inspected.follows_rules.toString());
  // console.log(inspected.follows_rules)

  $("#assignment_label").html("This week " + inspected.name + " is assigned to:");
  checkFacilities();
  $('#assignment').val(inspected.assignment.name);


  $("#living_label").html(inspected.name + "'s living conditions are:");
  $('#living').val(inspected.living);

  $("#clothing_label").html(inspected.name + " is wearing:");
  basic_clothing.forEach((item, i) => {
    option = document.createElement("option")
    option.text = item
    document.getElementById("clothing").add(option)
  });
  $('#clothing').val(inspected.clothing);

  // $("#collar_label").html(inspected.name + " is wearing:");
  // var collars = localStorage.getItem("collars")
  collars.forEach((item, i) => {
    option = document.createElement("option")
    option.text = item
    document.getElementById("collar").add(option)
  });
  $('#collar').val(inspected.collar);

  modalStatsBlock(inspected.stats,"#slave_stats");
  modalStatsBlock(inspected.scales,"#slave_scales");

  $("#slave_interact_buttons").empty()
  $("#slave_interact_log").empty()
  makeInteractButtons(inspected.id, "slaves")

  // $("#slave_skills").append("<hr>");
  modalStatsBlock(inspected.skills,"#slave_skills");
  $("#slave_skills").prepend("<h5>Skills</h5>");
  // $("#slave_kinks").append("<hr>");
  modalStatsBlock(inspected.kinks,"#slave_kinks");
  $("#slave_kinks").prepend("<h5>Kinks</h5>");
  $("#slave_history").append(inspected.end_of_week_report.join('  '))

  pf = ["kitchens", "guardhouse", "bathhouse", "gardens", "training room", "library", "office", "workshop", "clinic", "brothel"]
  levels = 0
  pf.forEach((item, i) => {
    levels += bldgLevel(item)
    // console.log(bldgLevel(item))
  });

  if (levels >= 1) {
    $("#slave_jobs").append("<hr>");
    modalStatsBlock(inspected.jobs,"#slave_jobs");
    $("#slave_jobs").prepend("<h5>Job Skills</h5>");
  }
};

function checkFacilities() {
  console.log(getFuncName())
  pf = ["kitchens", "guardhouse", "bathhouse", "gardens", "training room", "library", "office", "workshop", "clinic"]
  pf.forEach((bldg, i) => {
    if (bldgLevel(bldg) >= 1) {
      var opt = document.createElement('option');
      opt.value = bldg;
      opt.innerHTML = "work in the " + bldg;
      document.getElementById("assignment").appendChild(opt);
    }
  });
}

function makeInteractButtons(slave_id, group) {
  console.log(getFuncName())
  if (Array.isArray(group)) {
    slave = group.find(slave => slave.id == slave_id);
  } else {
    group = JSON.parse(localStorage.getItem(group) || "[]")
    slave = group.find(slave => slave.id == slave_id);
  }
  action_pts = localStorage.getItem("action_pts");
  $("#slave_interact_buttons").append("<p>Buttons <span class='text-success'>this color</span> cost 1 action point, while buttons <span class='text-primary'>this color</span> have no cost.")
  if (action_pts > 0) {
    $("#slave_interact_buttons").append("<button type='button' class='btn btn-success mt-2' onclick='talkButton(" + slave_id +", slaves" + ")'>Talk with " + slave.name + "</button>");
    if ((statLevel(slave, "Health") <= 0) && statKnown(slave, "Health")) {
      $("#slave_interact_buttons").append("<button type='button' class='btn btn-success mt-2' onclick='healButton(" + slave_id +", slaves" + ")'>Have a doctor heal " + slave.name + " (§1000)</button>");
    }
    if (statKnown(slave, "Health") == false) {
      $("#slave_interact_buttons").append("<button type='button' class='btn btn-success mt-2' onclick='examineButton(" + slave_id +", slaves" + ")'>Have " + slave.name + " examined by a doctor (§100)</button>");
    }
    $("#slave_interact_buttons").append("<button type='button' class='btn btn-primary mt-2' onclick='salonButton(" + slave_id + ")'>Change " + slave.name + "'s appearance</button>");
  }
}

// inspect a slave
function inspectSlave(id){
  console.log(getFuncName())
  current_page = localStorage.getItem("current_page");
  if (current_page == "buy_tab") {
    var these_ones = JSON.parse(localStorage.getItem("available") || "[]");
    // console.log(slaves);
  } else {
    var these_ones = JSON.parse(localStorage.getItem("slaves") || "[]");
    // console.log("not!");
  }
  // console.log(these_ones)
  var inspected = these_ones.find(slave => slave.id === id);
  // console.log(inspected);
  $("#modalLabel").html("<h5>" + inspected.name + ", " + inspected.age + "</h5>");
  modalDescription(inspected, "#modal-body");
  $("#modal-body").append("<hr>");
  // console.log(inspected.stats)
  modalStatsBlock(inspected.stats, "#modal-body");
  modalStatsBlock(inspected.scales, "#modal-body");

  // this is supposed to append a buy button to the modal, but it fires when the name is clicked and buys without clicking the buy button
  // if (current_page = "buy_tab") {
  //   var buy_btn = document.createElement("button");
  //   buy_btn.innerHTML = "Buy: $" + inspected.price;
  //   buy_btn.classList.add('btn', 'btn-primary', 'buy-btn');
  //   buy_btn.id = "buy_btn";
  //   buy_btn.setAttribute("data-inspected", inspected.id);
  //   buy_btn.onclick = buySlave(inspected.id);
  //   $(".modal-footer").append(buy_btn);
  // }
};

// save in viewSlave
$(document).ready(function() {
  $(".save_slave").click(function(){
    // console.log("Save!");
    var slave_id = $(".save_slave").attr('id');
    // console.log(slave_id);
    setAssignment(slave_id);
    setThing(slave_id, "living");
    setThing(slave_id, "clothing");
    setThing(slave_id, "collar");
    setThing(slave_id, "follows_rules")
    new_name = $.trim( $('#slave_name_input').val() );
    if (new_name.length >=1) {
      console.log("change name")
      changeName(slave_id, new_name)
      location.reload()
    }
    saveButton(slave_id)
    // document.getElementById(slave_id).classList.add("fade-primary");
  });
});

function changeName(slave_id, new_name) {
  var these_ones = JSON.parse(localStorage.getItem("slaves") || "[]");
  var objIndex = these_ones.findIndex((obj => obj.id == slave_id));
  these_ones[objIndex].name = new_name
  localStorage.setItem("slaves", JSON.stringify(these_ones))
  // $("#slave_name").empty()
  // $("#slave_name").append(new_name)
  // $("#slave_name_input").attr("placeholder", "Change name here").val("");
}

function setThing(id, div_id) {
  console.log(getFuncName())
  var these_ones = JSON.parse(localStorage.getItem("slaves") || "[]");
  var objIndex = these_ones.findIndex((obj => obj.id == id));
  var dropdown = document.getElementById(div_id);
  // console.log(div_id)
  var new_thing = dropdown.options[dropdown.selectedIndex].value
  // console.log(dropdown)
  if (div_id == "living") {
    if (these_ones[objIndex].living != new_thing) {
      these_ones[objIndex].living_weeks = 0
      these_ones[objIndex].follows_rules = false
    }
    these_ones[objIndex].living = new_thing;
  } else if (div_id == "clothing") {
    if (these_ones[objIndex].clothing != new_thing) {
      these_ones[objIndex].clothing_weeks = 0
      these_ones[objIndex].follows_rules = false
    }
    these_ones[objIndex].clothing = new_thing;
  } else if (div_id == "collar") {
    if (these_ones[objIndex].collar != new_thing) {
      these_ones[objIndex].collar_weeks = 0
      these_ones[objIndex].follows_rules = false
    }
    these_ones[objIndex].collar = new_thing;
  } else if (div_id == "follows_rules") {
    // console.log(new_thing)
    var mybool = JSON.parse(new_thing)
    these_ones[objIndex].follows_rules = mybool;
  }
  localStorage.setItem("slaves", JSON.stringify(these_ones))
}

function setAssignment(id) {
  console.log(getFuncName())
  // console.log("id: " + id);
  var these_ones = JSON.parse(localStorage.getItem("slaves") || "[]");
  var dropdown = document.getElementById("assignment");
  var new_assignment = dropdown.options[dropdown.selectedIndex].value
  var new_assignment_type = getAssignmentType(new_assignment);
  var NewAssignment = assignmentMaker(new_assignment, new_assignment_type, "none");
  var new_assignment = new NewAssignment;

  var objIndex = these_ones.findIndex((obj => obj.id == id));
  these_ones[objIndex].assignment = new_assignment;

  localStorage.setItem("slaves", JSON.stringify(these_ones))
}

function getAssignmentType(a) {
  console.log(getFuncName())
  var type = ""
  pf = ["kitchens", "guardhouse", "bathhouse", "gardens", "training room", "library", "office", "workshop", "clinic"]
  if (a == "rest") {
    type = "rest"
  } else if (a == "whore" || a == "serve the household" || a == "please you" || pf.includes(a)) {
    type = "work"
  } else if (a == "work a gloryhole" || a == "public use" || a == "stay confined") {
    type = "punishment"
  } else {
    type = "none"
  }
  return type
}

function statLevel(s, stat) {
  console.log(getFuncName())
  if (slave_scales.includes(stat)) {
    stat_level = s.scales.find(function(thing) {if(thing.name == stat) return thing}).level
  } else if (slave_stats.includes(stat)) {
    stat_level = s.stats.find(function(thing) {if(thing.name == stat) return thing}).level
  } else if (slave_skills.includes(stat)) {
    stat_level = s.skills.find(function(thing) {if(thing.name == stat) return thing}).level
  } else if (slave_jobs.includes(stat)) {
    stat_level = s.jobs.find(function(thing) {if(thing.name == stat) return thing}).level
  } else {
    stat_level = 0
  }
  return stat_level
}

function kinkLevel(s, stat) {
  console.log(getFuncName())
  stat_level = s.kinks.find(function(thing) {if(thing.name == stat) return thing}).level
  return stat_level
}

function statKnown(s, stat) {
  console.log(getFuncName())
  if (slave_scales.includes(stat)) {
    stat_known = s.scales.find(function(thing) {if(thing.name == stat) return thing}).known
  } else if (slave_stats.includes(stat)) {
    stat_known = s.stats.find(function(thing) {if(thing.name == stat) return thing}).known
  } else if (slave_skills.includes(stat)) {
    stat_known = s.skills.find(function(thing) {if(thing.name == stat) return thing}).known
  } else if (slave_jobs.includes(stat)) {
    stat_known = s.jobs.find(function(thing) {if(thing.name == stat) return thing}).known
  } else {
    stat_known = false
  }
  return stat_known
}

function kinkKnown(s, stat) {
  console.log(getFuncName())
  stat_known = s.kinks.find(function(thing) {if(thing.name == stat) return thing}).known
  return stat_known
}

function changeStat(s, stat, amount) {
  console.log(getFuncName())
  if (slave_scales.includes(stat)) {
    s.scales.find(function(thing) {if(thing.name == stat) return thing}).level += amount
  } else if (slave_stats.includes(stat)) {
    s.stats.find(function(thing) {if(thing.name == stat) return thing}).level += amount
    if (statLevel(s, stat) < 0) { setStat(s, stat, 0) }
  } else if (slave_skills.includes(stat)) {
    s.skills.find(function(thing) {if(thing.name == stat) return thing}).level += amount
    if (statLevel(s, stat) < 0) { setStat(s, stat, 0) }
  } else if (slave_jobs.includes(stat)) {
    s.jobs.find(function(thing) {if(thing.name == stat) return thing}).level += amount
    if (statLevel(s, stat) < 0) { setStat(s, stat, 0) }
  } else {
  }
  if (statLevel(s, stat) < -100) {setStat(s, stat, -100)}
  else if (statLevel(s, stat) > 100) {setStat(s, stat, 100)}
  if (stat == "Charisma") {
    s.charisma_desc = charismaWord(s)
  }
  localStorage.setItem("slaves", JSON.stringify(slaves))
}

function changeKink(s, stat, amount) {
  console.log(getFuncName())
  s.kinks.find(function(thing) {if(thing.name == stat) return thing}).level += amount
  if (statLevel(s, stat) < -100) {setStat(s, stat, -100)}
  else if (statLevel(s, stat) > 100) {setStat(s, stat, 100)}
  localStorage.setItem("slaves", JSON.stringify(slaves))
}

function statTrue(s, stat) {
  console.log(getFuncName())
  if (slave_scales.includes(stat)) {
    s.scales.find(function(thing) {if(thing.name == stat) return thing}).known = true
  } else if (slave_stats.includes(stat)) {
    s.stats.find(function(thing) {if(thing.name == stat) return thing}).known = true
    if (statLevel(s, stat) < 0) { setStat(s, stat, 0) }
  } else if (slave_skills.includes(stat)) {
    s.skills.find(function(thing) {if(thing.name == stat) return thing}).known = true
  } else if (slave_jobs.includes(stat)) {
    s.jobs.find(function(thing) {if(thing.name == stat) return thing}).known = true
  } else {
  }
  localStorage.setItem("slaves", JSON.stringify(slaves))
}

function kinkTrue(s, stat) {
  console.log(getFuncName())
  s.kinks.find(function(thing) {if(thing.name == stat) return thing}).known = true
  localStorage.setItem("slaves", JSON.stringify(slaves))
}

function setStat(s, stat, amount) {
  console.log(getFuncName())
  if (slave_scales.includes(stat)) {
    s.scales.find(function(thing) {if(thing.name == stat) return thing}).level = amount
  } else if (slave_stats.includes(stat)) {
    s.stats.find(function(thing) {if(thing.name == stat) return thing}).level = amount
  } else if (slave_skills.includes(stat)) {
    s.skills.find(function(thing) {if(thing.name == stat) return thing}).level = amount
  } else if (slave_jobs.includes(stat)) {
    s.jobs.find(function(thing) {if(thing.name == stat) return thing}).level = amount
  } else {
  }
  if (stat == "Charisma") {
    s.charisma_desc = charismaWord(s)
  }
  localStorage.setItem("slaves", JSON.stringify(slaves))
}

function setKink(s, stat, amount) {
  console.log(getFuncName())
  s.kinks.find(function(thing) {if(thing.name == stat) return thing}).level = amount
  localStorage.setItem("slaves", JSON.stringify(slaves))
}

function jobSkillDesc(s, job) {
  lvl = statLevel(s, job)
  word = ""
  if (between(lvl, 0, 25)) {
    word = "unskilled"
  } else if (between(lvl, 26, 50)) {
    word = "decently competent"
  } else if (between(lvl, 51, 75)) {
    word = "skilled"
  } else if (between(lvl, 76, 100)) {
    word = "exceptionally skilled"
  }
  return word
}

function between(x, min, max) {
  return x >= min && x <= max;
}
