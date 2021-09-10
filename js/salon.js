function viewSlaveSalon(slave_id) {
  console.log(getFuncName())
  $("#view_slave").addClass("hidden")
  getAttendants("bathhouse")
  slaves = JSON.parse(localStorage.getItem("slaves"))
  slave = slaves.find(slave => slave.id == slave_id)
  localStorage.setItem("current_slave_id", slave_id)
  current_page = "view_slave_salon"
  localStorage.setItem("current_page", current_page)
  // hideAll();
  $("#bathhouse_list").empty()
  $("#slave_bathhouse_list").empty()
  document.getElementById("bathhouse_tab").classList.remove("hidden");
  makePortrait("#salon_slave_bust", slave_id, 2, "slaves");
  btns = ["#salon_buttons", "#save_buttons", "#salon_buttons_0"]
  btns.forEach((item, i) => {
    $(item).removeClass("hidden-button")
  });

  bathhouse = bldgLevel("bathhouse")
  if (bathhouse == 0) {
    $("#salon_buttons").append("<p>Without a bathhouse or aestheticians, you can't change your slaves' appearances further.  Upgrade your bathhouse and employ an aesthetician to gain more options.</p>")
  } else if (bathhouse >= 1 && attendants.length >= 1) {
    $("#salon_buttons_1").removeClass("hidden-button")
  } else if (bathhouse >= 2 && attendants.length >= 1) {
    $("#salon_buttons_2").removeClass("hidden-button")
  } else if (bathhouse >= 3 && attendants.length >= 1) {
    $("#salon_buttons_3").removeClass("hidden-button")
  } else if (bathhouse >= 4 && attendants.length >= 1) {
    $("#salon_buttons_4").removeClass("hidden-button")
  } else if (bathhouse >= 5 && attendants.length >= 1) {
    $("#salon_buttons_1").removeClass("hidden-button")
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
        img_array.push({"category": $(this).attr("class"), "id": $(this).attr("data-id"), "visibility": vis})
        // console.log("category", $(this).attr("class"), "id", $(this).attr("data-id"), "visibility", $(this).is(':visible'))
      }
    )
    diff = slave.image.filter(({ value: id1 }) => !img_array.some(({ value: id2 }) => id2 === id1));
    if (diff.length >= 1) {
      slave.image = img_array
      changeStat(slave, "Charisma", bonus)
    }
    localStorage.setItem("slaves", JSON.stringify(slaves))
    saveButton("save_salon")
  });
});
