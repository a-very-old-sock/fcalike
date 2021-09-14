function makeWiki() {
  $("#wiki_contents").empty();
  wiki.forEach((item, i) => {
    $("#wiki_toc").append("<li class='list-group-item'><a href='#" + lowercase(item.section_title.replaceAll(' ', '_')) + "_wiki'>" + item.section_title + "</a></li>");
  });

  wiki.forEach((item, i) => {
    div_id = lowercase(item.section_title.replaceAll(' ', '_'));
    $("#wiki_contents").append("<div id='" + div_id + "_wiki'></div>");
    $("#" + div_id + "_wiki").append("<h3>" + item.section_title + "</h3>");
    console.log(div_id)
    item.section_contents.forEach((s_c, i) => {
      $("#" + div_id + "_wiki").append(s_c.overview)
      s_c.subsections.forEach((sub, i) => {
        sub_id = lowercase(sub.title.replaceAll(' ', '_'))
        $("#" + div_id + "_wiki").append("<div id='" + sub_id + "_wiki_sub' class='ml-5'></div>")
        $("#" + sub_id + "_wiki_sub").append("<h5 class='wiki_subitem'>" + sub.title + "</h5>");
        $("#" + sub_id + "_wiki_sub").append(sub.contents)
      });
    });
  });
}

var wiki = [
  {
    "section_title": "Slaves respond to",
    "section_contents": [
      {
        "overview": "<p>Slaves have distinct personalities, and some respond better to <span class='text-success'>kind</span> treatment, while others respond best to <span class='text-warning'>harsh</span> treatment.  A slave who responds to kindness will have their <span class='text-info'>Love</span>, <span class='text-info'>Loyalty</span>, <span class='text-info'>Obedience</span>, and <span class='text-info'>Happiness</span> raised by a kind action, while a slave who responds to severity will have those stats lowered.  Likewise, a slave who responds to severity will have <span class='text-info'>Love</span>, <span class='text-info'>Loyalty</span>, <span class='text-info'>Obedience</span>, and <span class='text-info'>Happiness</span> raised by harsh treatment, but a slave who responds to kindness will become more disloyal, fearful, disobedient and unhappy if treated harshly.</p><p>When you first acquire a slave, you will not know whether they respond to kindness or severity.  After you discover what they respond to, their profile summary will state 'In your experience, this slave responds best to ____.'  Slaves who respond to kindness or severity will also respond to the player's kindness stat.</p><p>Rarely, a very happy slave who responds to kindness may change to only respond to severity, and a very unhappy slave who responds to severity may change to only respond to kindness.</p>",
        "subsections": [
          {
            "title": "Kind actions",
            "contents": "<p>Assigning slaves to rest, serve your household, please you (if the slave is attracted to your gender), or do a job the slave is good at positively effect slaves who respond to kindness and negatively effect slaves who respond to severity.  Some events also allow you to treat your slaves with kindness.</p>"
          },
          {"title": "Harsh actions",
            "contents": "<p>Assigning slaves to work a gloryhole, be put out for public use, please you (if the slave is not attracted to your gender), or be confined will positively affect the stats of slaves who respond to severity and negatively affect the stats of slaves who respond to kindness.  Clothing your slaves only in rags or chains, or giving them a tight steel, uncomfortable leather, or shock punishment collar will also treat slaves harshly.  Some events also allow you to treat your slaves with severity.</p>"}
        ]
      }
    ]
  },
  {
    "section_title": "Slaves stats",
    "section_contents": [
      {
        "overview": "<p>Slaves have a number of stats that affect how they respond to you and interact with one another.  Personality stats (including Intelligence, Charisma, and Stength) are difficult to change and affect Mood stats (which include Obedience, Love, Loyalty, Honesty, Health, Libido, and Happiness).  Mood stats also interact to change one another if they are extreme.  Personality stats can only be 0 to 100, but Mood stats can be -100 to 100.  (A slave can have negative Love and dislike you, but a slave can't have negative Intelligence, for example.)</p><p>When you first acquire a slave, many of their traits will be unknown to you.  Interacting with your slaves, higher intelligence, and higher experience will help you discover more about them.</p>",
        "subsections": [
          {
            "title": "Intelligence",
            "contents": "<p>An intelligent slave will learn skills more quickly and be better at many jobs, but intelligent slaves are more likely to be unhappy, rebellious, or escape.</p>"
          },
          {"title": "Charisma",
            "contents": "<p>Charisma is a measure of how attractive you and others find the slave regardless of physical appearance (or image).  A charismatic slave will attract more customers, get better prices, and raise your reputation more.  Charisma can be raised by changing the slave's appearance in an upgraded bathhouse staffed with aestheticians.</p>"},
          {
            "title": "Strength",
            "contents": "<p>Strength helps slaves perform better as a guard, gardener, or chef, or when assigned to serve your household.  Strength can decrease if a slave is very ill or injured.</p>"
          },
          {
            "title": "Obedience",
            "contents": "<p>A slave's obedience influences how well they follow your rules and how much mistreatment they will tolerate.  A disobedient slave is more likely to run away or steal from you.</p>"
          },
          {
            "title": "Love",
            "contents": "<p>A slave's love or hate for you will influence their happiness, obedience, and loyalty.</p>"
          },
          {
            "title": "Loyalty",
            "contents": "<p>A slave who is very loyal will tolerate more extreme behavior from you before becoming unhappy.  A slave who is very disloyal is more likely to steal from you, attempt to escape, or betray you to your enemies.</p>"
          },
          {
            "title": "Honesty",
            "contents": "<p>A dishonest slave will make it harder to discover their traits (including their literacy, skills, and what they respond to).  Dishonest slaves are also more likely to steal from you or attempt to escape.</p>"
          },
          {
            "title": "Health",
            "contents": "<p>Slaves can be injured or become ill while performing tasks, especially by customers while assigned to whore.  If many of your slaves have poor health, it increases the chance that your healthy slaves will become gradually more ill.  Having more slaves than your estate has room for will cause all slaves to gradually become ill.</p>"
          },
          {
            "title": "Libido",
            "contents": "<p>A slave with high libido will be more likely to initiate relationships with other slaves and be happy with sexual assignments (including whoring, pleasing you, working a gloryhole, and public use).</p>"
          },
          {
            "title": "Happiness",
            "contents": "<p>A slave who is very happy will become more obedient and loyal over time, while a slave who is very unhappy will become less obedient and less loyal.  A slave who is happy and healthy will grow to love you more over time.</p>"
          }
        ]
      }
    ]
  },
  {
    "section_title": "Slave sexual skills",
    "section_contents": [
      {
        "overview": "<p>Slaves have a number of sexual skill that can be improved over time.  Sexual skills are different from kinks, many of which have the same names, because a slave can be good at a sexual act but not enjoy it.  Sexual skills can be improved through frequent use or training, and increase the money or reputation a slave brings you from various assignments.</p><p>Unless you buy from a specialty shop, most slaves' sexual skills and kinks will be unknown to you when you acquire them.  Interact with your slave to learn more about their kinks and skills.  Some assignments will also reveal skills and kinks.  A slave with more known higher sexual skills commands a higher price on resale.</p>",
        "subsections":[]
      }
    ]
  },
  {
    "section_title": "Slave kinks",
    "section_contents": [
      {
        "overview": "<p>Slave kinks are different from and more extensive than sexual skills.  Skills can only be 0 to 100, while kinks can be -100 to 100.  A slave can dislike a skill they are good at.  High libido has a chance to make a slave like a kink they previously disliked, while low libido can gradually cause a slave to dislike kinks they previously liked.  Kinks, including attraction to men or women, can be influenced through frequent use, certain assignments, collars, and clothing.  Brothel customers will sometimes tip more for a slave who strongly loves or hates a kink.</p>",
        "subsections": [
          {
            "title": "Attraction to Men or Women",
            "contents": "<p>The attraction kinks indicate how attracted the slave is to you, customers, and other slaves of that gender.  A negative attraction stat indicates the slave is repulsed by sex with that gender.  Genitals do not affect slave attraction kinks.  A slave who is attracted to men will still respond positively to a slave, customer, or player whose gender is male even if they do not have a penis.</p>"
          },
          {
            "title": "Domination and Submission",
            "contents": "<p>Going without a collar will make a slave more dominating, while wearing any collar will make a slave enjoy submitting more over time.  Domination and submission kinks are independent of obedience.  Some jobs, such as being a guard or teacher, will increase a slave's domination kink over time, while working as an aesthetician will make a slave more submissive.</p>"
          },
          {
            "title": "Getting fucked, fucking, and anal",
            "contents": "The getting fucked skill and kink describe how much a slave enjoys and is good at being penetrated vaginally or anally.  If a slave enjoys getting fucked but dislike anal (or vice versa), they will physically enjoy being fucked anally and have their libido raised but become unhappy.  The fucking skill and kink describe how much a slave enjoys and is good at penetrating someone else with a penis or strapon."
          }
        ]
      }
    ]
  },
  {
    "section_title": "Slave jobs and job skills",
    "section_contents": [
      {
        "overview": "<p>Job skills determine how well a slave does the corresponding job.  If a slave is highly skilled at a job, they will be happier when assigned to that job.  Job skills can be discovered by assigning the slave to that job, or to serve your household.  Because they work independently and interact with free people outside of your supervision, slaves employed in jobs are likely to become literate.  Slaves with high intelligence will acquire job skills when assigned to a job.  Slaves with high teaching skills will teach job skills to other slaves they are assigned to the same job with.</p>",
        "subsections": [
          {
            "title": "Aesthetician",
            "contents": "<p>Aestheticians require a bathhouse to work in.  Skilled Aestheticians allow you to modify your slaves' appearance more extensively, and raise slaves' charisma.</p>"
          },
          {
            "title": "Accountant",
            "contents": "<p>Accountants require an office to work in.  Skilled Accountants allow you to invest your money, bribe tax officials, and catch slaves who steal money.</p>"
          },
          {
            "title": "Guard",
            "contents": "<p>Guards require a guardhouse to work in.  Skilled Guards protext you from your enemies and help lower the chance of successful escape attempts.</p>"
          },
          {
            "title": "Gardener",
            "contents": "<p>Gardeners require a garden to work in.  Skilled Gardeners reduce household expenses and have a chance of upgrading your gardens without cost.</p>"
          },
          {
            "title": "Chef",
            "contents": "<p>Chefs require a kitchen to work in.  Skilled Chefs enhance your reputation when you throw parties.</p>"
          },
          {
            "title": "Tailor",
            "contents": "<p>Tailors require a workshop to work in.  Skilled Tailors can create more types of clothing for your slaves.</p>"
          },
          {
            "title": "Secretary",
            "contents": "<p>Secretaries require a library to work in.  Skilled secretaries get you invited to more parties and reduce slave disobedience.</p>"
          },
          {
            "title": "Teacher",
            "contents": "<p>Teachers require a training room to work in to teach sexual skills or change kinks. Slaves who are skilled teachers who are assigned to other jobs will also teach those skills to other slaves they're assigned with more quickly.</p>"
          },
          {
            "title": "Medic",
            "contents": "<p>Medics require a clinic to work in.  Skilled Medics allow you to surgically add or remove a slave's penis, balls, breasts, or vagina.  Skilled Medics reduce the negative effects to slaves' health when doing surgery.</p>"
          },
          {
            "title": "Whore",
            "contents": "<p>Whores do <strong>not</strong> require a brothel to work in, but skilled Whores will command higher prices when assigned to whore and your estate has a brothel.  Slaves with high charisma and sexual skills attract more customers and command higher prices.  Slaves assigned to whore will be available for your guests' use when you throw parties.</p>"
          },
          {
            "title": "Rest",
            "contents": "<p>A slave who is assigned to rest will grow more healthy, but may grow less obedient.  Slaves who respond to kindness will respond more positively to resting, while slaves who respond to severity will become more disloyal.</p>"
          },
          {
            "title": "Work a gloryhole",
            "contents": "<p>A slave assigned to work a gloryhole serves a random number of customers depending on the level of your brothel, and their prices are not affected by their charisma or skills.  Slaves who respond to kindness will become unhappy and disobedient, while slaves who respond to severity will become more obedient.  Slaves assigned to a gloryhole will be available for your guests' use when you throw parties.</p>"
          },
          {
            "title": "Please you",
            "contents": "<p>A slave assigned to please you adds to your reputation based on their charisma.  If a slave is attracted to your gender, it will gradually increase their libido.  If a slave is not attracted to your gender, the longer they are assigned to please you, there is an increasing chance they will become attracted to your gender.  Assigning a slave to please you makes it more likely you will discover things about them.  Slaves assigned to please you will be available for your guests' use when you throw parties.</p>"
          },
          {
            "title": "Public use",
            "contents": "<p>A slave assigned to public use is offered for free use by your neighbors and increases your reputation based on their charisma.  A slave who responds to severity will become more obedient when assigned to public use, and a slave who responds to kindness will become unhappy and disobedient.  Slaves assigned to public use will be available for your guests' use when you throw parties.</p>"
          },
          {
            "title": "Stay confined",
            "contents": "<p>A slave who is confined for the week will become more obedient.  A staffed guardhouse will increase the effect.  A slave who responds to severity will become obedient more quickly than a slave who responds to kindness.  Punishing a slave with confinement will make them more obedient, but it also risks damaging their intelligence, charisma, strength, sexual skills and job skills.</p>"
          },
          {
            "title": "Serve the household",
            "contents": "<p>A slave assigned to serve your household does general work as a servant and save your household money based on their strength, intelligence, and job skills.  A slave who responds to kindness will become more obedient and loyal, while a slave who responds to severity will become disobedient.  Assigning a slave to serve your household gives a chance to discover their job skills.  Slaves assigned to serve your household will be available for your guests' use when you throw parties.</p>"
          }
        ]
      }
    ]
  },
  {
    "section_title": "Player stats",
    "section_contents": [
      {
        "overview": "<p>As the owner of the estate, you have three main stats: Intelligence, Stamina, and Luck.  Your Reputation, Kindness, Money, and Experience will also be affected by your choices.</p>",
        "subsections": [
          {
            "title": "Player Reputation and Kindness",
            "contents": "<p>Reputation is how your peers perceive you, while kindness is how your slaves perceive you.  As a slave owner, you understand well how your peers see you, but you can only indirectly know how your slaves see you.  Being known for extreme kindness or severity towards your slaves may affect your reputation among your peers.</p>"
          },
          {"title": "Money",
            "contents": "<p>The most straightforward stat.  Make lots and don't run out. Running into debt puts you at risk of being sold into slavery yourself.</p>"},
          {
            "title": "Player Experience",
            "contents": "<p>Interacting with your slaves gives you more experience, making you more likely to discover more about them.</p>"
          },
          {
            "title": "Player Intelligence",
            "contents": "<p>You need to be smarter than your slaves to catch them being disobedient or dishonest.  Higher intelligence makes you more likely to discover things about them like kinks and traits.</p>"
          },
          {
            "title": "Player Stamina",
            "contents": "<p>Interacting with your slaves and attending to your own affairs takes stamina, and you have a limited amount of it.  Most actions cost action points, which are determined by your stamina.  Exercise (under Manage Estate) to raise your stamina.  Rarely, illnesses can cause you to lose stamina.</p>"
          }
        ]
      }
    ]
  },
  {
    "section_title": "Facilities",
    "section_contents": [
      {
        "overview": "<p>In the Manage Estate tab, you can pay to renovate your estate to build or renovate many facilities.  Most facilities require at least one slave assigned to work there in order to access the functions of that facility.  Fully upgraded facilities (at Level 5) do not require any staff, but will grant more benefits when staffed.</p>",
        "subsections": [
          {
            "title": "Dormitories",
            "contents": "<p>Dormitories do not require a slave to be staffed.  Upgrading the dormitories grants more beds to safely house your slaves.  Your estate starts with enough beds for five slaves.  When fully upgraded, your estate can house thirty slaves safely.  If you own more slaves than you have beds for, all of your slaves will gradually become more ill.</p>"
          },
          {
            "title": "Bathhouse",
            "contents": "<p>The bathhouse requires at least one aesthetician to function until it is fully upgraded.  Depending on the level, the bathhouse grants you the ability to change different aspects of your slaves' appearance and raise their charisma.  A bathhouse increases the health benefits of rest for any slave assigned to rest.  A fully upgraded bathhouse does not require any staff to function.</p>"
          },
          {
            "title": "Brothel",
            "contents": "<p>The brothel requires at least one whore to function.  A brothel makes your slaves assigned to whore less likely to be injured by customers and increases the prices they can charge.  An upgraded brothel allows you to specialize in order to increase prices and demand.</p>"
          },
          {
            "title": "Kitchens",
            "contents": "<p>The kitchens require at least one chef to function until fully upgraded.  A staffed kitchen increases the health of all your slaves, lowers your household expenses, and allows you to host parties.</p>"
          },
          {
            "title": "Guardhouse",
            "contents": "<p>The guardhouse requires at least one guard to function until fully upgraded.  A staffed guardhouse increases obedience, lowers the ability of slaves to succesfully escape, increases the effects of confinement, and gives you additional options to punish slaves.</p>"
          },
          {
            "title": "Gardens",
            "contents": "<p>The gardens require at least one gardener to function until fully upgraded.  Skilled gardeners have a chance of upgrading your gardens without cost.  Gardens raise your reputation, lower household expenses, and have a chance of positively affecting your slaves.</p>"
          },
          {
            "title": "Training Room",
            "contents": "<p>The training room requires at least one teacher to function until fully upgraded.  The training room allows your slaves to be assigned to exercise, allows you to directly train slaves to change their stats, skills, and kinks, and allows you to assign teachers to train slaves during the week.</p>"
          },
          {
            "title": "Library",
            "contents": "<p>The library does not require staff to function, but provides a place for secretaries to work.  The library increases the effects of other facilities, but it has a chance of making your slaves literate and more rebellious.</p>"
          },
          {
            "title": "Office",
            "contents": "<p>The office requires at least one accountant to function until fully upgraded.  The office allows you to invest your money, bribe tax officials to lower your tax rate, and increases the chance that your accountants will catch slaves who steal from you.</p>"
          },
          {
            "title": "Workshop",
            "contents": "<p>The workshop requires at least one tailor to function until fully upgraded.  The workshop allows your tailors to make more types of clothing.</p>"
          },
          {
            "title": "Clinic",
            "contents": "<p>The clinic requires at least one medic to function until fully staffed.  The clinic allows you to heal sick and injured slaves, perform surgery, and administer drugs.</p>"
          }
        ]
      }
    ]
  }

]
