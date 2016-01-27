'use strict'
var { ToggleButton } = require('sdk/ui/button/toggle');
var contextMenu = require("sdk/context-menu");
var pageWorker = require("sdk/page-worker");
var pageMod = require("sdk/page-mod");
var preferences = require("sdk/simple-prefs").prefs;
var self = require("sdk/self");
var data = self.data;
var {Cc, Ci, Cu}  = require('chrome');
var browser  = require('chrome').runtime;
 
  var button = ToggleButton({
    id: "MemoSnagButton",
    label: "MemoSnag Button",
	icon: self.data.url("loghi/logo_16.png"),
    onChange: handleChange	
});



function handleChange(state) {
    if (state.checked) {
    }
};

function handleHide() {
    button.state('window', {checked: false});
};

var name = "dom.disable_open_during_load";
var notOpenPopup = require("sdk/preferences/service").set(name, false);	
		
pageMod.PageMod({
    include: "*",
    contentStyleFile: [self.data.url("ScriptMemosnag/memosnag.css")],
    attachTo: ["top"],
    contentScriptFile: [self.data.url("jquery-1.11.1.min.js"), self.data.url("ScriptMemosnag/memosnagScript.js"),self.data.url("jquery-1.11.1.min.js"), self.data.url("ScriptMemosnag/click.js")],
	contentScriptWhen: "end"
});
 var mainIconOptions = contextMenu.Item({
  label: "Add to memosnag",
  image: self.data.url("loghi/logo_16.png"),
  context: contextMenu.SelectionContext(),
  contentScriptFile: [self.data.url("jquery-1.11.1.min.js"), self.data.url("ScriptMemosnag/scriptMenuBrowser/script-selectionText.js")]
});
	

/*------------ fine Menu principale -------------------*/
/* ------ Menu per il contesto pagina  ---------------*/
var subPageOptionsLink = contextMenu.Item({
  label: "Save Page link",
    context: contextMenu.PageContext(),
	contentScriptFile: [self.data.url("jquery-1.11.1.min.js"), self.data.url("ScriptMemosnag/scriptMenuBrowser/script-savePageLink.js")],
    onMessage: function(message) {	}
});

/*
var  subPageOptionsScreenshot = contextMenu.Item({  
   label: "Save Screenshot",
   context: contextMenu.PageContext(),
   contentScriptFile: [self.data.url("jquery-1.11.1.min.js"),self.data.url("ScriptMemosnag/click.js")],
   onMessage: function(message) {	}
});
*/ 
var pageOptions = contextMenu.Menu({
  label: "Add to memosnag",
  contentScript: 'self.on("click", self.postMessage);',
  image: self.data.url("loghi/logo_16.png"),
  context: contextMenu.PageContext(),
  items: [subPageOptionsLink]
});
/* ------ fine  Menu per il contesto pagina  ---------------*/


/*------------- Menu Immagine ---------------------*/
var subImageOptionsPicture = contextMenu.Item({  
   label: "Save Picture",
   context: contextMenu.SelectorContext("img"),
   contentScriptFile: [self.data.url("jquery-1.11.1.min.js"),self.data.url("ScriptMemosnag/scriptMenuBrowser/script-savePicture.js")]
});
/*
var subImageOptionsScreenshot = contextMenu.Item({  
   label: "Save Screenshot",
   context: contextMenu.SelectorContext("img"),
   contentScriptFile: [self.data.url("jquery-1.11.1.min.js"),self.data.url("ScriptMemosnag/click.js")]
});
*/
var subImageOptionsPageLink = contextMenu.Item({  
   label: "Save Page Link",
   context: contextMenu.SelectorContext("img"),
   contentScriptFile: [self.data.url("jquery-1.11.1.min.js"), self.data.url("ScriptMemosnag/scriptMenuBrowser/script-savePageLink.js")]
});

 var imageMenuOptions = contextMenu.Menu({
  label: "Add to memosnag",
  image: self.data.url("loghi/logo_16.png"),
  context: contextMenu.SelectorContext("img"),
  items: [subImageOptionsPicture, subImageOptionsPageLink]
});
/* ---------- Fine Menu Immagine -------------*/

/* ---------- Inizio Menu Link -------------*/
 var linkMenuOptions = contextMenu.Item({
  label: "Add link to memosnag",
  image: self.data.url("loghi/logo_16.png"),
  contentScriptFile: [self.data.url("jquery-1.11.1.min.js"), self.data.url("ScriptMemosnag/scriptMenuBrowser/script-addLinkToMemosnag.js")],
  context: contextMenu.SelectorContext("a[href]")
});

/* ---------- Fine Menu Link -------------*/
