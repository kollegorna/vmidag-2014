//= require bower_components/zepto/zepto.min.js
//= require bower_components/moment/min/moment.min.js
//= require bower_components/moment/lang/sv.js
//= require bower_components/moment/lang/da.js
//= require bower_components/moment/lang/nb.js

$(function() {
  moment.lang(VMIDAG.locale);

  // Returns the translated text for the current locale.
  var translate = function(text) {
    return VMIDAG.translate[text];
  }

  // Get the current and tomorrow's date.
  var now = moment();
  var tomorrow = now.clone().add(1, 'day');

  // Used to group matches by day.
  var currentDay, currentDayCounter = 0;

  // Selectors.
  var $body = $('body');
  var $header = $('.header');
  var $matches = $('.matches');

  // Pretty up and group matches by day.
  $('.match', $matches).each(function(i) {
    var $match = $(this);

    // Get the date for the match.
    var $time = $('.match__time', $match);
    var date = moment($time.text().trim(), 'YYYY-MM-DD HH:mm');
    var dateEnd = date.clone().add(115, 'minutes'); // 90 minutes + 15 minute break + overtime (10 minutes max)

    // Display only the time for the match.
    $time.text(date.format(VMIDAG.timeFormat));

    // Mark the match if it's currently playing.
    if (now.isAfter(date.clone().subtract(4, 'hours')) && now.isBefore(dateEnd.clone().subtract(4, 'hours'))) {
      $match.addClass('live');
    }

    // Reuse or create the container for its day.
    var $container;
    if (currentDay && date.isSame(currentDay, 'day')) {
      $container = $('#day-' + currentDayCounter);
    }
    else {
      currentDay = date.clone();
      currentDayCounter++;

      $container = $('<div id="day-' + currentDayCounter + '"></div>');

      if (date.isSame(now, 'day')) {
        $container.append('<h2 class="matches__heading matches__heading--today">' + translate('Today') + '</h2>');
        $container.addClass('present');
      }
      else if (date.isSame(tomorrow, 'day')) {
        $container.append('<h2 class="matches__heading matches__heading--tomorrow">' + translate('Tomorrow') + '</h2>');
        $container.addClass('near-future');
      }
      else {
        $container.append('<h2 class="matches__heading matches__heading--future">' + date.format(VMIDAG.dateFormat) + '</h2>');
        $container.addClass(date < now ? 'past' : 'future');
      }

      $container.insertBefore($match);
    }

    // Add the match to the container for its day.
    $match.appendTo($container);
  });

  // Link TV channels to their respective sites.
  $('.match__tv', $matches).each(function () {
    $tv = $(this);

    var channels = [];
    $.each($tv.text().split(', '), function(index, channel) {
      var text = $.trim(channel);
      var name = VMIDAG.channels[text];
      channels.push('<a href="http://bit.ly/vmidag2014-' + name + '">' + text + '</a>');
    });

    $tv.html(channels.join(' '));
  });

  var $topmost = $('.past', $matches).last().next();
  var $showAll = $('.show-all', $matches);

  // Show previous matches when clicking the link.
  $showAll.text(translate('Show past matches')).on('click', function () {
    event.preventDefault();

    // Remember the offset of the topmost match.
    var offsetTop = $topmost.offset().top - $body.scrollTop();

    // Hide the link, show past matches and set the offset to what it was
    // right before, relative to the topmost match. Everything stays in place.
    $showAll.hide();
    $matches.addClass('all');
    $body.scrollTop($topmost.offset().top - offsetTop);
  });

  // If on a small screen (responsive layout), show the topmost match first.
  if ($header.offset().left == 0) {
    $body.scrollTop($('header', $matches).offset().height);
  }
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
