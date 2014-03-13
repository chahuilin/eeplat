<%
response.setHeader("Pragma", "no-cache");
response.setHeader("Cache-Control", "no-store");
response.setDateHeader("Expires", 0);
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
<%@ page import="com.exedosoft.plat.SessionContext"%>
<%@ page import="com.exedosoft.plat.util.DOGlobals"%>
<%@ page import="com.exedosoft.plat.bo.DOService"%>
<%@ page import="com.exedosoft.plat.bo.BOInstance"%>
<%@ page import="com.exedosoft.plat.bo.DOResource"%>
<%@ page import="com.exedosoft.plat.util.I18n"%>
<%@ page import="java.util.List"%>
<%@ page import="java.util.Iterator"%>

<html>
<%

	String paneModelContent = (String) request
			.getAttribute("paneModelContent");
	String paneModelTitle = (String) request
			.getAttribute("paneModelTitle");
	SessionContext context = (SessionContext) session
			.getAttribute("userInfo");

	
	String mainStyle= "";
	try{

		mainStyle = DOGlobals.getInstance().getSessoinContext().getUser().getValue("style");
	}catch(Exception e){
		
	}
	if(mainStyle=="" || mainStyle==null){
		mainStyle = "_lan";
	}
	System.out.println(mainStyle);
%>
<head>
<title><%= I18n.instance().get(paneModelTitle)%></title>


<script language="javascript">

globalURL = "/<%=DOGlobals.URL%>/";

</script>
<link rel="icon" href="<%=request.getContextPath()%>/favicon.ico" type="image/x-icon" /> 
<link rel="shortcut icon" href="<%=request.getContextPath()%>/favicon.ico" type="image/x-icon" /> 
<link rel="stylesheet" href="<%=request.getContextPath()%>/web/default/css/redmond/jquery-ui-1.10.3.custom.min.css" type="text/css" />
<link rel="stylesheet" href="<%=request.getContextPath()%>/web/default/css/compressed/all.css" type="text/css"/>
<link href="<%=request.getContextPath()%>/web/site/bootstrap/css/bootstrap.min.css" rel="stylesheet" />	
<%=DOResource.getAllCssLink()%>

<!-- 插件的js -->

<script type="text/javascript" src="<%=request.getContextPath()%>/web/default/js/jquery/jquery-ui-1.10.3.custom.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/web/default/js/My97DatePicker/WdatePicker.js"></script>

<% if ("en".equals(DOGlobals.getValue("lang.local"))){ %>	
<script type="text/javascript" src="<%=request.getContextPath()%>/web/default/js/main/lang_en.js"  ></script>
<% }else{ %>
<script type="text/javascript" src="<%=request.getContextPath()%>/web/default/js/main/lang_zh.js"  ></script>
<% }%>

<script src="<%=request.getContextPath()%>/web/bootstrap/assets/js/bootstrap.min.js"></script>

<script type="text/javascript" src="<%=request.getContextPath()%>/web/default/js/compressed/all.js"></script>

<%=DOResource.getAllJavascriptLink()%>

<style type="text/css">

<%
//加载自定义css
DOService aService = DOService.getService("DO_BO_Icon_List_css_valid");
if(aService!=null){
	  List list = aService.invokeSelect();
	  for(Iterator it = list.iterator(); it.hasNext();){
		   BOInstance bi = (BOInstance)it.next();
		   if(bi!=null && bi.getValue("formulaScript")!=null)
		   out.println(bi.getValue("formulaScript"));
	  }
}
%>

html,body{
    overflow:auto;
}
#bodyouter {
	min-width: 960px; max-width: 1260px;
	margin: 0 auto; padding: 0 10px;
	width:expression(document.body.clientWidth < 961? "960px" : document.body.clientWidth > 1261? "1260px" : "auto");
}
</style>

</head>

<body  lang=zh>
<div id='dmLayer'></div>
<div id="bodyouter">
	<input  type="hidden" id="mainStyle" value="<%=mainStyle %>"/> 
	<%=paneModelContent%>
</div>
</body>
<script>

<%
//加载自定义javascript
  aService = DOService.getService("DO_BO_Icon_List_js_valid");
if(aService!=null){
	  List list = aService.invokeSelect();
	  for(Iterator it = list.iterator(); it.hasNext();){
		   BOInstance bi = (BOInstance)it.next();
		   if(bi!=null && bi.getValue("formulaScript")!=null)
		   out.println(bi.getValue("formulaScript"));
	  }
}
%>

var cssEditor;
var jsEditor;
var htmlEditor;
var rhinoEditor;
</script>

</html>
