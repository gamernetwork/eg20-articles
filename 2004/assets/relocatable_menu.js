function s_menuClicked( fireObj, wEvent ) {

	currentTarget = getCurrentTargetElement( wEvent );
	if( bubbleUpToClass( currentTarget, "static-header" ) ) {
		wEvent.cancelBubble = true;
		return( true );
	} else if( bubbleUpToClass( currentTarget, "menu" ) ) {
		wEvent.cancelBubble = true;
		return true;
	} else if( srcObj = bubbleUpToClass( currentTarget, "header" ) ) {

		if( focussed == false ) {
			focussed = true;
			openMenu = "";
		} else {
			focussed = false;
		}

		wEvent.cancelBubble = true;
		return( s_menuMouseOver( fireObj, wEvent ) );
	} else {
		wEvent.cancelBubble = true;
		return true;
	}
}

function s_menuMouseOver( fireObj, wEvent ) {

	currentTarget = getCurrentTargetElement( wEvent );

	if( srcObj = bubbleUpToClass( currentTarget, "header" ) ) {
		menuTableObj = fireObj.childNodes[ 0 ];

		menuName = getMenuName( srcObj.id );				

		if( focussed == true ) {
			if( openMenu != menuName ) {
				if( openMenu != "" ) {
					menuHeaderMouseOut( openMenu );
					menuBodyMouseOut( openMenu );
				}
				menuHeaderMouseOver( menuName );
				menuBodyMouseOver( menuName, getCumulativeOffsetLeft( srcObj, menuTableObj ), getCumulativeOffsetTop( srcObj, menuTableObj ) );
				openMenu = menuName;
			}
			
		} else {
			if( openMenu != "" ) {
				menuHeaderMouseOut( openMenu );
				menuBodyMouseOut( openMenu );
			}
			menuHeaderMouseOver( menuName );
			openMenu = menuName;
		}

		wEvent.cancelBubble = true;
		return false;
	} else if( srcObj = bubbleUpToClass( currentTarget, "static-header" ) ) {
		menuTableObj = fireObj.childNodes[ 0 ];

		menuName = getMenuName( srcObj.id );				

		if( focussed == true ) {
			if( openMenu != menuName ) {
				if( openMenu != "" ) {
					menuHeaderMouseOut( openMenu );
					menuBodyMouseOut( openMenu );
				}
				menuHeaderMouseOver( menuName );
			}
			
		} else {
			if( openMenu != "" ) {
				menuHeaderMouseOut( openMenu );
				menuBodyMouseOut( openMenu );
			}
			menuHeaderMouseOver( menuName );
		}

		wEvent.cancelBubble = true;
		return false;
	}
}

function s_closeAll() {
	if( openMenu != "" ) {
		menuHeaderMouseOut( openMenu );
		menuBodyMouseOut( openMenu );
	}
	focussed = false;
}

function s_mmmOut(  ) {

	//document.getElementById( "results" ).innerText = getCurrentTargetElement( wEvent ).nodeName;
	if( focussed == false ) {
		s_closeAll();
	}
	
}

function bubbleUpToClass( obj, cName ) {
	if( obj === document.body ) {
		return null;
	}
	if( obj.className == cName ) {
		return obj;
	} else {
		return bubbleUpToClass( obj.parentNode, cName );
	}
}

function menuHeaderMouseOver( menuName ) {
	menuHeaderObj = document.getElementById( "mh-" + menuName );
	menuHeaderObj.style.backgroundColor = highlightColour;
}

function menuHeaderMouseOut( menuName ) {
	menuHeaderObj = document.getElementById( "mh-" + menuName );
	menuHeaderObj.style.backgroundColor = normalColour;
}

function menuBodyMouseOver( menuName, xPos, yPos ) {
	showMenu( menuName, xPos, yPos );
}

function menuBodyMouseOut( menuName ) {
	hideMenu( menuName );
}

function showMenu( menuName, xPos, yPos ) {
	menuObj = document.getElementById( "m-" + menuName );

	menuObj.style.left = xPos + 6 + "px";
	menuObj.style.visibility = "visible";
}

function hideMenu( menuName ) {
	menuObj = document.getElementById( "m-" + menuName );

	menuObj.style.visibility = "hidden";
}

function getCurrentTargetElement( e ) {
	if( navigator.appName == "Microsoft Internet Explorer" ) {
		return e.srcElement;
	} else {
		// we don't care about text nodes
		if( e.target.nodeName == "#text" ) {
			return e.target.parentNode;
		} else {
			return e.target;
		}
	}
}

function getCumulativeOffsetLeft( obj, topObj ) {
	if( obj === topObj || obj.offsetParent === null ) {
		return 0;
	} else if( obj.offsetParent === topObj ) {
		return obj.offsetLeft;
	} else {
		return obj.offsetLeft + getCumulativeOffsetLeft( obj.offsetParent, topObj );
	}
}

function getCumulativeOffsetTop( obj, topObj ) {
	if( obj === topObj || obj.offsetParent === null ) {
		return 0;
	} else if( obj.offsetParent === topObj ) {
		return obj.offsetTop;
	} else {
		return obj.offsetTop + getCumulativeOffsetTop( obj.offsetParent, topObj );
	}
}

function getMenuName( objId ) {
	splitAt = objId.indexOf( "-" );
	return( objId.substring( splitAt + 1, objId.length ) );
}

menuload = true;

