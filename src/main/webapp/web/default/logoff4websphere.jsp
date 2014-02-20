<%@ page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
<%@ page import="com.exedosoft.plat.login.OnlineManager"%>
<%@ page import="com.exedosoft.plat.SessionContext"%>
<%
	response.setHeader("Pragma", "No-cache");
	response.setHeader("Cache-Control", "no-cache");
	response.setDateHeader("Expires", 0);
%>
<%
	SessionContext context = (SessionContext) session
			.getAttribute("userInfo");
	if (context.getUser() != null) {
		OnlineManager.removeUser(context.getUser().getUid());
	}

	request.getSession().removeAttribute("userInfo");
	if (!request.getSession().isNew()) {
		request.getSession().invalidate();

	}
	//response.sendRedirect("/wh/web/default/");
%>
<script>
	  window.top.location="<%=request.getContextPath()%>/web/default/"  ;
</script>