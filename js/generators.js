//return a random age in a range around the input age
function randomAge(age) {
  min = age - 10;
  if (min < 18) {
    min = 18
  }
  max = age + 10;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomLevel(level) {
  min = level - 15;
  if (min < -100) {
    min = -100
  }
  max = level + 15;
  if (max > 100) {
    max = 100
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function charismaWord(slave) {
  var adjective = ""
  // console.log(adjective);
  var charisma = slave.stats.find(function(stat) {if(stat.name == "Charisma") return stat}).level
  // console.log(charisma);
  if (charisma <= 20) {
    adjectives = revolting;
    adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  } else if (charisma > 20 && charisma <= 50) {
    adjectives = acceptable;
    adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  } else if (charisma > 50 && charisma <= 80) {
    adjectives = good;
    adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  } else {
    adjectives = superb;
    adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  }
  return adjective
};

function statMaker(name, type, level, known, known_mod) {
  var stat_constructor = function Stat(){
    this.name = Stat.defaultName;
    this.level = Stat.defaultLevel;
    this.type = Stat.defaultType;
    this.known = Stat.defaultKnown;
  };

  stat_constructor.defaultName = name;

  if (type === "scale" || type === "kink") {
    stat_constructor.defaultLevel = randomNumber(-100,100);
  } else if (type === "stat" || type === "skill") {
    stat_constructor.defaultLevel = randomNumber(0,100);
  } else {
    stat_constructor.defaultLevel = randomNumber(0,5);
    // console.log("stat:" + stat_constructor.defaultLevel);
  }
  // console.log(stat_constructor.defaultName + stat_constructor.defaultLevel)
  var roll = randomNumber(0,100);
  if (roll > 50 + known_mod) {
    known = true
  } else {
    known = false
  }
  stat_constructor.defaultKnown = known;
  stat_constructor.defaultType = type;
  // console.log(stat_constructor)
  return stat_constructor;
  // console.log(stat_constructor.defaultLevel);
};

function buildStatBlock(array, type, known_mod) {
  var stats = new Array(array.length);
  // console.log(array)
  array.forEach(function(stat, i) {
    var NewStat = statMaker(stat, type, 50, true, known_mod);
    var new_stat = new NewStat;
    stats[i] = new_stat;
  });
  // console.log(stats);
  return stats
};

// create a random slave
function slaveMaker(age, gender, known_mod) {
  var slave_constructor = function Slave(){
    this.id = Slave.defaultID;
    this.name = Slave.defaultName;
    this.age = Slave.defaultAge;
    this.gender = Slave.defaultGender;
    this.weeks_owned = Slave.defaultWeeksOwned;
    this.responds_to = Slave.defaultResponds;
    this.responds_known = Slave.defaultRespondsKnown;
    this.charisma_desc = Slave.defaultDesc;
    this.skin = Slave.defaultSkin;
    this.eye_adj = Slave.defaultEyeAdj;
    this.eye_color = Slave.defaultEye;
    this.face = Slave.defaultFace;
    this.hair_color = Slave.defaultHair;
    this.hair_style = Slave.defaultHairStyle;
    this.butt = Slave.defaultButt;
    this.pubic_hair = Slave.defaultPubic;
    this.has_breasts = Slave.defaultHasBreasts;
    this.breasts = Slave.defaultBreasts;
    this.has_chest = Slave.defaultHasChest;
    this.chest = Slave.defaultChest;
    this.has_penis = Slave.defaultHasPenis;
    this.penis = Slave.defaultPenis;
    this.has_vagina = Slave.defaultHasVagina;
    this.vagina = Slave.defaultVagina;
    this.price = Slave.defaultPrice;
    this.stats = Slave.defaultStats;
    this.scales = Slave.defaultScales;
    this.kinks = Slave.defaultKinks;
    this.jobs = Slave.defaultJobs;
    this.skills = Slave.defaultSkills;
    this.assignment = Slave.defaultAssignment;
    this.assignment_weeks = Slave.defaultAssignmentWeeks;
    this.end_of_week_report = Slave.defaultReport;
    this.status = Slave.defaultStatus;
    this.money = Slave.defaultMoney;
    this.literacy = Slave.defaultLiteracy;
    this.literacy_known = Slave.defaultLiteracyKnown;
    this.living = Slave.defaultLiving;
    this.living_weeks = Slave.defaultLivingWeeks;
    this.follows_rules = Slave.defaultRules;
    this.clothing = Slave.defaultClothing;
    this.clothing_weeks = Slave.defaultClothingWeeks;
    this.collar = Slave.defaultCollar;
    this.collar_weeks = Slave.defaultCollarWeeks;
    this.follows_rules = Slave.defaultFollows;
    this.image = Slave.defaultImage;
  };

  slave_constructor.defaultID = Date.now() + randomNumber(0,10000);
  slave_constructor.defaultAge = randomAge(age);
  slave_constructor.defaultResponds = getRandom(responds_to);
  var roll = randomNumber(0,100)
  if (randomNumber > 50 + known_mod) {
    slave_constructor.defaultRespondsKnown = true;
  } else {
    slave_constructor.defaultRespondsKnown = false;
  }
  slave_constructor.defaultWeeksOwned = 0;
  slave_constructor.defaultReport = [];
  slave_constructor.defaultStatus = "none";
  slave_constructor.defaultMoney = 0;
  slave_constructor.defaultLiving = "adequate";
  slave_constructor.defaultLivingWeeks = 0
  slave_constructor.defaultRules = true;
  slave_constructor.defaultClothing = "nothing";
  slave_constructor.defaultClothingWeeks = 0
  slave_constructor.defaultCollar = "none";
  slave_constructor.defaultCollarWeeks = 0
  slave_constructor.defaultFollows = true;

  slave_constructor.defaultSkin = getRandom(skin_color);
  slave_constructor.defaultEyeAdj = getRandom(eye_adj);
  slave_constructor.defaultEye = getRandom(eye_color);
  slave_constructor.defaultFace = getRandom(face);
  slave_constructor.defaultHair = getRandom(hair_color);
  slave_constructor.defaultHairStyle = getRandom(hair_style);
  slave_constructor.defaultButt = getRandom(butt);
  slave_constructor.defaultPubic = getRandom(pubic_hair);

  //build the stats and scales
  var stats_to_build = [];
  stats_to_build = buildStatBlock(slave_stats, "stat", known_mod);
  slave_constructor.defaultStats = stats_to_build;
  stats_to_build = [];
  slave_constructor.defaultDesc = "charisma_word";

  stats_to_build = [];
  stats_to_build = buildStatBlock(slave_scales, "scale", known_mod);
  slave_constructor.defaultScales = stats_to_build;

  // console.log("scales" + stats_to_build)
  stats_to_build = [];
  stats_to_build = buildStatBlock(slave_skills, "skill", known_mod);
  slave_constructor.defaultSkills = stats_to_build;
  // console.log("skills" + stats_to_build)

  stats_to_build = [];
  stats_to_build = buildStatBlock(slave_kinks, "kink", known_mod);
  slave_constructor.defaultKinks = stats_to_build;
  // console.log("kinks" + stats_to_build)

  stats_to_build = [];
  stats_to_build = buildStatBlock(slave_jobs, "job", known_mod);
  slave_constructor.defaultJobs = stats_to_build;

  slave_constructor.defaultLiteracy = isTrue();
  slave_constructor.defaultLiteracyKnown = isTrue();

  // calculate price
  slave_constructor.defaultPrice = 0;
  slave_constructor.defaultPurchased = 0;

  if (gender == "u") {
    var genders = ["male", "female"];
    slave_constructor.defaultGender = getRandom(genders);
  } else {
    slave_constructor.defaultGender = gender;
  }

  slave_constructor.defaultImage = createPortrait(slave_constructor.defaultGender, isTrue(), 3);
  // console.log(slave_constructor.defaultImage)

  if (slave_constructor.defaultGender == "male") {
    slave_constructor.defaultName = getRandom(male_names);
    slave_constructor.defaultHasBreasts = false;
    slave_constructor.defaultBreasts = "";
    slave_constructor.defaultHasChest = true;
    slave_constructor.defaultChest = getRandom(chest);
    slave_constructor.defaultHasPenis = true;
    slave_constructor.defaultPenis = getRandom(penis);
    slave_constructor.defaultHasVagina = false;
    slave_constructor.defaultVagina = "";
  } else {
    slave_constructor.defaultName = getRandom(female_names);
    slave_constructor.defaultHasBreasts = true;
    slave_constructor.defaultBreasts = getRandom(breasts);
    slave_constructor.defaultHasChest = false;
    slave_constructor.defaultChest = "";
    slave_constructor.defaultHasPenis = false;
    slave_constructor.defaultPenis = "";
    slave_constructor.defaultHasVagina = true;
    slave_constructor.defaultVagina = getRandom(vagina);
  }

  var NewAssignment = assignmentMaker("rest", "rest", "none");
  var new_assignment = new NewAssignment;
  slave_constructor.defaultAssignment = new_assignment;
  slave_constructor.defaultAssignmentWeeks = 0;

  return slave_constructor;
};

function calculatePrice(slave) {
  charisma = slave.stats.find(function(stat) {if(stat.name == "Charisma") return stat}).level
  var price_mod = 0;
  var stats_price = slave.stats.forEach(function(stat) {
    if (stat.known == "true") {
      price_mod += stat.level;
    }
  })
  var scales_price = slave.scales.forEach(function(stat) {
    if (stat.known == "true") {
      price_mod += stat.level;
    }
  })
  var kinks_price = slave.kinks.forEach(function(stat) {
    if (stat.known == "true") {
      price_mod += stat.level;
    }
  })
  var skills_price = slave.skills.forEach(function(stat) {
    if (stat.known == "true") {
      price_mod += stat.level;
    }
  })
  var jobs_price = slave.jobs.forEach(function(stat) {
    if (stat.known == "true") {
      price_mod += stat.level;
    }
  })

  price = ((randomNumber(100, 150) - slave.age) * charisma) + price_mod;
  if (price < 100) {
    price = randomNumber(100, 150)
  }
  slave.price = price
}

function assignmentMaker(name, type, building) {
  var assignment_constructor = function Assignment() {
    this.name = Assignment.defaultName;
    this.type = Assignment.defaultType;
    this.building = Assignment.defaultBldg;
    // this.attribute = Assignment.defaultAttr;
    // this.attribute_level = Assignment.defaultLevel;
  };

  assignment_constructor.defaultName = name;
  assignment_constructor.defaultType = type;
  assignment_constructor.defaultBldg = building;
  // assignment_constructor.defaultAttribute = attribute;
  // assignment_constructor.defaultLevel = attribute_level;

  return assignment_constructor;
}
