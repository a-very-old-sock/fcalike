// view an owned slave
function viewSlave(id){
  // console.log(id)
  $(".save_slave").attr("id", id);
  $("#slave_bust").empty()
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
  // console.log("bork!");
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

  $("#slave_skills").append("<hr>");
  $("#slave_skills").append("<h5>Skills</h5>");
  modalStatsBlock(inspected.skills,"#slave_skills");
  $("#slave_kinks").append("<hr>");
  $("#slave_kinks").append("<h5>Kinks</h5>");
  modalStatsBlock(inspected.kinks,"#slave_kinks");
  $("#slave_history").append(inspected.end_of_week_report.join('  '))

  pc_facilities = JSON.parse(localStorage.getItem("pc_facilities"))
  levels = 0
  pc_facilities.forEach((item, i) => {
    levels += item.level
  });

  if (levels > 0) {
    $("#slave_jobs").append("<hr>");
    $("#slave_jobs").append("<h5>Job Skills</h5>");
    modalStatsBlock(inspected.jobs,"#slave_jobs");
  }
};

function makeInteractButtons(slave_id, group) {
  group = JSON.parse(localStorage.getItem(group) || "[]")
  slave = group.find(slave => slave.id == slave_id);
  action_pts = localStorage.getItem("action_pts");
  if (action_pts > 0) {
    $("#slave_interact_buttons").append("<button type='button' class='btn btn-primary' onclick='interactButton(" + slave_id +", slaves" + ")'>Talk with " + slave.name + "</button>");
  }
}

function interactButton(slave_id, group) {
  $("#slave_interact_buttons").empty()
  slave = group.find(slave => slave.id == slave_id);
  $("#slave_interact_log").append(talkWith(slave_id, group))
  $("#slave_interact_log").append("<br/>")
  pcActionChange(-1)
  pcXpChange(1)
  makeInteractButtons(slave_id, group)
}

function statLevel(s, stat) {
  if (slave_scales.includes(stat)) {
    stat_level = s.scales.find(function(thing) {if(thing.name == stat) return thing}).level
  } else if (slave_stats.includes(stat)) {
    stat_level = s.stats.find(function(thing) {if(thing.name == stat) return thing}).level
  } else if (slave_kinks.includes(stat)) {
    stat_level = s.kinks.find(function(thing) {if(thing.name == stat) return thing}).level
  } else if (slave_skills.includes(stat)) {
    stat_level = s.skills.find(function(thing) {if(thing.name == stat) return thing}).level
  } else if (slave_jobs.includes(stat)) {
    stat_level = s.jobs.find(function(thing) {if(thing.name == stat) return thing}).level
  } else {
    stat_level = 0
  }
  return stat_level
}

function changeStat(s, stat, amount) {
  if (slave_scales.includes(stat)) {
    s.scales.find(function(thing) {if(thing.name == stat) return thing}).level += amount
  } else if (slave_stats.includes(stat)) {
    s.stats.find(function(thing) {if(thing.name == stat) return thing}).level += amount
  } else if (slave_kinks.includes(stat)) {
    s.kinks.find(function(thing) {if(thing.name == stat) return thing}).level += amount
  } else if (slave_skills.includes(stat)) {
    s.skills.find(function(thing) {if(thing.name == stat) return thing}).level += amount
  } else if (slave_jobs.includes(stat)) {
    s.jobs.find(function(thing) {if(thing.name == stat) return thing}).level += amount
  } else {
  }
}

function talkWith(slave_id, group) {
  pcKindnessChange(1)
  slave = group.find(slave => slave.id == slave_id);
  int = parseInt(localStorage.getItem("pc_int")) || 0;
  luck = parseInt(localStorage.getItem("pc_luck")) || 0;
  xp = parseInt(localStorage.getItem("xp")) || 0;
  slave_int = statLevel(slave, "Intelligence")
  slave_honesty = statLevel(slave, "Honesty") * -1
  slave_obedience = statLevel(slave, "Obedience") * -1
  player_roll = int + luck + xp
  slave_roll = slave_int + slave_honesty + slave_obedience - (randomNumber(0,luck))
  if (player_roll >= slave_roll) {
    thing = discoverOneThing(slave)
    console.log(thing)
    if (typeof thing == undefined) {
      roll_results = "After taking time to speak with " + slave.name + ", you discover " + thing + "."
    } else {
      roll_results = slave.name + " answers your questions readily but you don't learn anything new."
    }
  } else if (statLevel(slave, "Honesty") <= -50 && int >= 50) {
    roll_results = slave.name + " answers your questions obediently, but seems evasive."
  } else {
    roll_results = slave.name + " tolerates your interrogation obediently, but you don't learn much."
  }
  return roll_results
}

function discoverOneThing(slave) {
  var check_these = [slave.stats, slave.scales, slave.skills, slave.kinks]
  var discoveries = []
  check_these = shuffle(check_these)
  if (discoveries.length < 1) {
    check_these.forEach((thing, i) => {
      thing.forEach((stat, i) => {
        if (stat.known == false) {
          stat.known = true
          var phrase = ""
          if (stat.type == "stat") {
            phrase = aptitudeFor(stat.name)
          } else if (stat.type == "scale") {
            phrase = "level of " + lowercase(stat.name)
          } else if (stat.type == "kink") {
            if (stat.level >= 0) {
              if (stat.name == "Attraction to Men" || stat.name == "Attraction to Women") {
                phrase = lowercase(stat.name)
              } else {
                phrase = "love of " + lowercase(stat.name)
              }
            } else {
              if (stat.name == "Attraction to Men") {
                phrase = "disgust for fucking men"
              } else if (stat.name == "Attraction to Women") {
                phrase = "disgust for fucking women"
              } else {
                phrase = "hatred of " + lowercase(stat.name)
              }
            }
          } else if (stat.type == "skill") {
            phrase = "skills for " + lowercase(stat.name)
          } else {
          }
          discoveries.push(phrase)
        }
      })
    });
  }

  return discoveries[0]
}

function makePortrait(elem, slave_id, resize, group) {
  // console.log(slave_id)
  portrait_array = ["hair_deco", "head", "mark", "nose", "mouth", "brow", "eyes", "beard", "hair_hi", "ear", "shirt", "coat", "necklace", "accessory", "flowers", "glasses"]
  // console.log(elem)
  portrait_array.forEach((item, i) => {
    var img = document.createElement('img');
    img.dataset.id = 0
    img.id = item + "_" + slave_id
    img.className = item
    $(elem).append(img);
    // console.log(img)
  });
  // newPortrait("U", true, 3, resize, slave_id)
  drawPortrait(elem, slave_id, resize, group)
}

function drawPortrait(elem, slave_id, resize, group) {
  // console.log("drawPortrait")

  group = JSON.parse(localStorage.getItem(group) || "[]");
  // console.log(slaves)
  drawslave = group.find(slave => slave.id == slave_id);
  drawslave.image.forEach((item, i) => {
    // console.log(slave.name, item.category)
    // img = document.getElementById(item.category + "_" + slave_id)
    img = document.querySelectorAll(elem + ' #'+item.category+ '_' + slave_id)[0];
    thisone = portrait_data.filter(function(stuff) { return stuff.id == item.id; })
    url = "img/" + item.category + "/"+ thisone[0].sub + "/" + thisone[0].id +".png"
    img.src = url
    // console.log(slave.name, img)
    $(img).data('id', thisone[0].id);
    $(img).css({top: (thisone[0].y-180)/resize, left: (thisone[0].x)/resize, height: thisone[0].height/resize, width: thisone[0].width/resize, display: item.visibility});
  });

  // console.log(slave.image)
}

// function slaveKinksRadar(inspected){
//   var kctx = document.getElementById("slave_kinks_chart").getContext('2d');
//
//   var skills_levels = []
//   inspected.skills.forEach((item, i) => {
//     // console.log(item.name + item.level)
//     skills_levels.push(item.level)
//   });
//   var skills_labels = []
//   inspected.skills.forEach((item, i) => {
//     // console.log(item.name + item.level)
//     skills_labels.push(item.name + ", " + item.level)
//   });
//
//   var kinks_levels = []
//   inspected.kinks.forEach((item, i) => {
//     // console.log(item.name + item.level)
//     kinks_levels.push(item.level)
//   });
//   var kinks_labels = []
//   inspected.kinks.forEach((item, i) => {
//     // console.log(item.name + item.level)
//     kinks_labels.push(item.name + ", " + item.level)
//   });
//
//   var kinkRadarChart = new Chart(kctx, {
//       type: 'radar',
//       data: {
//           labels: kinks_labels,
//           // spanGaps: false,
//           datasets: [{
//               label: "Skills",
//               backgroundColor: 'rgba(255, 99, 132, 0.1)',
//               borderColor: 'rgb(255, 99, 132)',
//               data: skills_levels,
//               // spanGaps: false
//           },
//           {
//               label: "Kinks",
//               backgroundColor: 'rgba(54, 162, 235, 0.1)',
//               borderColor: 'rgba(54, 162, 235, 1)',
//               data: kinks_levels,
//               // spanGaps: false
//           }]
//       },
//       // options: options
//   });
// }
//
// function slaveStatsRadar(inspected){
//   var sctx = document.getElementById("slave_chart").getContext('2d');
//
//   var scales_levels = []
//   inspected.scales.forEach((item, i) => {
//     // console.log(item.name + item.level)
//     scales_levels.push(item.level)
//   });
//   inspected.stats.forEach((item, i) => {
//     // console.log(item.name + item.level)
//     scales_levels.push(item.level)
//   });
//   var scales_labels = []
//   inspected.scales.forEach((item, i) => {
//     // console.log(item.name + item.level)
//     scales_labels.push(item.name + ", " + item.level)
//   });
//   inspected.stats.forEach((item, i) => {
//     // console.log(item.name + item.level)
//     scales_labels.push(item.name + ", " + item.level)
//   });
//   // console.log(scales_levels)
//
//   var options = {
//     scale: {
//         // angleLines: {
//         //     display: false
//         // },
//         ticks: {
//             suggestedMin: -100,
//             suggestedMax: 100
//             }
//         }
//     };
//
//   var slaveRadarChart = new Chart(sctx, {
//       type: 'radar',
//       data: {
//           labels: scales_labels,
//           // spanGaps: false,
//           datasets: [{
//               label: "Slave attributes",
//               backgroundColor: 'rgb(255, 99, 132, 0.1)',
//               borderColor: 'rgb(255, 99, 132)',
//               data: scales_levels,
//               // spanGaps: false
//           }]
//       },
//       // options: options
//   });
// }

// inspect a slave
function inspectSlave(id){
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
    saveButton(slave_id)
    // document.getElementById(slave_id).classList.add("fade-primary");
  });
});

function setThing(id, div_id) {
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
  // console.log(inspected.assignment)
}

function getAssignmentType(a) {
  var type = ""
  if (a == "rest") {
    type = "rest"
  } else if (a == "whore" || a == "serve the household" || "please you") {
    type = "work"
  } else if (a == "work a gloryhole" || a == "public use" || a == "stay confined") {
    type = "punishment"
  } else {
    type = "none"
  }
  return type
}
