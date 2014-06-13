//= require bower_components/jquery/dist/jquery.min.js

$(function() {
  var nearFuture = 86400000; // 1 day in milliseconds
  var currentDayTimestamp, currentDayCounter = 0;

  // A timestamp for today, without the time.
  var todayTimestamp = (new Date).setHours(0, 0, 0, 0);

  // Whether currently on the front page.
  var isFront = $('.matches').is('.front');

  $('.match').each(function(i) {
    // Extract time and date values for the match.
    var $time = $('.match__time', this);
    var time = $time.text().trim().substr(-5);
    var datum = $time.text().trim().substr(0, 10);
    var year = datum.substr(0, 4);
    var month = parseInt(datum.substr(5, 2));
    var date = parseInt(datum.substr(8, 2), 10);

    // A date object for the match.
    var matchDate = new Date(year, month - 1, date, time.substr(0, 2), time.substr(3, 2));

    // A timestamp for the match, without the time.
    var matchTimestamp = matchDate.setHours(0, 0, 0, 0);

    // Display only the time for the match.
    $time.text(time);

    if (matchTimestamp != currentDayTimestamp) {
      currentDayTimestamp = matchTimestamp;
      currentDayCounter++;

      var $container = $('<div id="day-' + currentDayCounter + '"></div>');

      if (matchTimestamp == todayTimestamp) {
        $container.append('<h2 class="matches__heading matches__heading--today">' + VMIDAG.t['Today'] + '</h2>');
        $container.addClass('present');
      }
      else if (matchTimestamp == todayTimestamp + nearFuture) {
        $container.append('<h2 class="matches__heading matches__heading--tomorrow">' + VMIDAG.t['Tomorrow'] + '</h2>');
        $container.addClass('near-future');
      }
      else {
        var weekday = VMIDAG.dayLabels[matchDate.getDay()];
        $container.append('<h2 class="matches__heading matches__heading--future">' + weekday + ' ' + date + '/' + month + '</h2>');
        $container.addClass(matchTimestamp < todayTimestamp ? 'past' : 'future');
      }

      $container.insertBefore(this);
    }
    else {
      $container = $('#day-' + currentDayCounter);
    }

    // Convert channel names into images.
    $tv = $('.match__tv', this);
    var channels = $tv.text().split(', ');
    for (var i = 0, len = channels.length; i < len; i++) {
      var text = $.trim(channels[i]);
      var name = VMIDAG.channelNames[text];
      channels[i] = '<a href="http://bit.ly/vmidag2014-' + name + '"><img src="/assets/images/' + name + '.svg" alt="' + text + '" /></a>';
    }
    $tv.html(channels.join(' '));

    $(this).appendTo($container);
  });

  // If on the schedule page, scroll to today.
  // @todo Make it work.
  if (!isFront) {
    $('html').animate({
      scrollTop: $('.present').offset().top + $('.header').outerHeight()
    }, 1000);
  }
});

// Don't open internal links in Mobile Safari when running stand alone web app
// http://www.bennadel.com/blog/2302-preventing-links-in-standalone-iphone-applications-from-opening-in-mobile-safari.htm
$(document).on(
  "click",
  ".link-internal",
  function(event){
    // Stop the default behavior of the browser, which
    // is to change the URL of the page.
    event.preventDefault();

    // Manually change the location of the page to stay in
    // "Standalone" mode and change the URL at the same time.
    location.href = $(this).attr("href");
  }
);
