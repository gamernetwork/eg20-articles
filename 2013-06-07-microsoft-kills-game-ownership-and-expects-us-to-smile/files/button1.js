(function() {
  if ('https:' == document.location.protocol) {
      var base_url = 'https://web.archive.org/web/20130607064725/https://redditstatic.s3.amazonaws.com/'
  } else {
      var base_url = 'https://web.archive.org/web/20130607064725/http://www.reddit.com/static'
  }

  var write_string="<iframe src=\"" + base_url + "/button/button1.html?width=120&url=";

  if (window.reddit_url)  { 
      write_string += encodeURIComponent(reddit_url); 
  }
  else { 
      write_string += encodeURIComponent(window.location.href);
  }
  if (window.reddit_title) {
       write_string += '&title=' + encodeURIComponent(window.reddit_title);
  }
  if (window.reddit_target) {
       write_string += '&sr=' + encodeURIComponent(window.reddit_target);
  }
  if (window.reddit_css) {
      write_string += '&css=' + encodeURIComponent(window.reddit_css);
  }
  if (window.reddit_bgcolor) {
      write_string += '&bgcolor=' + encodeURIComponent(window.reddit_bgcolor); 
  }
  if (window.reddit_bordercolor) {
      write_string += '&bordercolor=' + encodeURIComponent(window.reddit_bordercolor); 
  }
  if (window.reddit_newwindow) { 
      write_string += '&newwindow=' + encodeURIComponent(window.reddit_newwindow);}
  write_string += "\" height=\"22\" width=\"120\" scrolling='no' frameborder='0'></iframe>";
  document.write(write_string);
})()

/*
     FILE ARCHIVED ON 06:47:25 Jun 07, 2013 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 14:45:56 Aug 29, 2019.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  esindex: 0.009
  exclusion.robots: 0.155
  load_resource: 394.399
  exclusion.robots.policy: 0.142
  PetaboxLoader3.resolve: 357.456
  LoadShardBlock: 690.772 (6)
  RedisCDXSource: 57.618
  CDXLines.iter: 81.305 (3)
  PetaboxLoader3.datanode: 706.385 (7)
*/