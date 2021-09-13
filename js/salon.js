function viewSlaveSalon(slave_id) {
  console.log(getFuncName(), slave_id)

  $("#view_slave").addClass("hidden")
  getAttendants("bathhouse")
  slaves = JSON.parse(localStorage.getItem("slaves"))
  slave = slaves.find(slave => slave.id == slave_id)
  localStorage.setItem("current_slave_id", slave_id)
  current_page = "view_slave_salon"
  localStorage.setItem("current_page", current_page)
  // hideAll();
  hide_these = ["#bathhouse_list", "#slave_bathhouse_list", "#slave_bust", "#salon_slave_bust"]
  hide_these.forEach((item, i) => {
    $(item).empty()
  });

  document.getElementById("bathhouse_tab").classList.remove("hidden");
  makePortrait("#salon_slave_bust", slave_id, 2, "slaves");
  $("#salon_slave_bust").addClass("bust-2")
  $("#salon_slave_name").append("<h4>" + slave.name + " " + charismaAssessment(slave) + "</h4>")
  btns = ["#salon_buttons", "#save_buttons", "#salon_buttons_0"]
  btns.forEach((item, i) => {
    $(item).removeClass("hidden-button")
  });
  write_these = [{"thing": "pubic", "val": "slave.pubic"}, {"thing": "butt", "val": "slave.butt"}, {"thing": "eye_adj", "val": "slave.eye_adj"}]
  write_these.forEach((item, i) => {
    $("#" + item.thing + "_input").attr("placeholder", eval(item.val)).val(eval(item.val));
  });

  check_these = [{"check": "slave.has_breasts", "thing": "breasts", "val": "slave.breasts"}, {"check": "slave.has_vagina", "thing": "vagina", "val": "slave.vagina"}, {"check": "slave.has_penis", "thing": "penis", "val": "slave.penis"}, {"check": "slave.has_balls", "thing": "balls", "val": "slave.balls"}]
  check_these.forEach((item, i) => {
      $("#" + item.thing + "_input").attr("placeholder", "").val("");
    if (eval(item.check)) {
      $("#" + item.thing + "_input").removeClass("hidden-button")
      $("#" + item.thing + "_group").removeClass("hidden-button")
      $("#" + item.thing + "_input").attr("placeholder", eval(item.val)).val(eval(item.val));
    }
  });


  bathhouse = bldgLevel("bathhouse")
  if (bathhouse == 0) {
    $("#salon-warning").removeClass("hidden-button")
  } else if (bathhouse >= 1 && attendants.length >= 1) {
    $("#salon_buttons_1").removeClass("hidden-button")
  } else if (bathhouse >= 2 && attendants.length >= 1) {
    $("#salon_buttons_2").removeClass("hidden-button")
  } else if (bathhouse >= 3 && attendants.length >= 1) {
    $("#salon_buttons_3").removeClass("hidden-button")
  } else if (bathhouse >= 4 && attendants.length >= 1) {
    $("#salon_buttons_4").removeClass("hidden-button")
  } else if (bathhouse >= 5) {
    $("#salon_buttons_1").removeClass("hidden-button")
    $("#salon_buttons_2").removeClass("hidden-button")
    $("#salon_buttons_3").removeClass("hidden-button")
    $("#salon_buttons_4").removeClass("hidden-button")
    $("#salon_buttons_5").removeClass("hidden-button")
  }
}

$(document).ready(function() {
  $("#save_salon").click(function(){
    bonus = 0
    slaves = JSON.parse(localStorage.getItem("slaves"))
    attendants = []
    slaves.forEach((s, i) => {
      if (s.assignment.name == "bathhouse") {
        attendants.push(s)
      }
    });
    if (attendants.length >= 1) {
      attendants.forEach((a, i) => {
        bonus += statLevel(a, "Aesthetician")
        statTrue(a, "Aesthetician")
        changeStat(a, "Aesthetician", 1)
      });
      bonus = Math.round(bonus / attendants.length) + attendants.length
    }
    img_array = []
    $("#salon_slave_bust").children().each(
      function() {
        if ($(this).is(':visible')) {
          vis = ""
        } else {
          vis = "none"
        }
        img_array.push({"category": $(this).attr("class"), "id": Number($(this).attr("data-id")), "visibility": vis})
        // console.log("category", $(this).attr("class"), "id", $(this).attr("data-id"), "visibility", $(this).is(':visible'))
      }
    )
    comp_orig = slave.image.sort((a, b) => {
      if (a.category < b.category)
        return -1;
      if (a.category > b.category)
        return 1;
      return 0;
    })
    comp_new = img_array.sort((a, b) => {
      if (a.category < b.category)
        return -1;
      if (a.category > b.category)
        return 1;
      return 0;
    })
    comp_orig = JSON.stringify(comp_orig)
    comp_new = JSON.stringify(comp_new)
    if (comp_orig === comp_new) {
      // do nothing
    } else {
      slaves.find(s => s.id == slave.id).image = img_array
      changeStat(slave, "Charisma", bonus)
    }

    check_these = [{"thing": "pubic", "val": "slave.pubic"}, {"thing": "eye_adj", "val": "slave.eye_adj"}, {"thing": "butt", "val": "slave.butt"}, {"check": "slave.has_breasts", "thing": "breasts", "val": "slave.breasts"}, {"check": "slave.has_vagina", "thing": "vagina", "val": "slave.vagina"}, {"check": "slave.has_penis", "thing": "penis", "val": "slave.penis"}, {"check": "slave.has_balls", "thing": "balls", "val": "slave.balls"}]
    // slaves = JSON.parse(localStorage.getItem("slaves"))
    check_these.forEach((item, i) => {
      new_desc = $.trim( $('#' + item.thing + '_input').val() );
      if (new_desc != eval(item.val)) {
        s = slaves.find(s => s.id == slave.id)
        slaves.find(s => s.id == slave.id)[item.thing] = new_desc
        lvl = parseInt(statLevel(s, "Loyalty")) + parseInt(statLevel(s, "Obedience"))
        bldlvl = parseInt(bldgLevel("bathhouse")) + parseInt(bldgLevel("clinic"))
        kindness = parseInt(localStorage.getItem("pc_kindness"))
        luck = parseInt(localStorage.getItem("pc_luck"))
        rnd = randomNumber(0,100) + bldlvl + kindness + luck
        if (lvl <= (rnd * -1)) {
          changeStat(s, "Happiness", randomNumber(-20,0))
        } else {
          changeStat(s, "Happiness", randomNumber(0,10))
        }
      }
    });

    localStorage.setItem("slaves", JSON.stringify(slaves))
    saveButton("save_salon")
  });
});
