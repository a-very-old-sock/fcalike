function viewPunish(slave_id) {
  getAttendants("guardhouse")
  slaves = JSON.parse(localStorage.getItem("slaves"))
  slave = slaves.find(slave => slave.id == slave_id)
  localStorage.setItem("current_slave_id", slave_id)
  current_page = "view_punish"
  localStorage.setItem("current_page", current_page)

  hide_these = ["#guardhouse_list", "#slave_guardhouse_list", "#slave_bust", "#guardhouse_slave_bust"]
  hide_these.forEach((item, i) => {
    $(item).empty()
  });

  makePortrait("#guardhouse_slave_bust", slave_id, 2, "slaves");
  $("#guardhouse_slave_bust").addClass("bust-2")
  if (statLevel(slave, "Health") <= -50) {
    $("#guardhouse_buttons").prepend("<span class='text-warning'>Warning:</span> " + slave.name + " is in very poor health and may die if whipped.")
  }

  guardhouse = bldgLevel("guardhouse")
  if (guardhouse == 0) {
    $("#guardhouse-warning").removeClass("hidden-button")
  } else if (guardhouse >= 1 && attendants.length >= 1) {
    $("#guardhouse_buttons_1").removeClass("hidden-button")
  } else if (guardhouse >= 2 && attendants.length >= 1) {
    $("#guardhouse_buttons_2").removeClass("hidden-button")
  } else if (guardhouse >= 3 && attendants.length >= 1) {
    $("#guardhouse_buttons_3").removeClass("hidden-button")
  } else if (guardhouse >= 4 && attendants.length >= 1) {
    $("#guardhouse_buttons_4").removeClass("hidden-button")
  } else if (guardhouse >= 5) {
    $("#guardhouse_buttons_1").removeClass("hidden-button")
    $("#guardhouse_buttons_2").removeClass("hidden-button")
    $("#guardhouse_buttons_3").removeClass("hidden-button")
    $("#guardhouse_buttons_4").removeClass("hidden-button")
    $("#guardhouse_buttons_5").removeClass("hidden-button")
  }

  makeInteractButtons(slave_id, "slaves", "guardhouse")
}

var guardhouse_buttons = [
  {"name": "whip", "prereqs": "true", "btn_txt": "'Have ' + slave.name + ' whipped'","fnc": "whipSlave(slave_id, group)", "xp": 1, "action": -1, "money": 0}
]

function whipSlave(slave_id, group) {
  lvl = bldgLevel("guardhouse")
  slave = group.find(slave => slave.id == slave_id);
  guards = getAttendants("guardhouse")[0]
  guard = getRandom(guards)
  dec = ["Health", "Happiness", "Strength", "Love"]
  inc = ["Obedience"]
  flip = ["Dominating", "Submitting", "Sadism", "Masochism"]
  results = []
  guard_skill = Math.round(statLevel(guard, "Guard") / 25)
  dec.forEach((item, i) => {
    changeStat(slave, item, randomNumber(0,guard_skill * -1))
  });
  inc.forEach((item, i) => {
    changeStat(slave, item, randomNumber(0,guard_skill + lvl) + 5)
  });
  flip.forEach((item, i) => {
    flipKink(slave, item, 100)
  });

  if (randomNumber(0,50) == 1) {
    if (slave.responds_to == "kindness") {
      slave.responds_to = "severity";
      slave.responds_known = false
    } else {
      slave.responds_to = "kindness";
      slave.responds_known = false
    }
  }

  if (guards.length > 1) {
    prepend = "As the guard on duty, "
  } else {
    prepend = ""
  }

  guard_kink = kinkLevel(guard, "Dominating") + kinkLevel(guard, "Sadism")

  if (guard_kink < -50) {
    guard_feeling = " reluctantly"
  } else if (between(guard_kink, -51, 50)) {
    guard_feeling = " grimly but obediently"
  } else if (guard_kink > 51) {
    guard_feeling = ", with obvious anticipation,"
  }

  results.push($.i18n(prepend + guard.name + guard_feeling + " ties " + slave.name + " to the whipping post and strips {{gender:$1|his|her}} back and " + slave.butt + " ass bare to your view.", slave.gender))

  slave_kink = statLevel(slave, "Obedience") + kinkLevel(slave, "Masochism")

  if (slave_kink < -50) {
    slave_feeling = " struggles and fights against "
  } else if (between(slave_kink, -51, 50)) {
    slave_feeling = " stoically submits "
  } else if (slave_kink > 51) {
    slave_feeling = " submits obediently "
  }

  if (slave.responds_to == "kindness") {
    fear_mod = ", obviously trying to hold back tears"
  } else {
    fear_mod = ", holding {{gender:$1|his|her}} head high"
  }

  results.push($.i18n(slave.name + slave_feeling + "being restrained" + fear_mod + ".", slave.gender))

  if (guard_kink < -50) {
    guard_action = guard.name + " surreptitiously tries to reassure " + slave.name + " when you're not looking."
    changeStat(guard, "Loyalty", -1)
    changeStat(guard, "Obedience", -1)
  } else if (between(guard_kink, -51, 50)) {
    guard_action = ""
  } else if (guard_kink > 51) {
    guard_action = guard.name + " takes the opportunity to finger " + slave.name + "\'s " + slave.butt + " ass once {{gender:$1|he|she}}\'s securely bound."
    changeStat(guard, "Loyalty", 1)
    changeStat(guard, "Obedience", 1)
  }

  results.push($.i18n(guard_action, slave.gender))

  guard_skill = statLevel(guard, "Guard") + lvl

  if (guard_skill <= 25) {
    whipping_desc = " with no finesse, flailing the whip dully one moment and cracking it across {{gender:$1|his|her}} back and things the next."
  } else if (between(guard_skill, 26, 75)) {
    whipping_desc = " competently, layering strokes but obviously tiring before finished."
  } else if (guard_skill >= 76) {
    whipping_desc = " with great practice, cracking thick red welts across " + slave.name + "\'s abused back, ass, and thighs."
  }
  changeKink(guard, "Dominating", 1)
  changeKink(guard, "Sadism", 1)
  changeStat(guard, "Guard", lvl)

  if (guard_kink >= 50) {
    if (guard.has_penis) {
      results.push($.i18n("As {{gender:$1|he|she}} works, it becomes increasingly obvious how hard {{gender:$1|his|her}} " + slave.penis + " cock is at the sight of " + slave.name + "\'s bloodied body." ))
    } else if (guard.has_vagina) {
      results.push($.i18n("As {{gender:$1|he|she}} works, it becomes increasingly obvious how wet {{gender:$1|his|her}} " + slave.vagina + " pussy is at the sight of " + slave.name + "\'s bloodied body." ))
    }
  }

  results.push($.i18n(guard.name + " whips " + slave.name + whipping_desc, slave.gender))

  if (slave.responds_to == "kindness") {
    finish_mod = ", begging forgiveness"
  } else {
    finish_mod = ""
  }

  finish = "When " + slave.name + " is finally cut down, {{gender:$1|he|she}} collapses at your feet" + finish_mod + "."
  results.push($.i18n(finish, slave.gender))

  return results.join(" ")
}
