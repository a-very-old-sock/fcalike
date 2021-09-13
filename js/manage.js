function showManageEstate() {
  console.log(getFuncName())
  hideAll();
  localStorage.setItem("current_page", "manage_estate")
  $('#facilities_list').empty()
  document.getElementById("manage_tab").classList.remove('hidden')
  printFacilities();
  playerManageButtons();
}

function playerManageButtons() {
  console.log(getFuncName())
  $("#player_manage_buttons").empty()
  action = parseInt(localStorage.getItem("action_pts"))
  luck = parseInt(localStorage.getItem("pc_luck"))
  stamina = parseInt(localStorage.getItem("pc_stamina"))
  int = parseInt(localStorage.getItem("pc_int"))
  $("#player_manage_buttons").append('<ul class="center list-group list-group-horizontal mx-auto"><li class="list-group-item">Stamina: ' + stamina + '</li><li class="list-group-item">Action points: ' + action + '</li><li class="list-group-item">Intelligence: ' + int + '</li><li class="list-group-item">Luck: ' + luck + '</li></ul>')
  $("#player_manage_buttons").append('<br/>')
  if (action >= 5) {
    five_pt_buttons.forEach((item, i) => {
      truth_array = []
      item.prereqs.forEach((prereq, i) => {
        if (eval(prereq)) {
          truth_array.push(prereq)
        }
      });
      if (truth_array.every(Boolean)) {
        $("#player_manage_buttons").append("<button type='button' class='btn btn-info' onclick='fivePtAction(" + item.id + ")'>" + item.text + "</button>")
      }
    });
  } else {
    $("#player_manage_buttons").append("<p>You're too tired this week to attend to your own affairs.</p>")
  }
}

function fivePtAction(id) {
  console.log(getFuncName())
  pts = parseInt(localStorage.getItem("action_pts"))
  localStorage.setItem("action_pts", action - 5)
  thing = five_pt_buttons.find(function(thing) {if (thing.id == id) return thing})
  thing.effects.forEach((effect, i) => {
    eval(effect)
  });
  $("#player_manage_results").append("<p>" + getRandom(thing.results) + "</p>")
  playerManageButtons()
}

var five_pt_buttons = [{"id": 1, "text": "Exercise (raise stamina)", "effects": ["pcStatChange(1, 'pc_stamina')"], "prereqs": ["pc_stamina < 100"], "results": ["After a hard workout, you feel tired but stronger."]}, {"id": 2, "text": "Study (raise intelligence)", "effects": ["pcStatChange(1, 'pc_int')"], "prereqs": ["pc_int < 100"], "results": ["After long hours of study, you feel better prepared to manage your business and your slaves."]}, {"id": 3, "text": "Gamble (raise luck, cost §500)", "effects": ["pcStatChange(1, 'pc_luck')", "pcMoneyChange(-500)", "pcRepChange(-10)", "pcMoneyChange(randomNumber(-100,5000) + luck)"], "prereqs": ["pc_luck < 100", "money >= 500"], "results": ["After a long night of gambling, you feel a bit more spring in your step."]}]

function pcStatChange(amount, stat) {
  console.log(getFuncName())
  prev = parseInt(localStorage.getItem(stat))
  newamt = prev += amount
  if (newamt > 100) {
    newamt = 100
  } else if (newamt < -100) {
    newamt = -100
  }
  localStorage.setItem(stat, newamt)
}

function printFacilities() {
  console.log(getFuncName())
  $("#bed-count").empty()
  $("#bed-count").append("<h5>" + (beds - slaves.length) + " beds open, " + beds + " beds total</h5>")
  var descriptions = [dorm_descriptions, kitchen_descriptions, security_descriptions, bathhouse_descriptions, garden_descriptions, training_descriptions, library_descriptions, office_descriptions, workshop_descriptions, clinic_descriptions, brothel_descriptions]
  money = Math.floor(localStorage.getItem("money"))
  luck = Math.floor(localStorage.getItem("pc_luck"))
  // console.log(money)
  pc_profession = localStorage.getItem("pc_profession")
  pc_facilities = JSON.parse(localStorage.getItem("pc_facilities"))
  pc_facilities.forEach((item, i) => {
    var item_price = (Math.floor(item.level) * 5000) + 1000 - randomNumber(0,luck) + (randomNumber(-500,500))
    if (pc_profession == "military" && item.name == "guardhouse") {
      item_price = item_price - (item_price * 0.2)
    } else if (pc_profession == "whore" && item.name == "brothel") {
      item_price = item_price - (item_price * 0.2)
    } else if (pc_profession == "slave" && item.name == "training room") {
      item_price = item_price - (item_price * 0.2)
    } else if (pc_profession == "scholar" && item.name == "library") {
      item_price = item_price - (item_price * 0.2)
    }
    item_price = Math.floor(item_price)
    $('#facilities_list').append("<div class='col-md-4 mb-3'><div class='card'><div class='card-header'><h5 class='card-title'>" + capitalize(item.name) + " Level " + item.level + "</h5></div><div class='card-body' id='" + item.name.replaceAll(' ', '_') + "'></div></div></div>")
    if (item.level < 5) {
      $("#" + item.name.replaceAll(' ', '_')).append("<p class='card-text'>" + basic_descriptions[i]+ "</p>")
      $("#" + item.name.replaceAll(' ', '_')).append("<p class='card-text'>" + descriptions[i][item.level] + "</p>")
      $("#" + item.name.replaceAll(' ', '_')).append("<div class='card-body'><a href='#' onclick='upgradeFacility(" + i + ", "+ item_price +")' class='btn btn-primary " + disableBtn(item_price) + "'>Renovate for " + item_price + "</a></div>")
    } else {
      $("#" + item.name.replaceAll(' ', '_')).append("<p class='card-text'>" + descriptions[i][item.level] + "</p>")
      $("#" + item.name.replaceAll(' ', '_')).html("<p class='card-text'>" + capitalize(item.name) + " is fully renovated!</p>")
    }
    // $("#" + item.name).append("<p class='card-text'>" + descriptions[i][item.level] + "</p>")
  });
}
//["dormitories", "kitchens", "guardhouse", "bathhouse", "gardens", "training room", "library", "office", "workshop"]
var basic_descriptions = ["A place to house your slaves.  Renovating your dormitories allows you to house more slaves and overcrowding will make your slaves ill.", "Renovating your kitchens will allow you to employ more chefs, host parties, and increases your reputation.", "Renovating your guardhouse and security systems allows you to employ guards, makes it harder for your slaves to escape, and improves their obedience, but will also make them fear you more.", "A place to beautify your slaves and entertain your guests.  Renovating your bathhouse will improve your reputation and allow you to employ aestheticians to beautify your slaves.", "Beautifies your estate and produces food for your estate.  Renovating your gardens improves your reputation, makes your slaves healthier, and allows you to employ gardeners.", "A place to teach your slaves obedience, honesty, loyalty, and various skills.  Renovating your training facilities makes teachers more effective and makes training quicker.", "Renovating your library will make your educated slaves more intelligent and gives your secretaries a place to work, but be careful--it may also make them less obedient and more rebellious!", "A place for your accountants to work.  Renovating the offices on your estate make your accountants more efficient.", "A place for your tailors to work.", "Renovating your clinic allows you to employ medics to cure and surgically enhance your slaves.", "A place to put your slaves out to work their assets.  Renovating your brothel improves the prices your slaves can get and the number of customers they can see."]

var dorm_descriptions = ["Your estate currently has <strong>five</strong> small, narrow beds tucked away in the service areas.", "A ramshakle little building to warehouse up to ten slaves.  Not very attractive.", "An attractive building to house up to fifteen slaves.", "A comfortable set of buildings that house up to twenty slaves.", "A block of small buildings designed to house up to twenty-five slaves.", "A series of small buildings that house up to thirty slaves."]
var kitchen_descriptions = ["There's a small, dingy kitchen barely big enough to accommodate your own needs.  You definitely won't be hosting any parties with this kitchen.", "A small, bright kitchen with just enough space for the basics.  You can host parties, but do you really want to with a kitchen this small?", "A large, well equipped kitchen with all the necessities to host a good party.", "A luxurious, well-stocked kitchen with space for your chefs to prepare for a grand party.", "A kitchen large enough to accommodate any party, if the chefs can handle it.", "A kitchen so technologically enhanced it hardly needs a chef at all."]
var security_descriptions = ["Your estate currently has no security beyond your own chore of locking the door every night.", "You have a fence now! And a better lock.", "Your estate has a moderately high fence and a place to lock away recalcitrant slaves.", "Your guards patrol your estate night and day, watching for any escape attempts.", "A bank of video monitors and sensitive alarms help your guards watch over your estate", "A sophisticated AI monitors your slaves, and the predictive algorithm is almost good enough to read their thoughts."]
var bathhouse_descriptions = ["There's no bathhouse to speak of.  Your slaves can clean each other with buckets in the courtyard, which isn't without its own appeals.", "A nice little bathhouse with a single soaking tub.", "A pretty little bathhouse with a spacious soaking tub and a small sauna.", "A beautifully appointed bathhouse to enhance your slaves' charms.", "A grand, spacious bathhouse with comfortable soaking pools and a little grotto.", "A luxurious bathhouse with a pool, waterfalls, and plenty of massage oil."]
var garden_descriptions = ["Do a few flowerpots of weeds in the courtyard count as a garden?", "A neat little vegetable patch that can employ one gardener.", "A reasonable garden for growing flowers and produce.", "A large, ample garden with a petite green house where your three gardeners can grow exotic plants.", "A spacious, fashionable garden with a large greenhouse and conservatory for exotic plants.", "A rambling, enchanted garden filled with flowers, streams, and hidden spots.  It's so extensive, who knows what's there?"]
var training_descriptions = ["There's the empty courtyard for exercise, but not much else.", "A small room with a few whips, paddles, dildos--the usual.", "Is a sybian really necessary for learning? Well, it does make it more fun.", "A fucking bench, a variety of restraints, and every other necessity for a thorough lesson.", "More dildos, better learning.", "Training facilities so advanced, the fucking machine basically runs itself."]
var library_descriptions = ["A few books next to the window are almost like a library.  Without a library, you can't employ a secretary.", "A basic set of reference texts, but nothing special.", "A modest little room with a small bookshelf and a comfortable place to read.", "A comfortable library with a grand wall of books.", "A nice place for a nightcap and a cozy read in front of the fireplace.", "A grand library with tall windows, grand views, and also some books."]
var office_descriptions = ["Without an office, you can't employ an accountant or attend to your own business very well.", "A little desk next to a window with just enough space to work.", "A couple of comfortable desks and file cabinets, just enough to get the job done.", "A bright, busy workspace that makes you feel productive just stepping into it.", "A few basic computers are all you need for a little tax fraud.", "Advanced computers with sophisticated algorithms that may know more about you than you know about yourself."]
var workshop_descriptions = ["There's nowhere for a tailor to work, so you're somewhat limited in how you can clothe your slaves.", "Your tailor has just enough space to make the basics.", "Tailors working here can produce moderately sophisticated clothing.", "A bright, clean space for tailors to make more elaborate clothing.", "A space so efficient your tailors can produce for sale to other estates.", "Your tailors can make anything you like."]
var clinic_descriptions = ["There's no appropriate space, so there's not much you can do to cure your slaves at home.", "A bare little room isn't really a clinic, but at least it's clean.", "An efficient little space where medics can do basic surgery.", "A clean, modern clinic that can cure basically everything.", "A clinic the envy of even free people--so why aren't your slaves more grateful?", "A bright, efficient center for surgical enhancements."]
var brothel_descriptions = ["Without a brothel attached to your estate, your slaves have to walk the streets to sell themselves and get fucked in back alleys where anything can happen.", "It's not pretty, but it's a place to make sure your slaves don't get abused too badly.", "A few clean beds and some dingy curtains are all a brothel really needs.", "Real walls, doors that close, and moderately clean beds.  That's all the advertisement you need, given the competition.", "A luxurious brothel with soft lighting, warm beds, and good clean fun.", "The fanciest little whorehouse in town."]

function upgradeFacility(facility_index, item_price) {
  console.log(getFuncName())
  pcMoneyChange(item_price * -1)
  $("#money_counter").html("Money: " + money);

  if (pc_facilities[facility_index].name == "guardhouse") {
    pcKindnessChange(-10)
  }
  pc_facilities[facility_index].level += 1
  localStorage.setItem("pc_facilities", JSON.stringify(pc_facilities))
  $("#" + pc_facilities[facility_index].name).prepend("<span class='text-success'>" + pc_facilities[facility_index].name + " renovated!")
  $('#facilities_list').empty()
  printFacilities()
  var show_facilities_menu = true
  localStorage.setItem("show_facilities_menu", true)
}

function bldgLevel(bldg) {
  console.log(getFuncName())
  buildings = JSON.parse(localStorage.getItem("pc_facilities"))
  console.log(bldg)
  bldg_level = parseInt(buildings.find(function(thing) {if (thing.name == bldg) return thing}).level) || 0
  return bldg_level
}

function facilityMaker(name, level) {
  console.log(getFuncName())
  var fac_constructor = function Facility(){
    this.name = Facility.defaultName;
    this.level = Facility.defaultLevel;
  };

  fac_constructor.defaultName = name;
  fac_constructor.defaultLevel = level;
  // console.log(stat_constructor)
  return fac_constructor;
  // console.log(stat_constructor.defaultLevel);
};

function makeFacilities() {
  console.log(getFuncName())
  facilities.forEach((item, i) => {
    var NewFacility = facilityMaker(item, 0)
    pc_facilities.push(new NewFacility)
  });
  localStorage.setItem("pc_facilities", JSON.stringify(pc_facilities))
  // console.log(pc_facilities)
}
