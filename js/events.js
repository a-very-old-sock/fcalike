function makeEvents(){
  console.log(getFuncName())
  var events = new Array()

  truth_array = []
  event_directory.forEach((event, i) => {
    event.prereqs.forEach((prereq, i) => {
      if (prereq.includes("slaves")) {
        truth_array.push(eval(prereq))
        // console.log(prereq, eval(prereq))
      } else if (prereq.includes("slave")) {
        slaves.forEach((slave, i) => {
          truth_array.push(eval(prereq))
          // console.log(prereq, slave.name, eval(prereq))
        });
      }
    });
    // console.log(truth_array)
    if (truth_array.every(Boolean)) {
      // console.log(event)
      events.push(event)
    }
    truth_array = []
  });
  // console.log(events)
  localStorage.setItem("events", JSON.stringify(events))
}

var event_directory = [
	{
		"id": 1,
		"tags": ["no-slaves"],
		"prereqs":["slaves.length < 1"],
		"text":"Without slaves to run your household, you're forced to do every little thing yourself.  Do you save money but damage your reputation by performing all the basic chores yourself, or do you save your reputation by renting slaves to attend your household tasks for the week?",
		"options": [
			{
				"text": "Do the chores yourself and damage your reputation.",
				"results":[
					{ "text": "Forced to do all your mundane household tasks yourself, you spend the week on your knees scrubbing floors and hauling laundry.  When your neighbors see you down on your knees like a common slave, they laugh behind your back, damaging your reputation.", "effects":["pcRepChange(-100)","pcMoneyChange(-0)"] }
				]
			},
			{
				"text": "Save face and rent slaves for §1000",
				"results":[
					{ "text": "Renting slaves from a neighbor has saved your reputation this week, but the expense of it will add up over time.", "effects":["pcMoneyChange(-1000)"] }
				]
			},
		]
	},
	{
		"id": 2,
		"tags": ["love"],
		"prereqs":["slaves.length > 0", "statLevel(slave, 'Love') >= 50"],
		"text":"<strong>$1</strong> says {{GENDER:$2|he|she}} loves you!",
    "textvar":["slave.name", "slave.gender"],
		"options": [
			{
				"text": "Say something kind to $1.",
        "textvar":["slave.name"],
				"results":[
					{ "text": "$1 looks pleased with your praise.", "textvar":["slave.name"], "effects":["pcKindnessChange(1)"] }
				]
			},
			{
				"text": "Spank $1 for getting above {{GENDER:$2|him|her}}self.",
        "textvar":["slave.name", "slave.gender"],
				"results":[
					{ "text": "$1 takes the spanking obediently, but you catch {{GENDER:$2|him|her}} crying silently as you send {{GENDER:$2|him|her}} away." , "textvar":["slave.name", "slave.gender"], "effects":["pcKindnessChange(-1)"] }
				]
			}
		]
	},
  {
    "id": 3,
    "tags": ["two"],
    "prereqs": ["slaves.length >= 2"],
    "text":"Passing through the courtyard one afternoon, you notice <strong>$1</strong> and <strong>$2</strong> bathing each other in the fountain in the middle of your courtyard, on display where anyone can watch.  They probably have other things to be doing, but so do you.",
    "textvar":["slave.name","other_slave.name"],
    "options":[
      {
        "text":"Say nothing and simply watch.",
        "textvar":"",
        "results":[
          {"text": "As you watch, $1 pours a bucket of cool water over $2`s skin, making $2 arch {{GENDER:$3|his|her}} back and moan in the sun.",
          "textvar":["slave.name", "other_slave.name", "other_slave.gender"],
          "effects":""}
        ]
      },
      {
        "text": "Tell them to get back to work.",
        "textvar":"",
        "results":[
          {"text": "$1 and $2 startle at the sound of your voice, dropping the buckets and soap they were using with a clatter.  They hurry back to their work, naked and shivering.",
          "textvar":["slave.name", "other_slave.name"],
          "effects":"pcKindnessChange(-1)"}
        ]
      },
      {
        "text": "Join them for a quick break",
        "textvar":"",
        "results":[
          {"text": "The water of the fountain is cool, but it`s an enjoyable break from your other business on a lovely afternoon.  You wave a hand and $1 kneels to pleasure you.",
          "textvar": ["slave.name"],
          "effects":"pcKindnessChange(1)"}
        ]
      },
      {
        "text": "Tell $1 to bend $2 over the fountain.",
        "textvar":["slave.name", "other_slave.name"],
        "results":[
          {"text": "$1 pushes $2 down to bend over the lip of the fountain for your view.  As you watch, $1 takes a vial of bath oil to pour over $2`s ass, making $2 moan and writhe.",
          "textvar": ["slave.name", "other_slave.name"],
          "effects":""}
        ]
      }
    ]
  },
  {
		"id": 4,
		"tags": ["hate"],
		"prereqs":["slaves.length > 0", "statLevel(slave, 'Love') <= -50"],
		"text":"$1 says {{GENDER:$2|he|she}} hates you.",
    "textvar":["slave.name","slave.gender"],
		"options": [
			{
				"text": "Slap {{GENDER:$1|him|her}}.",
        "textvar":["slave.gender"],
				"results":[
					{ "text": "You backhand $1 sharply across the face to show {{GENDER:$2|him|her}} what you think of {{GENDER:$2|his|her}} opinion.", "textvar":["slave.name", "slave.gender"], "effects":["pcKindnessChange(-5)", "harshAction(slave)"] }
				]
			},
			{
				"text": "Tell {{GENDER:$1|him|her}} that you're very disappointed but you hope to gain {{GENDER:$1|his|her}} trust soon.",
        "textvar":["slave.gender"],
				"results":[
					{ "text": "$1 frowns at you but goes away looking thoughtful.", "textvar":["slave.name", "slave.gender"], "effects":["pcKindnessChange(5)", "kindnessAction(slave)"] }
				]
			},
		]
	}
]

var btns = ["btn-outline-primary", "btn-outline-success", "btn-outline-info", "btn-outline-warning", "btn-outline-danger"]

//
// var joinThemResponse = function() {
//   has_dick = localStorage.getItem("pc_hasDick")
//   has_pussy = localStorage.getItem("pc_hasVagina")
//   if (has_dick != null) {
//     var genitals = "suck your cock"
//   } else if (has_pussy != null) {
//     var genitals = "lick your pussy"
//   } else {
//     var genitals = "show {{gender:$2|his|her}} obedience"
//   }
//   var response_text = $.i18n("The water of the fountain is cool, but it's an enjoyable break from your other business on a lovely afternoon.  $1 kneels to " + genitals + ".", slave.name, slave.gender)
//   pcKindnessChange(5)
//   return response_text
// }
//
// var bendOverBathResponse = function() {
//   if (other_slave.has_vagina == true) {
//     var finger_this = "pussy"
//     var adj = other_slave.vagina
//   } else {
//     var finger_this = "ass"
//     var adj = other_slave.ass
//   }
//   var response_text = $.i18n("$1 pushes $2 down to bend over the lip of the fountain for your view.  As you watch, $1 takes a vial of bath oil to pour over $2's $3 $4, making $2 moan and writhe.", slave.name, other_slave.name, adj, finger_this)
//   return response_text
// }
