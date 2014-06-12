//= require bower_components/jquery/dist/jquery.min.js

$(function() {

  $('.match').each(function(i) {
    //console.info('match ' + i);

    var match_date, previous_date;

    match_date = $('.match__time',this).text().trim().substr(0,10);
    console.log(match_date);

    match_time = $('.match__time',this).text().trim().substr(-5);
    $('.match__time',this).text(match_time);

    if (i == 0) {
      $(this).before('<h2 class="matches__heading matches__heading--today">I dag</h2>');
    } else if (i == 1) {
      $(this).before('<h2 class="matches__heading matches__heading--tomorrow">I morgon</h2>');
    } else if (i > 3) {
      if (previous_date !== match_date) {
        $(this).before('<h2 class="matches__heading">' + match_date + '</h2>');
      }
    }

    previous_date = match_date;
  });

  // SVG fallback
  if (!Modernizr.svg) {
    $("img[src$='.svg']").each(function() {
      $(this).attr("src", $(this).data('fallback'));
    });
  }
});
