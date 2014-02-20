<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <title>Editor</title>
  <style type="text/css" media="screen">
    body {
        overflow: hidden;
    }
    
    #htmleditor { 
        margin: 0;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }
  </style>
</head>

<%

  String hiddenid = request.getParameter("hiddenid");

%>

<body>

<pre id="htmleditor"></pre>
    
<script src="src/ace.js" type="text/javascript" charset="utf-8"></script>
<script src="src/mode-html.js" type="text/javascript" charset="utf-8"></script>
<script src="src/autocomplete.js" type="text/javascript" charset="utf-8"></script>
<script>

	var theHiddenValue = parent.document.getElementById("<%=hiddenid%>").value;


	var autocompleting=false;
	
	var html_tags=['!doctype','a','abbr','acronym','address','applet','area','b','base','basefont','bdo','bgsound','big','blink','blockquote','body','br','button','caption','center','cite','code','col','colgroup','comment','dd','del','dfn','dir','div','dl','dt','em','embed','fieldset','font','form','frame','frameset','h1','h2','h3','h4','h5','h6','head','hr','html','i','iframe','ilayer','img','input','ins','isindex','kbd','keygen','label','layer','legend','li','link','listing','map','marquee','menu','meta','multicol','nextid','nobr','noembed','noframes','nolayer','noscript','object','ol','optgroup','option','p','param','plaintext','pre','q','rb','rbc','rp','rt','rtc','ruby','s','samp','script','select','small','spacer','span','strike','strong','style','sub','sup','table','tbody','td','textarea','tfoot','th','thead','tr','tt','u','ul','var','wbr','xml','xmp','#assign','#if','#else','#elseif','#list','#switch','#for','#break','#setting','#break','#macro'];
	
	window.onload = function() {
		
		if(parent.htmlEditor!=null){
			parent.htmlEditor.destroy();
		}
		
		parent.htmlEditor = ace.edit("htmleditor");
		
		document.getElementById('htmleditor').style.fontSize='16px';
		//parent.htmlEditor.getSession().setUseWrapMode(true);
		parent.htmlEditor.getSession().setValue(theHiddenValue);
		
		var Mode = require("ace/mode/html").Mode;
		parent.htmlEditor.getSession().setMode(new Mode());
		
		parent.htmlEditor.setBehavioursEnabled(false);
		
		
		parent.htmlEditor.commands.addCommand({
			name: "autocomplete",
			exec: function(editor)  {
			
				var ac;
				
				if( document.getElementById('ac') ){
					ac=document.getElementById('ac');
					if(select.options.length>1){
						return;
					}
				}else{
					ac = document.createElement('select');
					ac.id = 'ac';
					ac.namme = 'ac';
					ac.style.position='absolute';
					ac.style.zIndex=100;;
					ac.style.width='140px';
					ac.size=10;
				}

				var sel = parent.htmlEditor.getSelection();
				
				var session = parent.htmlEditor.getSession();
				
				var lead = sel.getSelectionLead();
				var pos = parent.htmlEditor.renderer.textToScreenCoordinates(lead.row, lead.column);
				
				/*
				ac.addEventListener('click',function(e){
					//console.log('yo');
				})
				*/
				
				//calulate the container offset
				var obj=parent.htmlEditor.container;
				
				var curleft = 0;
				var curtop = 0;
				if (obj.offsetParent) {
					do {
						curleft += obj.offsetLeft;
						curtop += obj.offsetTop;
					} while (obj = obj.offsetParent);
				}						

				//position autocomplete
				ac.style.top=pos.pageY - curtop + 20 + "px";
				ac.style.left=pos.pageX - curleft + "px";
				ac.style.display='block';
				ac.style.background='white';
				
				var sel=parent.htmlEditor.selection.getRange();

				var line=parent.htmlEditor.getSession().getLine(sel.start.row);						
				
				line=line.substr(0,sel.start.col);						
			
				var pos=line.lastIndexOf('<');
				
				var text=line.substr(pos+1);
				
				var tag;
				for(i in html_tags){
					if(!html_tags.hasOwnProperty(i) ){
						continue;
					}
					
					tag=html_tags[i];					
				
					if( text ){
						if( text!=tag.substr(0,text.length) ){
							continue;
						}
					}
				
					var option = document.createElement('option');
					option.text = tag;
					option.value = tag;
					
					try {
						ac.add(option, null); // standards compliant; doesn't work in IE
					}
					catch(ex) {
						ac.add(option); // IE only
					}
				};
				
				if( ac.length==0 ){
					autocompleting=false;
					
					return false;
				}
				
				ac.selectedIndex=0;						
		
				parent.htmlEditor.container.appendChild(ac);
				
				autocompleting=true;
			}
		});
		
		parent.htmlEditor.commands.addCommand({
			name: "langle",
			bindKey: {
				win: "Shift-,", // <
				mac: "Shift-,", // <
				sender: "htmleditor"
			},
			exec: function(editor) {					
				parent.htmlEditor.insert('<');
					
				//parent.htmlEditor.autocomplete();
				parent.htmlEditor.commands.exec('autocomplete',editor);

				//command.exec(editor);					
			}
		});
		
		
		parent.htmlEditor.commands.addCommand({
			name: "finish",
			bindKey: {
				win: "Shift-.", // >
				mac: "Shift-.", // >
				sender: "htmleditor"
			},
			exec: function(editor) {					
				
				parent.htmlEditor.insert('>');
				if( document.getElementById('ac') ){
					var ac=document.getElementById('ac');
					ac.parentNode.removeChild(ac);
					autocompleting=false;
				}
	
			}
		});
		
		parent.htmlEditor.commands.addCommand({
			name: "up",
			bindKey: {
				win: "Up",
				mac: "Up",
				sender: "htmleditor"
			},
			exec: function(editor,args) {
				if( document.getElementById('ac') ){
					var select=document.getElementById('ac');
					
					if( select.selectedIndex==0 ){
						select.selectedIndex=select.options.length-1;
					}else{
						select.selectedIndex=select.selectedIndex-1;
					}
				}else{
					parent.htmlEditor.navigateUp(args.times);
				}
			}
		});
		
		parent.htmlEditor.commands.addCommand({
			name: "down",
			bindKey: {
				win: "Down",
				mac: "Down",
				sender: "htmleditor"
			},
			exec: function(editor,args) {
				if( document.getElementById('ac') ){
					var select=document.getElementById('ac');
					
					if( select.selectedIndex==select.options.length-1 ){
						select.selectedIndex=0;
					}else{
						select.selectedIndex=select.selectedIndex+1;
					}
				}else{
					parent.htmlEditor.navigateDown(args.times);
				}
			}
		});
		
		parent.htmlEditor.commands.addCommand({
			name: "escape",
			bindKey: {
				win: "Esc",
				mac: "Esc",
				sender: "htmleditor"
			},
			exec: function(editor) {
				if( document.getElementById('ac') ){							
					var ac=document.getElementById('ac');
					
					ac.parentNode.removeChild(ac);
					
					autocompleting=false;
				}
			}
		});
		
		parent.htmlEditor.commands.addCommand({
			name: "enter",
			bindKey: {
				win: "Return",
				mac: "Return",
				sender: "htmleditor"
			},
			exec: function(editor) {
				if( document.getElementById('ac') ){
					var select=document.getElementById('ac');
					var tag=select.options[select.selectedIndex].value;
					
					var sel=parent.htmlEditor.selection.getRange();

					var line=parent.htmlEditor.getSession().getLine(sel.start.row);						
					
					line=line.substr(0,sel.start.column);						
				
					var pos=line.lastIndexOf('<')+1;
					if(line.lastIndexOf('</')!=-1){
						pos = pos + 1;
					}
					
					var text=line.substr(pos);
					
					sel.start.column=sel.start.column-text.length
												
					parent.htmlEditor.selection.setSelectionRange(sel);
					
					parent.htmlEditor.insert(tag);
					
					var ac=document.getElementById('ac');
					ac.parentNode.removeChild(ac);
					autocompleting=false;
				}else{
					parent.htmlEditor.insert('\n');
				}
			}
		});
		
	
//		parent.htmlEditor.getSession().selection.on('changeCursor',function(oldRange, newRange, newText) {			
//			if( document.getElementById('ac') ){
//				var ac=document.getElementById('ac');
//				
//				ac.parentNode.removeChild(ac);
//			}					
//		});



		

		

		var event = require("ace/lib/event");
		

		
		event.addListener(parent.htmlEditor.textInput.getElement(), "keydown", 
			function(e){
				if(autocompleting && ( (e.keyCode >=65 && e.keyCode <=90)  )){//|| e.keyCode == 51
						
						if( document.getElementById('ac') ){
							var select=document.getElementById('ac');
							
							for(var i = 0; i < select.options.length; i++ ){
								  if( (select.options[i].value.toUpperCase().charCodeAt(0)==e.keyCode) ){
									select.selectedIndex=i;
									break;
								  }
							}
						}else{
							parent.htmlEditor.navigateUp(args.times);
						}
				}
			}
		);
		

		
		
	};
</script>

</body>
</html>
