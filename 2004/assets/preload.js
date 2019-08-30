
// do preload stuff here

function doswap( obj, state ) {
	stub = obj.getAttribute( "name" );
	if( stub == null || stub == "" ) {	
		stub = obj.name;
	}
	if( stub == null || stub == "" ) {	
		pos = obj.src.indexOf( "_on.gif" );
		if( pos > 1 ) {
			stub = obj.src.substring( 0, pos ) + "_off.gif";
		} else {
			pos = obj.src.indexOf( "_off.gif" );
			if( pos > 1 ) {
				stub = obj.src.substring( 0, pos ) + "_off.gif";
			}
		}
	}
	if( stub != null && stub != "" ) {
		obj.src = stub + "_" + state + ".gif";
	}
}

preload = true;

