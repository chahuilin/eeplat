<input type="button"  style="${model.style?if_exists}"  id='${model.objUid}' value="&nbsp;${model.l10n}&nbsp;" class='ctlBtn btn'>

<script>
$('#${model.objUid}').bind('click',function(){
	<#if (model.gridModel.containerPane.name)?exists>
  		$('#' + '${model.gridModel.containerPane.name}').dialog('close');
  	</#if>
  }
);
</script>