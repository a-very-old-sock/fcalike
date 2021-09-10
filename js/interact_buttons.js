function viewSlaveSalon(slave_id, group) {
  // showBathhouse()
}

function examineButton(slave_id, group) {
  $("#slave_interact_buttons").empty()
  // slave = group.find(slave => slave.id == slave_id);
  $("#slave_interact_log").append(examineSlave(slave_id, group))
  $("#slave_interact_log").append("<br/>")
  pcActionChange(-1)
  pcXpChange(1)
  pcMoneyChange(-100)
  makeInteractButtons(slave_id, group)
}

function healButton(slave_id, group) {
  $("#slave_interact_buttons").empty()
  // slave = group.find(slave => slave.id == slave_id);
  $("#slave_interact_log").append(healSlave(slave_id, group))
  $("#slave_interact_log").append("<br/>")
  pcActionChange(-1)
  pcXpChange(1)
  pcMoneyChange(-1000)
  makeInteractButtons(slave_id, group)
}

function talkButton(slave_id, group) {
  $("#slave_interact_buttons").empty()
  // slave = group.find(slave => slave.id == slave_id);
  $("#slave_interact_log").append(talkWith(slave_id, group))
  $("#slave_interact_log").append("<br/>")
  pcActionChange(-1)
  pcXpChange(1)
  makeInteractButtons(slave_id, group)
}

function examineSlave(slave_id, group) {
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
  pcKindnessChange(1)
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
  if (phrase) {
    discoveries.push(phrase)
  }

  localStorage.setItem("slaves", JSON.stringify(slaves))

  modalStatsBlock(slave.scales,"#slave_scales");
  modalStatsBlock(slave.stats,"#slave_stats");
  modalStatsBlock(slave.kinks,"#slave_kinks");
  return discoveries[0]
}
