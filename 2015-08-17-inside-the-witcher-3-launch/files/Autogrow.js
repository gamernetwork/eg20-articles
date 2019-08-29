function Autogrow(obj, focus)
{		
	//Functions
	var grow = function()
	{
		growByRef(obj);
	}
	
	var growByRef = function(obj)
	{
		var linesCount = 0;
		
		var lines = obj.value.split('\n');
		
		for(i = lines.length-1; i >= 0; --i)
		{
			linesCount += Math.floor((lines[i].length / colsDefault) + 1);
		}

		if (linesCount >= rowsDefault)
		{
			obj.rows = linesCount + 1;
		}
		else
		{
			obj.rows = rowsDefault;
		}
			
		return false;
	}

	var obj = document.getElementById(obj);	
	if(obj)
	{
		var colsDefault = obj.cols;
		var rowsDefault = obj.rows;
		obj.style.overflow = "hidden";
		obj.onkeydown = grow;
		if(focus)
		{
			var val = obj.value;
			obj.value = "";			
			obj.focus();
			obj.value = val;


		}
		growByRef(obj);
	}
};
/*
     FILE ARCHIVED ON 23:07:15 Aug 20, 2015 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 15:08:52 Aug 29, 2019.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  exclusion.robots.policy: 0.209
  CDXLines.iter: 14.908 (3)
  esindex: 0.015
  load_resource: 246.384
  RedisCDXSource: 68.411
  PetaboxLoader3.datanode: 319.984 (5)
  captures_list: 267.196
  PetaboxLoader3.resolve: 87.666 (2)
  LoadShardBlock: 180.636 (3)
  exclusion.robots: 0.218
*/