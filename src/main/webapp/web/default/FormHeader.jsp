<%@ page contentType="text/html; charset=UTF-8"%>

<%@ page import="com.exedosoft.plat.SessionContext"%>
<%@ page import="com.exedosoft.plat.login.LoginMain"%>
<%@ page import="com.exedosoft.plat.bo.org.OrgParterValue"%>
<%@ page import="java.util.List"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="com.exedosoft.plat.util.I18n"%>
<%
	response.setHeader("Pragma", "No-cache");
	response.setHeader("Cache-Control", "no-cache");
	response.setDateHeader("Expires", 0);
%>
<%	
	String userName = "";
    String company = "";
	SessionContext exedoContext = (SessionContext) session
			.getAttribute("userInfo");
	if (exedoContext != null && exedoContext.getUser() != null) {
		
		userName = exedoContext.getUser().getName();
		List parters = (List)exedoContext.getUser().getObjectValue(LoginMain.ALLAUTH);
		if(parters!=null){
			for(Iterator it = parters.iterator() ; it.hasNext();){
				OrgParterValue p = (OrgParterValue)it.next();
				if(p.getParter()!=null && p.getParter().isRole()){
					company = company + " " + I18n.instance().get(p.getName());  
				}
			}
			
		}
	}
	
	
	if("".equals(company) ||  "a".equals(userName)){
		company = I18n.instance().get("Developer");
	}

%>

<style> 
  .welcome {
	   color:#3C3C3C;
	   left:188px;
	   position:absolute;
	   top:17px;
  }
  .inner {
	   color:#3C3C3C;
  }
  .control{
  	color:#929393;
  	text-decoration:none;
  	position:absolute;
  	right:10px;
  	top:15px;
  	cursor:pointer;
  	line-height:167%;
  }
  .selectt{
  	width:134px;
  	display:inline;
  	color:black;
    font-weight:bold;
  }

</style>

<script language="javascript">

var theUrl = globalURL;
if(globalURL == '/web/default/'){
	  theUrl = "/";
}

  function logOff(){
	  if(confirm('<%=I18n.instance().get("Confirm Exit")%>')){
	  	window.location.href=theUrl  +  "web/default/logoff.jsp";
	  }
  }

  function helpme(){
   		window.open('http://code.google.com/p/eeplat');
  }



  function refreshMe(){

	  $.get(theUrl + "web/default/ClearCache.jsp",function(data){
			  alert("<%=I18n.instance().get("Confirm ClearCache")%>");
		});
  }
  


</script>
<div>
	<div algin="left" id='logoPic' style='z-index:1; height: 0; left: 0px; position: absolute; top: 1px; width: 0;'><img name='logoImg' height="40px" width="150px" src='<%=request.getContextPath()%>/web/default/images/logo_small_l.png' border='0'></div>
	
	 <div class="control">
	    <span class="inner">
			<%=I18n.instance().get("Welcome")%>，<%=userName%> ！
		</span> [ <%=company%> ]
		&nbsp;&nbsp;
	<a onclick="loadPml({'pml':'PM_DO_ORG_ACCOUNT_UpdatePWD','target':'_opener','title':'Reset Password'})" ><%=I18n.instance().get("Reset Password")%></a>

		 | 	<a onclick="refreshMe()" ><%=I18n.instance().get("Clear Cache")%></a> | <a onclick="helpme();" ><%=I18n.instance().get("Help")%></a>  | <a onclick="logOff()" ><%=I18n.instance().get("Logout")%></a>
	</div>

</div>


