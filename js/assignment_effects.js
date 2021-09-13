function checkExercise(slave) {
  console.log(getFuncName())
  training_level = bldgLevel("training room")
  if (statLevel(slave, "Health") > 0) {
    changeStat(slave, "Strength", (5 + training_level))
    slave.end_of_week_report.push(slave.name + " exercised this week and grew stronger.")
  } else {
    changeStat(slave, "Health", -2)
    slave.end_of_week_report.push(slave.name + " exercised this week but grew sicker due to their poor health.")
  }
}

function checkWhoring(slave) {
  console.log(getFuncName())
  brothel_level = parseInt(bldgLevel("brothel")) || 0
  console.log("brothel_level", brothel_level)

  var customers = randomNumber(0, 5) + Math.floor(statLevel(slave, "Charisma") / 10) + brothel_level
  console.log("customers", customers)
  var skillz = 0

  if (randomNumber(0,(brothel_level + 5)) == 0) {
    slave.end_of_week_report.push($.i18n(slave.name + " <span class='text-danger'> was injured by a customer this week</span>, damaging {{gender:$1|his|her}} health.", slave.gender))
    changeStat(slave, "Health", -10)
    changeStat(slave, "Love", -5)
    if (randomNumber(0,2) == 2) {
      changeKink(slave, "Masochism", 5)
    }
    console.log("injury")
  }

  skillz_array = []
  slave.skills.forEach((skill, i) => {
    if (skill.known == true) {
      skillz += skill.level
      skillz_array.push(skill)
    }
  });
  skillz_array = skillz_array.sort(function(a, b){return a.level - b.level})
  min_skill = skillz_array[0]

  skillz_array = skillz_array.sort(function(a, b){return b.level - a.level})
  max_skill = skillz_array[0]

  if (statKnown(slave, "Whore")) {
    var whore_skill = Math.floor(statLevel(slave, "Whore") / 10)
  } else {
    var whore_skill = 1
    if (randomNumber(1,3) == 1) {
      statTrue(slave, "Whore")
      slave.end_of_week_report.push($.i18n("You learned that " + slave.name + " is " + jobSkillDesc(statLevel(slave, "Whore")) + " as a whore."))
    }
  }
  console.log("whore_skill", whore_skill)

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
  console.log("price_modifier", price_modifier)
  var av_price = whore_skill + brothel_level + Math.round(whore_skill) + Math.round(skillz / 10) * (price_modifier)
  var e = 0
  av_price = Math.round(av_price + 1)
  var total = Math.round(customers * av_price)
  console.log("av_price", av_price, "customers", customers, "total", total)

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
    skill_mod = Math.round(customers/4)
    slave.skills.forEach((skill, i) => {
      if (skill.known == true) {
        if (randomNumber(1,5) + whore_skill >= 5) {skill.level += randomNumber(0,skill_mod)}
      } else {
        flip = randomNumber(1,5)
        if (flip == 1) {
          skill.known = true
          slave.end_of_week_report.push($.i18n(slave.name + " <span class='success'>demonstrated that {{gender:$1|he|she}} is " + jobSkillDesc(slave, skill.name)+ " at " + lowercase(skill.name) + "</span>.", slave.gender))
        } else if (flip == 2) {
          skill.level += randomNumber(1,skill_mod)
        }
      }
    });
    feature_kink.known = true;
    // console.log(slave.name, feature_kink)
    luck_mod = Math.round(parseInt(localStorage.getItem("pc_luck"))/50)
    if (feature_kink.level >= 50 && (randomNumber(1,3) + luck_mod >= 3)) {
      r = (whore_skill + feature_kink.level + brothel_level) * price_modifier
      r = Math.round(r)
      total = total += r
      slave.end_of_week_report.push($.i18n("whore-liked-kink", slave.gender, lowercase(feature_kink.name), (r)))
    } else if (feature_kink.level <= -50 && (randomNumber(1,3) + luck_mod >= 3)) {
      fk = feature_kink.level * -1
      r = (fk + brothel_level) * price_modifier
      r = Math.round(r)
      total = total += r
      slave.end_of_week_report.push($.i18n("whore-hated-kink", slave.gender, lowercase(feature_kink.name), (r)))
    }
    if (min_skill === undefined) {

    } else if (min_skill.level <= 10) {
      e = ((min_skill.level * -10) - brothel_level) * price_modifier
      e = Math.round(e)
      slave.end_of_week_report.push($.i18n("whore-low-skill", slave.gender, lowercase(min_skill.name), (e * -1)))
      total = total += e
    }
    if (max_skill === undefined) {

    } else if (max_skill.level > 50 && (randomNumber(1,3) + luck_mod >= 3)){
      e = (whore_skill + max_skill.level + brothel_level) * price_modifier
      console.log("high skill", e)
      e = Math.round(e)
      slave.end_of_week_report.push($.i18n("whore-high-skill", slave.gender, lowercase(max_skill.name), e))
      total = total += e
    }
  } else {
    slave.end_of_week_report.push($.i18n("whore-no-customers", slave.gender, slave.name));
  }
  localStorage.setItem("slaves", slaves)
  pcMoneyChange(total)
}

function checkResting(slave) {
  console.log(getFuncName())
  slave_health = statLevel(slave, "Health")
  bathhouse_level = bldgLevel("bathhouse")
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
  console.log(getFuncName())
  brothel_level = bldgLevel("brothel")
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
  console.log(getFuncName())
  brothel_level = bldgLevel("brothel")
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
  console.log(getFuncName())
  jobs = [{"name": "Chef", "bldg": "kitchens"}, {"name": "Guard", "bldg": "guardhouse"}, {"name": "Aesthetician", "bldg": "bathhouse"}, {"name": "Gardener", "bldg": "gardens"}, {"name": "Teacher", "bldg": "training room"}, {"name": "Secretary", "bldg": "library"}, {"name": "Accountant", "bldg": "office"}, {"name": "Tailor", "bldg": "workshop"}, {"name": "Medic", "bldg": "clinic"}, {"name": "Whore", "bldg": "brothel"}]
  var strength = 0
  job_mod = 0
  jobs.forEach((job, i) => {
    console.log(job.name, bldgLevel(job.bldg))
    if (statKnown(slave, job.name)) {
      job_mod += Math.round((statLevel(slave, job.name)/ 25) + bldgLevel(job.bldg)) + 1
    } else if (randomNumber(0,50) > 50) {
      statTrue(slave, job.name)
      job_mod += Math.round((statLevel(slave, job.name)/ 50) + bldgLevel(job.bldg)) + 1
      slave.end_of_week_report.push($.i18n("new-job", slave.gender, slave.name, lowercase(job.name)));
    }
  });

  if (slave.stats.find(function(stat) {if(stat.name == "Strength") return stat}).known == true) {
    strength = Math.round(statLevel(slave, "Strength") / 10)
  } else {
    var roll = randomNumber(0,100)
    if (roll > 50) {
      slave.stats.find(function(stat) {if(stat.name == "Strength") return stat}).known = true
      strength = Math.round(statLevel(slave, "Strength") / 10)
      slave.end_of_week_report.push($.i18n("$2's hard work this week revealed {{gender:$1|his|her}} $3.", slave.gender, slave.name, aptitudeFor("Strength")));
    }
  }
  var slave_int = Math.round(statLevel(slave, "Intelligence") / 10)
  var money_saved = (job_mod + strength + slave_int) * 6
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
  console.log(getFuncName())
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
  console.log(getFuncName())
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
  console.log(getFuncName())
  security_level = bldgLevel("guardhouse")
  effect = randomNumber(0,5) + security_level
  changeStat(slave, "Health", -5)
  changeStat(slave, "Obedience", effect)
  slave.end_of_week_report.push($.i18n("confinement", slave.gender, slave.name))
  harshAction(slave)
}

function checkJob(slave) {
  console.log(getFuncName())
  // ["Gardener", "Tailor", "Secretary", "Teacher", "Medic", "Chef", "Whore", "Accountant", "Aesthetician", "Guard"]
  pf = [{"assignment_name" : "kitchens", "stat" : "Chef", "inc_kinks": [], "dec_kinks": [], "changes": ["Health"]}, {"assignment_name" : "guardhouse", "stat" : "Guard", "dec_kinks": ["Submitting"], "inc_kinks": ["Dominating", "Sadism"], "changes": ["Obedience", "Strength"]}, {"assignment_name" : "bathhouse", "stat" : "Aesthetician", "dec_kinks": ["Dominating"], "inc_kinks": ["Submitting"], "changes": ["Libido", "Charisma", "Health"]}, {"assignment_name" : "gardens", "stat" : "Gardener", "dec_kinks": [], "inc_kinks": [], "changes": ["Health"]}, {"assignment_name" : "training room", "stat" : "Teacher", "dec_kinks": ["Submitting"], "inc_kinks": ["Dominating"], "changes": []}, {"assignment_name" : "library", "stat" : "Secretary", "dec_kinks": [], "inc_kinks": [""], "changes": ["Intelligence"]}, {"assignment_name" : "office", "stat" : "Accountant", "dec_kinks": [], "inc_kinks": [], "changes": ["Intelligence"]}, {"assignment_name" : "workshop", "stat" : "Tailor", "dec_kinks": [], "inc_kinks": [], "changes": []}, {"assignment_name" : "clinic", "stat" : "Medic", "dec_kinks": [], "inc_kinks": ["Aftercare"], "changes": ["Intelligence", "Health"]}]
  job = pf.filter(function(stuff) { return (stuff.assignment_name == slave.assignment.name)})[0]
  slave.end_of_week_report.push(slave.name + " worked in the " + slave.assignment.name + " this week and improved their skills as a " + lowercase(job.stat) + ".")
  int_bonus = Math.floor(statLevel(slave, "Intelligence") / 25)
  luck_bonus = randomNumber(0,Math.floor(parseInt(localStorage.getItem("pc_luck")) / 20))
  if (!slave.literacy) {
    if (randomNumber(0,100) <= (statLevel(slave, "Intelligence") + slave.assignment_weeks + (statLevel(slave, "Obedience")* -1))) {
      slave.literacy = true
      if ( parseInt(localStorage.getItem("pc_int")) + parseInt(localStorage.getItem("pc_luck")) + parseInt(localStorage.getItem("xp")) >= statLevel(slave, "Intelligence") + (statLevel(slave, "Honesty")* -1)) {
        slave.literacy_known = true
        slave.end_of_week_report.push($.i18n("In the course of {{gender:$1|his|her}} work, {{gender:$1|he|she}} seems to have learned how to read and write. Although unfortunate, this will help {{gender:$1|him|her}} do {{gender:$1|his|her}} job better.", slave.gender))
      } else if (parseInt(localStorage.getItem("pc_int")) >= statLevel(slave, "Intelligence")) {
        slave.end_of_week_report.push($.i18n("Something seems different about " + slave.name + "this week, but you're not sure what."))
      }
    }
  }
  if (!slave.literacy_known) {
    if (randomNumber(0,100) <= parseInt(localStorage.getItem("pc_int")) + randomNumber(0,parseInt(localStorage.getItem("pc_luck"))) + parseInt(localStorage.getItem("xp"))) {
      slave.literacy_known = true
      if (slave.literacy) {
        slave.end_of_week_report.push($.i18n("Observing " + slave.name + " do {{gender:$1|his|her}} job this week, you realize {{gender:$1|he|she}} is literate.  This may be unfortunate.", slave.gender))
      } else {
        slave.end_of_week_report.push($.i18n("Observing " + slave.name + " do {{gender:$1|his|her}} job this week, you realize {{gender:$1|he|she}} does not know how to read or write.  While this is good for {{gender:$1|his|her}} obedience, it will make it more difficult for {{gender:$1|him|her}} to do {{gender:$1|his|her}} job well.", slave.gender))
      }
    }
  }
  if (slave.literacy) {
    lit_bonus = 1
  } else {
    lit_bonus = 0
  }
  teaching_bonus = 0
  others = []
  thisone = [slave]
  slaves.forEach((s, i) => {
    if (s.assignment.name == slave.assignment.name) {
      others.push(s)
    }
  });
  not_this_one = others.filter(x => !thisone.includes(x));
  highest = 0
  highestteaching = 0
  if (not_this_one.length >= 1) {
    highskills = []
    teachingskills = []
    not_this_one.forEach((other, i) => {
      highskills.push(statLevel(other, slave.assignment.name))
      teachingskills.push(statLevel(other, "Teacher"))
    });
    highest = highskills.sort(function(a, b){return b - a})[0]
    highestteaching = teachingskills.sort(function(a, b){return b - a})[0]
  }
  if (highest > statLevel(slave, job.stat)) {
    teaching_bonus = Math.round(highestteaching/20) + Math.round(highest/25)
  }
  job_bonus = int_bonus + luck_bonus + teaching_bonus + bldgLevel(job.assignment_name) + lit_bonus
  if (job_bonus > 0) {
    changeStat(slave, job.stat, job_bonus)
  } else {
    changeStat(slave, job.stat, 1)
  }
  if (statLevel(slave, job.stat) >= 50) {
    slave.end_of_week_report.push($.i18n("{{gender:$1|He|She}} seemed to enjoy {{gender:$1|his|her}} job.", slave.gender))
    changeStat(slave, "Happiness")
    pcKindnessChange(1)
  }
  job.inc_kinks.forEach((kink, i) => {
    changeKink(slave, kink, 1)
  });
  job.dec_kinks.forEach((kink, i) => {
    changeKink(slave, kink, -1)
  });
  job.changes.forEach((stat, i) => {
    changeStat(slave, stat, 1)
  });

}
