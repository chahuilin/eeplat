<#include "TFormBase.ftl">
<#--参数通过formName传递-->
<button  type="button"   id='${model.objUid}' style="${model.style?if_exists}"   <#compress><@JudgeStyle model/></#compress> >${model.l10n}</button>
<script>
$('#${model.objUid}').bind('click',function(){
     
     var selects = $('#g${model.gridModel.objUid} tbody  tr.selected')
     if(selects.length==0){
     	alert("你还没有选择数据");
     	return ;
     }
     if(invokeDomRef){
     		invokeDomRef.value = selects.eq(0).attr("title");
			if(invokeDomRef.previousSibling!=null){
				invokeDomRef.previousSibling.value= selects.eq(0).attr("value");
			}
     }else{
	     $('#' + invokeDomId).val(selects.eq(0).attr("value"));
	     $('#' + invokeDomId +"_show").val(selects.eq(0).attr("title"));
     }
     
     ///关闭弹出页面
     <#if (model.gridModel.containerPane.name)?exists>
		try{
			if($('#F' + '${model.gridModel.containerPane.name}').size()>0){
	  			$('#F' + '${model.gridModel.containerPane.name}').dialog('close');
	  		}else{
	  			$('#' + '${model.gridModel.containerPane.name}').parents(".ui-dialog-content").dialog('close');
		  	}  	
	  	}catch(e){
	  	}		
	 </#if>
  }
);
</script>