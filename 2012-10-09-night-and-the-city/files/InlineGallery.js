var InlineGallery = Class.create({
	initialize: function(args)
	{		
		this.target = args.target;
		this.images = args.images;
		this.gid = args.gid;
		this.version = args.version;
		this.position = 1;
		this.localisations = args.localisations;		
		this.size = args.size;
		this.title = args.title;
		this.firstrun = true;
		this.type = args.type;
		this.gridacc = 0;
		this.gridposition = 0;
		this.adzone = args.adzone;
						
		switch(this.size)
		{
			default:
			case "large":
				this.width = "100%";
			break;

			case "small":
				this.width = "300px";
			break;
		}
				
		$(this.target).update("");
		$(this.target).style.width = this.width;		
		$(this.target).addClassName(this.size);
		$(this.target).addClassName(this.type);

		this.drawtitle();
		
		if(this.type == "grid")
		{
			this.gridsetup();
		}
		else
		{
			// image container
			var frame = new Element(
				"div",
				{
					'class': "frame",
					'unselectable': "on"
				}
			);
	
			var caption = new Element(
				"p",
				{
					'class': "caption"
				}
			);
			
			// show the first image
			var image = new Element(
				"img",
				{
					'class': "image",
					'id': "image"
				}
			);
			image.observe("load", this.animate.bind(this));
			image.observe("click", this.next.bind(this));
	
			this.frame = frame;		
			this.caption = caption;
			
			$(this.target).insert(frame);
			$(this.target).insert(caption);
					
			if(this.images.length > 1)
			{
				// create previous/next buttons
				var pager = new Element(
					"div",
					{
						'class' : "pager"
					}
				).update(' \
					<a href="#" class="tool previous">' + this.localisations.previous + '</a> \
					<a href="#" class="tool next">' + this.localisations.next + '</a> \
					<a href="gallery.php?article_id=' + this.gid + '" class="tool plain">' + this.localisations.all + '</a> \
				');
				
				$(this.target).insert(pager);
		
				// bind to previous and next buttons
				$$("#"+this.target + " .pager a.previous")[0].observe("click", this.previous.bind(this));
				$$("#"+this.target + " .pager a.next")[0].observe("click", this.next.bind(this));			
			}
	
			this.animate();
		}
	},
	
	drawtitle: function()
	{
		if(this.type == "grid" && this.title == "")
		{
			this.title = this.images[0]["caption"];
		}
		
		if(this.title > "")
		{
			// image container
			var title = new Element(
				"h2",
				{
					'class': "title",
					'unselectable': "on"
				}
			);
			title.update(this.title);
			$(this.target).insert(title);
		}	
	},
	
	gridsetup: function()
	{
		this.images.each(this.grid.bind(this));	
		Event.observe(document, "keydown", this.gridkey.bind(this));
	},
	
	grid: function(image)
	{		
		if(!image["ad"])
		{
			this.gridacc++;

			thumbW = 186;
			thumbH = 100;
			
			if(this.version == "portable")
			{
				thumbW = 208;
			}
			
			url = image["original-url"] + "/EG11/thumbnail/" + thumbW + "x" + thumbH + "/normalize/1";
			
			img = new Element(
				"img",
				{
					"src": url,
					"width": thumbW,
					"height": thumbH,
					"data-original": image["original-url"],
					"data-original-width": image["original-width"],
					"data-original-height": image["original-height"],
					"data-aspect": image["aspect"],
					"data-position": this.gridacc,
					"alt": image["caption"]
				}
			);
			Event.observe(img, "click", this.gridclick.bind(this));
			
			new Insertion.Bottom(
				$(this.target),
				img
			);
		}
	},
	
	gridkey: function(e)
	{
		if($("grid-blanket-"+this.gid))
		{
			if(
				e.keyCode == 37
				||
				e.keyCode == 39
				||
				e.keyCode == 67
				||
				e.keyCode == 27
			)
			{
				Event.stop(e);
			}
			
			switch(e.keyCode)
			{
				// left arrow
				case 37:
					this.gridprevious();
				break;
			
				// right arrow
				case 39:
					this.gridnext();
				break;
				
				// c and escape
				case 67:
				case 27:
					this.gridreset();
				break;		
			}
		}
	},
	
	gridloader: function()
	{
		var viewport = document.viewport.getDimensions();
		var loader = new Element("div", { 'id': 'grid-loader-'+this.gid, "class": "grid-loader" }).update(this.localisations.loading);
		new Insertion.Bottom( document.body, loader	);
		
		loader.setStyle(
			{
				left: (viewport.width/2) - (parseInt(loader.getStyle("width"))/2) - 15 + "px",
				top: (viewport.height/2) - (parseInt(loader.getStyle("height"))/2) - 15 + "px"
			}
		);	
	},
	
	gridclick: function(e)
	{
		this.gridreset();
		
		if( typeof e == "object" )
		{
			thumbnail = e.findElement();
		}
		else
		{
			thumbnail = $$("#" + this.target + " img")[e];
		}
		
		var viewport = document.viewport.getDimensions();

		// image needs to respect the max bounds of the window.
		original = thumbnail.getAttribute("data-original");
		aspect = thumbnail.getAttribute("data-aspect");
		buffer = 200;
		
		var max = {
			x: Math.min(thumbnail.getAttribute("data-original-width"), viewport.width) - buffer,
			y: Math.min(thumbnail.getAttribute("data-original-height"), viewport.height) - buffer
		}
		
		this.gridloader();
		
		this.gridposition = thumbnail.getAttribute("data-position");
		
		if(max.x > max.y)
		{
			imgX = Math.floor(max.y * aspect);
			imgY = Math.floor(max.y);
		}
		else
		{
			imgX = Math.floor(max.x);
			imgY = Math.floor(max.x / aspect);		
		}
				
		scale = imgX + "x" + imgY;
		
		var blanket = new Element("div", { id: "grid-blanket-"+this.gid, "class": "grid-blanket" });
		Event.observe(blanket, "click", this.gridreset.bind(this));
		new Insertion.Bottom( document.body, blanket );						

		var box = new Element(
			"div",
			{
				"id": "grid-box-"+this.gid,
				"class": "grid-box",
				"width": imgX,
				"height": imgY
			}
		);

		box.setStyle(
			{
				left: ((viewport.width - imgX) / 2) + "px",
				top: ((viewport.height - imgY) / 2) + "px"
			}
		);
		
		if(thumbnail.getAttribute("data-original-width") > max.x)
		{
			// popup to original image
			var original = new Element(
				"a",
				{
					"href": thumbnail.getAttribute("data-original"),
					"class": "original",
					"target": "_blank"
				}
			).update("<img src='img/EurogamerPage/Gallery/original.png'/><span>" + this.localisations.full + "</span>");
	
			box.appendChild(original);
		}

		
		var image = new Element(
			"img",
			{
				"id": "grid-overlay-"+this.gid,
				"src": original + "/EG11/thumbnail/" + scale + "/normalize/1",
				"width": imgX,
				"height": imgY,
				"data-position": thumbnail.getAttribute("data-position")
			}
		);				
		Event.observe(image, "click", this.gridnext.bind(this));
		Event.observe(image, "load", this.gridloadreset.bind(this) );

		var controls = new Element("ul").update(" \
			<li><a href='#' class='tool previous'><i class='icon-caret-left'></i> " + this.localisations.previous + "</a></li> \
			<li><span>" + thumbnail.getAttribute("alt") + "</li> \
			<li><a href='#' class='tool next'>" + this.localisations.next + " <i class='icon-caret-right'></i></a></li> \
		");
			
		new Insertion.Top(box, image);
		new Insertion.Bottom(box, controls);
		new Insertion.Bottom(document.body, box);		

		buttons = $$("#" + controls.identify() + " li a");
		Event.observe(buttons[0], "click", this.gridprevious.bind(this));
		Event.observe(buttons[1], "click", this.gridnext.bind(this));
	},

	gridprevious: function(e)
	{
		if(e)
		{
			e.preventDefault();
		}

		this.gridposition--;
		this.gridposition--;

		if(this.gridposition < 0)
		{
			this.gridposition = $$("#" + this.target + " img").length - 1;
		}
				
		this.gridclick(this.gridposition);
	},
	
	gridnext: function(e)
	{			
		if(e)
		{
			e.preventDefault();
		}
				
		if(this.gridposition > $$("#" + this.target + " img").length - 1)
		{
			this.gridposition = 0;
		}
				
		this.gridclick(this.gridposition);
	},
	
	gridreset: function(e)
	{
		while($("grid-blanket-"+this.gid))
		{
			$("grid-blanket-"+this.gid).remove();
		}
		
		while($("grid-box-"+this.gid))
		{
			$("grid-box-"+this.gid).remove();
		}
		
		this.gridloadreset();
	},
	
	gridloadreset: function()
	{
		while($("grid-loader-"+this.gid))
		{
			$("grid-loader-"+this.gid).remove();
		}
	},
	
	resize: function(e)
	{
		this.object = e.findElement();


		if(this.position == 1)
		{
			newHeight = this.object.getHeight();
			if(this.size == "small")
			{
				newHeight = 250;
			}

			this.frame.setStyle(
				{
					height: newHeight + "px"
				}
			);
		}
		
		if(this.object.getHeight() > this.frame.getHeight())
		{
			this.object.setStyle(
				{
					height: this.frame.getHeight() + "px"
				}
			);
		}
		else
		{
			this.object.setStyle(
				{
					marginTop: parseInt((this.frame.getHeight() - parseInt(this.object.getHeight()))/2) + "px"
				}
			);
		}
		this.object.show();
	},
	
	previous: function(e)
	{
		e.stop();
		if(this.position > 1)
		{
			this.position--;
		}
		else
		{
			this.position = this.images.length;
		}
		this.animate();
		
		return false;
	},

	next: function(e)
	{		
		e.stop();
		e.target.blur();

		if(this.position < this.images.length)
		{
			this.position++;
		}
		else
		{
			this.position = 1;
		}
		this.animate();
		
		return false;
	},
				
	animate: function()
	{	
		index = this.position-1;
		
		if(this.images[index].ad)
		{
			this.frame.update('<iframe frameborder="0" framepadding="0" framespacing="0" scrolling="no" width="300" height="250" src="https://web.archive.org/web/20121017094753/http://ads.eurogamer.net/delivery/afr.php?zoneid='+this.adzone+'" class="advert" style="display: none;">&nbsp;</iframe>');
		}
		else
		{		
			this.frame.update('<img src="' + this.images[index].url + '" alt="' + this.images[index].caption + '" style="display: none;"/>');
		}
		$$("#"+this.target + " .frame *")[0].observe("load", this.resize.bind(this));
		this.caption.update("<span>" + this.position + "/" + this.images.length + "</span> " + this.images[index].caption);
	}
});

document.observe(
	"dom:loaded",
	function()
	{
		window.onresize = function(event)
		{
			newWidth = parseInt($$("div.copy")[0].getStyle("width"));
			var galleries = $$(".inline-gallery");
			
			for(i = 0; i < galleries.length; i++)
			{			
				if(galleries[i].className == "inline-gallery sidebar")
				{
					galleries[i].style.width = $("sidebar").getStyle("width");
				}
				else
				{
					galleries[i].style.width = newWidth;
				}
			}
		}
		
		// illustration popups
		document.body.appendChild(new Element('div', { 'id': 'blanket' }));
		document.body.appendChild(new Element('div', { 'id': 'overlay' }));
		$("overlay").appendChild(new Element('img', { 'id': 'overlay-image' }));
		document.body.appendChild(new Element('div', { 'id': 'loader' }).update("Loading&hellip;"));
		
		$$("div.content img.preview").each(
			function(image)
			{			
				// if an illustration-preview has an href attribute don't spawn an overlay. See article_images.xslt			
				if(!image.hasClassName("no-overlay"))
				{
					Event.observe(image, "click", function(e) { e.preventDefault(); ImagePopup(e); });
				}
			}
		);

		$$("div.content .illustration img").each(
			function(image)
			{
				if(image.getAttribute("data-original-width") > parseInt(image.getStyle("width")))
				{
					image.addClassName("clickable");
					Event.observe(image, "click", function(e) { e.preventDefault(); ImagePopup(e); });
				}
			}
		);
		
		function ImagePopup(e)
		{
			image = "https://web.archive.org/web/20121017094753/http://images.eurogamer.net/" + e.target.getAttribute("data-uri");

			$("blanket").style.display = "block";

			var viewport = document.viewport.getDimensions();			
			$("loader").setStyle(
				{
					display: "block",
					left: ((viewport.width/2) - (parseInt($("loader").getDimensions().width)/2) + "px"),
					top: ((viewport.height/2) - (parseInt($("loader").getDimensions().height)/2) + "px")
				}
			);

			preload = new Image();
			preload.onload = function()
			{
				Event.observe(
					$("blanket"),
					"click",
					function()
					{
						$("overlay").style.display = "none";
						$("blanket").style.display = "none";
						$("loader").style.display = "none";
					}
				);
				
				var buffer = 200;
				var ratio = preload.width / preload.height;				
				
				if(preload.height > preload.width)
				{
					$("overlay-image").style.height = Math.min(preload.height, (document.viewport.getHeight() - buffer)) + "px";
					$("overlay-image").style.width = parseInt($("overlay-image").style.height) * ratio + "px";
				}
				else
				{
					$("overlay-image").style.width = Math.min(preload.width, (document.viewport.getWidth() - buffer)) + "px";
					$("overlay-image").style.height = parseInt($("overlay-image").style.width) / ratio + "px";
				}

				$("overlay-image").src = image;
						
				$("overlay").style.left = (document.viewport.getWidth()/2) - (parseInt($("overlay-image").style.width))/2 + "px";
				$("overlay").style.top = (document.viewport.getHeight()/2) - (parseInt($("overlay-image").style.height))/2 + "px";

				$("overlay").style.display = "block";				
				$("loader").style.display = "none";
			}
			preload.src = image;
		}
		
	}
);
/*
     FILE ARCHIVED ON 09:47:53 Oct 17, 2012 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 14:16:50 Aug 29, 2019.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  exclusion.robots.policy: 0.155
  CDXLines.iter: 11.075 (3)
  esindex: 0.011
  load_resource: 151.798
  RedisCDXSource: 1.587
  PetaboxLoader3.datanode: 293.994 (4)
  captures_list: 295.395
  PetaboxLoader3.resolve: 126.565
  LoadShardBlock: 280.093 (3)
  exclusion.robots: 0.167
*/