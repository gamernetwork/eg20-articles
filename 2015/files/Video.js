var Playlists = new Array;
var video_reload_attempts = [];
var video_played = [];
var realvideo = false;
var progress = [];
var dfp_timestamp = Date.now();
var dfp_url = document.URL;

// last param should always be 'pls' cos I'm using early binding (see invocation)
function invokeJWPlayer( pls_id, width, height, site_id, auto, pls ) {
	conf = {
        flashplayer: "/scripts/Eurogamer/jwplayer/player.swf",
        skin: "/scripts/Eurogamer/jwplayer/skins/egskin/egskin.xml",
        playlist: pls,
        width: width,
        height: height,
        autoStart: auto,
        stretching: 'bestfit',
        dock: true,
        plugins: {
            '../scripts/Eurogamer/jwplayer/sidemenu/sidemenu.js': {},
            '../scripts/Eurogamer/jwplayer/subtitles/subtitles.js': { margin: 10, site_id: site_id },
            '../scripts/Eurogamer/jwplayer/expand/expand.js': { site_id: site_id },
            'hd-2': {}
        }
    };

    try {
      if(_ox_zones[ 'video-preroll-hd' ]) {
        conf['plugins'] = {'../scripts/Eurogamer/jwplayer/sidemenu/sidemenu.js': {},
            '../scripts/Eurogamer/jwplayer/subtitles/subtitles.js': { margin: 10, site_id: site_id },
            '../scripts/Eurogamer/jwplayer/expand/expand.js': { site_id: site_id },
            'hd-2': {},
            '/scripts/Eurogamer/ova-jw/swf/ova-jw.swf': {
                "delayAdRequestUntilPlay": true,
                "canFireEventAPICalls": false,
                "ads":{
                    "notice": { "textStyle": "smalltext" },
                    "skipAd": {
                        "enabled": true,
                        "showAfterSeconds": 5,
                        "html": "<p class=\"skipad\">SKIP AD</p>",
                        "region": {
                            "id": "my-new-skip-ad-button",
                            "verticalAlign": "15",
                            "horizontalAlign": "15",
                            "backgroundColor": "#0069ff",
                            "opacity": 0.8,
                            "borderRadius": 9,
                            "padding": "0 1 1 13",
                            "width": 80,
                            "height": 20,
                            "style": ".skipad { z-index: 30; color: #ffffff; font-weight: bold; font-size: 10px; }"
                        }
                    },
                    "schedule":[
                        {
                            "tag": "https://web.archive.org/web/20150820230720/http://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/43340684/" + _ox_zones[ 'video-preroll-hd' ] + "&ciu_szs&impl=s&gdfp_req=1&env=vp&output=xml_vast2&unviewed_position_start=1&url=" + dfp_url + "&correlator=" + dfp_timestamp,
                            "position": "pre-roll"
                        }
                    ]
                },
                "debug":{
                    "debugger": "firebug",
                    "levels": "none"
                }
            }};
      }
    } catch(e) {
        conf['plugins'] = {'../scripts/Eurogamer/jwplayer/sidemenu/sidemenu.js': {},
            '../scripts/Eurogamer/jwplayer/subtitles/subtitles.js': { margin: 10, site_id: site_id },
            '../scripts/Eurogamer/jwplayer/expand/expand.js': { site_id: site_id },
            'hd-2': {}
            };
    }
    
	jwplayer( "video-" + pls_id ).setup( conf );
	//setupEvents( Playlist, site_id );
}

function Video( Playlist, site_id, reload, auto ) {
	if ( !reload ) {
		rewriteVideoLinks(Playlist['id']);
		Playlists[Playlists.length] = Playlist;
	}
	
	var width = Playlist["width"];
	var height = Playlist["height"];

	var pls_file = 'tv/playlist/'+Playlist['id'];
	pls_id = Playlist['id'];

	jQuery.getJSON(
		pls_file, invokeJWPlayer.bind( null, pls_id, width, height, site_id, auto )
	).error(
		function()
		{
			// do nothing
		}
	);
}


function setupEvents( Playlist, site_id ) {
	
	jwplayer("video-"+Playlist["id"]).onError( function(evt) { videoError( evt.message, Playlist, site_id ); } );
	jwplayer("video-"+Playlist["id"]).onPlay( function(evt) { videoPlay( Playlist["id"], jwplayer("video-"+Playlist["id"]).getPlaylistItem()['profileid'] ); } );
	jwplayer("video-"+Playlist["id"]).onComplete( function(evt) { videoOnComplete( Playlist, site_id ) } );
	jwplayer("video-"+Playlist["id"]).onTime( function(evt) { if ( realvideo ) videoTime( Playlist["id"], Math.round( parseFloat( evt.position ) ) ) } );
}

function videoTime( id, t ) {

    // get to nearest 15s
    p = t - ( t % 15 );

    // track view duration 15s and over
	if ( p > 0 && progress[p] == undefined ) {
		progress[p] = true;
		ga('send', 'event', 'video', 'viewtime', 'onsitevideo', p, {'nonInteraction': 1} );
	}

}

function videoOnComplete( Playlist, site_id ) {
	var profile_id = jwplayer("video-"+Playlist["id"]).getPlaylistItem()['profileid'];
	if ( profile_id == undefined ) return; //ignore pre-roll

	ga('send', 'event', 'video', 'view', 'onsitevideo', 100, {'nonInteraction': 1} );

	//jwplayer("video-"+Playlist["id"]).stop();
}


function videoError( message, Playlist, site_id ) {
	if ( message.substring(0,16) == "Video not found:" ) {
		//Reload the video object. Only allow this to be done a limited number of times
		if ( video_reload_attempts[ Playlist["id"] ] == undefined ) video_reload_attempts[ Playlist["id"] ] = 0;
		if ( video_reload_attempts[ Playlist["id"] ] < 4 ) Video( Playlist, site_id );
		video_reload_attempts[ Playlist["id"] ]++;
	}
}
function videoPlay( id, profile_id ) {
	if ( profile_id == undefined ) {
		realvideo = false;
		return; //ignore pre-roll
	}
	realvideo = true;
	progress = []; //reset for new video

	if ( video_played[ id ] == undefined ) { //first time only
		//jwplayer("video-"+id).resize( jwplayer("video-"+id).getWidth(), jwplayer("video-"+id).getHeight() );
		video_played[ id ] = true;
		jQuery.get( 'tv/view/' + id + '/' + profile_id ); //register view
	}
}


//Video links in articles:

function rewriteVideoLinks( id ) {
	j('a[href^="video#' + id + '@"]').each( function() { //with start position (in seconds)
		var start = j(this).attr('href').substring( id.length + 7 );
		j(this).attr('href','#');
		j(this).click( function() { playVideoAt( id, start ); return false; } );
	} );

	j('a[href="video#' + id + '"]').each( function() { //just the video, played from the start
		j(this).attr('href','#');
		j(this).click( function() { playVideoAt( id, 0 ); return false; } );
	});
}

var seekOnPlay = false;
function playVideoAt( id, pos ) {
	if ( jwplayer('video-' + id).getState() == "IDLE" ) {
		seekOnPlay = true;
		jwplayer('video-' + id).onPlay( function() { if ( seekOnPlay ) { seekOnPlay = false; jwplayer('video-' + id).seek(pos); } } );
		jwplayer('video-' + id).play(true);
	} else {
		jwplayer('video-' + id).seek( pos );
	}
	return false;
}

