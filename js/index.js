var start = localStorage.getItem("start");
// $.i18n( {
//     locale: 'en' // Locale is English
// } );

// init variables or get saved game data from localStorage
if (!start) {
  var show_facilities_menu = false;
  var week = 0;
  var money = 10000;
  var reputation = 0;
  var current_page = "home";
  var slaves = [];
  var end_of_week_report = [];
  var former_slaves = [];
  var index_record = [];
  var xp = 0;
  var pc_int = 0;
  var pc_stamina = 0;
  var action_pts = 0;
  var pc_kindness = 0;
  var pc_luck = 0;
  var pc_hasDick = true;
  var pc_hasVagina = false;
  var pc_hasBreasts = false;
  var beds = 5;
  var rules = [];
  var pc_facilities = []
  makeFacilities();
  // var shop_counter = 0;
} else {
  var week = localStorage.getItem("week");
  var beds = localStorage.getItem("beds");
  var money = localStorage.getItem("money");
  var reputation = localStorage.getItem("reputation");
  var pcName = localStorage.getItem("pcName");
  var current_page = localStorage.getItem("current_page");
  var xp = localStorage.getItem("xp");
  var pc_int = localStorage.getItem("pc_int");
  var pc_stamina = localStorage.getItem("pc_stamina");
  var action_pts = localStorage.getItem("action_pts");
  var pc_kindness = localStorage.getItem("pc_kindness");
  var pc_luck = localStorage.getItem("pc_luck")
  var slaves = localStorage.getItem("slaves");
  slaves = (slaves) ? JSON.parse(slaves) : [];
  var former_slaves = localStorage.getItem("former_slaves");
  former_slaves = (former_slaves) ? JSON.parse(former_slaves) : [];
  var pc_facilities = localStorage.getItem("pc_facilities");
  pc_facilities = (pc_facilities) ? JSON.parse(pc_facilities) : [];
  if (pc_facilities.length == 0) {
    makeFacilities()
  }
  var income_record = localStorage.getItem("income_record");
  income_record = (income_record) ? JSON.parse(income_record) : [];
  var end_of_week_report = localStorage.getItem("end_of_week_report");
  end_of_week_report = (end_of_week_report) ? JSON.parse(end_of_week_report) : [];
  // var shop_counter = 0;
}

// populate header stats
var week_div = $("#week_counter").html("Week: " + week);
var money_div = $("#money_counter").html("Money: " + money);
var reputation_div = $("#reputation_counter").html("Reputation: " + reputation);
var slaves_div = $("#slave_counter").html("Slaves: " + slaves.length);
var debug_div = $("#debug").html("<small><h6>Debug block</h6><ul><li>PC XP:"+ xp +"</li><li>PC Int:"+ pc_int +"</li><li>PC Stamina:"+ pc_stamina +"</li><li>PC Action:"+ action_pts +"</li><li>PC Kindness:"+ pc_kindness +"</li><li>PC Luck:"+ pc_luck +"</li></ul></small>");
