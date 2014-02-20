<%@ page contentType="text/html;charset=utf-8"%>
<%@ page language="java"
	import="java.util.HashMap,java.util.Map,java.util.UUID"%>
<%@ page language="java"
	import="org.json.simple.JSONArray,org.json.simple.JSONObject,org.json.simple.JSONValue"%>
<%@ page language="java"
	import="com.renren.api.client.param.impl.AccessToken,com.renren.api.client.RenrenApiClient,com.renren.api.client.utils.HttpURLUtils,com.renren.api.client.RenrenApiConfig"%>
<%@ page language="java"
	import="com.eeplat.social.openapi.callback.GlobalConfig"%>
<%@ page language="java"
	import="com.eeplat.social.openapi.user.SocialUser,com.eeplat.social.openapi.user.SocialUserManager"%>

<%@ page language="java" import="com.exedosoft.plat.SSOController"%>
<%@ page language="java" import="com.exedosoft.plat.bo.BOInstance"%>
<%@ page language="java" import="com.exedosoft.plat.util.DOGlobals" %>

<%
	String code = request.getParameter("code");

	//到人人网的OAuth 2.0的token endpoint用code换取access token
	String rrOAuthTokenEndpoint = "https://graph.renren.com/oauth/token";
	Map parameters = new HashMap();
	parameters.put("client_id", RenrenApiConfig.renrenApiKey);
	parameters.put("client_secret", RenrenApiConfig.renrenApiSecret);
	parameters.put("redirect_uri",
			GlobalConfig.getCallBack("renren.cb"));
	//这个redirect_uri要和之前传给authorization endpoint的值一样
	parameters.put("grant_type", "authorization_code");
	parameters.put("code", code);
	try {
		String tokenResult = HttpURLUtils.doPost(rrOAuthTokenEndpoint,
				parameters);
		JSONObject tokenJson = (JSONObject) JSONValue
				.parse(tokenResult);
		if (tokenJson != null) {

			String accessToken = (String) tokenJson.get("access_token");
			AccessToken at = new AccessToken(accessToken);

			RenrenApiClient apiClient = new RenrenApiClient(
					accessToken, true);

			int rrUid = apiClient.getUserService().getLoggedInUser(at);
			JSONArray userInfo = apiClient.getUserService().getInfo(
					String.valueOf(rrUid), at);
			if (userInfo != null && userInfo.size() > 0) {
				JSONObject currentUser = (JSONObject) userInfo.get(0);
				System.out.println("CurrentUser:::" + currentUser);
				SocialUser user = new SocialUser();
				System.out.println(currentUser.get("uid").toString());
				user.setUserId(currentUser.get("uid").toString());
				user.setNickName((String) currentUser.get("name"));
				user.setName((String) currentUser.get("name"));
				user.setUserName((String) currentUser.get("name"));
				user.setFigureurl((String) currentUser.get("tinyurl"));
				user.setFigureurl1((String) currentUser.get("headurl"));
				if ("1".equals(currentUser.get("sex").toString())) {
					user.setGender("M");
				} else {
					user.setGender("F");
				}
				user.setOpenSite(SocialUser.OPEN_SITE_RENREN);
				user = SocialUserManager.storeUser(user);

				SSOController sso = new SSOController();

				
				BOInstance biUser = new BOInstance();
				biUser.fromObject(user);

				sso.makeMultiLogin(request, biUser, null);

				if("true".equals(session.getAttribute("mobileclient"))){
					if(DOGlobals.getInstance().getSessoinContext().getUser()!=null){
						DOGlobals.getInstance().getSessoinContext().getUser().putValue("jslib", "jquery_mobile");
					}
					System.out.println("use jslib:::" + DOGlobals.getValue("jslib"));
					response.sendRedirect(request.getContextPath() +  "/web/mobile/AppList.jsp");//pane_jyhd.pml?isApp=true

				}else{
					response.sendRedirect(request.getContextPath() +  "/pane_CRM.pml?isApp=true");
				}
				
			}

		} else {

			out.println("请修改回调地址!");
		}

	} catch (Exception e) {
		response.sendRedirect(request.getContextPath()
				+ "/web/default/logoff.jsp");
	}
%>
