<%@ page pageEncoding="UTF-8"%><%@ page import="com.exedosoft.plat.util.DOGlobals,com.exedosoft.plat.util.StringUtil,com.exedosoft.plat.SessionContext"%><%@ page import="com.exedosoft.plat.util.Escape"%><%@ page import="com.exedosoft.plat.bo.BOInstance"%><%@ page import="com.exedosoft.plat.ui.DOFormModel"%><%@ page import="com.exedosoft.plat.bo.DOService"%><%@ page import="java.net.URLEncoder"%><% response.setContentType("application/x-download;charset=UTF-8");

  response.setCharacterEncoding("UTF-8");
  SessionContext context = (SessionContext) session
	.getAttribute("userInfo");
	if (null == session.getAttribute("userInfo")
		|| context.getUser() == null) {
		response.sendRedirect(request.getContextPath()
			+ "/web/default/logoff.jsp");
	}
  String formModelUid =  request.getParameter("formModelUid");
  String fileName =  request.getParameter("fileName");
  DOFormModel theModel = DOFormModel.getFormModelByID(formModelUid);
  

  
  if(theModel!=null){
 
  DOService aService = theModel.getLinkService();
  

  if(aService!=null){
  	aService.invokeAll();
  }

  String aFileName = fileName ;
  if(aFileName==null && aService!=null){
	  if(aService.getBo().getCorrInstance()!=null){
	  	aFileName = aService.getBo().getCorrInstance().getValue("name") + ".xml";
	  }
  }
 // aFileName = URLEncoder.encode(aFileName, "UTF-8");
   aFileName = StringUtil.filter(aFileName);
   response.addHeader("Content-Disposition", "attachment;filename="+aFileName);
  }
  out.println(Escape.unescape(DOGlobals.getInstance().getRuleContext().getEchoValue()));   

 %>