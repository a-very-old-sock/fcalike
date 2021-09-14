function doButton(btn_name, slave_id, group, prefix) {
  console.log(getFuncName(), btn_name)
  btn_group = eval(prefix + "_buttons")
  btn = btn_group.find(btn => btn.name == btn_name)
  $("#" + prefix + "_interact_buttons").empty()
  $("#" + prefix + "_interact_log").append(eval(btn.fnc))
  $("#" + prefix + "_interact_log").append("<br/>")
  // console.log(btn.name, btn.action, btn.xp, btn.money)
  pcActionChange(parseInt(btn.action))
  pcXpChange(parseInt(btn.xp))
  pcMoneyChange(parseInt(btn.money))
  makeInteractButtons(slave_id, group, prefix)
}

function examineSlave(slave_id, group) {
  console.log(getFuncName())
  slave = group.find(slave => slave.id == slave_id);
  statTrue(slave, "Health")
  modalStatsBlock(slave.scales,"#slave_scales");
  if (statLevel(slave, "Love") < 0) {
    results = $.i18n(slave.name + " obviously hates every second of the intrusive exam, but by the end of it you learn that {{gender:$1|his|her}} health is " + lowercase(statWord(slave, "Health"))+ ".", slave.gender)
  } else {
    results = $.i18n(slave.name + " submits obediently to the intrusive exam, and you learn that {{gender:$1|his|her}} health is " + lowercase(statWord(slave, "Health"))+ ".", slave.gender)
  }
  if (slave.responds_to == "kindness") {
    changeStat(slave, "Love", 10)
  }
  return results
}

function healSlave(slave_id, group) {
  console.log(getFuncName())
  pcKindnessChange(10)
  luck = parseInt(localStorage.getItem("pc_luck"))
  slave = group.find(slave => slave.id == slave_id);
  changeStat(slave, "Health", (50 + randomNumber(0,50) + randomNumber(0,luck)))
  changeStat(slave, "Love", 10)
  changeStat(slave, "Loyalty", 10)
  statTrue(slave, "Health")
  modalStatsBlock(slave.scales,"#slave_scales");
  if (statLevel(slave, "Health") < 50) {
    results = "The doctor attends to " + slave.name + " as best she is able, but says your slave still needs time to recover."
  } else {
    results = "The doctor says " + slave.name + " is recovered fully."
  }
  return results
}

function talkWith(slave_id, group) {
  console.log(getFuncName())
  slave = group.find(slave => slave.id == slave_id);
  int = parseInt(localStorage.getItem("pc_int")) || 0;
  luck = parseInt(localStorage.getItem("pc_luck")) || 0;
  xp = parseInt(localStorage.getItem("xp")) || 0;
  slave_int = statLevel(slave, "Intelligence")
  slave_honesty = statLevel(slave, "Honesty") * -1
  slave_obedience = statLevel(slave, "Obedience") * -1
  player_roll = int + luck + xp
  slave_roll = slave_int + slave_honesty + slave_obedience - (randomNumber(0,luck))
  thing = ""
  if (player_roll >= slave_roll) {
    thing = discoverOneThing(slave)
    // console.log(thing)
    if (thing) {
      roll_results = $.i18n("After taking time to speak with " + slave.name + ", you discover {{gender:$1|his|her}} " + thing + ".", slave.gender)
    } else {
      roll_results = slave.name + " answers your questions readily but you don't learn anything new."
    }
  } else if (statLevel(slave, "Honesty") <= -50 && int >= 50) {
    roll_results = slave.name + " answers your questions obediently, but seems evasive."
  } else {
    roll_results = slave.name + " tolerates your interrogation obediently, but you don't learn much."
  }
  return roll_results
}

function discoverOneThing(slave) {
  console.log(getFuncName())
  phrase = ""
  var check_these = ["Intelligence", "Charisma", "Strength", "Obedience", "Love", "Loyalty", "Honesty", "Health", "Libido", "Happiness", "Getting fucked", "Anal", "Fucking", "Licking pussy", "Sucking dick", "Eating ass", "Attraction to Women", "Attraction to Men", "Receiving oral", "Getting rimmed", "Dominating", "Submitting", "Sadism", "Masochism", "Humiliation", "Aftercare"]
  var check_kinks = ["Getting fucked", "Anal", "Fucking", "Licking pussy", "Sucking dick", "Eating ass", "Attraction to Women", "Attraction to Men", "Receiving oral", "Getting rimmed", "Dominating", "Submitting", "Sadism", "Masochism", "Humiliation", "Aftercare"]
  var discoveries = []
  check_these = shuffle(check_these)
  check_kinks = shuffle(check_kinks)
  unknown_stats = []
  unknown_kinks = []
  check_these.forEach((item, i) => {
    if (statKnown(slave, item) == false) {
      unknown_stats.push(item)
    }
  });
  check_kinks.forEach((item, i) => {
    if (kinkKnown(slave, item) == false) {
      unknown_kinks.push(item)
    }
  });
  if (unknown_stats.length >= 1) {
    thisone = getRandom(unknown_stats)
    statTrue(slave, thisone)
    if (slave_stats.includes(thisone)) {
      phrase = aptitudeFor(thisone)
    } else if (slave_scales.includes(thisone)) {
      phrase = "level of " + lowercase(thisone)
    } else if (slave_skills.includes(thisone)) {
      phrase = "skills for " + lowercase(thisone)
    }
  } else if (unknown_kinks.length >= 1) {
    thisone = getRandom(unknown_kinks)
    kinkTrue(slave, thisone)
    if (kinkLevel(slave, thisone) >= 0) {
      if (thisone == "Attraction to Men" || thisone == "Attraction to Women") {
        phrase = lowercase(thisone)
      } else {
        phrase = "love of " + lowercase(thisone)
      }
    } else {
      if (thisone == "Attraction to Men") {
        phrase = "disgust for fucking men"
      } else if (thisone == "Attraction to Women") {
        phrase = "disgust for fucking women"
      } else {
        phrase = "hatred of " + lowercase(thisone)
      }
    }
  }
  // console.log("phrase", phrase)
  if (phrase) {
    discoveries.push(phrase)
  }

  localStorage.setItem("slaves", JSON.stringify(slaves))

  modalStatsBlock(slave.scales,"#slave_scales");
  modalStatsBlock(slave.stats,"#slave_stats");
  modalStatsBlock(slave.kinks,"#slave_kinks");
  console.log(discoveries)
  return discoveries[0]
}

function spank(slave_id, group) {
  slave = group.find(slave => slave.id == slave_id);
  results = []
  if (statLevel(slave, "Obedience") > 0) {
    results.push($.i18n("{{gender:$1|He|She}} accepts the spanking obediently.", slave.gender))
  } else {
    results.push($.i18n(slave.name + " balks and struggles, but stays where you force {{gender:$1|him|her}} for the spanking.", slave.gender))
    changeStat(slave, "Love", -1)
  }

  if (kinkLevel(slave, "Submitting") > 0 || statLevel(slave, "Masochism") > 0 || statLevel(slave, "Humiliation") > 0) {
    changeStat(slave, "Libido", 1)
  }
  if (statLevel(slave, "Libido") >= 1) {
    genitals = []
    if (slave.has_penis) {
      genitals.push(slave.penis + " cock is already hard and leaking")
    }
    if (slave.has_vagina) {
      genitals.push(slave.vagina + " pussy is wet and slick")
    }
    genitals.join(" and ")
    results.push($.i18n("With " + slave.name + " bent over, you can see {{gender:$1|his|her}} $2.", slave.gender, genitals))
  }

  spanking_word = getRandom(["spank", "beat", "redden", "tan"])
  aside = ""
  if (statLevel(slave, "Obedience") < 0) {aside = "even if {{gender:$1|he|she}} hates it"}
  results.push($.i18n("As you " + spanking_word + " {{gender:$1|his|her}} " + slave.butt + " ass, you enjoy the knowledge that " + slave.name + " will grow more obedient " + aside + ".", slave.gender))

  check_these = ["Dominating", "Submitting", "Masochism", "Humiliation"]
  check_these.forEach((item, i) => {
    if (statKnown(slave, item)) {}
    else {
      if (randomNumber(1,5) == 1) {
        kinkKnown(slave, item)
        if (kinkLevel(slave, item) > 0) { word = "loves"}
        else { word = "hates"}
        results.push($.i18n("You get the feeling that {{gender:$1|he|she}} " + word + " " + lowercase(item) + ".", slave.gender))
      }
    }
  });

  spank_result = results.join(" ")
  changeStat(slave, "Obedience", 1)
  return spank_result
}

// var pc_hasDick = true;
// var pc_hasVagina = false;
// var pc_hasBreasts = false;
function fuckSlave(slave_id, group, type) {
  slave = group.find(slave => slave.id == slave_id);
  results = []
  pc_gender = localStorage.getItem("pcGender")
  pc_hasDick = eval(localStorage.getItem("pc_hasDick"))
  pc_hasVagina = eval(localStorage.getItem("pc_hasVagina"))
  console.log("pc has dick", pc_hasDick, "pc has vagina", pc_hasVagina)
  type_mod = null
  kink_mod = ""
  verbs = ""
  pc_junk = ""

  if (pc_gender == "male") {
    attraction = kinkLevel(slave, "Attraction to Men")
    if (attraction < 0 && randomNumber(0,100) == 1) {
      changeKink(slave, "Attraction to Men", 50,100)
    }
  } else if (pc_gender == "female") {
    attraction = kinkLevel(slave, "Attraction to Women")
    if (attraction < 0 && randomNumber(0,100) == 1) {
      changeKink(slave, "Attraction to Women", 50,100)
    }
  } else {
    attraction = 0
  }

  if (type == "pussy") {
    type_mod = kinkLevel(slave, "Getting fucked")
    kink_mod = "Getting fucked"
    verbs = "takes"
    if (randomNumber(1,3) == 1) {
      slave_desc = slave.vagina + " pussy"
    } else {
      slave_desc = getRandom(["pussy", "cunt"])
    }
    if (randomNumber(1,3) == 1) {
      second_desc = slave.vagina + " " + getRandom(["pussy", "cunt"])
    } else {
      second_desc = getRandom(["pussy", "cunt"])
    }

  } else if (type == "ass") {
    type_mod = kinkLevel(slave, "Anal")
    kink_mod = "Anal"
    verbs = "takes"
    if (randomNumber(1,3) == 1) {
      slave_desc = slave.butt + " ass"
    } else {
      slave_desc = "ass"
    }
    if (randomNumber(1,3) == 1) {
      second_desc = slave.butt + " ass"
    } else {
      second_desc = "ass"
    }
  } else if (type == "mouth") {
    slave_desc = "mouth"
    if (pc_hasDick) {
      type_mod = kinkLevel(slave, "Sucking dick")
      kink_mod = "Sucking dick"
      verbs = "sucks"
    }
    if (pc_hasVagina) {
      type_mod = kinkLevel(slave, "Licking pussy")
      kink_mod = "Licking pussy"
      verbs = "licks"
    }
  }

  if (statLevel(slave, "Love") + type_mod > 0) {
    eagerness = "Eagerly"
  } else {
    eagerness = "Nervously"
  }
  if (attraction + type_mod > 0) {
    feeling = "lust in {{gender:$1|his|her}} eyes"
  } else {
    feeling = "obvious distaste"
  }
  results.push($.i18n(eagerness + ", " + slave.name + " submits with " + feeling + ".", slave.gender))

  console.log("pc has dick", pc_hasDick)
  if (pc_hasDick) {
    pc_junk = "cock"
    fuckverb = fuck
    fuckverbing = fucking
  } else {
    if (type == "mouth") {
      pc_junk = "pussy"
    } else {
      pc_junk = "strap"
    }
    fuckverb = pussy_fuck
    fuckverbing = pussy_fucking
  }

  if (statLevel(slave, kink_mod) <= 25) {
    well = "poorly"
    if (type == "mouth") {
      if (pc_hasDick) {desc = "choking and gagging"}
      else {desc = "licking into you sloppily with no rythm"}
    } else {
      desc = "with sloppy rythm and little response"
    }
    pc_orgasm = getRandom(["unsatisfactory", "disappointing", "perfunctory", "dissatisfying"])
  } else if (between(statLevel(slave, kink_mod), 26, 75)) {
    well = "well enough"
    if (type == "mouth") {
      desc = "clumsily trying to make it good"
    } else {
      desc = "trying to arch into it and match your pace"
    }
    pc_orgasm = getRandom(["fair", "decent", "mediocre"])
  } else if (statLevel(slave, kink_mod) > 76) {
    well = "beautifully"
    if (type == "mouth") {
      if (pc_hasDick) {desc = "taking your cock deep in {{gender:$1|his|her}} throat"}
      else {desc = "burying {{gender:$1|his|her}} tongue in your pussy to lick you out"}
    } else {
      desc = "arching into it and spreading {{gender:$1|his|her}} legs sluttily"
    }
    pc_orgasm = getRandom(["shuddering", "amazing", "powerful"])
  }
  statTrue(slave, kink_mod)
  kinkTrue(slave, kink_mod)

  results.push($.i18n("{{gender:$1|He|She}} " + verbs + " your " + pc_junk + " " + well + " as you " + getRandom(fuckverb) + " {{gender:$1|his|her}} " + slave_desc + ", " + desc + ".", slave.gender))

  if (attraction + kinkLevel(slave, kink_mod) + statLevel(slave, "Libido") >= 100) {

    if (attraction < 0) {mod = " despite {{gender:$1|him|her}}self"} else {mod = ""}

    if (type == "mouth") {
      orgasm = $.i18n(slave.name + " shudders and comes as you use {{gender:$1|his|her}} mouth" + mod + ".", slave.gender)
    } else {
      orgasm = $.i18n("You feel {{gender:$1|his|her}} " + second_desc + " clench around you as {{gender:$1|he|she}} comes hard" + mod + ".", slave.gender)
    }

    changeKink(slave, kink_mod, 1)

  } else {

    if (type == "mouth") {
      orgasm = $.i18n("You finish " + getRandom(fuckverbing) + " {{gender:$1|his|her}} " + slave_desc + " with a " + pc_orgasm + " orgasm.", slave.gender)
    } else {
      orgasm = $.i18n("You finish " + getRandom(fuckverbing) + " {{gender:$1|his|her}} " + second_desc + " with a " + pc_orgasm + " orgasm, but {{gender:$1|he|she}} fails to come on your " + pc_junk + ".", slave.gender)
    }

    changeKink(slave, kink_mod, -1)

  }
  results.push(orgasm)
  changeStat(slave, kink_mod, 1)
  fuck_result = results.join(" ")
  return fuck_result
}

var view_buttons = [
  {"name": "examine", "prereqs": "statKnown(slave, 'Health') == false", "btn_txt": "'Have a doctor examine ' + slave.name + '(§100)'","fnc": "examineSlave(slave_id, group)", "xp": 1, "action": -1, "money": -100},
  {"name": "heal", "prereqs": "(statLevel(slave, 'Health') <= 0) && statKnown(slave, 'Health')", "btn_txt": "'Have a doctor heal ' + slave.name + '(§1000)'", "fnc": "healSlave(slave_id, group)", "xp": 1, "action": -1, "money": -1000},
  {"name": "talk", "prereqs": "true", "btn_txt": "'Talk with ' + slave.name", "fnc": "talkWith(slave_id, group)", "xp": 1, "action": -1, "money": 0},
  {"name": "spank", "prereqs": "true", "btn_txt": "'Spank ' + slave.name", "fnc": "spank(slave_id, group)", "xp": 1, "action": -1, "money": 0},
  {"name": "pussy_fuck", "prereqs": "slave.has_vagina", "btn_txt": "'Fuck ' + slave.name", "fnc": "fuckSlave(slave_id, group, 'pussy')", "xp": 1, "action": -1, "money": 0},
  {"name": "ass_fuck", "prereqs": "true", "btn_txt": "'Fuck ' + slave.name + ' in the ass'", "fnc": "fuckSlave(slave_id, group, 'ass')", "xp": 1, "action": -1, "money": 0},
  {"name": "mouth", "prereqs": "true", "btn_txt": "'Use ' + slave.name + '&#39;s mouth'", "fnc": "fuckSlave(slave_id, group, 'mouth')", "xp": 1, "action": -1, "money": 0}
]
