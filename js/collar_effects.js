function punishingCollar(slave) {
  var phrases = []
  var bad_collars = ["uncomfortable leather", "tight steel", "shock punishment", "leather with cowbell"]
  // var nice_collars = ["satin choker", "silk ribbon", "heavy gold", "pretty jewelry"]
  if (slave.responds_to == "severity") {
    bad_collars.forEach((collar, i) => {
      if (slave.collar == collar) {
        var change_these = ["Obedience", "Loyalty"]
        change_these.forEach((change_this, i) => {
          slave.scales.find(function(stat) {if(stat.name == change_this) return stat}).level += 2
          phrases.push(" and <span class='text-success'>grew more obedient</span> as a result")
        });
      }
    });
  } else if (slave.responds_to == "kindness") {
    bad_collars.forEach((collar, i) => {
      if (slave.collar == collar) {
        var change_these = ["Love"]
        change_these.forEach((change_this, i) => {
          slave.scales.find(function(stat) {if(stat.name == change_this) return stat}).level -= 2
          phrases.push(" and <span class='text-danger'>trusted you less</span> as a result")
        });
      }
    });
  }
  // console.log(phrases)
  return phrases
}

function humiliatingCollar(slave) {
  // var kinks = ["Humiliation", "Submitting"]
  var s = slave.kinks.find(function(stat) {if(stat.name == "Submitting") return stat}).level
  var h = slave.kinks.find(function(stat) {if(stat.name == "Humiliation") return stat}).level
  var phrases = []
    if (s >= 40 || h >= 40) {
      var change_these = ["Obedience", "Loyalty", "Happiness", "Libido"]
      change_these.forEach((change_this, i) => {
        slave.scales.find(function(stat) {if(stat.name == change_this) return stat}).level += 5
      });
      phrases.push(" <span class='text-success'>submitted obediently</span> to wearing a $2 collar this week")
    } else if (s <= -40 || h <= -40) {
      var change_these = ["Obedience", "Loyalty", "Happiness"]
      change_these.forEach((change_this, i) => {
        slave.scales.find(function(stat) {if(stat.name == change_this) return stat}).level -= 5
      });
      phrases.push(" <span class='text-danger'>hated</span> wearing a $2 collar this week")
    } else {
      var change_these = ["Submitting", "Humiliation"]
      change_these.forEach((change_this, i) => {
        slave.kinks.find(function(stat) {if(stat.name == change_this) return stat}).level += 1
        slave.scales.find(function(stat) {if(stat.name == "Obedience") return stat}).level += 2
      });
      phrases.push(" accepted wearing a $2 collar this week")
    }
  // console.log(phrases)
  return phrases
}
