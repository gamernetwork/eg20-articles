var SocialButtons = new Class.create({

	initialize: function(args)
	{
		this.targets = $$(".social-buttons");
		
		for(i = 0; i < this.targets.length; i++)
		{	
			var target = this.targets[i];
			
			var sites = target.getAttribute("data-sites").split(",");
						
			var url = target.getAttribute("data-url");
			var title = target.getAttribute("data-title");	
			var article = target.getAttribute("data-title");			

			var list = new Element("ul");
				list.update("<li><strong>" + target.getAttribute("data-lang") + "</strong></li>");

			new Insertion.Top(target, list);	
	
			for(k = 0; k < sites.length; k++)
			{
				var values = this.providers[sites[k]];
				
				values.url = values.url.replace("#{u}", encodeURIComponent(url));
				values.url = values.url.replace("#{t}", encodeURIComponent(title));
				values.permalink = url;
				values.article = article;
				
				list.innerHTML += this.template.evaluate(
					values
				);
			}

			this.social(target);
		}
	},
	
	providers: {
		"facebook" : {
			'url': "//web.archive.org/web/20150820230725/http://www.facebook.com/sharer.php?u=#{u}",
			'type': "facebook",
			'icon': "facebook",
			'title': "Facebook"		
		},
		"twitter" : {
			'url': "//web.archive.org/web/20150820230725/http://twitter.com/intent/tweet?text=#{t}+#{u}",
			'type': "twitter",
			'icon': "twitter",
			'title': "Twitter"		
		},
		"google" : {
			'url': "//web.archive.org/web/20150820230725/http://plus.google.com/share?url=#{u}",
			'type': "google",
			'icon': "google-plus-sign",
			'title': "Google+"
		},
		"reddit" : {
			'url': "//web.archive.org/web/20150820230725/http://www.reddit.com/submit?url=#{u}",
			'type': "reddit",
			'icon': "gamepad",
			'title': "Reddit"		
		},
		"wykop" : {
			'url': "//web.archive.org/web/20150820230725/http://www.wykop.pl/remotelink/?url=#{u}&title=#{t}",
			'type': "wykop",
			'icon': "maxcdn icon-flip-vertical icon-flip-horizontal",
			'title': "Wykop"		
		},
		"whatsapp" : {
			'url': "whatsapp://send?text=#{t}+#{u}",
			'type': "whatsapp",
			'icon': "phone",
			'title': "WhatsApp"		
		}		
	},
	
	template: new Template(' \
		<li> \
			<a href="#{url}" class="#{type}" data-permalink="#{permalink}"><i class="icon-#{icon}"></i> <span>#{title}</span></a> \
		</li> \
	'),

	social: function(target)
	{
		var buttons = target.select("a");
		for(k = 0; k < buttons.length; k++)
		{
			this.countSocial(buttons[k]);
			Event.observe(buttons[k], "click", this.doSocial.bind(this));
		}
	},
	
	countSocial: function(button)
	{
		switch(button.className)
		{
			case "facebook":
				jQuery.getJSON(
					'//web.archive.org/web/20150820230725/http://graph.facebook.com/' + button.getAttribute("data-permalink") + '?callback=?',
					function(a)
					{
						if(a && a.shares)
						{
							new Insertion.Bottom(
								button,
								new Element(
									"span",
									{
										"class": "count"
									}
								).update(number_format(a.shares))
							);
						}
					}
				);
			break;
			
			case "twitter":
				jQuery.getJSON(
					'//web.archive.org/web/20150820230725/http://urls.api.twitter.com/1/urls/count.json?url=' + button.getAttribute("data-permalink") + '&callback=?',
					function(a)
					{
						if(a && a.count)
						{
							new Insertion.Bottom(
								button,
								new Element(
									"span",
									{
										"class": "count"
									}
								).update(number_format(a.count))
							);
						}
					}
				);
			break;

			case "reddit":
				jQuery.getJSON(
					'//web.archive.org/web/20150820230725/http://reddit.com/api/info.json?url=' + button.getAttribute("data-permalink") + '&jsonp=?',
					function(a)
					{
						try
						{
							if(a.data.children[0].data.score)
							{
								new Insertion.Bottom(
									button,
									new Element(
										"span",
										{
											"class": "count"
										}
									).update(number_format(a.data.children[0].data.score))
								);
							}
						} catch(Exception) {}
					}
				);
			break;
		}
	},
	
	doSocial: function(e)
	{
		if(e) e.preventDefault();

		var res = {
			x: screen.width,
			y: screen.height
		};
		
		var link = e.findElement("a").href;
		
		var w = 800;
		var h = 500;
		
		var top = (res.y / 2) - (h / 2);
		var left = (res.x / 2) - (w / 2);

		window.open(
			link,
			"",
			"width=" + w + ",height=" + h + ",scrollbars=yes,titlebar=yes,location=no,fullscreen=no,status=no,top="+top+",left="+left,
			false
		);
		
		return false;
	}	
	
});

function number_format (number, decimals, dec_point, thousands_sep) {
  // http://kevin.vanzonneveld.net

  // Strip all characters but numerical ones.
  number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function (n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
 
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}
/*
     FILE ARCHIVED ON 23:07:25 Aug 20, 2015 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 15:09:01 Aug 29, 2019.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  esindex: 0.019
  LoadShardBlock: 49.119 (3)
  CDXLines.iter: 21.589 (3)
  PetaboxLoader3.datanode: 68.673 (5)
  RedisCDXSource: 6.806
  captures_list: 82.707
  load_resource: 90.761
  exclusion.robots.policy: 0.266
  PetaboxLoader3.resolve: 55.778 (2)
  exclusion.robots: 0.284
*/