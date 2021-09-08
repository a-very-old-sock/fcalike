function hideAll() {
  var tabs = document.getElementsByClassName("tab");
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].classList.add("hidden");
  }
  clearShowSlave()
};

// hide and show different tabs on refresh
document.addEventListener('DOMContentLoaded', function() {
  if (week == 0) {
    document.getElementById("first_week").classList.remove("hidden");
  } else if (current_page == "buy_tab") {
    hideAll();
    document.getElementById("buy_tab").classList.remove("hidden");
    showBuyPage();
  } else if (current_page == "money_tab") {
    hideAll();
    document.getElementById("money_tab").classList.remove("hidden");
    showMoneyPage();
  } else if (current_page == "home") {
    hideAll();
    document.getElementById("home").classList.remove("hidden");
    showHomePage();
  } else if (current_page == "view_slave") {
    hideAll();
    current_slave_id = localStorage.getItem("current_slave_id");
    document.getElementById("view_slave").classList.remove("hidden");
    viewSlave(current_slave_id);
  } else if (current_page == "rules_manager") {
    document.getElementById("rules_manager").classList.remove("hidden");
    showRulesManager();
  } else if (current_page=="manage_estate") {
    document.getElementById("manage_tab").classList.remove("hidden");
    showManageEstate();
  } else {
    document.getElementById("next_week").classList.remove("hidden");
  }
  // alert("Ready!");
}, false);

// click the go home button to start the game
$(document).ready(function() {
  $("#go_home").click(function(){
    var pcName = $.trim( $('#PCName').val() );
    if(pcName == "") {
      pcName = "Anon";
    } else {
      pcName = $.trim( $('#PCName').val() );
    }
    localStorage.setItem("pcName", pcName)

    var pcTitle = $.trim( $('#PCTitle').val() );
    if(pcTitle == "") {
      pcTitle = "Master";
    } else {
      pcTitle = $.trim( $('#PCTitle').val() );
    }
    localStorage.setItem("pcTitle", pcTitle)

    var pcGender = $('input[name=PCPronouns]:checked').val();
    var pcAge = $('input[name=PCAge]:checked').val();
    if (pcAge == "young") {
      var pc_stamina = 100;
      var action_pts = 25;
      reputation -= 50;
    } else if (pcAge == "old") {
      var pc_stamina = 20;
      var action_pts = 5;
      pc_int += 10;
      reputation += 50
    } else {
      var pc_stamina = 60;
      var action_pts = 15;
    }
    localStorage.setItem("pc_stamina", pc_stamina)
    localStorage.setItem("action_pts", action_pts)

    var pcProfession = $('input[name=PCProfession]:checked').val();
    if (pcProfession == "dilettante") {
      money += 10000;
      pc_luck += 50;
    } else if (pcProfession == "celebrity") {
      reputation += 1000;
      pc_luck += 10;
    } else if (pcProfession == "tech") {
      money += 5000
      pc_int += 10;
    } else if (pcProfession == "banker") {

    } else if (pcProfession == "whore") {
      reputation -= 100
      pc_luck += 20;
    } else if (pcProfession == "slave") {
      reputation -= 1000
      pc_kindness += 50
      pc_int += 10;
      pc_luck += 10;
      xp += 100;
    } else if (pcProfession == "military") {
      pc_kindness -= 50
    } else if (pcProfession == "scholar") {
      pc_int += 50
    } else {
      pcProfession = "scholar"
      pc_int += 50
    }
    localStorage.setItem("pcProfession", pcProfession)
    localStorage.setItem("pc_int", pc_int)
    localStorage.setItem("pc_kindness", pc_kindness)
    localStorage.setItem("pc_luck", pc_luck)
    localStorage.setItem("xp", xp)

    var pc_hasDick = $('input[id=pc_hasDick]:checked').val();
    localStorage.setItem("pc_hasDick", pc_hasDick)
    var pc_hasBreasts = $('input[id=pc_hasBreasts]:checked').val();
    localStorage.setItem("pc_hasBreasts", pc_hasBreasts)
    var pc_hasVagina = $('input[id=pc_hasVagina]:checked').val();
    localStorage.setItem("pc_hasVagina", pc_hasVagina)

    var pc_Attitude = $('input[name=PCAttitude]:checked').val();
    pc_kindness += pc_Attitude
    if (pc_kindness > 100) {
      pc_kindness = 100
    } else if (pc_kindness < -100) {
      pc_kindness = -100
    }
    week += 1;
    var start = true;
    // console.log(week);
    localStorage.setItem("pcGender", pcGender);
    localStorage.setItem("pcName", pcName);
    localStorage.setItem("pcProfession", pcProfession);
    localStorage.setItem("week", week);
    localStorage.setItem("money", money);
    localStorage.setItem("reputation", reputation);
    localStorage.setItem("start", start);
    localStorage.setItem("beds", beds);
    localStorage.setItem("current_page", "home");
    localStorage.setItem("rules", rules)
    location.reload(true);
  });

});

$(document).ready(function() {
  $("#manage").click(function() {
    showManageEstate();
  })
});

// click the "Shop" button
$(document).ready(function() {
  $("#shop").click(function(){
    // console.log("Shop!");
    showBuyPage();
  });
});

$(document).ready(function() {
  $("#keep_shopping").click(function(){
    // console.log("Shop!");
    showBuyPage();
    localStorage.setItem("available", "")
  });
});

$(document).ready(function() {
  $("#money_counter").click(function(){
    // console.log("Shop!");
    location.reload(true);
    showMoneyPage();
  });
});

// click Rules manager
$(document).ready(function() {
  $("#rules").click(function() {
    showRulesManager();
  })
});

// click the end week button
$(document).ready(function() {
  $("#end_week").click(function(){
    endWeek();
  });
  localStorage.setItem("available", "")
});

// click Previous slave
$(document).ready(function() {
  $("#previous_slave").click(function(){
    var slaves = JSON.parse(localStorage.getItem("slaves") || "[]");
    current_slave_id = localStorage.getItem("current_slave_id")
    // var current_slave = these_ones.find(slave => slave.id == current_slave_id);
    var c_index = slaves.findIndex(slave => slave.id == current_slave_id);
    if (c_index > 0) {
      var previous = c_index - 1;
    } else {
      var previous = slaves.length - 1
    }
    // console.log("previous index: " + previous)
    var previous_slave = slaves[previous]
    // console.log(previous_slave.living)
    viewSlave(previous_slave.id);
  });
});

// click Next slave
$(document).ready(function() {
  $("#next_slave").click(function(){
    var slaves = JSON.parse(localStorage.getItem("slaves") || "[]");
    current_slave_id = localStorage.getItem("current_slave_id")
    // var current_slave = these_ones.find(slave => slave.id == current_slave_id);
    var c_index = slaves.findIndex(slave => slave.id == current_slave_id);
    // console.log(c_index)
    if (c_index == slaves.length - 1) {
      var next = 0;
    } else {
      var next = c_index + 1
    }
    // console.log("next index: " + next)
    var next_slave = slaves[next]
    // console.log(next_slave)
    viewSlave(next_slave.id);
  });
});

// click the shop button
function showBuyPage() {
  hideAll()
  // hide the main div and show the buy div
  document.getElementById("buy_tab").classList.remove("hidden");
  $("#shop_name").html("");
  $("#buy_slave_list").empty();
  $("#buy_slave_list").append("<table class='table'><thead><th>Shop</th><th></th></thead><tbody id='buy_list_start'></tbody></table>");
  shops.forEach((shop, i) => {
    $("#buy_list_start").append("<tr><td><button id='btn-" + shop.id + "' onclick='visitShop("+ shop.id + ")' type='button' class='btn btn-sm " + shop_btns[i] + "'>" + shop.name + "</td><td>" + shop.tag + "</td></tr>");
  });
};

// click the "Home" button
$(document).ready(function() {
  $(".home").click(function(){
    showHomePage();
  });
  localStorage.setItem("available", "")
});

// click the "Home" button
$(document).ready(function() {
  $("#home").click(function(){
    showHomePage();
  });
  localStorage.setItem("available", "")
});

function showHomePage() {
  // hide the main div and show the home div
  hideAll();
  // location.reload(true);
  document.getElementById("next_week").classList.remove("hidden");
  homeTableHead();
  slaves = JSON.parse(localStorage.getItem("slaves") || "[]");
  listAllSlaves(slaves);
  var current_page = "home";
  localStorage.setItem("current_page", current_page);
};

function showMoneyPage() {
  // hide the main div and show the money div
  hideAll();
  document.getElementById("money_tab").classList.remove("hidden");
  var current_page = "money_tab";
  localStorage.setItem("current_page", current_page);
  showSlaveSaleList()
};

function clearShowSlave() {
  // console.log("clear!")
  var ids = ["slave_details", "slave_stats", "slave_scales", "slave_jobs", "slave_skills", "slave_kinks", "slave_history"]
  var dropdowns = ["slave_assignment"]
  ids.forEach((id, i) => {
    // console.log("clear " + id + "!")
    $('#'+id).empty();
  });
  removeOptions(document.getElementById('clothing'))
  removeOptions(document.getElementById('collar'))
  // $(".save_slave").classList.add("btn-primary");
  var save_button = document.getElementsByClassName('save_slave')
  save_button[0].classList.remove("fade-success");
}

function removeOptions(selectElement) {
   var i, L = selectElement.options.length - 1;
   for(i = L; i >= 0; i--) {
      selectElement.remove(i);
   }
}

function saveButton(div_id) {
  document.getElementById(div_id).classList.remove("btn-primary");
  document.getElementById(div_id).classList.add("fade-success");
  setTimeout(function(){
    document.getElementById(div_id).classList.remove("fade-success")
    // console.log("remove fade")
  }, 1000)
  setTimeout(function(){document.getElementById(div_id).classList.add("btn-primary")}, 1000)
}
