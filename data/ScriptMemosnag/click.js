'use strict';

	/*---- global variabiles ----*/
	var SF = $.noConflict();
	var isLive=true;
	var youtb="https://www.youtube.com/watch?v=";
	var dailyMotion="http://www.dailymotion.com/video/";
	var vimeo="https://vimeo.com/";
	var memoSnagURL="http://my-pc/memosnag/";
	var image_index = 0;
	var keep_switching_icon = true;
	var btn_FirefoxMemosnag = null;
	var knoteText = '';
	var knoteTitle = '';
	var webPage = '';
	var sourceURL = '';
	var pageAuthor = '';
	var publishedDate = '';
	var publisher = '';
	var memoToken='';
    var pageAuthor = '';
	var publishedDate = '';
	var publisher = '';
	var httpRequest;
	var isFine = false;
	var isOpen = false;
	var ciclo = 0;
	var n = null; // variabile used for notification 
	var selectionText = "";
	var ItemSelectedText = false;
	var primaChiamata = true;

	
	

Notification.requestPermission();
		if(isLive){
	memoSnagURL="http://www.memosnag.com/";
		}
(function() {
	var documentUrl=window.location.href;
	
   
	localStorage.myObject = { 'memoSnagURL': memoSnagURL, 
									'youtubeURL': youtb, 
									'vimeoURL': vimeo  , 
									'dailyMotionURL': dailyMotion };
								
    SF(window).load(function() {
		if(getFromURL()){
			//chrome.runtime.sendMessage({method: "pageDetails",pageDetails:getFromURL()}, function(response) {});
		}
		if(findAuthor()){
			pageAuthor=findAuthor();
			//chrome.runtime.sendMessage({method: "pageAuthor",pAuthor:pageAuthor}, function(response) {});
		}
		if(findPublisher()){
			publisher=findPublisher();
			//chrome.runtime.sendMessage({method: "publisher",publisherName:publisher}, function(response) {});
		}
		if(findPublishedDate()){
			publishedDate=findPublishedDate();
			//chrome.runtime.sendMessage({method: "publishedDate",pdate:publishedDate}, function(response) {});
		}
	});
	SF("body").on("click",function(e){
		SF('#coordDiv').html("");
		setTimeout(function(){ 
			if(!isEmptySelection()){
				SF('body').append("<div id='coordDiv'></div>");
				SF('#coordDiv').html('<img id="textSelection" src="'+memoSnagURL+'themes/front/img/add_text.png" title="Add selected text into memosnag... :)" style="width:auto;height:auto;cursor:pointer;z-index:9999999;position:absolute;left:' + e.pageX + 'px;top:'+ e.pageY +'px" />');
			}
		},10);
	});
	SF("body").on("click","#textSelection",function(e){
		e.preventDefault();
		e.stopPropagation();
		if (!isEmptySelection()) {
		    addToMemoSnag();
			getAccessToken();
			saveTomemoSnag();
			//chrome.runtime.sendMessage({method: "saveTomemoSnag", text: knoteText,pageDetails:getFromURL()}, function(response) {});
		}
	});
	
	SF("body").on("click",".memosnagImage",function(event){
		event.stopPropagation();
		event.preventDefault();
		var isImage=SF(this).attr("data-image");
		var dvURL = SF(this).attr("data-url");
				
		if(isImage=="true"){
			var imgalt= SF(this).attr('data-alt');
			if(!imgalt){
				imgalt='NULL';
			}
			knoteText = document.createElement("div");
			knoteText.innerHTML = "<img data-img='true' style='max-width:300px;max-height:175px;' src='" + dvURL + "' >";
			knoteText = knoteText.innerHTML;
			//chrome.runtime.sendMessage({method: "saveTomemoSnag", text: knoteText,pageDetails:getFromURL(),pageTitle:imgalt}, function(response) {});
		}else{
			var videoTitle= SF(this).attr('data-title');
			if(!videoTitle){
				var t=dvURL.substr(dvURL.lastIndexOf('/') + 1);
				var arr = t.split('.');
				if(arr.length>0){
					videoTitle=arr[0];
				}else{
					videoTitle='';
				}
			}
			knoteText = document.createElement("div");
			var arr=dvURL.split(".");
			var size=arr.length;
			var vType=arr[size-1];
			var vId=Math.floor((Math.random() * 10000) + 1);
			var vdo='';
			if(dvURL.toLowerCase().indexOf(youtb) >= 0){
				vdo="<video id='"+vId+"' data-vid='"+vId+"' width='580' height='300' style='width: 100%; height: 100%;' controls><source src='"+dvURL+"' type='video/youtube'/></video>";
			}else if(dvURL.toLowerCase().indexOf(dailyMotion) >= 0){
				var daily="http://www.dailymotion.com/";
				var vURL=dvURL.substr(dvURL.lastIndexOf('/') + 1);
				dvURL=daily+"embed/video/"+vURL;
				vdo='<iframe frameborder="0" data-vid="'+vId+'" width="580" height="300" src="'+dvURL+'" allowfullscreen></iframe>';
			}else if(dvURL.toLowerCase().indexOf(vimeo) >= 0){
				vdo="<video id='"+vId+"' data-vid='"+vId+"' width='580' height='300' style='width: 100%; height: 100%;' controls><source src='"+dvURL+"' type='video/vimeo'/></video>";
			}else{
				vdo="<video x-webkit-airplay='allow' data-vid='"+vId+"' id='"+vId+"' src='"+dvURL+"' width='580' height='300' style='width: 100%; height: 100%;' controls></video>";
			}		
			
			knoteText.innerHTML = vdo;
			knoteText = knoteText.innerHTML;
		    
			//chrome.runtime.sendMessage({method: "saveTomemoSnag", text: knoteText,pageDetails:getFromURL(),pageTitle:videoTitle}, function(response) {});
		};
		 getAccessToken();
		saveTomemoSnag();
		
	}); 
	
	var clearNotification=function(){
			window.n.close();
	};
	
	var getFromURL = function() {
        var sourceURL = documentUrl;
        knoteTitle = SF('title').html();
        var webPage = sourceURL.replace(/^http(s|):\/\/(www.|)/, "").replace(/\/.*?$/, "");
		var arr=[knoteTitle,webPage,sourceURL];
        return arr;
    };
    var addToMemoSnag = function(evt) {
		prefetchSelection(evt);
		addToMemoSnagCore();
    };
	var addToMemoSnagCore = function() {
        window.knoteText = adjuctImgs(window.knoteText);
    };
	var adjuctLinks = function(html) {
        var elm = SF(html);
        var anchors = elm.find("a");
        for (var i = 0; i < anchors.length; i++) {
            var anchor = anchors[i];
            SF(anchor).attr({
                href: anchor.href,
                target: '_blank'
            });
        }
        return elm[0].outerHTML;
    };
    var adjuctImgs = function(html) {
        var div = document.createElement("p");
        div.innerHTML = html;
        var imgs = div.querySelectorAll("img");
        for (var i = 0; i < imgs.length; i++) {
            imgs[i].src = imgs[i].src;
        }
        return div.innerHTML;
    };
    var prefetchSelection = function(evt) {
        if (evt && evt.preventDefault) {
            evt.preventDefault();
        } else {
            getSelection();
        }
    };
	var getSelection = function() {
        var selection = window.getSelection().toString();
        window.knoteText= selection;
        return window.knoteText;
    };
    var isEmptySelection = function() {
		var selection = window.getSelection();
		var sel=(!selection || (selection.rangeCount < 1) || (/^(\s+|)$/.test(selection.getRangeAt(0))));
		if(selection.toString().length<100){
			sel=true;
		}
        return sel;
    };
	
		var getSelectionCoords=function() {
		var sel = document.selection, range, rects, rect;
		var x = 0, y = 0;
		if (sel) {
			if (sel.type != "Control") {
				range = sel.createRange();
				range.collapse(true);
				x = range.boundingLeft;
				y = range.boundingTop;
			}
		} else if (window.getSelection) {
			sel = window.getSelection();
			if (sel.rangeCount) {
				range = sel.getRangeAt(0).cloneRange();
				if (range.getClientRects) {
					range.collapse(true);
					rects = range.getClientRects();
					if (rects.length > 0) {
						rect = range.getClientRects()[0];
					}
					x = rect.pageX;
					y = rect.pageY;
				}
				// Fall back to inserting a temporary element
				if (x == 0 && y == 0) {
					var span = document.createElement("span");
					if (span.getClientRects) {
						// Ensure span has dimensions and position by
						// adding a zero-width space character
						span.appendChild( document.createTextNode("\u200b") );
						range.insertNode(span);
						rect = span.getClientRects()[0];
						x = rect.pageX;
						y = rect.pageY;
						var spanParent = span.parentNode;
						spanParent.removeChild(span);

						// Glue any broken text nodes back together
						spanParent.normalize();
					}
				}
			}
		}
		return { x: x, y: y };
	};
	var findAuthor=function(){
		var author=''; 
		author=SF("meta[name='author']").attr("content");
		if(author && author !==undefined && author !=='undefined'){
			return author;
		}
		author=SF("meta[name='byl']").attr("content");
		if(author && author !==undefined && author !=='undefined'){
			return author;
		}
		author=SF("meta[name='by']").attr("content");
		if(author && author !==undefined && author !=='undefined'){
			return author;
		}
		author=SF("body").find("cite").html();
		if(author && author !==undefined && author !=='undefined'){
			return author;
		}
		author=SF("span[itemprop='name']").html();
		if(author && author !==undefined && author !=='undefined'){
			return author;
		}
		if(!author){
			author=findPublisher();
			if(author){
				return author;
			}
		}
		return author;	
	};
	var findPublishedDate=function(){
		var pubDate=''; 
		pubDate=SF("span[itemprop='datePublished']").html();
		if(pubDate && pubDate !==undefined && pubDate !=='undefined'){
			return pubDate;
		}
		pubDate=SF("time[itemprop='datePublished']").html();
		if(pubDate && pubDate !==undefined && pubDate !=='undefined'){
			return pubDate;
		}
		pubDate=SF("meta[name='pub_date']").attr("content");
		if(pubDate && pubDate !==undefined && pubDate !=='undefined'){
			return pubDate;
		}
		pubDate=SF("meta[name='article:published_time']").attr("content");
		if(pubDate && pubDate !==undefined && pubDate !=='undefined'){
			return pubDate;
		}
		pubDate=SF("meta[name='datePublished']").attr("content");
		if(pubDate && pubDate !==undefined && pubDate !=='undefined'){
			return pubDate;
		}
		pubDate=SF("body").find("time").html();
		var pubDate1=SF("body").find("time");
		if(pubDate && pubDate !==undefined && pubDate !=='undefined'){
			if(pubDate.length<100)
				return pubDate;
			else
				return pubDate1.attr('datetime');
		}
		pubDate=(new Date).getFullYear();
		return pubDate;	
	};
	var findPublisher=function(){
		var publisher=''; 
		publisher=SF("meta[name='publisher']").attr("content");
		if(publisher && publisher !==undefined && publisher !=='undefined'){
			if(publisher.length<150)
				return publisher;
		}
		publisher=SF("span[itemprop='publisher']").html();
		if(publisher && publisher !==undefined && publisher !=='undefined'){
			if(publisher.length<150)
				return publisher;
		}
		if((publisher && publisher.length>150) || !publisher){
			var publisher = documentUrl.replace(/^http(s|):\/\/(www.|)/, "").replace(/\/.*?$/, "");
			return publisher;
		}
		return publisher;	
	};
	
	/* N.B. Nel caso si stia utilizzando delle variabili globali, per accedere al loro contenuto
	 * senza ottenere "undefined" bisogna anteporre window.<<nome variabile>> alla variabile locale 
	 * 
	 */
	var saveTomemoSnag = function(knoteText,Title,webPage,sURL,pageAuthor,publishedDate,pblisher){
			 if(window.ItemSelectedText){
				 window.knoteText = window.selectionText;
			     window.ItemSelectedText = false;
			 }
			 
		window.pageAuthor=findAuthor();
		window.pblisher=findPublisher();
		window.publishedDate =findPublishedDate();
		var x = getFromURL();
		window.Title = x[0];
		window.webPage = x[1];
		window.sURL = x[2];
		var t=window.Title;
		
	   var myTimer = setTimeout(function() {
		keep_switching_icon=true;
			SF.ajax({
			url: memoSnagURL+'extension/addItem',
			type: "POST",
			beforeSend: function(xhr) {
				//alert(window.memoToken);
				xhr.setRequestHeader('x-token-code-header',window.memoToken);
			},
			
			data: {title:window.Title,desc:window.knoteText,webpage:window.webPage,sourceURL:window.sURL,author:window.pageAuthor,publisher:window.pblisher,dateOfPublish:window.publishedDate},
			dataType: "json",
			success: function(data){
				if(data.status=="success"){
				//	window.alert("richiesta di tipo post al server");
				sendNotification('Item Saving...');
						var i=40;
					var notInterval=setInterval(function(){
					
						if(i==100){
							setTimeout(function(){ 
								clearNotification();
								clearInterval(notInterval);
								sendNotification('Item Saved Successfully...');
								setTimeout(function(){clearNotification();},1000);
							},100);
						}
						
						i=i+20;
					},300);
			 }
				if(data.status=="error"){
						if(data.message=='invalid_token' || data.message=='unauthorized_access'){
						sendNotification('Please Login in to memosnag...');
						window.open(memoSnagURL);
						setTimeout(function(){clearNotification();},2000);
					}else{
						sendNotification('Unable to save Item...');
						setTimeout(function(){clearNotification();},2000);
					}
					
				}
			},
			error: function(data){
				sendNotification('Unable to save Item...');
				setTimeout(function(){clearNotification();},2000);
			}
			
			});	
		}, 1000);	
	};

	var sendNotification=function(msg){
			var options = {
			   type: "basic",
			   title: "memosnag",
			   body: msg,
			   icon: window.memoSnagURL + 'themes/front/img/add_text.png',
			};
		    var notificationId = 'MSG_NOTE';
			window.n = new Notification("Memosnag",options);
	};		

	var getAccessToken=function(){
		SF.ajax({
			url: memoSnagURL+'extension/getAccessToken',
			type: "GET",
		    data: {},
			dataType: "json",
			success: function(data){
				if(data.status=="success"){
					
					window.memoToken=data.message;
					window.isFine = true;
				 //   window.alert("Memo token " + window.memoToken);
				}
				if(data.status=="error"){
					//window.alert("Memo token error " + data.message);
					window.isFine = true;
				}
			},
			error: function(xhr, thrownError, data) {
          //  alert("Non ha avuto successo: " +xhr.statusText);
          //  alert(" non ha avuto successo: " +thrownError);
		  window.isFine = false;
        }
			
		});
	};
  
	
})();
	

	

