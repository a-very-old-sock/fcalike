function checkExercise(slave) {
  buildings = JSON.parse(localStorage.getItem("pc_facilities"))
  training_level = buildings.find(function(bldg) {if (bldg.name == "training") return bldg}).level
  if (statLevel(slave, "Health") > 0) {
    changeStat(slave, "Strength", (5 + training_level))
    slave.end_of_week_report.push(slave.name + " exercised this week and grew stronger.")
  } else {
    changeStat(slave, "Health", -2)
    slave.end_of_week_report.push(slave.name + " exercised this week but grew sicker due to their poor health.")
  }
}

function checkWhoring(slave) {
  buildings = JSON.parse(localStorage.getItem("pc_facilities"))
  brothel_level = buildings.find(function(bldg) {if (bldg.name == "brothel") return bldg}).level
  var customers = randomNumber(0, 5) + Math.floor(statLevel(slave, "Charisma") / 20) + brothel_level
  var skillz = 0
  slave.skills.forEach((skill, i) => {
    if (skill.known == true) {
      skillz += skill.level
      skill.level += randomNumber(0,customers)
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

  min_skill = skillz_array[0]

  skillz_array = skillz_array.sort(function(a, b){return b.level - a.level})
  max_skill = skillz_array[0]

  var whore_skill = 0
  function getSkill(slave) {
    if (slave.jobs.find(function(stat) {if(stat.name == "Whore" && stat.known == true) return stat})) {
      var get_skill = Math.floor(statLevel(slave, "Whore") / 10)
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
  slave_health = statLevel(slave, "Health")
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
    hc = bathhouse_level + slave_cost + (Math.floor(slave_health/10) * -1)
    slave.end_of_week_report.push(slave.name + " rested this week and recuperated.")
  } else if (slave_health > -50 && slave_health <= 0) {
    hc = bathhouse_level + slave_cost + 5
    slave.end_of_week_report.push(slave.name + " rested this week and grew a bit more healthy.")
  } else if (slave_health > 0 && slave_health <= 50) {
    hc = bathhouse_level + slave_cost + 3
    changeStat(slave, "Libido", (bathhouse_level))
    slave.end_of_week_report.push(slave.name + " rested this week and felt better.")
  } else {
    hc = 1
    changeStat(slave, "Libido", (bathhouse_level + 5))
    changeStat(slave, "Obedience", (bathhouse_level * -1))
    slave.end_of_week_report.push(slave.name + " lazed around this week and did nothing.")
  }
  changeStat(slave, "Health", hc)
  kindnessAction(slave);
}

function checkGloryHole(slave) {
  buildings = JSON.parse(localStorage.getItem("pc_facilities"))
  brothel_level = buildings.find(function(bldg) {if (bldg.name == "brothel") return bldg}).level
  var customers = randomNumber(0, 20) + brothel_level
  var av_price = randomNumber(1,10) + brothel_level
  var total = (customers * av_price) * 6
  money = Math.round(localStorage.getItem("money"))
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
  var customers = randomNumber(0, 5) + Math.round(statLevel(slave, "Charisma")/ 20) + brothel_level
  var av_price = randomNumber(0, 2) + Math.round(statLevel(slave, "Charisma") / 50) + brothel_level
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
  reputation = Math.round(localStorage.getItem("reputation"))
  reputation += total
  localStorage.setItem("reputation", reputation)
}

function checkServeHousehold(slave) {
  buildings = JSON.parse(localStorage.getItem("pc_facilities"))
  kitchen_level = buildings.find(function(bldg) {if (bldg.name == "kitchens") return bldg}).level
  var cooking = 0
  var strength = 0
  if (slave.jobs.find(function(stat) {if(stat.name == "Chef") return stat}).known == true) {
    cooking = Math.round(statLevel(slave, "Chef") / 10) + kitchen_level
  } else {
    var roll = randomNumber(0,100)
    if (roll > 50) {
      slave.jobs.find(function(stat) {if(stat.name == "Chef") return stat}).known = true
      cooking = Math.round(statLevel(slave, "Chef") / 10)
      slave.end_of_week_report.push($.i18n("new-job", slave.gender, slave.name, "chef"));
    }
  }
  if (slave.stats.find(function(stat) {if(stat.name == "Strength") return stat}).known == true) {
    strength = Math.round(statLevel(slave, "Strength") / 10)
  } else {
    var roll = randomNumber(0,100)
    if (roll > 50) {
      slave.stats.find(function(stat) {if(stat.name == "Strength") return stat}).known = true
      strength = Math.round(statLevel(slave, "Strength") / 10)
      slave.end_of_week_report.push($.i18n("new-talent", slave.gender, slave.name, aptitudeFor("Strength")));
    }
  }
  var slave_int = Math.round(statLevel(slave, "Intelligence") / 10)
  var money_saved = (cooking + strength + slave_int) * 6
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
  var charisma = Math.floor(statLevel(slave, "Charisma") / 2)
  var attraction = 0
  var pcGender = localStorage.getItem("pcGender");
  if (statLevel(slave, "Attraction to Men") > 0 && pcGender == "male") {
    attraction = Math.floor(statLevel(slave, "Attraction to Men") / 2)
  } else if (statLevel(slave, "Attraction to Women") > 0 && pcGender == "female") {
    attraction = Math.floor(statLevel(slave, "Attraction to Women") / 2)
  }
  if (attraction > 0) {
    changeStat(slave, "Libido", randomNumber(1,attraction))
  } else if (attraction < 0 && slave.assignment_weeks >= 3) {
    if (randomNumber(1,100) < slave.assignment_weeks) {
      if (pcGender == "male") {
        changeStat(slave, "Attraction to Men", randomNumber(50,100))
      } else {
        changeStat(slave, "Attraction to Women", randomNumber(50,100))
      }
    }
  }
  rep_change = charisma + attraction
  pcRepChange(rep_change)

  slave.end_of_week_report.push($.i18n("please-you", slave.gender, slave.name, rep_change))

  changeStat(slave, "Health", randomNumber(1,5))

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
  slave_honesty = statLevel(slave, "Honest")
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
  changeStat(slave, "Health", -5)
  changeStat(slave, "Obedience", security_level)
  slave.end_of_week_report.push($.i18n("confinement", slave.gender, slave.name))
  harshAction(slave)
}
