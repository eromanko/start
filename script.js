// Finds current time and date, formats it properly
function startTime() {
	var now = new Date();
	var hour = ('0' + now.getHours()).slice(-2);
	var mins = now.getMinutes();
	var secs = now.getSeconds();
	var ampm = hour >= 12 ? 'PM' : 'AM';
	var day = ('0' + now.getDate()).slice(-2);
	var month = ('0' + (now.getMonth()+1)).slice(-2);
	var year = now.getFullYear();
// 24/12 h
//	hour = hour % 24;
  	hour = hour ? hour : 12;
	mins = mins < 10 ? '0' + mins : mins;
	secs = secs < 10 ? '0' + secs : secs;
	var timeString = hour + ':' + mins + ':' + secs;
	var dateString = month + '/' + day + '/' + year;
	document.getElementById('time').innerHTML = timeString;
	document.getElementById('date').innerHTML = dateString;
	var t = setTimeout(startTime, 500);
}

// Gets weather for requested location, appends to page
function getWeather(place) {
	$.simpleWeather({
		location: "Washington DC, USA",
		unit: 'f',
		success: function(weather) {
			$('.weather').html(weather.city + '</br>' + weather.currently + ', ' + weather.temp + '&deg;');
			$('.weatherlink').html('<a href="' + weather.link + '">[W]</a>');
		},
		error: function(error)   {
			$('.weather').html('Sorry, there has been a problem retrieving the weather information.');
		}
	});
}

// Geolocates the user, otherwise defaulting to Washington, DC
function loadStuff() {
	if('geolocation' in navigator) {
		navigator.geolocation.getCurrentPosition(function(position) {
	    	getWeather(position.coords.latitude + ',' + position.coords.longitude);
	  	});
	} else { getWeather('Washington DC, USA'); }
}

// Initializes keyboard nav
function bindMousetraps() {
	$.each($('.parent'), function(i, val) {
		Mousetrap.bind($(val).children('span').text(), function(e) {
			$('a#' + $(val).attr('id')).toggleClass('active').next().slideToggle(150);
			$.each($(val).parent().find('.tab span'), function(i, val) {
				Mousetrap.bind($(val).text(), function(e) {
					window.location.href = $(val).parent().attr('href');
				});
			});
			Mousetrap.bind($(val).children('span').text(), function(e) {
				resetMousetraps();
			});
		});
	});

	// Resets on ESC or spacebar
	Mousetrap.bind(['esc', 'space'], function(e) {
		resetMousetraps();
	});
}

// Closes cells, rebinds keyboard shortcuts
function resetMousetraps() {
	$('.subMenu').slideUp(150);
	$('li a').removeClass('active');
	Mousetrap.reset();
	bindMousetraps();
}

// Initializes everything on page load
$(function() {
	startTime();
	loadStuff();
	bindMousetraps();
	// Binds click events for opening tabs and background click to close
	$('li a.parent').click(function() {
		$(this).parent('li').find('ul').slideToggle(150);
		$(this).toggleClass('active');
	});
	$('#background').click(function() {
		resetMousetraps();
	});
});
