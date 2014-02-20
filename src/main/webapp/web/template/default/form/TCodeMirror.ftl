<textarea id="${model.fullColID}" name="${model.colName}" >${model.value?if_exists}
</textarea>
<!--
<input type="hidden" id="${model.fullColID}_cphd" name="${model.colName}" value="${model.value?if_exists}">
-->
<br/>
<script>
  mirrorEditor = CodeMirror.fromTextArea(document.getElementById("${model.fullColID}"),
       {mode: "javascript",  tabMode: "indent",indentUnit: 4,lineNumbers: true,  matchBrackets: true, onKeyEvent: function(i, e) {
	      if (e.keyCode == 32 && (e.shiftKey || e.metaKey) && !e.altKey) {
	        e.stop();
	        return startComplete();
	      }
    	}
   });
 </script>
<style>
 .CodeMirror-scroll{
    height:${model.inputConfig?default(300)}px;
 }
</style> 




