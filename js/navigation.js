function hideAll() {
  console.log(getFuncName())
  var tabs = document.getElementsByClassName("tab");
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].classList.add("hidden");
  }
  clearShowSlave();
  $("#facilities_menu").empty()
  clear = ["#slave_list", "#buy_slave_list", "#bathhouse_list", "#slave_bathhouse_list", "#salon_slave_name", "#salon_slave_bust", "#slave_bust", "#guardhouse_slave_bust", "#guardhouse_list", "#slave_guardhouse_list", "#guardhouse_interact_buttons", "#guardhouse_interact_log", "#view_interact_buttons"]
  clear.forEach((item, i) => {
    $(item).empty()
  });

  pf = [{"name": "kitchens", "fnc": "showSorry()"}, {"name": "guardhouse", "fnc": "showGuardhouse()"}, {"name": "bathhouse", "fnc": "showBathhouse()"}, {"name": "gardens", "fnc": "showSorry()"}, {"name": "training room", "fnc": "showSorry()"}, {"name": "library", "fnc": "showSorry()"}, {"name": "office", "fnc": "showSorry()"}, {"name": "workshop", "fnc": "showSorry()"}, {"name": "clinic", "fnc": "showSorry()"}, {"name": "brothel", "fnc": "showSorry()"}]
  show_facilities_menu = localStorage.getItem("show_facilities_menu") || false
  if (show_facilities_menu) {
    pf.forEach((bldg, i) => {
      if (bldgLevel(bldg.name) >= 1) {
        $("#facilities_menu").append('<h6><li class="nav-item"><a class="nav-link" id="' + bldg.name + '_link" href="#" onclick="' + bldg.fnc +'"><h6>' + capitalize(bldg.name) + '</h6></a></li>')
      }
    });
  }
};

function showSorry() {
  alert("Sorry, that part of the game hasn't been built yet!")
}

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
  } else if (current_page == "bathhouse_tab") {
    document.getElementById("bathhouse_tab").classList.remove("hidden");
    showBathhouse();
  } else if (current_page == "guardhouse_tab") {
    document.getElementById("guardhouse_tab").classList.remove("hidden");
    showGuardhouse();
  } else if (current_page == "view_slave_salon") {
    hideAll();
    document.getElementById("bathhouse_tab").classList.remove("hidden");
    current_slave_id = localStorage.getItem("current_slave_id");
    viewSlaveSalon(current_slave_id);
  } else if (current_page == "view_punish") {
    hideAll();
    document.getElementById("guardhouse_tab").classList.remove("hidden");
    current_slave_id = localStorage.getItem("current_slave_id");
    viewPunish(current_slave_id);
  } else if (current_page == "about") {
    document.getElementById("about_tab").classList.remove("hidden");
    showAbout();
  } else if (current_page == "wiki") {
    document.getElementById("wiki_tab").classList.remove("hidden");
    showWiki();
  } else {
    document.getElementById("next_week").classList.remove("hidden");
  }
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
    if (pcGender === undefined) {
      pcGender = "male"
    }
    var pcAge = $('input[name=PCAge]:checked').val();
    if (pcAge == "young") {
      var pc_stamina = 100;
      var action_pts = 25;
      reputation -= 20;
    } else if (pcAge == "old") {
      var pc_stamina = 20;
      var action_pts = 5;
      pc_int += 10;
      reputation += 20
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
      reputation += 50;
      pc_luck += 10;
    } else if (pcProfession == "tech") {
      money += 5000
      pc_int += 10;
    } else if (pcProfession == "banker") {

    } else if (pcProfession == "whore") {
      reputation -= 20
      pc_luck += 20;
    } else if (pcProfession == "slave") {
      reputation -= 50
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

    var pc_hasDick = $('#pc_hasDick').is(":checked");
    localStorage.setItem("pc_hasDick", pc_hasDick)
    var pc_hasBreasts = $('#pc_hasBreasts').is(":checked");
    localStorage.setItem("pc_hasBreasts", pc_hasBreasts)
    var pc_hasVagina = $('#pc_hasVagina').is(":checked");
    localStorage.setItem("pc_hasVagina", pc_hasVagina)
    if (pc_hasVagina === undefined && pc_hasDick === undefined) {
      pc_hasDick = true
      localStorage.setItem("pc_hasDick", true)
    }

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
    console.log("pcjunk", pcGender, pc_hasDick, pc_hasVagina, pc_hasBreasts)
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
    showBuyPage();
  });
});

$(document).ready(function() {
  $("#keep_shopping").click(function(){
    showBuyPage();
    localStorage.setItem("available", "")
  });
});

$(document).ready(function() {
  $("#money_counter").click(function(){
    location.reload(true);
    showMoneyPage();
  });
});

$(document).ready(function() {
  $("#about").click(function(){
    location.reload(true);
    showAbout();
  });
});

$(document).ready(function() {
  $("#wiki").click(function(){
    location.reload(true);
    showWiki();
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
    var c_index = slaves.findIndex(slave => slave.id == current_slave_id);
    if (c_index == slaves.length - 1) {
      var next = 0;
    } else {
      var next = c_index + 1
    }
    var next_slave = slaves[next]
    viewSlave(next_slave.id);
  });
});

// click the shop button
function showBuyPage() {
  console.log(getFuncName())
  hideAll()
  document.getElementById("buy_tab").classList.remove("hidden");
  $("#shop_name").html("");
  $("#buy_slave_list").empty();
  $("#buy_slave_list").append("<table class='table'><thead><th>Shop</th><th></th></thead><tbody id='buy_list_start'></tbody></table>");
  rep = parseInt(localStorage.getItem("reputation"))
  shops.forEach((shop, i) => {
    if (rep >= parseInt(shop.rep)) {
      $("#buy_list_start").append("<tr><td><button id='btn-" + shop.id + "' onclick='visitShop("+ shop.id + ")' type='button' class='btn btn-sm " + shop_btns[i] + "'>" + shop.name + "</td><td>" + shop.tag + "</td></tr>");
    }
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
  console.log(getFuncName())
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

function showAbout() {
  console.log(getFuncName())
  // hide the main div and show the home div
  hideAll();
  // location.reload(true);
  document.getElementById("about_tab").classList.remove("hidden");
  localStorage.setItem("current_page", "about");
}

function showWiki() {
  console.log(getFuncName())
  // hide the main div and show the home div
  hideAll();
  // location.reload(true);
  document.getElementById("wiki_tab").classList.remove("hidden");
  localStorage.setItem("current_page", "wiki");
  makeWiki();
}

function showMoneyPage() {
  console.log(getFuncName())
  // hide the main div and show the money div
  hideAll();
  document.getElementById("money_tab").classList.remove("hidden");
  var current_page = "money_tab";
  localStorage.setItem("current_page", current_page);
  showSlaveSaleList()
};

function showGuardhouse() {
  console.log(getFuncName())
  hideAll();
  $("#guardhouse_list").empty()
  $("#slave_guardhouse_list").empty()
  document.getElementById("guardhouse_tab").classList.remove("hidden");
  var current_page = "guardhouse_tab";
  localStorage.setItem("current_page", current_page);

  attendants = getAttendants("guardhouse")[0]
  others = getAttendants("guardhouse")[1]
  if (attendants.length >= 1) {
    guardhouseAttendantTableHead()
    listAttendantsGuardhouse(attendants)
  } else {
    $("#guardhouse_list").append("You have a very nice guardhouse, but without slaves employed as guards you can't make use of it.  Assign at least one slave to work in the guardhouse to make full use of this facility.")
  }
  guardhouseTableHead()
  listSlavesGuardhouse(others)
};

function showBathhouse() {
  console.log(getFuncName())
  hideAll();
  $("#salon_slave_bust").empty()
  $("#salon_slave_bust").removeClass("bust-2")
  $("#salon_slave_name").empty()
  $("#salon_buttons").addClass("hidden-button")
  $("#bathhouse_list").empty()
  $("#slave_bathhouse_list").empty()
  document.getElementById("bathhouse_tab").classList.remove("hidden");
  var current_page = "bathhouse_tab";
  localStorage.setItem("current_page", current_page);

  attendants = getAttendants("bathhouse")[0]
  others = getAttendants("bathhouse")[1]
  if (attendants.length >= 1) {
    bathhouseAttendantTableHead()
    listAttendantsBathhouse(attendants)
  } else {
    $("#bathhouse_list").append("You have a very nice bathhouse, but without slaves employed as aestheticians you can't make use of it.  Assign at least one slave to work in the bathhouse to make full use of this facility.")
  }
  bathhouseTableHead()
  listslavesBathhouse(others)
};

function getAttendants(bldg) {
  slaves = JSON.parse(localStorage.getItem("slaves"))
  attendants = []
  slaves.forEach((s, i) => {
    if (s.assignment.name == bldg) {
      attendants.push(s)
    }
  });
  others = slaves.filter(x => !attendants.includes(x));
  return [attendants, others]
}

function clearShowSlave() {
  console.log(getFuncName())
  // console.log("clear!")
  var ids = ["slave_details", "slave_stats", "slave_scales", "slave_jobs", "slave_skills", "slave_kinks", "slave_history"]
  var dropdowns = ["slave_assignment"]
  ids.forEach((id, i) => {
    // console.log("clear " + id + "!")
    $('#'+id).empty();
  });
  removeOptions(document.getElementById('clothing'))
  removeOptions(document.getElementById('collar'))
  removeOptions(document.getElementById('assignment'))
  // $(".save_slave").classList.add("btn-primary");
  var save_button = document.getElementsByClassName('save_slave')
  save_button[0].classList.remove("fade-success");
}

function removeOptions(selectElement) {
  console.log(getFuncName())
   var i, L = selectElement.options.length - 1;
   for(i = L; i >= 0; i--) {
      selectElement.remove(i);
   }
}

function saveButton(div_id) {
  console.log(getFuncName())
  document.getElementById(div_id).classList.remove("btn-primary");
  document.getElementById(div_id).classList.add("fade-success");
  setTimeout(function(){
    document.getElementById(div_id).classList.remove("fade-success")
    // console.log("remove fade")
  }, 1000)
  setTimeout(function(){document.getElementById(div_id).classList.add("btn-primary")}, 1000)
}
