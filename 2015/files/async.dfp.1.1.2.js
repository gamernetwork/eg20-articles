/**
 * Async DFP
 *
 * Copyright 2014 Gamer Network
 */

(function( $, window, undefined ) {

    $.fn.getDFPads = function( options ) {
 
        // Default options
        var defaults = $.extend({
            dfp_instance : '43340684',
            dfp_id : 'data-dfp-id',
            dfp_sizes : 'data-dfp-sizes',
            dfp_ad_targeting : 'data-dfp-targeting',
            custom_variables : '',
            acceptable_ads_show : true,
            acceptable_ads_file : '//web.archive.org/web/20150820234019/http://cdn.gamer-network.net/plugins/dfp/evil-ads.js'
        }, options);

        var ads = $(this).filter(':visible');
        var get_ads = false;
        var openx_json = defaults.openx_json;

        var zones = [];
        var zone_groups = [];
        var tags = [];
        var rendered = 0;

        getDimensions = function ($adUnit) {

            var dimensions = [],
            dimensionsData = $adUnit.data('dfp-sizes');
            if (dimensionsData) {
             
             var dimensionGroups = dimensionsData.split(',');

             $.each(dimensionGroups, function (k, v) {

                 var dimensionSet = v.split('x');
                 dimensions.push([parseInt(dimensionSet[0], 10), parseInt(dimensionSet[1], 10)]);

             });

            } else {

                dimensions.push([$adUnit.width(), $adUnit.height()]);

            }

            return dimensions;

        },

        loadDFP = function () {

            window.googletag = window.googletag || {};
            window.googletag.cmd = window.googletag.cmd || [];

            var gads = document.createElement('script');
            gads.async = true;
            gads.type = 'text/javascript';

            var useSSL = 'https:' === document.location.protocol;
            gads.src = (useSSL ? 'https:' : 'http:') +
            '//web.archive.org/web/20150820234019/http://www.googletagservices.com/tag/js/gpt.js';
            var node = document.getElementsByTagName('script')[0];
            node.parentNode.insertBefore(gads, node);

        },

        ghostAds = function() {
            zone_ids = ads.map(function() {
                return $(this).attr('data-ghost-zone')
            }).get().join('|');
            $.getScript("https://web.archive.org/web/20150820234019/http://ghost.gamer-network.net/www/delivery/spc.php?zones=" + zone_ids + "&r=" + Math.floor(Math.random() * 99999999), function() {
                ads.each(function(key, b) {
                    // Swap out advert with iframe              
                    $(document.body).addClass("blocked");
                    $(b).html();
                    $(b).html(
                    OA_output[$(b).attr('data-ghost-zone')]);
                });
            });
        },

        createAds = function () {

            $(ads).each(function(){
                if($(this).css('display') == 'block' || $(this).css('display').indexOf('box') >= 0 ) {  
                    var dfpId = $(this).attr(defaults.dfp_id);
                    var zoneId = $(this).attr('id');
                    var dimensions = getDimensions($(this));
                    var ad_targeting = $(this).attr(defaults.dfp_ad_targeting);
                    zones.push(zoneId);

                    // Spit out some useful stuff in the console
                    //console.log('\n***** Ad Slot Defined: ' + zoneId + ' *****');
                    //console.log('Dimensions: ' + dimensions);

                    // Define ad slot in DFP
                    window.googletag.cmd.push(function () {
                        dfpSlot = window.googletag.defineSlot('/' + defaults.dfp_instance + '/' + dfpId, dimensions, zoneId).addService(window.googletag.pubads());

                        //Ad slot specific targeting
                        if (ad_targeting) {
                            var targeting = [];
                             
                            var targetingGroups = ad_targeting.split(',');

                            $.each(targetingGroups, function (k, v) {
                                var targetingSet = v.split('=');
                                //console.log('Slot Targeting: ' + targetingSet[0] + ' is ' + targetingSet[1]);
                                dfpSlot.setTargeting(targetingSet[0], targetingSet[1]);
                            });
                        }

                    });
                };
            });

            //console.log('\n***** General DFP Settings *****');

            window.googletag.cmd.push(function () {

                window.googletag.pubads().enableSingleRequest();

                if(defaults.custom_variables) {
                    
                    var variable_string = '';

                    $.each(defaults.custom_variables, function(key, val) {
                        //console.log('Targeting Rule: ' + key + ' is ' + val);
                        window.googletag.pubads().setTargeting(key, val);
                    });

                }

                window.googletag.pubads().addEventListener('slotRenderEnded', function(event) {

                   rendered++;

                });

                window.googletag.enableServices();

            });

        },

        displayAds = function () {

            $.each(zones, function (key, val) {
                window.googletag.cmd.push(function () { window.googletag.display(val); }); 
            });

        }

        loadDFP();

        if(defaults.acceptable_ads_show) {

            $.jsonp({
                url: defaults.acceptable_ads_file,
                callback: '_jqjsp',
                cache: false,
                success: function () {
                    createAds();
                    displayAds();
                },
                error:function () {
                    ghostAds();  
                }
            });

        } else {

            createAds();
            displayAds();

        }

    }
 
})( window.jQuery, window);

