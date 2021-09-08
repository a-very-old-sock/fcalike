function checkExercise(slave) {
  buildings = JSON.parse(localStorage.getItem("pc_facilities"))
  training_level = buildings.find(function(bldg) {if (bldg.name == "training") return bldg}).level
  if (slave.scales.find(function(stat) {if(stat.name == "Health") return stat}).level > 0) {
    slave.stats.find(function(stat) {if(stat.name == "Strength") return stat}).level += 5 + training_level
    slave.end_of_week_report.push(slave.name + " exercised this week and grew stronger.")
  } else {
    slave.scales.find(function(stat) {if(stat.name == "Health") return stat}).level -= 2
    slave.end_of_week_report.push(slave.name + " exercised this week but grew sicker due to their poor health.")
  }
}

function checkWhoring(slave) {
  // console.log(slave.name + " whore!")
  buildings = JSON.parse(localStorage.getItem("pc_facilities"))
  brothel_level = buildings.find(function(bldg) {if (bldg.name == "brothel") return bldg}).level
  var customers = randomNumber(0, 5) + Math.floor((slave.stats.find(function(stat) {if(stat.name == "Charisma") return stat}).level / 20)) + brothel_level
  var skillz = 0
  slave.skills.forEach((skill, i) => {
    if (skill.known == true) {
      skillz += skill.level
      flip = randomNumber(1,5)
      if (flip == 1) {
        skill.level += randomNumber(0,customers)
      }
    } else {
      flip = randomNumber(1,5)
      if (flip == 1) {
        skill.known = true
        slave.end_of_week_report.push("While whoring this week " + slave.name + " <span class='success'>demonstrated their skill in " + lowercase(skill.name) + "</span>.")
      } else if (flip == 2) {
        skill.level += randomNumber(0,customers)
      }
    }
  });

  skillz_array = []
  slave.skills.forEach((skill, i) => {
    if (skill.known == true) {
      skillz_array.push(skill)
    }
  });
  skillz_array = skillz_array.sort(function(a, b){return a.level - b.level})
  // console.log(skillz_array)
  min_skill = skillz_array[0]
  // console.log(min)
  skillz_array = skillz_array.sort(function(a, b){return b.level - a.level})
  max_skill = skillz_array[0]
  // console.log(skillz_array)
  // console.log(max)
  var whore_skill = 0
  function getSkill(slave) {
    if (slave.jobs.find(function(stat) {if(stat.name == "Whore" && stat.known == true) return stat})) {
      var get_skill = Math.floor(slave.jobs.find(function(stat) {if(stat.name == "Whore") return stat}).level / 10)
    } else {
      var get_skill = 1
    }
    return get_skill
  }
  whore_skill = getSkill(slave);
  if (brothel_level == 0) {
    price_modifier = 0.2
  } else if (brothel_level == 1) {
    price_modifier = 0.6
  } else if (brothel_level == 2) {
    price_modifier = 1
  } else if (brothel_level == 3) {
    price_modifier = 1.2
  } else if (brothel_level >= 4) {
    price_modifier = 1.4
  }
  var av_price = 0 + Math.floor(whore_skill) + Math.floor(skillz / 10) * (price_modifier)
  var e = 0
  av_price = Math.round(av_price)
  var total = Math.round(customers * av_price)

  var kinks_array = []
  slave.kinks.forEach((kink, i) => {
    if (kink.level > 50) {
      kinks_array.push(kink)
      // console.log(kink.name)
    } else if (kink.level < -50) {
      kinks_array.push(kink)
      // console.log(kink.name)
    }
  });
  var feature_kink = getRandom(kinks_array)

  if (customers > 0) {
    slave.end_of_week_report.push($.i18n("whore-earned-money", slave.gender, slave.name, customers, av_price, total));
    feature_kink.known = true;
    // console.log(slave.name, feature_kink)
    if (feature_kink.level >= 50) {
      r = (feature_kink.level + randomNumber(1,100)) * price_modifier
      r = Math.round(r)
      feature_kink.known = true
      total = total += r
      slave.end_of_week_report.push($.i18n("whore-liked-kink", slave.gender, lowercase(feature_kink.name), (r)))
    } else if (feature_kink.level <= -50) {
      fk = feature_kink.level * -1
      r = (fk + randomNumber(1,100)) * price_modifier
      // if (r < 0) {
      //   r = r * -1
      // }
      r = Math.round(r)
      feature_kink.known = true
      total = total += r
      slave.end_of_week_report.push($.i18n("whore-hated-kink", slave.gender, lowercase(feature_kink.name), (r)))
    }
    if (min_skill.level <= 10) {
      e = ((min_skill.level * -10) - randomNumber(20,100)) * price_modifier
      e = Math.round(e)
      slave.end_of_week_report.push($.i18n("whore-low-skill", slave.gender, lowercase(min_skill.name), (e * -1)))
      total = total += e
    }
    if (max_skill.level > 50){
      e = (max_skill.level + randomNumber(1,50)) * price_modifier
      e = Math.round(e)
      slave.end_of_week_report.push($.i18n("whore-high-skill", slave.gender, lowercase(max_skill.name), e))
      total = total += e
    }
  } else {
    slave.end_of_week_report.push($.i18n("whore-no-customers", slave.gender, slave.name));
  }
  localStorage.setItem("slaves", slaves)
  money = Math.floor(localStorage.getItem("money"))
  money += total
  localStorage.setItem("money", money)
}

function checkResting(slave) {
  slave_health = slave.scales.find(function(stat) {if(stat.name == "Health") return stat}).level
  buildings = JSON.parse(localStorage.getItem("pc_facilities"))
  bathhouse_level = buildings.find(function(bldg) {if (bldg.name == "bathhouse") return bldg}).level
  if (slave.living == "luxurious") {
    slave_cost = 10
  } else if (slave.living == "comfortable") {
    slave_cost = 5
  } else if (slave.living == "adequate") {
    slave_cost = 2
  } else if (slave.living == "sparse") {
    slave_cost = 1
  } else {
    slave_cost = 1
  }
  if (slave_health <= -50) {
    slave.scales.find(function(stat) {if(stat.name == "Health") return stat}).level += ((Math.floor(slave_health / 10)) * -1) + slave_cost + bathhouse_level
    slave.end_of_week_report.push(slave.name + " rested this week and recuperated.")
    // console.log("low!")
  } else if (slave_health > -50 && slave_health <= 0) {
    slave.scales.find(function(stat) {if(stat.name == "Health") return stat}).level += 5 + slave_cost + bathhouse_level
    slave.end_of_week_report.push(slave.name + " rested this week and grew a bit more healthy.")
    // console.log("med!")
  } else if (slave_health > 0 && slave_health <= 50) {
    slave.scales.find(function(stat) {if(stat.name == "Health") return stat}).level += 5 + slave_cost + bathhouse_level
    slave.scales.find(function(stat) {if(stat.name == "Libido") return stat}).level += 5 + bathhouse_level
    slave.end_of_week_report.push(slave.name + " rested this week and felt better.")
    // console.log("good!")
  } else {
    slave.scales.find(function(stat) {if(stat.name == "Libido") return stat}).level += 5 + slave_cost + bathhouse_level
    slave.scales.find(function(stat) {if(stat.name == "Obedience") return stat}).level -= 2 + slave_cost
    slave.end_of_week_report.push(slave.name + " lazed around this week and did nothing.")
    // console.log("best!")
  }
  // console.log("resting!")
  kindnessAction(slave);
}

function checkGloryHole(slave) {
  // console.log(slave.name)
  buildings = JSON.parse(localStorage.getItem("pc_facilities"))
  brothel_level = buildings.find(function(bldg) {if (bldg.name == "brothel") return bldg}).level
  var customers = randomNumber(0, 20) + brothel_level
  var av_price = randomNumber(1,10) + brothel_level
  var total = (customers * av_price) * 6
  money = Math.floor(localStorage.getItem("money"))
  money += total
  if (customers > 0) {
    slave.end_of_week_report.push($.i18n("gloryhole-customers", slave.name, customers, av_price, total));
    harshAction(slave);
  } else {
    slave.end_of_week_report.push($.i18n("gloryhole-no-customers", slave.gender, slave.name));
  }
}

function checkPublicUse(slave) {
  buildings = JSON.parse(localStorage.getItem("pc_facilities"))
  brothel_level = buildings.find(function(bldg) {if (bldg.name == "brothel") return bldg}).level
  // console.log(slave.name + " whore!")
  var customers = randomNumber(0, 5) + Math.floor((slave.stats.find(function(stat) {if(stat.name == "Charisma") return stat}).level / 20)) + brothel_level
  var av_price = randomNumber(0, 2) + Math.floor(slave.stats.find(function(stat) {if(stat.name == "Charisma") return stat}).level / 50) + brothel_level
  var e = 0
  var total = (customers * av_price) * 6
  if (customers > 0) {
    if (total < 1) {
      total = 1
    }
    slave.end_of_week_report.push($.i18n("publicuse-reputation", slave.name, customers, total));
    harshAction(slave);
  } else {
    slave.end_of_week_report.push($.i18n("publicuse-no-customers", slave.gender, slave.name));
  }
  reputation = Math.floor(localStorage.getItem("reputation"))
  reputation += total
  localStorage.setItem("reputation", reputation)
}

function checkServeHousehold(slave) {
  buildings = JSON.parse(localStorage.getItem("pc_facilities"))
  kitchen_level = buildings.find(function(bldg) {if (bldg.name == "kitchens") return bldg}).level
  var cooking = 0
  var strength = 0
  if (slave.jobs.find(function(stat) {if(stat.name == "Chef") return stat}).known == true) {
    cooking = Math.floor(slave.jobs.find(function(stat) {if(stat.name == "Chef") return stat}).level / 10) + kitchen_level
  } else {
    var roll = randomNumber(0,100)
    if (roll > 50) {
      slave.jobs.find(function(stat) {if(stat.name == "Chef") return stat}).known = true
      cooking = Math.floor(slave.jobs.find(function(stat) {if(stat.name == "Chef") return stat}).level / 10)
      slave.end_of_week_report.push($.i18n("new-job", slave.gender, slave.name, "chef"));
    }
  }
  if (slave.stats.find(function(stat) {if(stat.name == "Strength") return stat}).known == true) {
    strength = Math.floor(slave.stats.find(function(stat) {if(stat.name == "Strength") return stat}).level / 10)
  } else {
    var roll = randomNumber(0,100)
    if (roll > 50) {
      slave.stats.find(function(stat) {if(stat.name == "Strength") return stat}).known = true
      strength = Math.floor(slave.stats.find(function(stat) {if(stat.name == "Strength") return stat}).level / 10)
      slave.end_of_week_report.push($.i18n("new-talent", slave.gender, slave.name, aptitudeFor("Strength")));
    }
  }
  var money_saved = (cooking + strength) * 6
  if (money_saved > 0) {
    slave.end_of_week_report.push($.i18n("servant-money", slave.gender, slave.name, money_saved));
    kindnessAction(slave);
  } else {
    slave.end_of_week_report.push($.i18n("servant-no-money", slave.gender, slave.name));
  }
  money = Math.floor(localStorage.getItem("money"))
  money += money_saved
}

function checkPleaseYou(slave) {
  var charisma = Math.floor(slave.stats.find(function(stat) {if(stat.name == "Charisma") return stat}).level / 2)
  var attraction = 0
  var pcGender = localStorage.getItem("pcGender");
  if (slave.kinks.find(function(stat) {if(stat.name == "Attraction to Men") return stat}).level > 0 && pcGender == "male") {
    attraction = Math.floor(slave.kinks.find(function(stat) {if(stat.name == "Attraction to Men") return stat}).level / 2)
  } else if (slave.kinks.find(function(stat) {if(stat.name == "Attraction to Women") return stat}).level > 0 && pcGender == "female") {
    attraction = Math.floor(slave.kinks.find(function(stat) {if(stat.name == "Attraction to Women") return stat}).level / 2)
  }
  if (attraction > 0) {
    slave.scales.find(function(stat) {if(stat.name == "Libido") return stat}).level += randomNumber(1,5)
  } else if (attraction < 0 && slave.assignment_weeks >= 3) {
    if (randomNumber(1,100) < slave.assignment_weeks) {
      if (pcGender == "male") {
        slave.kinks.find(function(stat) {if(stat.name == "Attraction to Men") return stat}).level = randomNumber(50,100)
      } else {
        slave.kinks.find(function(stat) {if(stat.name == "Attraction to Women") return stat}).level = randomNumber(50,100)
      }
    }
  }
  reputation = Math.floor(localStorage.getItem("reputation"))
  rep_change = charisma + attraction
  if (reputation < 0) {
    reputation = 0
  }
  reputation += rep_change
  localStorage.setItem("reputation", reputation)
  slave.end_of_week_report.push($.i18n("please-you", slave.gender, slave.name, rep_change))

  slave.scales.find(function(stat) {if(stat.name == "Health") return stat}).level += randomNumber(1,5)

  //discover things
  var together_time = discoverThings(slave)
  if (together_time.length > 0) {
    // console.log(together_time)
    slave.end_of_week_report.push($.i18n("please-you-skill-discovery", slave.gender, slave.name, together_time.join(", ")))
  }

  if (slave.responds_known == false) {
    var roll = randomNumber(0,100)
      if (roll > 50) {
        slave.responds_known = true
        slave.end_of_week_report.push($.i18n("please-you-responds-discovery", slave.gender, slave.name, slave.responds_to))
      }
  }

  if (slave.assignment_weeks <= 1) {
    if (attraction > 0) {
      slave.end_of_week_report.push($.i18n("please-you-attraction-positive", slave.gender))
      slave.responds_known = true
      kindnessAction(slave)
    } else {
      slave.end_of_week_report.push($.i18n("please-you-attraction-negative", slave.gender))
      slave.responds_known = true
      harshAction(slave)
    }
  }
}

function discoverThings(slave) {
  var check_these = [slave.stats, slave.scales, slave.skills, slave.kinks]
  var discoveries = []
  slave_honesty = slave.scales.find(function(stat) {if(stat.name == "Honesty") return stat}).level
  pc_int = parseInt(localStorage.getItem("pc_int"))
  xp = parseInt(localStorage.getItem("xp"))
  luck = parseInt(localStorage.getItem("pc_luck"))
  check_these.forEach((thing, i) => {
    // console.log(thing)
    thing.forEach((stat, i) => {
      if (stat.known == false) {
        var roll = pc_int + slave_honesty + slave.assignment_weeks + luck + xp
        beat = randomNumber(100,200)
        // console.log(roll > (beat - randomNumber(0,luck)))
        if (roll > (beat - randomNumber(0,luck) - randomNumber(0,xp))) {
          stat.known = true
          var phrase = ""
          if (stat.type == "stat") {
            phrase = aptitudeFor(stat.name)
          } else if (stat.type == "scale") {
            phrase = "level of " + lowercase(stat.name)
          } else if (stat.type == "kink") {
            // console.log(stat)
            if (stat.level >= 0) {
              if (stat.name == "Attraction to Men" || stat.name == "Attraction to Women") {
                phrase = lowercase(stat.name)
                // console.log(stat)
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
            // console.log(stat)
          }
          discoveries.push(phrase)
        }
      }
    });
  });
  return discoveries
}

function checkConfinement(slave) {
  buildings = JSON.parse(localStorage.getItem("pc_facilities"))
  security_level = buildings.find(function(bldg) {if (bldg.name == "security") return bldg}).level
  effect = 10 + security_level
  negativeEffect(slave, slave.scales, "Health", 5)
  positiveEffect(slave, slave.scales, "Obedience", security_level)
  slave.end_of_week_report.push($.i18n("confinement", slave.gender, slave.name))
  harshAction(slave)
}
