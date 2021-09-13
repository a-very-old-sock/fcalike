function punishingCollar(slave) {
  console.log(getFuncName())
  var phrases = []
  var bad_collars = ["uncomfortable leather", "tight steel", "shock punishment"]
  if (bad_collars.includes(slave.collar)) {
    harshAction(slave)
    changeKink(slave, "Masochism", 2)
    if (slave.responds_to == "severity") {
      phrases.push(" and <span class='text-success'>grew more obedient</span> as a result")
    } else {
      phrases.push(" and <span class='text-warning'>trusted you less</span> as a result")
    }
  }
  return phrases
}

function humiliatingCollar(slave) {
  console.log(getFuncName())
  var s = kinkLevel(slave, "Submitting")
  var h = kinkLevel(slave, "Humiliation")
  var change_kink = ["Submitting", "Humiliation"]
  change_kink.forEach((item, i) => {
    changeKink(slave, item, 2)
  });
  var phrases = []
    if (s >= 40 || h >= 40) {
      var change_these = ["Obedience", "Loyalty", "Happiness", "Libido"]
      change_these.forEach((change_this, i) => {
        changeStat(slave, change_this, 5)
      });
      phrases.push(" <span class='text-success'>submitted obediently</span> to wearing a $2 collar this week")
    } else if (s <= -40 || h <= -40) {
      var change_these = ["Obedience", "Loyalty", "Happiness"]
      change_these.forEach((change_this, i) => {
        changeStat(slave, change_this, -5)
      });
      phrases.push(" <span class='text-danger'>hated</span> wearing a $2 collar this week")
    } else {
      var change_these = ["Obedience", "Loyalty"]
      change_these.forEach((change_this, i) => {
        changeStat(slave, change_this, 2)
      });
      phrases.push(" accepted wearing a $2 collar this week")
    }
  return phrases
}
