var gapi=window.gapi=window.gapi||{};gapi._bs=new Date().getTime();(function(){var f=null,g=window,h="push",i="replace",k="length";var l=g,r=document,v=l.location,w=function(){},z=/\[native code\]/,B=function(a,b,c){return a[b]=a[b]||c},C=function(a){for(var b=0;b<this[k];b++)if(this[b]===a)return b;return-1},D=function(){var a;if((a=Object.create)&&z.test(a))a=a(f);else{a={};for(var b in a)a[b]=void 0}return a},E=B(l,"gapi",{});var F;F=B(l,"___jsl",D());B(F,"I",0);B(F,"hel",10);var G=function(){var a=v.href,b;if(F.dpo)b=F.h;else{b=F.h;var c=RegExp("([#].*&|[#])jsh=([^&#]*)","g"),e=RegExp("([?#].*&|[?#])jsh=([^&#]*)","g");if(a=a&&(c.exec(a)||e.exec(a)))try{b=decodeURIComponent(a[2])}catch(d){}}return b},I=function(a){return B(B(F,"H",D()),a,D())};var J=B(F,"perf",D()),L=B(J,"g",D()),M=B(J,"i",D());B(J,"r",[]);D();D();var N=function(a,b,c){var e=J.r;"function"===typeof e?e(a,b,c):e[h]([a,b,c])},P=function(a,b,c){b&&0<b[k]&&(b=O(b),c&&0<c[k]&&(b+="___"+O(c)),28<b[k]&&(b=b.substr(0,28)+(b[k]-28)),c=b,b=B(M,"_p",D()),B(b,c,D())[a]=(new Date).getTime(),N(a,"_p",c))},O=function(a){return a.join("__")[i](/\./g,"_")[i](/\-/g,"_")[i](/\,/g,"_")};var Q=D(),R=[],S;S={a:"callback",g:"sync",e:"config",c:"_c",d:"h",k:"platform",i:"jsl",TIMEOUT:"timeout",f:"ontimeout",j:"mh"};R[h]([S.i,function(a){for(var b in a)if(Object.prototype.hasOwnProperty.call(a,b)){var c=a[b];"object"==typeof c?F[b]=B(F,b,[]).concat(c):B(F,b,c)}if(a=a.u)b=B(F,"us",[]),b[h](a),(c=/^https:(.*)$/.exec(a))&&b[h]("http:"+c[1]),B(F,"u",a)}]);var T=decodeURI("%73cript");Q.m=function(a){var b=F.ms||"https://web.archive.org/web/20121017095751/https://apis.google.com/",a=a[0],c;if(!(c=!a))c=0<=a.indexOf("..");if(c)throw"Bad hint";return b+"/"+a[i](/^\//,"")};
var U=function(a){return a.join(",")[i](/\./g,"_")[i](/-/g,"_")},W=function(a,b){for(var c=[],e=0;e<a[k];++e){var d=a[e];d&&0>C.call(b,d)&&c[h](d)}return c},aa=/[@"'<>#\?&%]/,ba=/^https?:\/\/[^\/\?#]+\.google\.com(:\d+)?\/[^\?#]+$/,ca=/\/cb=/g,X=function(a){var b=r.createElement(T);b.setAttribute("src",a);b.async="true";a=r.getElementsByTagName(T)[0];a.parentNode.insertBefore(b,a)},Z=function(a,b){var c=b||{};"function"==typeof b&&(c={},c[S.a]=b);var e=c,d=e&&e[S.c];if(d)for(var j=0;j<R[k];j++){var m=
R[j][0],n=R[j][1];n&&Object.prototype.hasOwnProperty.call(d,m)&&n(d[m],a,e)}e=a?a.split(":"):[];if(!(d=c[S.d]))if(d=G(),!d)throw"Bad hint";j=d;m=B(F,"ah",D());if(!m["::"]||!e[k])Y(e||[],c,j);else{d=[];for(n=f;n=e.shift();){var q=n.split("."),q=m[n]||m[q[1]&&"ns:"+q[0]||""]||j,u=d[k]&&d[d[k]-1]||f,x=u;if(!u||u.hint!=q)x={hint:q,b:[]},d[h](x);x.b[h](n)}var A=d[k];if(1<A){var y=c[S.a];y&&(c[S.a]=function(){0==--A&&y()})}for(;e=d.shift();)Y(e.b,c,e.hint)}},Y=function(a,b,c){for(var e=a.sort(),a=[],d=
void 0,j=0;j<e[k];j++){var m=e[j];m!=d&&a[h](m);d=m}var a=a||[],n=b[S.a],q=b[S.e],d=b[S.TIMEOUT],u=b[S.f],x=f,A=!1;if(d&&!u||!d&&u)throw"Timeout requires both the timeout parameter and ontimeout parameter to be set";var e=B(I(c),"r",[]).sort(),y=B(I(c),"L",[]).sort(),H=[].concat(e),V=function(a,b){if(A)return 0;l.clearTimeout(x);y[h].apply(y,p);var d=((E||{}).config||{}).update;d?d(q):q&&B(F,"cu",[])[h](q);if(b){P("me0",a,H);try{$(function(){var a;a=c===G()?B(E,"_",D()):D();a=B(I(c),"_",a);b(a)})}finally{P("me1",
a,H)}}n&&n();return 1};0<d&&(x=l.setTimeout(function(){A=!0;u()},d));var p=W(a,y);if(p[k]){var p=W(a,e),s=B(F,"CP",[]),t=s[k];s[t]=function(a){if(!a)return 0;P("ml1",p,H);var b=function(){s[t]=f;return V(p,a)};if(0<t&&s[t-1])s[t]=b;else for(b();(b=s[++t])&&b(););};if(p[k]){var K="loaded_"+F.I++;E[K]=function(a){s[t](a);E[K]=f};a=c.split(";");a=(d=Q[a.shift()])&&d(a);if(!a)throw"Bad hint:"+c;d=a=a[i]("__features__",U(p))[i](/\/$/,"")+(e[k]?"/ed=1/exm="+U(e):"")+("/cb=gapi."+K);j=d.match(ca);if(!j||
!(1===j[k]&&ba.test(d)&&!aa.test(d)))throw"Bad URL "+a;e[h].apply(e,p);P("ml0",p,H);b[S.g]||l.___gapisync?(b=a,"loading"!=r.readyState?X(b):r.write("<"+T+' src="'+encodeURI(b)+'"></'+T+">")):X(a)}else s[t](w)}else V(p)};var $=function(a){if(F.hee&&0<F.hel)try{return a()}catch(b){F.hel--,Z("debug_error",function(){g.___jsl.hefn(b)})}else return a()};E.load=function(a,b){return $(function(){return Z(a,b)})};L.bs0=g.gapi._bs||(new Date).getTime();N("bs0");L.bs1=(new Date).getTime();N("bs1");delete g.gapi._bs;})();
gapi.load("plusone-unsupported",{callback:window["gapi_onload"],_c:{"annotation":[],"jsl":{"u":"https://web.archive.org/web/20121017095751/https://apis.google.com/js/plusone.js","dpo":false,"hee":true,"ci":{"services":{},"inline":{"css":1},"lexps":[17,69,71,36,40,61,74,75,30,45],"oauth-flow":{},"report":{},"iframes":{"additnow":{"url":"https://web.archive.org/web/20121017095751/https://apis.google.com/additnow/additnow.html?bsv=m&abtk=AEIZW7TH/CSH9pRacCZbmNzmEuwFSuhcblt8fQmJ3EWWHRlSy/ki4HwJKgzzS4usf502gWthb1eY60Z6%2BQhIRdj7iJSDlyNSb3/stNidL6niTm2wfPutqss%3D"},"plus":{"methods":["onauth"],"url":":socialhost:/u/:session_index:/_/pages/badge?bsv=m&abtk=AEIZW7SZ4ZsAoZz9tQ7DA6vUjSvsqufW3OlNZoQYi5vq6uljb7vKyIPA437jzh9ADj0TVuEb2AYpki7gCSp43YVSKWA%2BM3%2BDt5uh03jlbJFefWko0B9OOnU%3D"},":socialhost:":"https://web.archive.org/web/20121017095751/https://plusone.google.com/","plus_circle":{"params":{"url":""},"url":":socialhost:/:session_prefix:_/widget/plus/circle?bsv=m&abtk=AEIZW7Rrqvrh0t7VAtszBa%2BYkSdMev8j14o0vPkBv1YnnKqqSPirzX2Acmek%2BNRJlwjyM63Jn7LNJ6dVEPNkHYIVOT4/2Hocy6xVX8T4703o/QN7TWbJkH0%3D"},"evwidget":{"params":{"url":""},"url":":socialhost:/:session_prefix:_/events/widget?bsv=m&abtk=AEIZW7ReSjcJfC%2BV%2BwoUQzH0d43rRPzHSsw6lwBupoybQV6g9SicffcgZEJr4nMcHvkj0%2BdvpIJUgd/xAlfzHT7fFV3FJuUsw0h3ELGjsMVAtc4ITD//ZFE%3D"},":signuphost:":"https://web.archive.org/web/20121017095751/https://plus.google.com/","plusone":{"preloadUrl":["https://web.archive.org/web/20121017095751/https://ssl.gstatic.com/s2/oz/images/stars/po/Publisher/sprite4-a67f741843ffc4220554c34bd01bb0bb.png"],"params":{"count":"","url":"","size":""},"url":":socialhost:/:session_prefix:_/+1/fastbutton?bsv=m&abtk=AEIZW7SDWPYEUz9lbmD2beuoaJTJBi7f20p5SVLfPo19JcotXCdkqCq0Nagawk68ABnfKuawR8hLZhrOghAqRSV/KLMcIzsrVm98ocEq%2BaKwCDXOECP6vdc%3D"},"plus_share":{"params":{"url":""},"url":":socialhost:/:session_prefix:_/+1/sharebutton?plusShare=true&bsv=m&abtk=AEIZW7SCjvVfQOqC3XshDvkM/7JqatotJVvul2VqGOhpSiGUN9oyD8PoayiyQa0qNGvSPeeUzqNs24w1dWsWt3F4VfMa0kjORfH9e0X158XQHYByd5hei54%3D"}},"isPlusUser":false,"debug":{"host":"https://web.archive.org/web/20121017095751/https://plusone.google.com/","reportExceptionRate":0.05,"rethrowException":true},"csi":{"rate":0},"googleapis.config":{"mobilesignupurl":"https://web.archive.org/web/20121017095751/https://m.google.com/app/plus/oob?"}},"h":"m;/_/apps-static/_/js/gapi/__features__/rt=j/ver=FR4Bxq03aOY.en_US./sv=1/am=!2H2H8ZqGj6aIqyfgIg/d=1/rs=AItRSTMIuC4qhrvc5n2HxJ_fAlIFdYG3DA","fp":"133d695d39a27cd42ca8fd9b6eb7ee24a4c3b2c6"},"fp":"133d695d39a27cd42ca8fd9b6eb7ee24a4c3b2c6"}});
/*
     FILE ARCHIVED ON 09:57:51 Oct 17, 2012 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 14:16:53 Aug 29, 2019.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  CDXLines.iter: 93.969 (3)
  LoadShardBlock: 116.117 (6)
  RedisCDXSource: 80.072
  PetaboxLoader3.datanode: 96.879 (7)
  PetaboxLoader3.resolve: 115.593
  load_resource: 131.479
  exclusion.robots: 0.239
  esindex: 0.008
  exclusion.robots.policy: 0.222
*/