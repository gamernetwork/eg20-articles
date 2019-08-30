// boomboxPlacement('{clickurl}http://images.eurogamer.net/2011/takeovers/sw_counti.png', 'https://web.archive.org/web/20130607075518/http://www.eurogamer.net/', 'January 31, 2012 16:00:00', 'test');
// Boombox
function boomboxPlacement(img, url, date, cta, site) {
	
	// Translations
	var local = {
    	'days' : {
        	'net' : 'Days',
        	'be' : 'Days',
        	'cz' : 'Days',
        	'de' : 'Tage',
        	'dk' : 'Days',
        	'es' : 'Days',
        	'fr' : 'Days',
        	'it' : 'Days',
        	'pt' : 'Dias',
        	'se' : 'Days'
        },
        'hours' : {
        	'net' : 'Hours',
        	'be' : 'Hours',
        	'cz' : 'Hours',
        	'de' : 'Stunden',
        	'dk' : 'Hours',
        	'es' : 'Hours',
        	'fr' : 'Hours',
        	'it' : 'Hours',
        	'pt' : 'Horas',
        	'se' : 'Hours'
        },
        'mins' : {
        	'net' : 'Mins',
        	'be' : 'Mins',
        	'cz' : 'Mins',
        	'de' : 'Min',
        	'dk' : 'Mins',
        	'es' : 'Mins',
        	'fr' : 'Mins',
        	'it' : 'Mins',
        	'pt' : 'Min',
        	'se' : 'Mins'
        },
        'secs' : {
        	'net' : 'Secs',
        	'be' : 'Secs',
        	'cz' : 'Secs',
        	'de' : 'Sek',
        	'dk' : 'Secs',
        	'es' : 'Secs',
        	'fr' : 'Secs',
        	'it' : 'Secs',
        	'pt' : 'Seg',
        	'se' : 'Secs'
        }
	}
	
	// Time
	var msPerSecond = 1000;
	var msPerMinute = 60 * msPerSecond;
	var msPerHour = 60 * msPerMinute;
	var msPerDay = 24 * msPerHour;
	// Variables
	var j = jQuery;
	var boombox = j('#boom-box');
	if( site == undefined ) { site = 'net'; };
	
	// Countdown
	function boomboxCountdown () {
		var difference = targetDate - new Date(); // Start With Seconds
		// Complete
		if( difference <= 0 ) {
			countdownCta();
			clearInterval(countdownTimerInterval);
		// Counting Down
		} else {
			countdownNumber('seconds', Math.floor(difference / msPerSecond) % 60);
            countdownNumber('minutes', Math.floor(difference / msPerMinute) % 60);
            countdownNumber('hours', Math.floor(difference / msPerHour) % 24);
            countdownNumber('days', Math.floor(difference / msPerDay));
		}
	};
	
	// Countdown Set Up
	function countdownBuild() {
		// Add To Container
		boombox.find('#adboomboxContainer')
		.append('<span id="boom-box-days"><span class="number">0</span><span class="period">' + local['days'][site] + '</span></span>')
		.append('<span id="boom-box-hours"><span class="number">0</span><span class="period">' + local['hours'][site] + '</span></span>')
		.append('<span id="boom-box-minutes"><span class="number">0</span><span class="period">' + local['mins'][site] + '</span></span>')
		.append('<span id="boom-box-seconds"><span class="number">0</span><span class="period">' + local['secs'][site] + '</span></span>');
	};
	 
	// Countdown Number
	function countdownNumber (id, number) {
		if ( number < 10 ) {
			number = '0' + number;
		}
		j('#boom-box-' + id).find('span.number').html(number);
	};
	
	// Countdown Call To Action
	function countdownCta () {
		var text = '<a href="' + url + '" title="' + cta + '">' + cta + '</a>';
		j('span', boombox).empty().remove();
		boombox.append(text);
	};
		
	// Init
	if( cta != undefined ) { 
		// Countdown
		var targetDate = new Date(date); // Pretty Date
		countdownBuild();
		countdownTimerInterval = setInterval(boomboxCountdown, 1000);
	} // Image Background
	
	boombox.css({'background-image' : 'url(' + img + ')', 'cursor' : 'pointer'});
	
	// Full Boombox Clickthrough
	boombox.click(function() {
		window.open(url, '_blank');
	});

};

/*
     FILE ARCHIVED ON 07:55:18 Jun 07, 2013 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 14:45:54 Aug 29, 2019.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  PetaboxLoader3.datanode: 63.47 (4)
  esindex: 0.009
  PetaboxLoader3.resolve: 137.029 (2)
  RedisCDXSource: 1.221
  captures_list: 167.165
  CDXLines.iter: 11.542 (3)
  exclusion.robots: 0.153
  load_resource: 50.016
  exclusion.robots.policy: 0.144
  LoadShardBlock: 151.924 (3)
*/