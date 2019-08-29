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
     FILE ARCHIVED ON 07:55:20 Jun 07, 2013 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 14:45:56 Aug 29, 2019.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  PetaboxLoader3.datanode: 153.996 (4)
  LoadShardBlock: 67.378 (3)
  RedisCDXSource: 1.001
  exclusion.robots: 0.15
  captures_list: 83.527
  exclusion.robots.policy: 0.14
  load_resource: 87.95
  CDXLines.iter: 12.74 (3)
  esindex: 0.008
*/