var Zoomer = Class.create({			
	initialize: function(args)
	{
		this.target = args.target;
		this.groups = args.groups;
												
		$(this.target).update("");		
		$(this.target).removeClassName("disabled");
		$(this.target).addClassName("enabled");
		
		for(i = 0; i < this.groups.length; i++)
		{		
			// create a group divider
			var group = new Element("div", { class: "group", id: "group-"+i } );
			
			var images = this.groups[i].images;
			var caption = this.groups[i].caption;
			
			// draw main reference image
			var referenceContainer = new Element(
				"div",
				{
					"class": "reference-container"
				}
			);
			
			// draw main reference image
			var reference = new Element(
				"img",
				{
					"class": "reference",
					"src": this.groups[i].images[0].url + "/EG11/resize/300x-1",
					"reference-for": "group-"+i
				}
			);

			referenceContainer.insert(reference);			

			// pointer for showing the current highlighted area		
			var pointer = new Element("div", { class: "pointer" } );
			referenceContainer.insert( pointer );

			group.insert(referenceContainer);
			
			$(this.target).insert( group );

			// thumbnails of each of the images supplied:
			// - thumbs are divided into the available space
			var thumbnails = new Element("div", { class: "thumbnails" });
			group.insert( thumbnails );
			
			for(j = 0; j < images.length; j++)
			{				
				var title = new Element("span").update(images[j].caption);			
				var link = new Element("a", { href: images[j].url, target: "_blank" } );
				var image = new Element("img", { src: images[j].url } );
				
				link.insert(image);
				
				var div = new Element("div", { style: "width: " + (100 / images.length) + "%" } );
	
				div.insert(title);
				div.insert(link);
				
				thumbnails.insert(div);
			}

			Event.observe(document, 'mousemove', this.checkPointer.bind(this, reference));
		}

		this.title = new Element("h3", { class: "title" } );
		if(this.groups[0].caption > "")
		{
			this.title.update(this.groups[0].caption);
			$(this.target).insert( this.title );
		}		

		// draw reference thumbs that allow you to
		// switch between image groups

		var switchers = new Element("div", { class: "switchers" });
		for(i = 0; i < this.groups.length; i++)
		{
			var images = this.groups[i].images;
			// draw main reference image
			var thumb = new Element(
				"img",
				{
					"src": images[0].url + "/EG11/resize/76x-1",
					"reference-for": "group-"+i,
					"style": "width: " + (100 / this.groups.length) + "%"
				}
			);
			thumb.observe( "click", this.setGroup.bind(this, i) );
			
			switchers.insert(thumb);			
		}
		$(this.target).insert( switchers );	
		
		this.setGroup(0);
	},
	
	setGroup: function(x, e)
	{
		// set the first group as the active group
		var groups = $$("#" + this.target + " .group");
		groups.each(
			function(o)
			{
				o.setStyle(
					{ display: "none" }
				);
			}
		);
		groups[x].setStyle({ display: "block" });

		$$("#" + this.target + " .switchers img").each( function(o) { o.removeClassName("on"); } );
		$$("#" + this.target + " .switchers img")[x].addClassName("on");

		this.title.update(this.groups[x].caption);

		// reset pointer position
		var pointer = $$("#" + this.target + " #group-" + x + " .pointer")[0];
		pointer.setStyle(
			{
				top: (174 / 2) - (parseInt(pointer.getStyle("height")) / 2) + "px",
				left: (309 / 2) - (parseInt(pointer.getStyle("width")) / 2) + "px",
			}
		);
		
		// reset image positions
		thumbs = $$("#" + this.target + " #group-" + x + " .thumbnails img");
		thumbs.each( function(thumb)
			{
				thumb.setStyle(
					{
						top: "-" + ((thumb.height / 2) - 100) + "px",
						left: "-" + ((thumb.width / 2) - 150) + "px",
					}
				);
			}
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
	},
	
	checkPointer: function(o, e)
	{	
		if(this.withinViewport(o))
		{	
			var containerLeft = Position.page(o)[0] + document.viewport.getScrollOffsets().left;
			var containerTop = Position.page(o)[1] + document.viewport.getScrollOffsets().top;
			
			//get the mouse coordinates
			mouseX = Event.pointerX(e);
			mouseY = Event.pointerY(e);
		
			//calculate the absolute mouse position in the div,
			//by mouseposition minus left position of the container
			horizontalPosition = mouseX - containerLeft;
			verticalPosition = mouseY - containerTop;
				
			//use prototypes function to get the dimension
			//this is a VERY usefull function because it also checks for borders
			containerDimensions = o.getDimensions();
			height	= containerDimensions.height;
			width	= containerDimensions.width;
		
			//check if the mouse is out or inside the div
			//this if statement checks if the cursor is inside the div
			var pointer = $$("#" + this.target + " #" + o.getAttribute("reference-for") + " .pointer")[0];
			var thumbs = $$("#" + this.target + " #" + o.getAttribute("reference-for") + " .thumbnails img");
				
			if(horizontalPosition < 0 || verticalPosition < 0 || mouseX > (width + containerLeft) || mouseY > (height + containerTop) )
			{
				pointer.setStyle(
					{
						top: (height / 2) - (parseInt(pointer.getStyle("height")) / 2) + "px",
						left: (width / 2) - (parseInt(pointer.getStyle("width")) / 2) + "px",
					}
				);
	
				thumbs.each( function(thumb)
					{
						thumb.setStyle(
							{
								top: "-" + ((thumb.height / 2) - 100) + "px",
								left: "-" + ((thumb.width / 2) - 150) + "px",
							}
						);
					}
				);	
			}
			else
			{
				vPercent = (100 / o.height) * verticalPosition;			
				hPercent = (100 / o.width) * horizontalPosition;
				
				vPixel = (thumbs[0].height / 100) * vPercent;
				hPixel = (thumbs[0].width / 100) * hPercent;
	
				/*
				if($("debug"))
				{
					$('debug').innerHTML = 'MOUSE IN TARGET<br/>mouseX:' + horizontalPosition + '<br/>mouseY:' + verticalPosition + "<br/><br/>Percentages:<br/>h:" + hPercent + "% v:" + vPercent + "%<br/><br/>Pixels:<br/>h:" + hPixel + "px v:" + vPixel + "px";
				}
				*/
	
				pointer.setStyle(
					{
						left: horizontalPosition + "px",
						top: verticalPosition + "px",
					}
				);
				
				for(i = 0; i < thumbs.length; i++)
				{
					thumbs[i].setStyle(
						{
							top: "-" + vPixel + "px",
							left: "-" + hPixel + "px"
						}
					);
				}
			}
		}
	}	
});
/*
     FILE ARCHIVED ON 07:55:23 Jun 07, 2013 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 14:45:55 Aug 29, 2019.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  load_resource: 63.344
  exclusion.robots: 0.206
  exclusion.robots.policy: 0.193
  PetaboxLoader3.datanode: 54.737 (4)
  PetaboxLoader3.resolve: 59.548 (2)
  LoadShardBlock: 77.92 (3)
  CDXLines.iter: 15.952 (3)
  esindex: 0.016
  RedisCDXSource: 48.343
  captures_list: 145.733
*/