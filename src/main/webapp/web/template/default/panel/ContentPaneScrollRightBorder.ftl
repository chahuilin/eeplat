 <!-js befor loading-->
 <#if model.beforScript?exists>
	<script>
	    eval(${model.beforScript});
	</script>
 </#if>
<div id="${model.name}"  style="overflow:auto;width:100%;height:100%;border-right:1px solid #6678b1">
	<#if model.navigationTxt?exists>
		<div class='navcontainer'>
		    <div class='navleft'>
		       ${model.navigationTxt}
		    </div>
		 </div>
	 </#if>
 	${items_html}
</div>
 <!-js after loading-->
 <!-js after loading-->
 <#if model.afterScript?exists>
	<script>
	    eval(${model.afterScript});
	 </script>
 </#if>