DEFAULT_SELECTION_TEXT = "Copy Text And Paste It Here...";
MIN_LIMIT = 20;
MAX_LIMIT = 500;

{% include "../../static/scripts/jquery/jquery-1.3.2.js" %}
{% include "../../static/scripts/utils/preserve_default_text.js" %}
jQuery(function(){

$('#frame').load(function()
{

// Cross-Frame Scripting Doesn't Allow Access to Document...
/* $(window).mouseup(function(){
var selection = window.getSelection();
if (selection.length > 2) return OpenEditor(selection);
 }); */
 
 resizeIframe();
 
});
		


$('input#selection').bind('paste', function() { 

return setTimeout(function(){

var selection = $('input#selection').val();

$('input#selection').preserveDefaultText(DEFAULT_SELECTION_TEXT);
if (selection.length < MIN_LIMIT) return alert('Selection must be at least ' + MIN_LIMIT + ' characters');
if (selection.length > MAX_LIMIT) return alert('Selection must be no more than ' + MAX_LIMIT + ' characters');

OpenEditor( selection );  }, 50);  
}).preserveDefaultText(DEFAULT_SELECTION_TEXT);


$(document).bind('item_submit', function() { $('#header').hide();  $('#header_success').show('slow'); 

return setTimeout(function(){ $('#header_success').hide();  $('#header').show('slow'); }, 3000);  

});



});


function OpenEditor(statement){


var this_url = window.location.href;      
var get_selection = function(){ return document.getSelection(); };
//  var statement = get_selection() || statement;
var doc = document;

var serverUrl = "{{ http_server }}";
// editor can run XSS, so it needs absolute URL

var id = "pq-injected-data";

jQuery.ajax({
	type: "POST",
	url:  "/ubiquity/",
	data:
{
	get: "html",
	text: statement,
	topic_key: "{{ topic_key }}",
	subject_key: "{{ subject_key }}"
},
	error: function(data){
		jQuery(doc.body).append("<div id='error'>" + data + "</div>");
	},
	success: function(data){
		// Remove existing injected data
		jQuery('#' + id, doc.body).remove();
		jQuery('head', doc).append('<link rel="stylesheet" type="text/css"  href="{{ http_server }}/static/html/quizbuilder/ubiquity.css" />');
		jQuery.post('/ubiquity/?get=js', function(script){
			eval(script); 
			jQuery(doc.body).append("<div id='" + id + "'>" + data + "</div>");
			runCode(); 
		});
	},
  complete: function(data){  }
});


};


function resizeIframe() {
    var height = document.documentElement.clientHeight;
    height -= document.getElementById('frame').offsetTop;    
    // not sure how to get this dynamically
    height -= 20; /* whatever you set your body bottom margin/padding to be */   
    document.getElementById('frame').style.height = height +"px";
    
};
