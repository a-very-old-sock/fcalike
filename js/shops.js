var shops = [{id: "0", name: "Bargain Bill's Bargain Woobies", tag: "Tragic backstory guaranteed."}, {id: "1", name: "Finder's Keepers", tag: "Runaways and other miscellaneous refuse.  One man's trash is another man's treasure?"}, {id: "2", name: "Smart Bitches", tag: "They're not nice, they're not happy to see you, but they are smart."}, {id: "3", name: "Golden Oldies", tag: "So good at their jobs, it almost makes up for how old they are.  If you're into that sort of thing."}, {id: "4", name: "Scratch 'n Dent", tag: "Former gladiators and bodyguards, only a little injured."}, {id: "5", name: "Box of Rocks", tag: "Beautiful and charming, but not good at much."}]

var reputation_shops = [{id: 6, name: "Erotique Exotique", tag: "A bit of adventure."}, {id: 7, name: "Maid to Measure", tag: "Custom order to your exacting specifications."}]

var shop_btns = ["btn-outline-primary", "btn-outline-success", "btn-outline-info", "btn-outline-warning", "btn-outline-danger", "btn-outline-primary", "btn-outline-success", "btn-outline-info", "btn-outline-warning", "btn-outline-danger"]

function visitShop(shop_id) {
  hideAll()
  // hide the main div and show the buy div
  document.getElementById("buy_tab").classList.remove("hidden");
  shop = shops.find(function(shop) {if(shop.id == shop_id) return shop})
  $("#buy_slave_list").empty();
  $("#shop_name").html("<h1>"+ shop.name +"</h1><small>"+ shop.tag +"</small>");
  var el = document.getElementById("keep_shopping");
  el.classList.remove("hidden");
  defaultShop(shop_id)
}

function defaultShop(shop_id) {
  shopTableHead();

  //make the array
  var n = randomNumber(1,10);
  var available = localStorage.getItem("available")
  if (shop_id == 0 || shop_id == 5) {
    var age = 18
  } else if (shop_id == 3) {
    var age = 50
  } else {
    var age = 25
  }
  // bill: 0, finder's: 1, smart: 2, old: 3, scratch: 4, dumb: 5
  if (shop_id == 0 || shop_id == 1) {
    var known = 30
  } else if (shop_id == 3 || shop_id == 5) {
    var known = -30
  } else {
    var known = 0
  }

  if (available.length > 0) {
    available = JSON.parse(available)
  } else {
    var available = new Array(n);
    function makeSlaves(n) {
      for(var i=0; i<n; ++i) {
        var TemplateSlave = slaveMaker(age, "u", known);
        available[i] = new TemplateSlave;
        calculatePrice(available[i]);
        available[i].charisma_desc = charismaWord(available[i]);
        // console.log(available[i].kinks);
      }
      return available;
    };
    makeSlaves(n);
  }

  if (shop_id == 0) {
    available.forEach((slave, i) => {
      slave.scales.find(function(stat) {if(stat.name == "Health") return stat}).level = randomNumber(-99,0)
      slave.scales.find(function(stat) {if(stat.name == "Happiness") return stat}).level = randomNumber(-99,0)
    });
  }
  if (shop_id == 1) {
    var low = ["Health", "Happiness", "Love", "Loyalty", "Obedience"]
    low.forEach((item, i) => {
      available.forEach((slave, i) => {
        slave.scales.find(function(stat) {if(stat.name == item) return stat}).level = randomNumber(-99,0)
      });
    });
  }
  if (shop_id == 2) {
    var low = ["Happiness", "Love", "Obedience"]
    var high = ["Intelligence"]
    low.forEach((item, i) => {
      available.forEach((slave, i) => {
        slave.scales.find(function(stat) {if(stat.name == item) return stat}).level = randomNumber(-99,20)
      });
    });
    available.forEach((slave, i) => {
      slave.stats.find(function(stat) {if(stat.name == "Intelligence") return stat}).level = randomNumber(60,100)
      var goodjob = getRandom(slave_jobs)
      slave.jobs.find(function(job) {if (job.name == goodjob) return job}).level = randomNumber(60,100)
    });

  }
  if (shop_id == 3) {
    var low = ["Libido", "Health"]
    low.forEach((item, i) => {
      available.forEach((slave, i) => {
        slave.scales.find(function(stat) {if(stat.name == item) return stat}).level = randomNumber(-99,20)
      });
    });
    var high = ["Jobs", "Skills"]
    high.forEach((item, i) => {
      available.forEach((slave, i) => {
        var num_jobs = randomNumber(1,3)
        while (i < num_jobs) {
          var goodjob = getRandom(slave_jobs)
          slave.jobs.find(function(job) {if (job.name == goodjob) return job}).level = randomNumber(40,100)
          i++
        }
        var num_skills = randomNumber(1,5)
        while (i < num_skills) {
          var goodskill = getRandom(slave_skills)
          slave.skills.find(function(skill) {if (skill.name == goodskill) return skill}).level = randomNumber(40,100)
          i++
        }
      });
    });
  }
  if (shop_id == 4) {
    available.forEach((slave, i) => {
      slave.scales.find(function(stat) {if(stat.name == "Health") return stat}).level = randomNumber(-99,0)
      slave.stats.find(function(stat) {if(stat.name == "Strength") return stat}).level = randomNumber(60,100)
    });
  }
  if (shop_id == 4) {
    var low = ["Intelligence", "Jobs", "Skills"]
    available.forEach((slave, i) => {
      slave.stats.find(function(stat) {if(stat.name == "Intelligence") return stat}).level = randomNumber(0,10)
      slave.jobs.forEach((item, i) => {
        item.level = 0
      });
      slave.skills.forEach((item, i) => {
        item.level = randomNumber(-100,10)
      });
      slave.stats.find(function(stat) {if(stat.name == "Charisma") return stat}).level = randomNumber(60,100)
      charismaWord(slave)
    });
  }
  // bill: 0, finder's: 1, smart: 2, old: 3, scratch: 4, dumb: 5
  var shop_price_modifier = 0
  if (shop_id == 0 || shop_id == 3) {
    shop_price_modifier = -0.20
  }
  if (shop_id == 1) {
    shop_price_modifier = -0.50
  }
  if (shop_id == 5) {
    shop_price_modifier = 0.20
  }

  available.forEach((slave, i) => {
    calculatePrice(slave)
    // console.log(slave.name + " " + slave.price)
    slave.price += Math.floor(slave.price * shop_price_modifier)
    // console.log(slave.name + " " + slave.price)
  });
  localStorage.setItem("available", JSON.stringify(available));
  listAllSlavesWithPrice(available);
  var current_page = "buy_tab";
  localStorage.setItem("current_page", current_page);
}
