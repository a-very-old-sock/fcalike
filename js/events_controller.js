function getEvents() {
  console.log(getFuncName())
  var events = localStorage.getItem("events");
  events = JSON.parse(events)
  var this_one = events[Math.floor(Math.random() * events.length)]
  slaves = JSON.parse(localStorage.getItem("slaves"))
  slave = getRandom(slaves)
  // console.log(slaves.length)
  if (slaves.length <= 1) {
    other_slave = slave
  } else {
    other_slave = getOtherSlave(slave)
  }
  if (other_slave === null || other_slave === undefined || typeof other_slave === 'undefined') {
    console.log("null")
    getOtherSlave(slave)
  }
  // console.log("after get other " +slave.name, other_slave.name)
  // console.log(other_slave)
  $("#event-row").empty()
  $("#event-row").append('<div class="media"><div class="ml-3 mr-3" id="event-bust"><h6 class="event-name">' + slave.name + '</h6><div class="media-body" id="event-body"></div></div>')

  makePortrait("#event-bust", slave.id, 5, "slaves")

  if (this_one.tags.includes("two")) {
    $("#event-row").append('<div class="media second-portrait"><div class="ml-3 second-event-bust" id="other-event-bust"><h6 class="event-name">' + other_slave.name + '</h6><div class="media-body" id=""></div></div>')
    makePortrait("#other-event-bust", other_slave.id, 5, "slaves")
  }

  $("#event-body").html(checkText(this_one.text, slave.id, other_slave.id, this_one.textvar));
  $("#event-body").append("</br>")

  this_one.options.forEach((option, i) => {
    // console.log("check options " + slave.name, other_slave.name)
    $("#event-body").append("<button type='button' class='btn "+ btns[i] +" choice-btn' onclick='showResponse(\"" + checkText(option.results[0].text, slave.id, other_slave.id, option.results[0].textvar) + "\"); responseEffects(\"" + option.results[0].effects + "\")'>" + checkText(option.text, slave.id, other_slave.id, option.textvar) + "</button>");
  });
}

function checkText(text, slave_id, other_slave_id, textvar) {
  console.log(getFuncName())
  if (text.includes("$")) {
    // console.log(text)
    slave = slaves.filter(function(slave) { return slave.id == slave_id; })[0]
    other_slave = slaves.filter(function(other_slave) { return other_slave.id == other_slave_id; })[0]
    // console.log(slave_id, other_slave_id)
    a = []
    if (typeof textvar !== 'undefined') {
      // console.log(textvar)
      textvar.forEach((item, i) => {
        a.push(eval(item))
      });
    }
    // console.log(...a)
    // console.log(text, slave.name, ...a)
    temptext = $.i18n(text, ...a)
    return temptext
  } else {
    return text
  }
}

function showResponse(result) {
  console.log(getFuncName())
  // console.log(result)
  $("#event-body").html(checkText(result));
  $("#event-body").append("<div class='modal-footer'><button type='button' class='btn btn-secondary' data-dismiss='modal'>Close</button></div>")
}

function responseEffects(effects) {
  console.log(getFuncName())
  pcXpChange(1)
  a = effects.split(",")
  // console.log(a)
  a.forEach((effect, i) => {
    eval(effect)
  });
}

function pcXpChange(amount) {
  console.log(getFuncName())
  xp = Math.floor(localStorage.getItem("xp"))
  xp += amount
  localStorage.setItem("xp", xp)
}

function pcRepChange(amount) {
  console.log(getFuncName())
  reputation = Math.floor(localStorage.getItem("reputation"))
  reputation += amount
  if (reputation > 100) {
    reputation = 100
  } else if (reputation < -100) {
    reputation = -100
  }
  localStorage.setItem("reputation", reputation)
  $("#reputation_counter").html("Reputation: " + reputation);
}

function pcMoneyChange(amount) {
  console.log(getFuncName())
  money = parseInt(localStorage.getItem("money"))
  console.log("original money", money)
  money += amount
  console.log("money changed to", money)
  localStorage.setItem("money", money)
  $("#money_counter").html("Money: " + money);
}

function pcKindnessChange(amount) {
  console.log(getFuncName())
  kindness = Math.floor(localStorage.getItem("pc_kindness"))
  kindness += amount
  localStorage.setItem("pc_kindness", kindness)
}

function pcActionChange(amount) {
  console.log(getFuncName())
  ac = Math.floor(localStorage.getItem("action_pts"))
  ac += amount
  localStorage.setItem("action_pts", ac)
}

function getOtherSlave(slave) {
  console.log(getFuncName())
  newone = getRandom(slaves)
  // console.log(slave.name, newone.name)
  if (newone.id === slave.id) {
    index = slaves.findIndex(s => s.id == slave.id)
    if (index < slaves.length) {
      other_slave = slaves[index + 1]
    } else {
      other_slave = slaves[index - 1]
    }
  } else {
    other_slave = newone
  }
  // console.log(slave.name, other_slave.name)
  if (other_slave === undefined) {
    index = slaves.findIndex(s => s.id == slave.id)
    if (index < slaves.length) {
      other_slave = slaves[index + 1]
    } else {
      other_slave = slaves[index - 1]
    }
  }
  // if (typeof other_slave == null) {
  //   newone = getRandom(slaves)
  //   if (newone.id !== slave.id) {
  //     other_slave = newone
  //   } else {
  //     // console.log("else")
  //     index = slaves.findIndex(s => s.id == slave.id)
  //     // console.log(index)
  //     if (index < slaves.length) {
  //       other_slave = slaves[index + 1]
  //     } else {
  //       other_slave = slaves[index - 1]
  //     }
  //   }
  // }
  return other_slave
}
