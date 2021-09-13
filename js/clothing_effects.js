function nakedClothing(slave) {
  console.log(getFuncName())
  // console.log("nakedClothing")
  var phrases = []
  var naked_clothing = ["nothing", "nothing but jewelry", "nothing but body oil"]
  var s = kinkLevel(slave, "Submitting")
  var h = kinkLevel(slave, "Humiliation")
  var flaunt = []
  if (slave.has_breasts == true) {
    flaunt.push(slave.breasts + " tits")
  } else if (slave.has_penis == true) {
    flaunt.push(slave.penis + " cock")
  }
  flaunt.push(slave.butt + " ass")
  naked_clothing.forEach((item, i) => {
    if (slave.clothing == item && (s >= 40 || h >= 40)) {
      var change_these = ["Obedience", "Libido", "Happiness"]
      change_these.forEach((item, i) => {
        changeStat(slave, item, 5)
        report = slave.name + " <span class='text-success'>enjoyed</span> flaunting {{GENDER:$1|his|her}} " + flaunt.join(" and ") + " wearing " + slave.clothing + " this week"
      });
      phrases.push($.i18n(report, slave.gender))
    } else if (slave.clothing == item && (s <= 40 || h <= 40)) {
      var change_these = ["Obedience", "Libido", "Happiness"]
      change_these.forEach((item, i) => {
        changeStat(slave, item, -5)
        report = slave.name + " <span class='text-danger'>resented</span> being forced to display {{GENDER:$1|his|her}} " + flaunt.join(" and ") + " wearing " + slave.clothing + " this week"
      });
      phrases.push($.i18n(report, slave.gender))
    } else if (slave.clothing == item) {
      var change_these = ["Submitting", "Humiliation"]
      change_these.forEach((item, i) => {
        changeKink(slave, item, 2)
      });
      phrases.push(slave.name + " obediently wore " + slave.clothing + " this week")
    }
  });

  return phrases
}

function domClothing(slave) {
  console.log(getFuncName())
  var phrases = []
  var dom_clothing = ["a bondage harness and leather pants", "a latex catsuit"]
  var d = kinkLevel(slave, "Dominating")
  // var h = slave.kinks.find(function(stat) {if(stat.name == "Humiliation") return stat}).level
  var flaunt = []
  if (slave.has_breasts == true) {
    flaunt.push(slave.breasts + " breasts")
  } else {
    flaunt.push(slave.chest + " body")
  }
  flaunt.push(slave.butt + " ass")
  dom_clothing.forEach((item, i) => {
    if (slave.clothing == item && d >= 40) {
      changeKink(slave, "Dominating", 5)
      changeStat(slave, "Libido", 5)
      report = slave.name + " was <span class='text-success'>more assertive</span> this week wearing " + slave.clothing
      phrases.push($.i18n(report, slave.gender))
    } else if (slave.clothing == item && d <= -40) {
      changeKink(slave, "Dominating", -5)
      changeStat(slave, "Libido", -5)
      report = slave.name + " seemed <span class='text-danger'>awkward and embarassed</span> wearing " + slave.clothing + " this week"
      phrases.push($.i18n(report, slave.gender))
    } else if (slave.clothing == item) {
      changeKink(slave, "Dominating", 1)
      changeStat(slave, "Libido", 1)
      phrases.push(slave.name + " obediently wore " + slave.clothing + " this week")
    }
  });

  return phrases
}

function liveryClothing(slave) {
  console.log(getFuncName())
  var phrases = []
  var livery_clothing = ["the livery of your estate"]
  var love = statLevel(slave, "Love")
  var loyalty = statLevel(slave, "Loyalty")
  change_these = ["Love", "Loyalty", "Happiness", "Obedience"]
  if (slave.clothing == livery_clothing[0]) {
    if (love >= 40 || loyalty >= 40) {
      change_these.forEach((item, i) => {
        changeStat(slave, item, 5)
      });
      phrases.push(slave.name + " was <span class='text-success'>proud</span> to wear " + slave.clothing + " this week")
    } else if (love <= -40 || loyalty <= -40) {
      change_these.forEach((item, i) => {
        changeStat(slave, item, -5)
      });
      phrases.push(slave.name + " <span class='text-danger'>resented</span> being made to wear " + slave.clothing + " this week")
    } else if (slave.clothing == livery_clothing[0]) {
      change_these.forEach((item, i) => {
        changeStat(slave, item, 2)
      });
      phrases.push(slave.name + " obediently wore " + slave.clothing + " this week")
    }
  }
  return phrases
}

function punishingClothing(slave) {
  console.log(getFuncName())
  var phrases = []
  var punishing_clothing = ["nothing but chains", "rags"]
  if (punishing_clothing.includes(slave.clothing)) {
    harshAction(slave)
    if (slave.responds_to == "severity") {
      phrases.push(slave.name + " submitted to wearing " + slave.clothing + " this week and <span class='text-success'>learned obedience</span>")
    } else {
      phrases.push(slave.name + " was <span class='text-danger'>miserable</span> wearing " + slave.clothing + " this week")
    }
  }
  return phrases
}

function otherClothing(slave) {
  console.log(getFuncName())
  var phrases = []
  var other = ["delicate lingerie", "a string bikini", "cutoffs and a slutty croptop", "harem gauze", "a skimpy maid outfit", "a minidress"]
  var change_these = ["Libido", "Obedience"]
  other.forEach((item, i) => {
    if (slave.clothing == item) {
      change_these.forEach((item, i) => {
        changeStat(slave, item, 2)
      });
      phrases.push(slave.name + " obediently submitted to wearing " + slave.clothing + " this week")
    }
  });
  return phrases
}
