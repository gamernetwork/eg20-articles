
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

/*
     FILE ARCHIVED ON 09:26:31 Aug 11, 2004 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 13:55:44 Aug 29, 2019.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  LoadShardBlock: 164.694 (3)
  esindex: 0.013
  exclusion.robots: 0.192
  RedisCDXSource: 10.367
  load_resource: 881.2
  captures_list: 190.925
  CDXLines.iter: 12.587 (3)
  exclusion.robots.policy: 0.178
  PetaboxLoader3.resolve: 843.319
  PetaboxLoader3.datanode: 196.653 (4)
*/