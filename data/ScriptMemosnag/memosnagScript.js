'use strict';
var SF = $.noConflict();
var hasMemoButton=false;
var memoSnagURL,btnHide,youtb,dailyMotion,vimeo;
//chrome.storage.sync.get('memoSnagURL', function(e){memoSnagURL=e.memoSnagURL;});
//chrome.storage.sync.get('youtubeURL', function(e){youtb=e.youtubeURL;});
//chrome.storage.sync.get('dailyMotionURL', function(e){dailyMotion=e.dailyMotionURL;});
//chrome.storage.sync.get('vimeoURL', function(e){vimeo=e.vimeoURL;});

SF( document ).ready(function() {
	if (!location.origin)
    location.origin = location.protocol + "//" + location.host;
	if(location.origin != "http://www.memosnag.com"){
	SF("body").append("<span class='memosnagImage' title='Add to memosnag...'></span>");
	window.onmouseover=function(e) {
		if (e.target.className==='memosnagImage') {
			SF(".memosnagImage").css('opacity',1);
			clearTimeout(btnHide);
			return;
        }
		var element = getEl(e);
		if (element.tagName === 'IMG') {
			if (element.src) {
			   if (!element.src.match(/^data/)) {
					var h = element.naturalHeight || element.height;
					var w = element.naturalWidth || element.width;
					var elW=element.width;
					if (((h >= 120 && w >= 120) || (h >= 120 && w >= 120)) && (element.height >= 120 && element.width >= 120)) {
						if (hasMemoButton === false) {
							var p = getPos(element);
							if (p.left && p.top) {
								var marginTop = getMargin(element, 'top');
								var marginLeft = getMargin(element, 'left');
								clearTimeout(btnHide);
								hasMemoButton = true;
								SF(".memosnagImage").css("top",(p.top+5) + 'px');
								SF(".memosnagImage").css("left",(p.left+(elW-37)) + 'px');
								SF(".memosnagImage").css('opacity',0.85);
								SF(".memosnagImage").attr("data-url",element.src);
								SF(".memosnagImage").attr("data-alt",element.alt);
								SF(".memosnagImage").attr("data-image",true);
								SF(".memosnagImage").fadeIn();
							}
							
						}
					}
			   }
			}
		}
		if(element.tagName==='VIDEO' || element.className==='video' || element.className==='target' || element.getElementById==='video' || element.tagName==='EMBED'){
			var vidSrc='';
			var elW=SF(element).innerWidth();
			var vTitle=element.title;
			if(element.src)
				vidSrc=element.src;
			
			if(!vidSrc && element.getElementsByTagName('source').length>0){
				vidSrc=element.getElementsByTagName('source')[0].src;
			}
			var documentUrl=window.location.href;
			if (documentUrl.toLowerCase().indexOf(youtb) >= 0){
				vidSrc=documentUrl;
			}else if(documentUrl.toLowerCase().indexOf(dailyMotion) >= 0){
				vidSrc=documentUrl;
			}else if(documentUrl.toLowerCase().indexOf(vimeo) >= 0){
				vidSrc=documentUrl;
			}
			if(vidSrc) {
				if(!vTitle)
					vTitle=SF('title').html();
				var h = SF(element).innerHeight();
				var w = SF(element).innerWidth();
				if (elW >= 120) {
					if (hasMemoButton === false) {
						var p = getPos(element);
						if (p.left && p.top) {
							var marginTop = getMargin(element, 'top');
							var marginLeft = getMargin(element, 'left');
							clearTimeout(btnHide);
							hasMemoButton = true;
							SF(".memosnagImage").css("top",(p.top+5) + 'px');
							SF(".memosnagImage").css("left",(p.left+5) + 'px');
							SF(".memosnagImage").css('opacity',0.85);
							SF(".memosnagImage").attr("data-url",vidSrc);
							SF(".memosnagImage").attr("data-title",vTitle);
							SF(".memosnagImage").attr("data-image",false);
							SF(".memosnagImage").fadeIn();
						}
						
					}
				}
			}
		}
	};
	window.onmouseout=function(e) {
		if(hasMemoButton===true){
			hasMemoButton=false;
			btnHide = setTimeout(function () {
              SF(".memosnagImage").hide();
            }, 10);
		}
	};
 }
});


function getEl(e){
	var el = null;
	if (e.target) {
	el = (e.target.nodeType === 3) ? e.target.parentNode : e.target;
	} else {
	el = e.srcElement;
	}
	return el;
}
function getPos(el){
	var x = 0, y = 0;
	var p = SF(el);
	var offset = p.offset();
	var position = p.position();
	x=x+offset.left;
	y=y+offset.top;
	return {"left":x,"top":y};
}
function getMargin(el, prop){
	var margin;
	margin = getComputedStyle(el).getPropertyValue("margin-" + prop);
	if (margin) {
	margin = margin.split('px')[0];
	}
	if (margin > 0) {
	margin = 0;
	}
	margin = parseInt(margin);
	return margin;
}