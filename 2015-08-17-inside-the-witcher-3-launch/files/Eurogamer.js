function createCookie(name,value,days) {	
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}

function checkLanguage(args)
{
	var current = args.site;
	var sites = args.sites;
	
	// get language
	var language = window.navigator.userLanguage || window.navigator.language;
	var short = language.substr(0,2);
	
	switch(short)
	{
		case "de":	sid = 2;	break;
		case "es":	sid = 4;	break;
		case "it":	sid = 5;	break;
		case "cs":	sid = 10;	break;	
		case "da":	sid = 12;	break;
		case "pl":	sid = 13;	break;
		case "nl":	sid = 7;	break;
		case "sv":	sid = 6;	break;
	}
		
	var allowed = readCookie("hide-language-bar") != "yes";
	if(sid && sid != current && allowed)
	{
		sites[sid].id = sid;
		
		var template = new Template(' \
			<div> \
				<a href="#{www}"><img class="flag" src="/img/language-bar/hello-#{id}.gif" alt="" /></a> \
				<p> \
					<a href="#{www}"> \
						#{exists} \
						<strong>#{cta}</strong> \
					</a> \
				</p> \
				<a href="#" onclick="#" class="cancel">x</a> \
			</div> \
		');
		
		var bar = new Element(
			"div",
			{
				"id": "language-notifier",
				"class": "notifier"
			}
		);
		
		bar.update(template.evaluate(sites[sid]));
		
		var cancel = bar.select(".cancel").shift();		
		
		// hide on cancel button click
		new Event.observe(
			cancel,
			"click",
			function(e)
			{
				e.preventDefault();
				
				$("language-notifier").remove();
				
				return;
			}
		);
				
		// insert the language block
		new Insertion.Before(
			$("header"),
			bar
		);
	}
}

// function for finding element in an array
Array.prototype.has = function(needle)
{
    for (key in this)
    {
        if (this[key] == needle)
        {
            return true;
        }
    }
    return false;
}

// function for finding element in an array
Array.prototype.position = function(needle)
{
    for (key in this)
    {
        if (this[key] == needle)
        {
            return key;
        }
    }
    return false;
}

function addCommas(nStr)
{
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

function unfollow(button)
{
	if(button.getElementsByTagName("span").length > 1)
	{
		var count = button.getElementsByTagName("span")[1].innerHTML.replace(/\,/g, '');
		count--;
	}
		
	var request = new Ajax.Request(
		button.href,
		{
			method: 'get',
			encoding: 'UTF-8',
			onLoading: function()
			{
				button.getElementsByTagName("span")[0].update("Plz wait&hellip;");
			},
			onSuccess: function()
			{
				Event.stopObserving(button.id);
				Event.observe
				(
					button.id,
					"click",
					function(event)
					{
						follow(button);
						Event.stop(event);
					}
				);					

				button.getElementsByTagName("i")[0].removeClassName("icon-minus");				
				button.getElementsByTagName("i")[0].addClassName("icon-plus");
				
				button.getElementsByTagName("span")[0].update("Follow");				
				if(count)
				{
					button.getElementsByTagName("span")[1].update(addCommas(count));
				}
				button.href = "follow/" + button.getAttribute("data-type") + "/" + button.getAttribute("data-identifier");
				
				return false;
			}
		}
	);

	return false;
}

function follow(button)
{
	if(button.getElementsByTagName("span").length > 1)
	{
		var count = button.getElementsByTagName("span")[1].innerHTML.replace(/\,/g, '');
		count++;
	}

	var request = new Ajax.Request(
		button.href,
		{
			method: 'get',
			encoding: 'UTF-8',
			onLoading: function()
			{
				button.getElementsByTagName("span")[0].update("Plz wait&hellip;");
			},
			onSuccess: function()
			{
				Event.stopObserving(button.id);
				Event.observe
				(
					button.id,
					"click",
					function(event)
					{
						unfollow(button);
						Event.stop(event);
					}
				);					

				button.getElementsByTagName("i")[0].removeClassName("icon-plus");				
				button.getElementsByTagName("i")[0].addClassName("icon-minus");
				
				button.getElementsByTagName("span")[0].update("Unfollow");				
				if(count)
				{
					button.getElementsByTagName("span")[1].update(addCommas(count));
				}

				button.href = "unfollow/" + button.getAttribute("data-type") + "/" + button.getAttribute("data-identifier");
				
				return false;
			}
		}
	);

	return false;
}

// ---- Notifications.js -------------------------------------
// Fetches unread notifications and displays them in a popup.

document.observe(
	"dom:loaded",
	function()
	{	
		if( $("notifications-link") && $$("#notifications-link span").length > 0)
		{						
			Event.observe(
				$("notifications-link"),
				"click",
				function(e)
				{
					if(e) e.preventDefault();
					
					$("options").style.display = "none";

					if($("notifications").style.display == "block")
					{
						$("notifications").style.display = "none";
					}
					else
					{
						$("notifications").style.display = "block";
						var updater = new Ajax.Updater("notifications", "ajax.php?action=notifications");
					}

					return;
				}
			);
		}

		if($("options-link"))
		{
			Event.observe(
				$("options-link"),
				"click",
				function(event)
				{
					event.stop();
	
					$("notifications").style.display = "none";
					if($("options").style.display == "block")
					{
						$("options").morph(
							'opacity: 0;',
							{
								duration: 0.1,
								afterFinish: function()
								{
									$("options").style.display = "none";
								}
							}
						);
					}
					else
					{
						$("options").style.opacity = "0";
						$("options").style.display = "block";
						$("options").morph(
							'opacity: 1;',
							{
								duration: 0.1
							}
						);
					}
					return false;
				}
			);
		}
	}
);

function MarkNotificationsAsRead(type,aids)
{
	// mark as read
	var request = new Ajax.Request(
		"ajax.php",
		{
			parameters: "action=mark-notifications-as-read&aids="+aids,
			method: 'get',
			onSuccess: function()
			{
				var items = $$("#notifications ul li."+type);
				var note_count = $$("#notifications-link span").shift().innerHTML;
				var item_count = $$("#notifications ul li.title."+type + " span").shift().innerHTML;
				
				$$("#notifications-link span")[0].update( Math.max(0, (note_count - item_count)) );

				items.each(
					function(o)
					{
						o.remove();
					}
				);

				return false;
			}
		}
	);
	
	return false;
}

function toggleSites()
{	
	var args = { display: "block" };
	
	if($("sites").style.display == "block")
	{
		args.display = "none";		
	}

	$("sites").setStyle(args);
}

function QuickLogin()
{
	new Effect.ScrollTo(
		$$("body")[0],
		{
			duration: 0.5,
			afterFinish: function()
			{
				SignIn(true);
			}
		}
	);
	return false;
}

function SignIn(force)
{
	if(force)
	{
		$('login').style.display='block';
		$('login-username').focus();	
	}
	else
	{
		if($('login').style.display=='block')
		{
			$('login').style.display='none';
		}
		else
		{
			$('login').style.display='block';
			$('login-username').focus();
		}
	}
	return false;
}

var originalClass = "";

function Popup(popup, parent)
{
	if(originalClass == "" && parent)
	{
		originalClass = parent.className;
	}
	
	if(parent)
	{
		var offset = parent.cumulativeOffset();

		document.body.appendChild($(popup));

		$(popup).setStyle(
			{
				opacity: "0"
			}
		);
			
		new Effect.Morph(
			$(popup),
			{
				style: "opacity: 1;",
				duration: 0.2
			}
		);
		
		$(popup).style.top = (offset.top + 35) + "px";
		if(parent.className == "tool smiley")
		{
			$(popup).style.left = (offset.left + -385) + "px";		
		}
		else
		{
			$(popup).style.left = offset.left + 10 + "px";
		}
		$(popup).style.zIndex = 10;
	}
	
	// kill all the other popups which may be active
	var popups = document.getElementsByClassName('popup');
	for(i = 0; i < popups.length; i++)
	{
		if(popups[i].id != popup)
		{
			popups[i].style.display = "none";
		}
	}
		
	if($(popup).style.display == "block")
	{
		if(parent)
		{
			parent.className = originalClass;
		}
		$(popup).style.display = "none";
	}
	else
	{
		if(parent)
		{
			parent.className = originalClass + " on";
		}
		$(popup).style.display = "block";
	}
	return false;
}

function PopupSubmit(form)
{	
	var request = new Ajax.Updater(
		form,
		"request.php",
		{
			parameters: form.serialize(),
			onCreate: function()
			{
				form.style.opacity = "0.5";
				form.update("<div class='response'><p>Loading...</p></div>");
			},
			onComplete: function()
			{
				form.style.opacity = "1";
				var loader = new document.createElement("div");
				loader.update("Loading…");
				form.appendChild(loader);
			},

			evalScripts: true
		}
	);
	return false;
}

document.observe("dom:loaded", resizeYoutubes);
Event.observe(document.onresize ? document : window, "resize", resizeYoutubes);

function resizeYoutubes()
{
	var tubes = $$("iframe.youtube-player");
	for(i = 0; i < tubes.length; i++)
	{
		var width = parseInt(tubes[i].up().getWidth());
		var height = parseInt(width / 16 * 9);

		tubes[i].width = width + "px";
		tubes[i].height = height + "px";

		tubes[i].style.width = width + "px";
		tubes[i].style.height = height + "px";
	}

	var tubes = $$("object");	
	for(i = 0; i < tubes.length; i++)
	{
		var embed = tubes[i].getElementsByTagName("embed")[0];
		
		if(embed)
		{
			if(embed.src.match(/youtube/))
			{
				var width = parseInt(tubes[i].up().getWidth());
				var height = parseInt(width / 16 * 9);
				
				tubes[i].style.width = width + "px";
				tubes[i].style.height = height + "px";
	
				tubes[i].width = width + "px";
				tubes[i].height = height + "px";
	
				embed.width = width + "px";
				embed.height = height + "px";
	
				embed.style.width = width + "px";
				embed.style.height = height + "px";
			}
		}
	}	
}

/* --------------------------------------------------------- */
/* ---- LazyLoad class ------------------------------------- */
/* --------------------------------------------------------- */

LazyLoad = Class.create(
{
	initialize: function(options)
	{
		this.options = options || {};
					
		$$(this.options.target).each(
		    function(el)
		    {
		        if(!this.withinViewport(el))
		        {
		            el._src = el.src;
		            el.src = this.options.placeholder;
			    }
			}.bind(this)
		);
		Event.observe(window, 'scroll', this.load.bind(this));
	},

	load: function(el)
	{
		$$(this.options.target).each(
			function(el)
			{
				if(el._src && this.withinViewport(el))
				{
					el.src = el._src;
					delete el._src;
				}
			}.bind(this)
		);
	},

	withinViewport: function(el)
	{
		var elOffset = el.cumulativeOffset(),
		vpOffset = document.viewport.getScrollOffsets(),
		elDim = el.getDimensions();
		vpDim = document.viewport.getDimensions();

		if(
			elOffset[1] + elDim.height < vpOffset[1]
			||
			elOffset[1] > vpOffset[1] + vpDim.height
			||
			elOffset[0] + elDim.width < vpOffset[0]
			||
			elOffset[0] > vpOffset[0] + vpDim.width
		)
		{
			return false;
		}
		return true;
	}
});

/* --------------------------------------------------------- */
/* ---- Facebook connect button class ---------------------- */
/* --------------------------------------------------------- */

var Facebook = Class.create({
	initialize: function(args)
	{
		this.args = args;				
		var button = new Element("a", { 'class': "facebook-login" }).update(this.args.translations.login);

		if(this.args.size)
		{
			button.addClassName(this.args.size);		
		}
		
		button.observe(
			"click",
			function(e)
			{
				e.stop();

				FB.getLoginStatus(
					function(response)
					{
						if(response.status === 'connected')
						{
							e.findElement().update(args.translations.working);
							var accessToken = response.authResponse.accessToken;
							var url = "facebook-transfer.php";
							var params = "token="+accessToken+"&anchor="+args.anchor;

							new Ajax.Request(
								url,
								{
									method: 'post',
									parameters: params,
									onSuccess: function(t)
									{
										if(t.responseText > 0)
										{
											location.reload();
										}
										else
										{
											console.log("Error logging in.");
										}
									}
								}
							);
						}
						else
						{
							FB.login(
								function(response)
								{					
									if(response.authResponse)
									{					
										e.findElement().update(args.translations.working);
										var accessToken = response.authResponse.accessToken;
										var url = "facebook-transfer.php";
										var params = "token="+accessToken+"&anchor="+args.anchor;
			
										new Ajax.Request(
											url,
											{
												method: 'post',
												parameters: params,
												onSuccess: function(t)
												{
													if(t.responseText > 0)
													{
														location.reload();
													}
													else
													{
														console.log("Error logging in.");
													}
												}
											}
										);
									}
									else
									{
										console.log('User cancelled login or did not fully authorize.');
									}
								},
								{
									scope: "email,user_birthday,user_location,user_about_me"
								}
							);
						}
					 }
				);				
			}
		);

		$(this.args.target).appendChild(button);
	}
});


CookieNotifier = Class.create(
{
	initialize: function(options)
	{
		this.options = options || {};
		this.sid = options.sid;
		this.lang = options.lang;
		
		if(this.sid == 13 && !readCookie("cookie-message-dismissed"))
		{
			this.draw();			
		}
	},
	
	draw: function()
	{
		bar = new Element("div", { 'id': "cookie-bar", 'class': "notifier"});		
		bar.update(" \
			<div> \
				<p> \
					" + this.lang.one + " \
				</p> \
				<a href='cookies.php?return=true' id='hide-cookies' class='tool plain'> \
					" + this.lang.button + " \
				</a> \
			</div>");
		new Insertion.Top($("browserMaster"), bar);

		Event.observe(
			$("hide-cookies"),
			"click",
			function(e)
			{
				e.stop();
				createCookie('cookie-message-dismissed', '1', 365);
				$("cookie-bar").hide();
			}
		);

	}
});

document.observe("dom:loaded", function() {
	$$("article aside").each(
		function(a)
		{
			var button = a.select(".toggle").shift();
			new Event.observe(
				button,
				"click",
				function(e)
				{
					e.preventDefault();
					
					var button = e.findElement("a");
					var aside = button.up("aside");
					
					aside.toggleClassName("active");
					
					return;
				}
			);
		}
	);
});
/*
     FILE ARCHIVED ON 23:06:35 Aug 20, 2015 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 15:08:52 Aug 29, 2019.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  PetaboxLoader3.datanode: 84.847 (5)
  exclusion.robots.policy: 0.131
  LoadShardBlock: 42.15 (3)
  exclusion.robots: 0.139
  esindex: 0.006
  load_resource: 182.138
  CDXLines.iter: 11.648 (3)
  RedisCDXSource: 47.398
  captures_list: 103.569
  PetaboxLoader3.resolve: 136.534 (2)
*/