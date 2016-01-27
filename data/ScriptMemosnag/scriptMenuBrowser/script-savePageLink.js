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
	var dataURL;
	var pLink = '';
	var ItemLink = false;
	var primaChiamata = true;
	var linkCliccked = ''; 
	var imgSrc = '';
	var imageNotFound = false;
      window.onload = function() {
  getAccessToken();
};

Notification.requestPermission();
		if(isLive){
	memoSnagURL="http://www.memosnag.com/";
		}

(function() {
	 self.on("click", function(node) {
		 var x = SF('meta[property="og:image"]').attr("content");
		 if(x == '' || x == undefined || x == null){
	     window.linkCliccked = node;
	     window.ItemLink = true;
         window.imgSrc = '';
         window.pLink =  document.location.href;
		 window.imageNotFound = true;
		 }
		 else{
		 window.linkCliccked = node;
	     window.ItemLink = true;
		 window.imgSrc = document.createElement("div");
         window.imgSrc.innerHTML = "<div><img data-img='true' src='" + x + "' ></div>";
         window.imgSrc = window.imgSrc.innerHTML;
         window.pLink =  document.location.href;
		 window.imageNotFound = false;
		 }
	   getAccessToken();
       saveScreenShotTomemoSnag();
  });
	var documentUrl=window.location.href;
	
	
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
	
	var saveScreenShotTomemoSnag=function(knoteText,Title,webPage,sURL,pLink,pageAuthor,publishedDate,pblisher){
      if(window.ItemLink){
		   window.ItemLink = false;
			 } 
		window.pageAuthor=findAuthor();
		window.pblisher=findPublisher();
		window.publishedDate =findPublishedDate();
		var x = getFromURL();
		window.Title = x[0];
		window.webPage = x[1];
		window.sURL = x[2];	
		 if(window.imageNotFound){
			 var l = "<a href=\"" +window.sURL+ "\" target=\"_blank\">" +window.sURL+  "</a>"; 
		     var p = String(l);
		     window.Title = p;
		     window.sURL = '';
			 } 
	   var myTimer = setTimeout(function() {
		keep_switching_icon=true;
			SF.ajax({
			url: memoSnagURL+'extension/addItem',
			type: "POST",
			beforeSend: function(xhr) {
				xhr.setRequestHeader('x-token-code-header',window.memoToken);
			},
			data: {title:window.Title,desc:window.imgSrc,webpage:window.webPage,sourceURL:window.sURL,pgLink:window.pLink,author:window.pageAuthor,publisher:window.pblisher,dateOfPublish:window.publishedDate},
			dataType: "json",
			success: function(data){
				if(data.status=="success"){
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

 var sendProgressNotification=function(msg, progressPerc) {
  var options = {
	type: "progress",
	title: "memosnag",
  	body: msg,
  	icon: "./img/sad_head.png",
	progress: progressPerc
  };
  var notificationId = 'PROGRESS_NOTIFY';
  var pro = new Notification(notificationId,options);
  setTimeout(pro.close.bind(n), 2000); 
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
				 
				}
				if(data.status=="error"){
					window.isFine = true;
				}
			},
			error: function(xhr, thrownError, data) {
		  window.isFine = false;
        }		
		});
	};
})();

	

