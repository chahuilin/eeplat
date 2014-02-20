<%@ page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
<%@ page import="com.exedosoft.plat.SessionContext"%>
<%@ page import="com.exedosoft.plat.util.DOGlobals"%>
<%@ page import="com.exedosoft.plat.util.I18n"%>
<!DOCTYPE html>
	<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, minimum-scale=1, maximum-scale=1">
        <title>EEPlat Login</title>
		<link rel="stylesheet"  href="<%=request.getContextPath()%>/web/mobile/css/jquery.mobile.css" />
		<link rel="stylesheet"  href="<%=request.getContextPath()%>/web/mobile/css/openid.css" />
		<link rel="stylesheet"  href="<%=request.getContextPath()%>/web/mobile/css/jqpagination.css" />

		<script type="text/javascript" src="<%=request.getContextPath()%>/web/mobile/js/jquery.js"></script>
   		<script type="text/javascript" src="<%=request.getContextPath()%>/web/mobile/js/jquery.mobile.js" ></script>
   		<script type="text/javascript" src="<%=request.getContextPath()%>/web/mobile/js/jquery.jqpagination.min.js" ></script>
   		
   		<% if ("en".equals(DOGlobals.getValue("lang.local"))){ %>	
		<script type="text/javascript" src="<%=request.getContextPath()%>/web/default/js/main/lang_en.js"  ></script>
		<% }else{ %>
		<script type="text/javascript" src="<%=request.getContextPath()%>/web/default/js/main/lang_zh.js"  ></script>
		<% }%>
		<script language="javascript">
		  globalURL = "/<%=DOGlobals.URL%>/";
		</script>  
		

    </head>
	<body>
	    
	<div data-role="page" data-theme="b">
	 
	    <div data-role="header" data-position="inline"  data-nobackbtn="true" data-theme="b">
	        <h1>EEPlat Login</h1>
	    </div>
	 
	    <div data-role="content" data-theme="c">
	        <form  id="loginform" method="get">
	           <div data-role="fieldcontain">
		            <label for="username"><%=I18n.instance().get("UserName")%>:</label>
	                <input type="text" name="name" id="username" value="demo"  />
               </div>
				<div data-role="fieldcontain">
				    <label for="password"><%=I18n.instance().get("Paasword")%>:</label>
				    <input type="password" name="password" id="password" value="1" />
				</div>	
				<div data-role="fieldcontain">
				    <label for="tenancyid"><%=I18n.instance().get("Tenant")%>:</label>
				    <input type="text" name="tenancyid" id=tenancyid value="Recruiting" />
				</div>	
 	            <a id="asub" href="#" data-role="button" data-inline="true" data-theme="b"><%=I18n.instance().get("Login")%></a>
	        </form>
	 
	    </div>
	 
	</div>
	</body>
	<script language="javascript">
	
	  $(function(){
	  	  $("#asub").bind("click",function(){
	  	  		var userName = $("input:eq(0)").val();
	  	  		var passWord = $("input:eq(1)").val();
	  			if(userName==""){
	  				alert(EELang.accountRequired);
	  				return;
	  			}
	  			if(passWord==""){
	  				alert(EELang.pwdRequired);
	  				return;
	  			}
	  	  		submitForm();
	  	  })
	  });
	
	  //登录
	  function submitForm(){
		   var paras =  $('#loginform').serialize();
		   paras = paras + "&contextServiceName=do_org_user_findbynameandpwd&mobileclient=true";
		   $.ajax({
			   url: globalURL + "ssocontroller",
			   data: paras,
			   dataType:"json",
			   success: function(data){
				   var retValue = unescape(data.returnValue);
				   if('success'==retValue){
				       window.location= "AppList.jsp";	jyhd_mobile_pane
					   //window.location= globalURL + "Recruiting_mobile_pane.pml";
				   }else{
					   	alert(retValue);
				   }
				 }
			 });
		   

	  }
</script>
	</html>