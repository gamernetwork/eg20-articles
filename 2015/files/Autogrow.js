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
