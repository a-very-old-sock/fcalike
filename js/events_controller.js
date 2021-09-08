function getEvents() {
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
  if (other_slave == null) {
    console.log("null")
    getOtherSlave(slave)
  }
  // console.log("after get other " +slave.name, other_slave.name)
  // console.log(other_slave)
  $("#event-row").empty()
  $("#event-row").prepend("<div class='col bust-5' id='event-bust'></div>")
  makePortrait("#event-bust", slave.id, 5, "slaves")
  $("#event-bust").append("<h6 class='event-name'>"+slave.name+"</h6>")
  $("#event-row").append('<div class="col-9" id="event-body"></div>')
  if (this_one.tags.includes("two")) {
    // console.log("if tags include two " +slave.name, other_slave.name)
    $("#event-row").append("<div class='col bust-5' id='other-event-bust'></div>")
    makePortrait("#other-event-bust", other_slave.id, 5, "slaves")
    $("#other-event-bust").append("<h6 class='event-name'>"+other_slave.name+"</h6>")
  }
  // console.log("before event body " + slave.name, other_slave.name)
  $("#event-body").html(checkText(this_one.text, slave.id, other_slave.id, this_one.textvar));
  $("#event-body").append("</br>")

  this_one.options.forEach((option, i) => {
    // console.log("check options " + slave.name, other_slave.name)
    $("#event-body").append("<button type='button' class='btn "+ btns[i] +" choice-btn' onclick='showResponse(\"" + checkText(option.results[0].text, slave.id, other_slave.id, option.results[0].textvar) + "\"); responseEffects(\"" + option.results[0].effects + "\")'>" + checkText(option.text, slave.id, other_slave.id, option.textvar) + "</button>");
  });
}

function checkText(text, slave_id, other_slave_id, textvar) {
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
  // console.log(result)
  $("#event-body").html(checkText(result));
  $("#event-body").append("<div class='modal-footer'><button type='button' class='btn btn-secondary' data-dismiss='modal'>Close</button></div>")
}

function responseEffects(effects) {
  pcXpChange(1)
  a = effects.split(",")
  // console.log(a)
  a.forEach((effect, i) => {
    eval(effect)
  });
}

function pcXpChange(amount) {
  xp = Math.floor(localStorage.getItem("xp"))
  xp += amount
  localStorage.setItem("xp", xp)
}

function pcRepChange(amount) {
  reputation = Math.floor(localStorage.getItem("reputation"))
  reputation += amount
  localStorage.setItem("reputation", reputation)
  $("#reputation_counter").html("<h2>Reputation: " + reputation + "</h2>");
}

function pcMoneyChange(amount) {
  money = Math.floor(localStorage.getItem("money"))
  money += amount
  localStorage.setItem("money", money)
  $("#money_counter").html("<h2>Money: " + money + "</h2>");
}

function pcKindnessChange(amount) {
  kindness = Math.floor(localStorage.getItem("pc_kindness"))
  kindness += amount
  localStorage.setItem("pc_kindness", kindness)
}

function pcActionChange(amount) {
  ac = Math.floor(localStorage.getItem("action_pts"))
  ac += amount
  localStorage.setItem("action_pts", ac)
}

function getOtherSlave(slave) {
  newone = getRandom(slaves)
  // console.log(random.name + " and " + slave.name)
  if (newone.id === slave.id) {
    // console.log("else")
    index = slaves.findIndex(s => s.id == slave.id)
    // console.log(index)
    if (index < slaves.length) {
      other_slave = slaves[index + 1]
    } else {
      other_slave = slaves[index - 1]
    }
  } else {
    other_slave = newone
  }
  if (typeof other_slave == null) {
    newone = getRandom(slaves)
    if (newone.id !== slave.id) {
      other_slave = newone
    } else {
      // console.log("else")
      index = slaves.findIndex(s => s.id == slave.id)
      // console.log(index)
      if (index < slaves.length) {
        other_slave = slaves[index + 1]
      } else {
        other_slave = slaves[index - 1]
      }
    }
  }
  return other_slave
}
