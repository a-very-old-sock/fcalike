function showManageEstate() {
  hideAll();
  localStorage.setItem("current_page", "manage_estate")
  $('#facilities_list').empty()
  document.getElementById("manage_tab").classList.remove('hidden')
  printFacilities();
}

function printFacilities() {
  var descriptions = [dorm_descriptions, kitchen_descriptions, security_descriptions, bathhouse_descriptions, garden_descriptions, training_descriptions, library_descriptions, office_descriptions, workshop_descriptions, clinic_descriptions, brothel_descriptions]
  money = Math.floor(localStorage.getItem("money"))
  // console.log(money)
  pc_profession = localStorage.getItem("pc_profession")
  pc_facilities = JSON.parse(localStorage.getItem("pc_facilities"))
  pc_facilities.forEach((item, i) => {
    var item_price = (Math.floor(item.level) * 10000) + 10000 + (money * 0.05) + randomNumber(0,10000)
    if (pc_profession == "military" && item.name == "security") {
      item_price = item_price - (item_price * 0.2)
    } else if (pc_profession == "whore" && item.name == "brothel") {
      item_price = item_price - (item_price * 0.2)
    } else if (pc_profession == "slave" && item.name == "training") {
      item_price = item_price - (item_price * 0.2)
    }
    item_price = Math.floor(item_price)
    $('#facilities_list').append("<div class='col-md-4 mb-3'><div class='card'><div class='card-header'><h5 class='card-title'>" + capitalize(item.name) + "</h5></div><div class='card-body' id='" + item.name + "'></div></div></div>")
    if (item.level < 10 && (item.name == "dormitories" || item.name == "security")) {
      $("#" + item.name).append("<p class='card-text'>" + basic_descriptions[i]+ "</p>")
      $("#" + item.name).append("<p class='card-text'>" + descriptions[i][item.level] + "</p>")
      $("#" + item.name).append("<div class='card-body'><a href='#' onclick='upgradeFacility(" + i + ", " + item_price +")' class='btn btn-primary " + disableBtn(item_price) + "'>Renovate for " + item_price + "</a></div>")
    } else if (item.level < 5) {
      $("#" + item.name).append("<p class='card-text'>" + basic_descriptions[i]+ "</p>")
      $("#" + item.name).append("<p class='card-text'>" + descriptions[i][item.level] + "</p>")
      $("#" + item.name).append("<div class='card-body'><a href='#' onclick='upgradeFacility(" + i + ", "+ item_price +")' class='btn btn-primary " + disableBtn(item_price) + "'>Renovate for " + item_price + "</a></div>")
    } else {
      $("#" + item.name).append("<p class='card-text'>" + descriptions[i][item.level] + "</p>")
      $("#" + item.name).html("<p class='card-text'>" + capitalize(item.name) + " is fully renovated!</p>")
    }
    // $("#" + item.name).append("<p class='card-text'>" + descriptions[i][item.level] + "</p>")
  });
}
//["dormitories", "kitchens", "security", "bathhouse", "gardens", "training", "library", "office", "workshop"]
var basic_descriptions = ["A place to house your slaves.  Renovating your dormitories allows you to house more slaves.  Slaves employed in a job are housed at their place of work and not in the dormitories.", "Renovating your kitchens will allow you to employ more chefs, host parties, and increases your reputation.", "Renovating your security systems allows you to employ guards, makes it harder for your slaves to escape, and improves their obedience, but will also make them fear you more.", "A place to beautify your slaves and entertain your guests.  Renovating your bathhouse will improve your reputation and allow you to employ aestheticians to beautify your slaves.", "Beautifies your estate and produces food for your estate.  Renovating your gardens improves your reputation, makes your slaves healthier, and allows you to employ gardeners.", "A place to teach your slaves obedience, honesty, loyalty, and various skills.  Renovating your training facilities makes teachers more effective and makes training quicker.", "Renovating your library will make your educated slaves more intelligent and improve their job skills, but be careful--it may also make them less obedient and more rebellious!", "A place for your social secretaries and accountants to work.  Renovating the offices on your estate make your secretaries and accountants more efficient.", "A place for your tailors to work.", "Renovating your clinic allows you to employ medics to cure and surgically enhance your slaves.", "A place to put your slaves out to work their assets.  Renovating your brothel improves the prices your slaves can get and the number of customers they can see."]

var dorm_descriptions = ["Your estate currently has five small, narrow beds tucked away in the service areas.", "A ramshakle little building to warehouse up to ten slaves.  Not very attractive.", "An attractive building to house up to fifteen slaves.", "A comfortable set of buildings that house up to twenty slaves.", "A block of small buildings designed to manage up to twenty-five slaves.", "A series of small buildings that manage up to thirty slaves."]
var kitchen_descriptions = ["There's a small, dingy kitchen barely big enough to accommodate your own needs.  You definitely won't be hosting any parties with this kitchen.", "A small, bright kitchen that can employ one chef.  You can host parties, but do you really want to with a kitchen this small?", "A large, well equipped kitchen with all the necessities to host a good party.", "A luxurious, well-stocked kitchen with space for three chefs to prepare for a grand party.", "A kitchen large enough to accommodate any party, if the four chefs can handle it.", "A kitchen so technologically enhanced it hardly needs five chefs."]
var security_descriptions = ["Your estate currently has no security beyond your own chore of locking the door every night.", "Your estate has a moderately high fence and a place to lock away recalcitrant slaves.", "You have a fence now! And a better lock.", "security 3", "security 4", "security 5", "security 6", "security 7", "security 8", "security 9", "A sophisticated AI monitors your slaves, and the predictive algorithm is almost good enough to read their thoughts."]
var bathhouse_descriptions = ["There's no bathhouse to speak of.  Your slaves can clean each other with buckets in the courtyard, which isn't without its own appeals.", "A nice little bathhouse with a single soaking tub.", "A pretty little bathhouse with a spacious soaking tub and a small sauna.", "A beautifully appointed bathhouse to enhance your slaves' charms.", "A grand, spacious bathhouse with comfortable soaking pools and a little grotto.", "A luxurious bathhouse with a pool, waterfalls, and plenty of massage oil."]
var garden_descriptions = ["Do a few flowerpots of weeds in the courtyard count as a garden?", "A neat little vegetable patch that can employ one gardener.", "A reasonable garden for growing flowers and produce.", "A large, ample garden with a petite green house where your three gardeners can grow exotic plants.", "An spacious, fashionable garden with a large greenhouse and conservatory for exotic plants.", "A rambling, enchanted garden filled with flowers, streams, and hidden spots.  It's so extensive, who knows what's there?"]
var training_descriptions = ["There's the empty courtyard for exercise, but not much else.", "A small room with a few whips, paddles, dildos, the usual.", "Is a sybian really necessary for learning? Well, it does make it more fun.", "A fucking bench, a variety of restraints, and every other necessity for a thorough lesson.", "More dildos, better learning.", "Training facilities so advanced, the fucking machine basically runs itself."]
var library_descriptions = ["A few books next to the window are almost like a library.", "A basic set of reference texts, but nothing special.", "A modest little room with a small bookshelf and a comfortable place to read.", "A comfortable library with a grand wall of books.", "A nice place for a nightcap and a cozy read in front of the fireplace.", "A grand library with tall windows, grand views, and also some books."]
var office_descriptions = ["Without an office, you can't employ a secretary or accountant or attend to your own business very well."]
var workshop_descriptions = ["There's nowhere for a tailor to work, so you're somewhat limited in how you can clothe your slaves.", "Your tailor has just enough space to make the basics.", "Two tailors working together can produce moderately sophisticated clothing.", "A bright, clean space for up to three tailors to make more elaborate clothing.", "A space so efficient your four tailors can produce for sale to other estates.", "Your five tailors can make anything you like."]
var clinic_descriptions = ["There's no appropriate space, so there's not much you can do to cure your slaves at home.", "A bare little room isn't really a clinic, but at least it's clean.", "An efficient little space where up to two medics can do basic surgery.", "A clean, modern clinic that can cure basically everything.", "A clinic the envy of even free people--so why aren't your slaves more grateful?", "A bright, efficient center for surgical enhancements."]
var brothel_descriptions = ["Without a brothel attached to your estate, your slaves have to walk the streets to sell themselves and get fucked in back alleys where anything can happen.", "It's not pretty, but it's a place to make sure your slaves don't get abused too badly.", "A few clean beds and some dingy curtains are all a brothel really needs.", "Real walls, doors that close, and moderately clean beds.  That's all the advertisement you need, given the competition.", "A luxurious brothel with soft lighting, warm beds, and good clean fun.", "The fanciest little whorehouse in town."]

function upgradeFacility(facility_index, item_price) {
  pcMoneyChange(item_price * -1)
  $("#money_counter").html("<h2>Money: " + money + "</h2>");

  if (pc_facilities[facility_index].name == "security") {
    pcKindnessChange(-10)
  }
  pc_facilities[facility_index].level += 1
  localStorage.setItem("pc_facilities", JSON.stringify(pc_facilities))
  $("#" + pc_facilities[facility_index].name).prepend("<span class='text-success'>" + pc_facilities[facility_index].name + " renovated!")
  $('#facilities_list').empty()
  printFacilities()
}

function bldgLevel(bldg) {
  buildings = JSON.parse(localStorage.getItem("pc_facilities"))
  bldg_level = buildings.find(function(bldg) {if (bldg.name == bldg) return bldg}).level
  return bldgLevel
}

function facilityMaker(name, level) {
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
  facilities.forEach((item, i) => {
    var NewFacility = facilityMaker(item, 0)
    pc_facilities.push(new NewFacility)
  });
  localStorage.setItem("pc_facilities", JSON.stringify(pc_facilities))
  // console.log(pc_facilities)
}
