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
     FILE ARCHIVED ON 09:47:48 Oct 17, 2012 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 14:16:50 Aug 29, 2019.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  exclusion.robots.policy: 0.191
  CDXLines.iter: 15.085 (3)
  esindex: 0.017
  load_resource: 181.149
  RedisCDXSource: 9.17
  PetaboxLoader3.datanode: 136.924 (4)
  captures_list: 66.711
  PetaboxLoader3.resolve: 77.373
  LoadShardBlock: 38.895 (3)
  exclusion.robots: 0.207
*/