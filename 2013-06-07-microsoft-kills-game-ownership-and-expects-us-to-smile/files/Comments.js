Comments = Class.create(
{
	initialize: function(options)
	{
		this.options = options || {};
		this.options.start = 0;
		this.options.comments = [];
		
		this.buffer = "";
		this.loading = false;
		this.hidden = new Array();
		this.lang = this.options.lang;

		this.options.template = " \
<li \
	id='comment-%%ID%%' \
	data-id='%%ID%%' \
	data-username='%%USERNAME%%' \
	data-userid='%%USERID%%' \
	data-my-score='%%MY-SCORE%%' \
	class='comment %%LOGGEDIN%% %%VERIFIED%% %%EDITABLE%% %%DELETED%% %%AVATARS%% %%MODERATOR%%' \
> \
	<p class='details'> \
		<img src='%%AVATAR%%'/> \
		<a href='profiles/%%USERNAME%%' class='username'>%%USERNAME%%</a> \
		<span class='verified'>%%VERIFIED-TITLE%%, <a href='https://web.archive.org/web/20130607075521/http://www.gamesindustry.biz/resources/directory/company/%%VERIFIED-COMPANY-TAG%%'>%%VERIFIED-COMPANY%%</a></span>\
		<a href='profiles/%%USERNAME%%/comments/%%AID%%' class='timestamp'>%%TIMESTAMP%%</a> \
	</p> \
	<div class='post'> \
		<span id='post-%%ID%%'> \
			%%POST%% \
		</span> \
		\
		<span> \
			<a href='#' class='tool reply'><i class='icon-share-alt'></i> " + this.lang.reply + "</a> \
			<span class='karma'> \
				<span id='karma-%%ID%%' data-id='%%ID%%' class='score'>%%KARMA%%</span> \
				<a href='#' data-id='%%ID%%' class='karma down'>-</a> \
				<a href='#' data-id='%%ID%%' class='karma up'>+</a> \
			</span> \
			<a href='comment_edit.php?id=%%ID%%&action=edit' class='tool edit'><i class='icon-pencil'></i> " + this.lang.edit + "</a> \
			<a href='comment_edit.php?id=%%ID%%&action=delete' class='tool delete'><i class='icon-remove'></i> " + this.lang.del + "</a> \
			<a href='community.php?action=view-scorers&cid=%%ID%%' data-id='%%ID%%' class='tool scorers'><i class='icon-user'></i> Scorers</a> \
		</span> \
	</div> \
</li>";
						
		$(this.options.target).update(this.buffer);

		this.sidebar();

		// temp for entities fix		
		if($("comment-form"))
		{
			Event.observe($("comment-form"), "submit", this.post.bind(this));
		}
				
		Event.observe(window, 'scroll', this.scroll.bind(this));

		if(this.options.count == 0)
		{
			this.check();
		}
		else
		{
			this.load();
		}		
	},
	
	check: function()
	{
		if(this.options.count == 0)
		{
			$(this.options.target).insert(new Element("li", { "class": "loading" }).update("<span>" + this.lang.none + "</span>"));
		}
	},
	
	scroll: function()
	{
		// find the 10th last comment, and use that coming into
		// the viewport as a trigger for more comments to be loaded		
		trigger = Math.max(1, (this.options.comments.length-10));
	
		comment = $$("#"+this.options.target + " li.comment:nth-child("+trigger+")")[0];
		if(comment && this.withinViewport(comment))
		{
			this.load();
		}
	},

	withinViewport: function(el)
	{

		elOffset = el.cumulativeOffset();
		vpOffset = document.viewport.getScrollOffsets();
		
		// todo: resolve bug in document.viewport.getHeight()
		vpHeight = window.innerHeight;

		var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight;
		if(
			elOffset[1]
			<
			vpOffset[1]+y
		)
		{
			return true;
		}
		return false;
	},
	
	sidebar: function()
	{	
		if(this.options.isloggedin == "logged-in")
		{ 
			var twitters = $$("#filters li.twitter-prompt input[type=submit]")
			if(twitters.length > 0)
			{
				twitter_button = $$("#filters li.twitter-prompt input[type=submit]").shift();
				Event.observe(twitter_button, "click", this.setTwitter.bind(this));
			}
		}
		
		// set up the event handlers for each of the sidebar filters
		var filters = $$("#filters ul.selector li a");
		for(i = 0; i < filters.length; i++)
		{
			Event.observe(filters[i], "click", this.filter.bind(this));
		}

		// set up the event handlers for each of the sidebar filters
		var filters = $$("ul.horizontal-selector li a");
		for(i = 0; i < filters.length; i++)
		{
			Event.observe(filters[i], "click", this.filter.bind(this));
		}

		$$("ul.horizontal-selector").each( function(e) { e.setStyle({ display: "block" }); });
	},
	
	filter: function(e)
	{
		e.stop();
		
		type = e.findElement().up().up().getAttribute("data-type");
		value = e.findElement().getAttribute("data-value");
		$$("#"+e.findElement().up().up().identify() + " a").each(
			function(element)
			{
				element.removeClassName("on");
			}
		);
		e.findElement().addClassName("on");
		
		this.options[type] = value;
		
		if(type == "score")
		{
			this.saveScoreFilter(value);
		}
		else
		{
			this.savePreference(type, value);
		}
		
		this.reset();
		this.loadAll();
	},

	saveScoreFilter: function(value)
	{
		var requester = new Ajax.Request("community.php?action=update-karma-threshold&threshold="+value+"&return=false");
	},

	savePreference: function(type, value)
	{
		var requester = new Ajax.Request(
			"community.php?action=update-pref&pref=comment-"+type+"&value="+value,
			{
				method: "get"
			}
		);
	},

	flush: function()
	{		
		if(this.options.start > this.options.comments.length)
		{
			//$("load-more").remove();
		}
		else
		{
			for(
				i = this.options.start;
				i < this.options.start + this.options.limit;
				i++
			)
			{
				this.render(i);
			}

			$(this.options.target).innerHTML += this.buffer;
			this.buffer = "";
			
			this.listeners();
			this.loading = false;
			
			// update the offset		
			this.options.start = this.options.comments.length;
		}
		
		this.karmacheck();

		if(this.jumpTo > 0 && $("comment-"+this.jumpTo))
		{
			$("comment-"+this.jumpTo).scrollTo();
		}

	},
	
	karmacheck: function()
	{
		// check each comment against the current karma score
		// if it scores too low, hide it!
		var scores = $$("#"+this.options.target + " li.comment .score");
		for(i = 0; i < scores.length; i++)
		{
			var parent = scores[i].up().up().up().up();
			$$("#"+parent.identify() + " .karma").each(function(e) { e.removeClassName("on"); });
			switch(parent.getAttribute("data-my-score"))
			{
				case "Y":
					$$("#"+parent.identify() + " .karma.up")[0].addClassName("on");
				break;
				
				case "N":
					$$("#"+parent.identify() + " .karma.down")[0].addClassName("on");				
				break;
			}
			
			scores[i].removeClassName("positive");
			scores[i].removeClassName("negative");

			if(parseInt(scores[i].innerHTML) > 0)
			{
				scores[i].addClassName("positive");

			}
			else if(parseInt(scores[i].innerHTML) < 0)
			{

				scores[i].addClassName("negative");			
			}
			
			if(parseInt(scores[i].innerHTML) < parseInt(this.options.score))
			{
				id = scores[i].getAttribute("data-id");
				this.hidecomment(id);
			}
		}
	},
	
	hidecomment: function(cid)
	{
		cid = parseInt(cid);
		
		comment = $$("#"+this.options.target + " li#comment-"+cid)[0];
		post = $$("#"+this.options.target + " li#comment-" + cid + " div.post span:first-child")[0];
		
		if(!comment.hasClassName("deleted"))
		{		
			if(typeof(this.hidden[cid]) === "undefined")
			{
				this.hidden[cid] = post.innerHTML.strip();
			}
			
			comment.addClassName("hidden");
			post.update(this.lang.hidden + " <span class='show'>" + this.lang.show + "</span>");
			Event.observe(
				$$("#"+this.options.target + " li#comment-" + cid + " div.post span:first-child > span.show")[0],
				"click",
				this.showcomment.bind(this)
			);
		}
	},
	
	showcomment: function(e)
	{
		e.stop();
		
		cid = e.findElement().up().up().up().getAttribute("data-id");
		
		comment = $$("#"+this.options.target + " li#comment-"+cid)[0];
		post = $$("#"+this.options.target + " li#comment-" + cid + " div.post span:first-child")[0];
		
		comment.removeClassName("hidden");
		
		post.update(this.hidden[cid]);
	},
	
	/* --- Sets up events for karma, reply, edit, and delete buttons --- */
	listeners: function()
	{
		ups = $$("#" + this.options.target + " li.comment .karma.up");
		for(i = 0; i < ups.length; i++)
		{
			Event.observe(ups[i], "click", this.plus.bind(this));
		}

		downs = $$("#" + this.options.target + " li.comment .karma.down");
		for(i = 0; i < downs.length; i++)
		{
			Event.observe(downs[i], "click", this.minus.bind(this));
		}

		reply = $$("#" + this.options.target + " li.comment .reply");
		for(i = 0; i < reply.length; i++)
		{
			Event.observe(reply[i], "click", this.quickreply.bind(this));
		}

		deleters = $$("#" + this.options.target + " li.comment .delete");
		for(i = 0; i < deleters.length; i++)
		{
			Event.observe(deleters[i], "click", this.deleteConfirm.bind(this));
		}

		scorers = $$("#" + this.options.target + " li.comment .scorers");
		for(i = 0; i < scorers.length; i++)
		{
			if(this.options.ismoderator)
			{
				Event.observe(scorers[i], "click", this.scorers.bind(this));
			}
			else
			{
				scorers[i].remove();
			}
		}

		// on mouseover start a timer that will show the avatar popup after half a second
		$$("#" + this.options.target + " .details img").invoke('observe', 'mouseover', this.avatartimer.bind(this));
		$$("#" + this.options.target + " .details img").invoke('observe', 'mouseout', this.avatartimerkill.bind(this));

		// clicking anywhere hides an avatar popup
		$$("body").first().observe('click', function(e) {
			$$(".avatar-popup").each(function( popup ) {
				popup.morph(
					'opacity: 0;',
					{
						duration: 0.25
					}
				);
			});
		});
	},
	
	deleteConfirm: function(e)
	{
		e.preventDefault();
		
		if(confirm(this.lang.delconfirm))
		{
			document.location = e.target.href;
		}
		return false;
	},
	
	avatartimerkill: function(e)
	{
		clearTimeout(this.timerId);
	},
	
	avatartimer: function(e)
	{
		this.timerId = setTimeout(this.avatar.bind(this, e.findElement()), 300);		
	},

	avatar: function(avatar)
	{
		var parent = avatar.up().up();
		var id = parent.getAttribute("data-userid");
	
		$$(".avatar-popup").each(function(e) { e.remove(); });
		
		if(
			!$("popup-"+id)
			&&
			!parent.hasClassName("hidden")
			&&
			!parent.hasClassName("deleted")
		)
		{
			var popup = new Element("div", { "id": "popup-"+id, "class": "avatar-popup" }).update("<p style='color: #c0c0c0; font-weight: normal;'>" + this.lang.loading + "</p>");

			// this prevents a click within the popup from bubbling up to the body tag and triggering the hide popups function defined above
			popup.observe('click', function(e) { e.stop(); });
			popup.setStyle({ opacity: "1"});
			
			new Insertion.Bottom(parent, popup);
			/*
			popup.morph(
				'opacity: 1;',
				{
					duration: 0.25
				}
			);
			*/
			
			var request = new Ajax.Updater(
				popup,
				"request.php",
				{
					method: 'get',
					evalScripts: true,
					parameters: "action=avatar&uid="+id
				}
			);										
		}
		
		return false;
	},
	
	scorers: function(e)
	{
		e.stop();

		// decrement the score
		id = e.findElement().getAttribute("data-id");
		
		if(!$("scorers-"+id))
		{
			button = e.findElement();
			
			scorers = new Element("div", { 'id': "scorers-"+id, 'class': "popup scores" }).update(this.lang.loading);
			scorers.setStyle(
				{
					display: "block",
					top: $("comment-"+id).getHeight() + "px"
				}
			);

			new Insertion.Bottom($("comment-"+id), scorers);
				
			var updater = new Ajax.Updater(
				"scorers-"+id,
				"community.php?action=view-scorers&cid="+id,
				{
					method: 'get'				
				}
			);
		}
	},
		
	quickreply: function(e)
	{
		e.stop();

		var username = e.findElement().up().up().up().getAttribute("data-username");
		
		if(this.options.version == "mobile")
		{
			// set the body to @username, and call it a day
						
			$("comment").focus();
			$("comment").update("@"+username+ " ");
			$("reply-box").scrollTo();
		}
		else
		{				
			reply = $("quick-reply");
			document.body.appendChild(reply);
			reply.update("<div style='color: white;'>Loading&hellip;</div>");		
			reply.setStyle(
				{
					display: "block",
					top: e.findElement().cumulativeOffset().top + "px",
					left: e.findElement().cumulativeOffset().left + "px"
				}
			);
					
			new Ajax.Updater(
				"quick-reply",
				"ajax.php",
				{
					method: "post",
					parameters: "&action=quick-reply&user="+username+"&aid="+this.options.aid,
					evalScripts: true,
					evalJS: true,
					onComplete: this.quicklisteners.bind(this)
				}
			);	
		}
	},

	quicklisteners: function()
	{
		if($("quick-reply-form"))
		{
			Event.observe($("quick-reply-form"), "submit", this.quickcomment.bind(this));
		}
		
		close = $$("#quick-reply .close");
		for(i = 0; i < close.length; i++)
		{
			Event.observe(close[i], "click", this.quickclose.bind(this));
		}
	},	
	
	quickcomment: function(e)
	{
		e.stop();
		
		submission = e.findElement();		
		var aid = submission.article_id.value;
		
		var button = $("quick-submit").value;
		
		new Ajax.Request(
			'request.php',
			{
				method: 'post',
				encoding: 'iso-8859-1',
				parameters: Form.serialize(submission) + "&redirect=false",
				onLoading: function()
				{
					// disable the comments text box and input
					$("quick-comment").disabled = true;
					$("quick-submit").disabled = true;
					$("quick-submit").value = "Posting...";
					$("quick-submit").className = "button disabled";
				},
				onSuccess: this.quickreplied.bind(this)
			}
		);
	},
	
	quickreplied: function(transport)
	{
		response = transport.responseText.evalJSON();
		this.jumpTo = response.id;

		// fade, then								
		// load everything so they can see their new comment
		reply = $("quick-reply");
		var fader = new Effect.Fade(
			reply,
			{
				duration: 0.25,
				afterFinish: this.loadAll.bind(this)
			}
		);
	},

	quickclose: function(e)
	{
		e.stop();
		reply = $("quick-reply");
		var fader = new Effect.Fade(reply, { duration: 0.25 });
	},
	
	liftReply: function()
	{
		reply = $("quick-reply");
		var offset = reply.cumulativeOffset();
		
		document.body.appendChild(reply);
		
		reply.style.left	= (offset[0]) + "px";
		reply.style.top		= (offset[1]) + "px";
	},
	
	plus: function(e)
	{
		e.stop();
		
		// increment the score
		id = e.findElement().getAttribute("data-id");
		$("comment-"+id).setAttribute("data-my-score", "Y");
		this.karma(id, "Y");				
	},

	minus: function(e)
	{
		e.stop();
		
		// decrement the score
		id = e.findElement().getAttribute("data-id");
		$("comment-"+id).setAttribute("data-my-score", "N");
		this.karma(id, "N");
	},	

	karma: function(cid, direction)
	{
		var requester = new Ajax.Updater(
			"karma-"+cid,
			"request.php?action=karma&cid="+cid+"&direction="+direction+"&return=false",
			{
				method: 'post'
			}
		);
	
		return false;
	},
	
	render: function(i)
	{	
		if(i < this.options.comments.length)
		{
			var temp = this.options.template;
			
			if(this.options.comments[i].a > "")
			{
				this.options.comments[i].a = "https://web.archive.org/web/20130607075521/http://images.eurogamer.net/" + this.options.comments[i].a + "/EG11/thumbnail/30x30";
			}
			else
			{
				this.options.comments[i].a = "img/EurogamerPage/who.png";
			}

			temp = this.swap(temp, /\%\%AID\%\%/g, this.options.aid);						
			temp = this.swap(temp, /\%\%ID\%\%/g, this.options.comments[i].id);
			temp = this.swap(temp, /\%\%USERNAME\%\%/g, this.options.comments[i].u);
			temp = this.swap(temp, /\%\%USERID\%\%/g, this.options.comments[i].uid);
			temp = this.swap(temp, /\%\%POST\%\%/g, this.options.comments[i].p);
			temp = this.swap(temp, /\%\%AVATAR\%\%/g, this.options.comments[i].a);
			temp = this.swap(temp, /\%\%AVATARS\%\%/g, this.options.avatars);
			temp = this.swap(temp, /\%\%KARMA\%\%/g, this.options.comments[i].k);
			temp = this.swap(temp, /\%\%TIMESTAMP\%\%/g, this.options.comments[i].t);
			temp = this.swap(temp, /\%\%VERIFIED\%\%/g, this.options.comments[i].v);
			temp = this.swap(temp, /\%\%EDITABLE\%\%/g, this.options.comments[i].e);
			temp = this.swap(temp, /\%\%DELETED\%\%/g, this.options.comments[i].d);
			temp = this.swap(temp, /\%\%LOGGEDIN\%\%/g, this.options.isloggedin);
			temp = this.swap(temp, /\%\%MODERATOR\%\%/g, this.options.ismoderator);
			temp = this.swap(temp, /\%\%MY-SCORE\%\%/g, this.options.comments[i].s);
			
			if(this.options.comments[i].gi)
			{
				temp = this.swap(temp, /\%\%VERIFIED-TITLE\%\%/g, this.options.comments[i].gi.j);
				temp = this.swap(temp, /\%\%VERIFIED-COMPANY\%\%/g, this.options.comments[i].gi.n);
				temp = this.swap(temp, /\%\%VERIFIED-COMPANY-TAG\%\%/g, this.options.comments[i].gi.c);
			}
			
			this.buffer += temp;
		}
	},

	swap: function(temp, token, replacement)
	{
		if(replacement)
		{
			return temp.replace(token, replacement);
		}
		return temp.replace(token, "");
	},
	
	reset: function()
	{
		//reset the offset, and clear the comments
		this.options.start = 0;
		this.options.comments = [];
		this.buffer = "";
		this.loading = false;
		$(this.options.target).update();
	},

	loadAll: function()
	{
		this.options.limit = 1000;
		this.destruct();
		this.reset();
		this.load();
	},

	spinner: function()
	{
		var loadingClass = "loading";
		if(this.options.start > 0)
		{
			loadingClass += " bottom";
		}
		
		$(this.options.target).insert(new Element("li", { "class": loadingClass }).update("<span>" + this.lang.loading + " <img src='img/EurogamerPage/spinner-pac-man.gif' alt=''/></span>"));
	},
		
	load: function(e)
	{	
		if(!this.loading)
		{
			this.loading = true;
			
			// insert a loading bar into the bottom of the comments			
			// todo: retain current view, and insert a loading spinner?
			
			this.spinner();
			
			var params ="action=json-comments" +
						"&aid=" + this.options.aid +
						"&start=" + this.options.start +
						"&limit=" + this.options.limit +
						"&filter=" + this.options.filter +
						"&order=" + this.options.order;
			
			// load some more comments and add them to the end of this.options.comments
			new Ajax.Request(
				"ajax.php",
				{
					method: "get",
					evalJSON: 'force',
					parameters: params,
					onSuccess: this.tack.bind(this),
					onFailure: this.error.bind(this)
				}
			);
		}
	},
	
	error: function()
	{
		$$("#" + this.options.target + " li.loading")[0].update("<span>" + this.lang.error + "</span>");
	},
	
	tack: function(transport)
	{
		this.loading = false;
		$$("#" + this.options.target + " li.loading").each(
			function(element)
			{
				element.remove();
			}
		);
		
		response = transport.responseText;
		tacked = eval(response);
		
		if(tacked.length > 0)
		{
			this.options.comments = this.options.comments.concat(tacked);
			this.flush();
		}
		else
		{
			this.destruct();
		}
	},
	
	destruct: function()
	{
		// no more comments!		
		// remove the scroll listener
		Event.stopObserving(window, 'scroll');
	},

	post: function(event)
	{
		event.stop();
			
		var aid = event.findElement().article_id.value;
		var button = $("comment-submit").value;
		var params = Form.serialize(event.findElement());
		
		var post = new Ajax.Request(
			"request.php",
			{
				method: "post",
				encoding: "iso-8859-1",
				parameters: params + "&redirect=false",
				onLoading: function()
				{
					// disable the comments text box and input
					$("comment").disabled = true;
					$("comment-submit").blur();
					$("comment-submit").disabled = true;
					$("comment-submit").value = "Posting...";
					$("comment-submit").addClassName("disabled");
				},
				onSuccess: this.posted.bind(this)
			}
		);
		return false;
	},
	
	posted: function(transport)
	{
		response = transport.responseText.evalJSON();
		
		$("comment").value = "";
		$("comment").disabled = false;
		$("comment").focus();		

		// re-enable the comments text box and input
		$("comment-submit").disabled = false;
		$("comment-submit").value = "Post a comment";
		$("comment-submit").removeClassName("disabled");

		if(response.status == "OK" && response.id > 0)
		{
			_gaq.push(['_trackEvent', 'Comments', 'Posted']);
			this.jumpTo = response.id;			
			this.loadAll();
		}
	},
	
	setTwitter: function(e)
	{
		e.preventDefault();
		twitter_input = $$("#filters li.twitter-prompt input[type=text]").shift();
		var requester = new Ajax.Request(
			"ajax.php?action=set-twitter&account="+twitter_input.value,
			{
				method: "get",
				onSuccess: function(t)
				{
					$$("#filters li.twitter-prompt > div").shift().update("<strong>Thanks!</strong>");
				}
			}
		);
		return false;
	}
});
/*
     FILE ARCHIVED ON 07:55:21 Jun 07, 2013 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 14:45:57 Aug 29, 2019.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  esindex: 0.016
  exclusion.robots: 0.23
  captures_list: 53.228
  exclusion.robots.policy: 0.216
  load_resource: 35.633
  PetaboxLoader3.resolve: 25.113
  LoadShardBlock: 36.471 (3)
  RedisCDXSource: 0.598
  CDXLines.iter: 13.003 (3)
  PetaboxLoader3.datanode: 44.391 (4)
*/