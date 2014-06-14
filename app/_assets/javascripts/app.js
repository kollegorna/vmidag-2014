//= require bower_components/zepto/zepto.min.js
//= require bower_components/moment/min/moment.min.js
//= require bower_components/moment/lang/sv.js
//= require bower_components/moment/lang/da.js
//= require bower_components/moment/lang/nb.js

$(function() {
  var settings = VMIDAG;

  // Set the locale for dates.
  moment.lang(settings.locale);

  // Returns the translated text for the current locale.
  var t = function(text) {
    return settings.strings[text];
  }

  // Selectors.
  var $body = $('body');
  var $header = $('.header');
  var $matches = $('.matches');

  // If on a small screen (responsive layout), snap to the topmost match.
  if ($header.offset().left == 0) {
    $body.scrollTop(120); // .matches-header's height + margins
  }

  // Get the current and tomorrow's date.
  var now = moment();
  var tomorrow = now.clone().add(1, 'day');

  // Used to group matches by day.
  var currentDay, currentDayCounter = 0;

  // Pretty up matches and group by day.
  $('.match', $matches).each(function(i) {
    var $match = $(this);
    var $time = $('.match__time', $match);

    // Get the date for the match and its actual start and end moments.
    var date = moment($time.text().trim(), 'YYYY-MM-DD HH:mm');
    var matchStart = date.clone();
    if (matchStart.hour() < 5) matchStart.add(1, 'day').subtract(1, 'minute'); // Compensate for matches starting late
    var matchEnd = matchStart.clone().add(90 + 15 + 10, 'minutes'); // 90 minutes + 15 minute break + overtime (10 minutes max)

    // Display only the time.
    $time.text(date.format(settings.timeFormat));

    // Reuse or create the day's container.
    var $container;
    if (currentDay && date.isSame(currentDay, 'day')) {
      $container = $('#day-' + currentDayCounter);
    }
    else {
      currentDay = date.clone();
      currentDayCounter++;

      $container = $('<div id="day-' + currentDayCounter + '"></div>');

      if (date.isSame(now, 'day')) {
        $container.append('<h2 class="matches__heading matches__heading--today">' + t('Today') + '</h2>');
        $container.addClass('present');
      }
      else if (date.isSame(tomorrow, 'day')) {
        $container.append('<h2 class="matches__heading matches__heading--tomorrow">' + t('Tomorrow') + '</h2>');
        $container.addClass('near-future');
      }
      else {
        $container.append('<h2 class="matches__heading matches__heading--future">' + date.format(settings.dateFormat) + '</h2>');
        $container.addClass(date < now ? 'past' : 'future');
      }

      $container.insertBefore($match);
    }

    // Highlight the match if it's live.
    if (now.isAfter(matchStart) && now.isBefore(matchEnd)) {
      $match.addClass('live');

      // If the match is in a "past" container, mark it as still ongoing.
      if ($container.is('.past')) {
        $container.addClass('ongoing');
      }
    }

    // Add the match to the container for its day.
    $match.appendTo($container);
  });

  // Get the topmost day group.
  var $topmost = $('.past', $matches).last().next();

  // Show past matches when clicking the button.
  $('.show-past', $matches).text(t('Show past matches')).on('click', function() {
    // Remember the offset of the topmost match.
    var offsetTop = $topmost.offset().top - $body.scrollTop();

    // Hide the link, show past matches and set the offset to what it was
    // right before, relative to the topmost match. Everything stays in place.
    $(this).parent().hide();
    $matches.addClass('past-matches');
    $body.scrollTop($topmost.offset().top - offsetTop);
  });

  // Show future matches when clicking the button.
  $('.show-future', $matches).text(t('Show future matches')).on('click', function() {
    $(this).parent().hide();
    $matches.addClass('future-matches');
  });

  // Link TV channels to their respective sites.
  $('.match__tv', $matches).each(function () {
    $tv = $(this);

    var channels = [];
    $.each($tv.text().split(', '), function(index, channel) {
      var text = $.trim(channel);
      var name = settings.channels[text];
      channels.push('<a href="http://bit.ly/vmidag2014-' + name + '">' + text + '</a>');
    });

    $tv.html(channels.join(' '));
  });
});

// Don't open internal links in Mobile Safari when running stand alone web app
// http://www.bennadel.com/blog/2302-preventing-links-in-standalone-iphone-applications-from-opening-in-mobile-safari.htm
$(document).on(
  "click",
  ".link-internal",
  function(event){
    // Stop the default behavior of the browser, which is to change the URL of
    // the page.
    event.preventDefault();

    // Manually change the location of the page to stay in "Standalone" mode and
    // change the URL at the same time.
    location.href = $(this).attr("href");
  }
);
