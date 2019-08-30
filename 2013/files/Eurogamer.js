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

function checkLanguage(current)
{
	// get language
	var language = window.navigator.userLanguage || window.navigator.language;
	language = language.substr(0,2);
				
	var show = 0;
	switch(language)
	{
		case "de":	show = 2;	break;
		case "fr":	show = 3;	break;
		case "es":	show = 4;	break;
		case "it":	show = 5;	break;
		//case "pt":	show = 8;	break;
		case "cs":	show = 10;	break;	
		case "da":	show = 12;	break;
		case "pl":	show = 13;	break;
		case "sv":	show = 6;	break;	
		case "nl":	show = 7;	break;
	}
							
	if(show > 0 && show != current && readCookie("hide-language-bar") != "yes")
	{						
		// insert the language block
		$("browserMaster").insertBefore(
			new Element(
				"div",
				{
					"id": "language-notifier",
					"class": "notifier"
				}
			),
			$("header")
		);
		
		// fill him with something
		new Ajax.Updater(
			"language-notifier",
			"ajax.php?action=language-notifier&sid="+show,
			{
				evalScripts: true,
				onSuccess: function()
				{
					new Effect.Morph("language-notifier", { style: "height: 36px;", duration: 0.5 });
				}
			}
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
		if( $("notifications-link") && $$("#notifications-link span").length > 0) {
			
			// clicking anywhere hides smilies popup
			$$("body").first().observe('click', function(e) {
				$("notifications").morph(
					'opacity: 0;',
					{
						duration: 0.1,
						afterFinish: function()
						{
							$("notifications").style.display = "none";
						}
					}
				);
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
			});
			
			Event.observe(
				$("notifications-link"),
				"click",
				function(event)
				{
					event.stop();
					
					$("options").style.display = "none";
					if($("notifications").style.display == "block")
					{
						$("notifications").morph(
							'opacity: 0;',
							{
								duration: 0.1,
								afterFinish: function()
								{
									$("notifications").style.display = "none";
								}
							}
						);
					}
					else
					{				
						$("notifications").style.opacity = "0";
						$("notifications").style.display = "block";
						$("notifications").morph(
							'opacity: 1;',
							{
								duration: 0.1,
								afterFinish: function()
								{
									var updater = new Ajax.Updater("notifications", "ajax.php?action=notifications");
								}
							}
						);
					}
					return false;
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
				
				var note_count = $$("#notifications-link span")[0].innerHTML;
				var item_count = $$("#notifications ul li.title."+type + " span")[0].innerHTML;
				
				$$("#notifications-link span")[0].update( note_count - item_count );
				for(i = 0; i < items.length; i++)
				{
					var fader = new Effect.Fade(
						items[i],
						{
							duration: 0.3,
							afterFinish: function(item)
							{
								item.element.remove();							
								
								if($$("#notifications ul li").length == 0)
								{
									$("notifications").morph(
										'opacity: 0;',
										{
											duration: 0.1,
											afterFinish: function()
											{
												$("notifications").style.display = "none";
											}
										}
									);																		
								}
							}
						}
					);
				}
												
				return false;
			}
		}
	);
	
	return false;
}

function toggleSites()
{
	var contentZ = $("content").getStyle("z-index");
	
	if($("sites").style.display == "block")
	{
		$("footer").style.zIndex = contentZ;
		$("sites").morph(
			'opacity: 0;',
			{
				duration: 0.1,
				afterFinish: function()
				{
					$("sites").style.display = "none";
				}
			}
		);
	}
	else
	{
		$("footer").style.zIndex = contentZ+1;
		$("sites").style.opacity = "0";
		$("sites").style.display = "block";
		$("sites").morph(
			'opacity: 1;',
			{
				duration: 0.1
			}
		);
	}
}

function toggleSearch()
{
	var search = $("search");
	if(search.style.display == "block")
	{
		search.style.display = "none";
	}
	else
	{
		search.style.display = "block";
	}
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

var VersionPrompt = Class.create({			
	initialize: function(args)
	{
		this.params = args;
		this.params.ignore = readCookie("ignore-version-prompt");
					
		if(this.params.ignore == null)
		{
			if(
				screen.width <= 480
				||
				screen.height <= 480
			)
			{
				if(this.params.version != "mobile")
				{
					this.recommend("mobile");
				}
			}
			else if(
				screen.width < 1280
				||
				screen.height <= 768
			)
			{
				if(this.params.version != "portable")
				{
					this.recommend("portable");
				}
			}
			else if(screen.width >= 1280)
			{
				if(this.params.version != "hd")
				{
					this.recommend("hd");
				}			
			}
		}
	},
	
	recommend: function(version)
	{
		var style = new Element("link",
			{
				'rel': "stylesheet",
				'type': "text/css",
				'href': "styles/Eurogamer/versions.css"
			}
		);
		
		$$("head").pop().appendChild(style);

		var blanket = new Element("div", { 'id': "version-blanket" });
		Event.observe(
			blanket,
			"click",
			function(e)
			{
				$("version-prompt").remove();
				$("version-blanket").remove();
				
				createCookie("ignore-version-prompt", true, 365);		
				return false;
			}
		);
		
		var prompt = new Element("div", { 'id': "version-prompt" });

		$("browserMaster").insertBefore(blanket, $("header"));
		$("browserMaster").insertBefore(prompt, $("header"));	
	
		blanket.style.height = Math.max(
			parseInt(document.viewport.getHeight()),
			parseInt($("browserMaster").getStyle("height"))
		) + "px";

		// fill him with somethin'
		new Ajax.Updater(
			prompt.id,
			"ajax.php?action="+prompt.id+"&version="+version,
			{
				onComplete: function()
				{
					var v = $("version-prompt");					
					v.style.left = (parseInt(document.viewport.getDimensions().width) - parseInt(v.getStyle("width")))/2 + "px";
					
					Event.observe(
						$$("#version-prompt form").pop(),
						"submit",
						function(e)
						{
							createCookie("ignore-version-prompt", true, 365);
						}
					);
					
					Event.observe(
						$$("#version-prompt a.cancel").pop(),
						"click",
						function(e)
						{
							e.stop();
							$("version-prompt").remove();
							$("version-blanket").remove();
							
							createCookie("ignore-version-prompt", true, 365);
							
							return false;
						}
					);
					
					Event.observe(
						window,
						"resize",
						function(e)
						{
							var v = $("version-prompt");
							v.style.left = ((parseInt(document.viewport.getDimensions().width) - parseInt(v.getStyle("width")))/2) + "px";
						}
					)
				}
			}
		);
		
		return false;
	}
});

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
/*
     FILE ARCHIVED ON 07:55:18 Jun 07, 2013 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 14:45:55 Aug 29, 2019.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  PetaboxLoader3.datanode: 70.956 (4)
  exclusion.robots.policy: 0.174
  PetaboxLoader3.resolve: 40.607
  RedisCDXSource: 46.262
  exclusion.robots: 0.187
  CDXLines.iter: 20.5 (3)
  captures_list: 97.872
  LoadShardBlock: 27.287 (3)
  load_resource: 122.956
  esindex: 0.017
*/