
document.observe(
	"dom:loaded",
	function()
	{
		
		function hideSmilies() {
			if($('smilies'))
			{
				$('smilies').morph(
					'opacity: 0;',
					{
						duration: 0.1,
						afterFinish: function()
						{
							$('smilies').style.display = "none";
							$$('a.tool.smiley').first().removeClassName('on');
						}
					}
				);
			}
		}
		
		if($$('a.tool.smiley').length > 0)
		{
			$$('a.tool.smiley').first().observe('click',
				function(e) {
					e.stop();
					if( $('smilies').style.display == "block" ) {
						hideSmilies();
					}
					else {
						var offset = e.element().cumulativeOffset();
						$('smilies').style.top = (e.element().offsetTop + 35) + 'px';
						$('smilies').style.left = (e.element().offsetLeft - 385) + 'px';
						$('smilies').style.opacity = "0";
						$('smilies').style.display = "block";
						$('smilies').morph(
							'opacity: 1;',
							{
								duration: 0.1,
								afterFinish: function()
								{
									e.element().addClassName('on');
								}
							}
						);
					}
				}
			);
		}
		
		// clicking anywhere hides smilies popup
		$$("body").first().observe('click', function(e) {
			hideSmilies();
		});

		// this prevents a click within the popup from bubbling up to the body tag and triggering the hide popups function defined above
		if($('smilies'))
		{
			$('smilies').observe('click', function(e) {
				e.stop();
			});
		}
		
	}
);

function formatTag(tag, str)
{
	if(tag == "link")
	{
		if(str == "")
		{
			str = "Put_link_here";
		}
		return "[" + tag + " url=" + str + "]" + "Description_here" + "[/" + tag + "]";
	}
	else if(tag == "youtube")
	{
		if(str == "")
		{
			str = "Put_ID_here";
		}
		return "[" + tag + " id=" + str + "]";
	}
	else if(tag == "img")
	{
		if(str == "")
		{
			str = "Put_link_here";
		}
		return "[" + tag + " src=" + str + "]";
	}
	else
	{
		return "[" + tag + "]" + str + "[/" + tag + "]";
	}
}

function format(tag)
{
	var v = document.getElementById("comment");
	
	if(document.selection)
	{
		var str = document.selection.createRange().text;
		v.focus();
		var sel = document.selection.createRange();
		
		sel.text = formatTag(tag, str);		
	}
	else
	{
        var start	= v.selectionStart; 
        var end		= v.selectionEnd;
        var middle	= v.value.substr(start, end - start);
	
        v.value = v.value.substr(0, start) + formatTag(tag, middle) + v.value.substr(end, v.value.length); 
		v.focus();
		
		var caretPos = start.length + tag.length+2;							
		v.setSelectionRange(caretPos, caretPos); 
	}
}

function smilie(smilie)
{
	var v = document.getElementById("comment");
	
	if(document.selection)
	{
		var str = document.selection.createRange().text;
		v.focus();
		var sel = document.selection.createRange();
		
		sel.text = smilie;
	}
	else
	{
        var start	= v.selectionStart; 
        var end		= v.selectionEnd;
        var middle	= v.value.substr(start, end - start);
	
        v.value = v.value.substr(0, start) + smilie + v.value.substr(end, v.value.length); 
		v.focus();
		
		var caretPos = start.length + smilie.length+2;							
		v.setSelectionRange(caretPos, caretPos); 
	}
}

function quote(pid)
{
	var who		= trim(document.getElementById("who-"+pid).innerHTML);
	var post	= trim(document.getElementById("post-"+pid).innerHTML);
	
	var quote = "[quote][b]" + who + " wrote:[/b]\n\n" + post + "\n[/quote]\n\n";

	document.getElementById("comment").value = quote;
	
	Effect.ScrollTo(
		"comment",
		{
			duration: "0.5",
			offset: -20,
			afterFinish: function()
			{
				document.getElementById("comment").focus();			
			}
		}
	);
	
	return false;
}

function trim(str, chars) {
	return ltrim(rtrim(str, chars), chars);
}
 
function ltrim(str, chars) {
	chars = chars || "\\s";
	return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
}
 
function rtrim(str, chars) {
	chars = chars || "\\s";
	return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
}

/*
     FILE ARCHIVED ON 09:47:51 Oct 17, 2012 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 14:16:50 Aug 29, 2019.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  exclusion.robots.policy: 0.281
  esindex: 0.017
  PetaboxLoader3.resolve: 45.442
  RedisCDXSource: 2.71
  load_resource: 57.445
  exclusion.robots: 0.3
  LoadShardBlock: 116.399 (3)
  CDXLines.iter: 23.793 (3)
  PetaboxLoader3.datanode: 88.766 (4)
  captures_list: 148.337
*/