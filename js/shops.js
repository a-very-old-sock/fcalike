var shops = [{id: 0, rep: -5000, name: "Bargain Bill's Bargain Woobies", tag: "Tragic backstory guaranteed."}, {id: 2, rep: -5000, name: "Trash Warehouse", tag: "Runaways and other miscellaneous refuse.  One man's trash is another man's treasure?"}, {id: 2, rep: 20, name: "Smart Bitches", tag: "They're not nice, they're not happy to see you, but they are smart."}, {id: 3, rep: 20, name: "Golden Oldies", tag: "So good at their jobs, it almost makes up for how old they are.  If you're into that sort of thing."}, {id: 4, rep: 50, name: "Scratch 'n Dent", tag: "Former gladiators and bodyguards, only a little injured."}, {id: 5, rep: 50, name: "Box of Rocks", tag: "Beautiful and charming, but not good at much."}]

var reputation_shops = [{id: 6, rep: 90, name: "Erotique Exotique", tag: "A bit of adventure."}, {id: 7, rep: 99, name: "Maid to Measure", tag: "Custom order to your exacting specifications."}]

var shop_btns = ["btn-outline-primary", "btn-outline-success", "btn-outline-info", "btn-outline-warning", "btn-outline-danger", "btn-outline-primary", "btn-outline-success", "btn-outline-info", "btn-outline-warning", "btn-outline-danger"]

function visitShop(shop_id) {
  console.log(getFuncName())
  hideAll()
  // hide the main div and show the buy div
  document.getElementById("buy_tab").classList.remove("hidden");
  shop = shops.find(function(shop) {if(shop.id == shop_id) return shop})
  $("#buy_slave_list").empty();
  $("#shop_name").html("<h2>" + shop.name + "</h2>");
  $("#shop_name").append("<h6>"+ shop.tag +"</h6>")
  var el = document.getElementById("keep_shopping");
  el.classList.remove("hidden");
  defaultShop(shop_id)
}

function defaultShop(shop_id) {
  console.log(getFuncName())
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

  // bill: 0, finder's: 1, smart: 2, old: 3, scratch: 4, dumb: 5
  // ["Intelligence", "Charisma", "Strength"]
  // ["Obedience", "Love", "Loyalty", "Honesty", "Health", "Libido", "Happiness"]
  // ["Gardener", "Tailor", "Secretary", "Teacher", "Medic", "Chef", "Whore", "Accountant", "Aesthetician", "Guard"]
  if (shop_id == 0) { // bargain bill's bargain woobies
    available.forEach((slave, i) => {
      setStat(slave, "Health", randomNumber(-99,0))
      setStat(slave, "Happiness", randomNumber(-99,0))
      setStat(slave, "Charisma", randomNumber(50,100))
    });
  }
  if (shop_id == 1) { // runaway trash
    var low = ["Health", "Happiness", "Love", "Loyalty", "Obedience", "Honesty"]
    low.forEach((item, i) => {
      available.forEach((slave, i) => {
        setStat(slave, item, randomNumber(-99,0))
      });
    });
  }
  if (shop_id == 2) { // smart bitches
    var low = ["Happiness", "Love", "Obedience", "Loyalty"]
    var high = ["Intelligence"]
    low.forEach((item, i) => {
      available.forEach((slave, i) => {
        setStat(slave, item, randomNumber(-99,20))
      });
    });
    available.forEach((slave, i) => {
      setStat(slave, "Intelligence", randomNumber(60,100))
      var goodjob = getRandom(slave_jobs)
      setStat(slave, goodjob, randomNumber(70,100))
    });

  }
  if (shop_id == 3) { // golden oldies
    var low = ["Libido", "Health"]
    low.forEach((item, i) => {
      available.forEach((slave, i) => {
        setStat(slave, item, randomNumber(-99,20))
      });
    });
    var high = ["Jobs", "Skills"]
    high.forEach((item, i) => {
      available.forEach((slave, i) => {
        var num_jobs = randomNumber(1,3)
        while (i < num_jobs) {
          var goodjob = getRandom(slave_jobs)
          setStat(slave, goodjob, randomNumber(40,100))
          i++
        }
        var num_skills = randomNumber(1,5)
        while (i < num_skills) {
          var goodskill = getRandom(slave_skills)
          setStat(slave, goodskill, randomNumber(40,100))
          i++
        }
      });
    });
  }
  if (shop_id == 4) { // scratch n dent
    available.forEach((slave, i) => {
      setStat(slave, "Health", randomNumber(-99,0))
      setStat(slave, "Strength", randomNumber(60,100))
      setStat(slave, "Guard", randomNumber(60,100))
      console.log(slave.image)
      thing = slave.image.find(function(thing) {if(thing.category == "mark") return thing})
      thing.visibility = ""
    });
  }
  if (shop_id == 5) { // dumb n pretty
    available.forEach((slave, i) => {
      setStat(slave, "Intelligence", randomNumber(0,10))
      slave.jobs.forEach((item, i) => {
        setStat(slave, item, 0)
      });
      slave.skills.forEach((item, i) => {
        setStat(slave, item, randomNumber(-100,10))
      });
      setStat(slave, "Charisma", randomNumber(70,100))
      thing = slave.image.find(function(thing) {if(thing.category == "mark") return thing})
      thing.visibility = "none"
    });
  }
  available.forEach((slave, i) => {
    calculatePrice(slave)
    slave.charisma_desc = charismaWord(slave)
  });


  // available.forEach((slave, i) => {
  //   check_these = [slave.stats, slave.skills, slave.jobs, slave.kinks]
  //   check_these.forEach((item, i) => {
  //     if (statLevel(slave, item.name) > 100) {
  //       changeStat(slave, item.name, 100)
  //     } else if (statLevel(slave, item.name) < -100) {
  //       changeStat(slave, item.name, -100)
  //     }
  //   });

  // });

  // bill: 0, finder's: 1, smart: 2, old: 3, scratch: 4, dumb: 5
  var shop_price_modifier = 0
  if (shop_id == 0 || shop_id == 3) {
    shop_price_modifier = -0.30
  }
  if (shop_id == 1) {
    shop_price_modifier = -0.90
  }
  if (shop_id == 5) {
    shop_price_modifier = 0.50
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
