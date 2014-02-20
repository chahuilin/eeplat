<div id="${model.objUid}" class="fb-wall" style="display: block;">
  <#list data as ins>
	     <#if ins_index==0>
	       <div class="fb-wall-box fb-wall-box-first">
	      <#else>
			<div class="fb-wall-box">
	     </#if>
			<a href="#"
				target="_blank"><img class="fb-wall-avatar"
				src="${ins.map.owner_pic?if_exists}"/></a>
			
			<div class="fb-wall-data">
				<span class="fb-wall-message"><a
					href="#" class="fb-wall-message-from">${ins.map.msg_owner_name?if_exists}</a> 
					${ins.map.msg_content?if_exists}
					<br></span>
				<span class="fb-wall-date">${ins.map.mdate?if_exists}</span>
				
				<div class="fb-wall-comments">
			    <#if ( (ins.map.comments?exists) && ins.map.comments?size > 0 )>
				       <#list ins.map.comments as comm>
						<span class="fb-wall-comment"><a
							href="#s"
							class="fb-wall-comment-avatar" target="_blank"><img
								src="${contextPath}images/empty.gif"></a>
								
								<span class="fb-wall-comment-message"><a
								class="fb-wall-comment-from-name"
								href="#"
								target="_blank">${comm.map.c_owner_name?if_exists}</a> 
								${comm.map.c_content?if_exists}
								<span class="fb-wall-comment-from-date">${comm.map.mdate?if_exists}</span></span></span>
						</#list>			
				   </#if>
								
				    <span class="fb-wall-comment"> <a
							href="#s"
							class="fb-wall-comment-avatar" target="_blank"><img
								src="${contextPath}images/empty.gif"></a><input type="text" name="ttt" data-role="none"/></span>			
			    </div>
			</div>


			<div class="fb-wall-clean"></div>
		</div>
  </#list>
</div>

<script type="text/javascript">

	$(".input_box").elastic().css("height","30px");
	

</script> 

