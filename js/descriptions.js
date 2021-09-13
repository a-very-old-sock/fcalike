function modalDescription(slave, div_id) {
  console.log(getFuncName());
  $(div_id).html($.i18n("description-intro", slave.name, slave.age, slave.eye_adj));
  if (slave.has_breasts === true) {
    $(div_id).append($.i18n("description-physical-breasts", slave.gender, slave.butt, slave.breasts));
  } else {
    $(div_id).append($.i18n("description-physical-chest", slave.gender, slave.butt, slave.chest));
  }
  if (slave.has_penis === true) {
    $(div_id).append($.i18n("description-physical-cock", slave.gender, slave.penis, slave.balls, slave.pubic_hair));
  } else {
    $(div_id).append($.i18n("description-physical-pubic", slave.gender, slave.pubic_hair));
  }
  $(div_id).append($.i18n("description-assessment", slave.gender, slave.charisma_desc));
};

function modalStatsBlock(stat_block, div_id) {
  console.log(getFuncName());
  // console.log(stat_block);
  $(div_id).empty()
  stat_block.forEach(function(stat, i) {
    // $(div_id).append("</br>");
    $(div_id).append("<h6 class='stat-name'>" + stat.name + "</h6>");
    if ((stat.type === 'stat' || stat.type === 'skill' || stat.type === 'job') && stat.known === true) {
      $(div_id).append("<div class='stat-bar'><div class='text-right text-light level-label'>" + stat.level + "</div><div class='stat-fill' style='width:"+ stat.level +"%'></div></div>");
    } else if (stat.known === true) {
      if (stat.level >= 0) {
        var templevel = stat.level
        var neglevel = 0
      } else {
        var templevel = 0
        var neglevel = stat.level * -1
      }
      $(div_id).append("<div class='scale-bar-neg'><div class='scale-fill " + scaleColor(stat.level) + "' style='width:"+ neglevel +"%'></div></div><div class='scale-bar'><div class='text-right text-light level-label'>" + stat.level + "</div><div class='scale-fill " + scaleColor(stat.level) + "' style='width:"+ templevel +"%'></div></div>");
    } else {
      $(div_id).append("<div class='stat-bar text-center'>UNKNOWN</div>")
    }
    $(div_id).append("</br>");
  });
};
