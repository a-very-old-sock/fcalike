function punishingCollar(slave) {
  var phrases = []
  var bad_collars = ["uncomfortable leather", "tight steel", "shock punishment", "leather with cowbell"]
  if (slave.responds_to == "severity") {
    bad_collars.forEach((collar, i) => {
      if (slave.collar == collar) {
        var change_these = ["Obedience", "Loyalty"]
        change_these.forEach((change_this, i) => {
          changeStat(slave, change_this, 2)
          phrases.push(" and <span class='text-success'>grew more obedient</span> as a result")
        });
      }
    });
  } else if (slave.responds_to == "kindness") {
    bad_collars.forEach((collar, i) => {
      if (slave.collar == collar) {
        var change_these = ["Love"]
        change_these.forEach((change_this, i) => {
          changeStat(slave, change_this, -2)
          phrases.push(" and <span class='text-danger'>trusted you less</span> as a result")
        });
      }
    });
  }
  return phrases
}

function humiliatingCollar(slave) {
  var s = statLevel(slave, "Submitting")
  var h = statLevel(slave, "Humiliation")
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
      var change_these = ["Submitting", "Humiliation", "Obedience"]
      change_these.forEach((change_this, i) => {
        changeStat(slave, change_this, 2)
      });
      phrases.push(" accepted wearing a $2 collar this week")
    }
  return phrases
}
