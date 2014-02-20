package com.exedosoft.plat.login;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.exedosoft.plat.ExedoException;
import com.exedosoft.plat.SessionContext;
import com.exedosoft.plat.bo.BOInstance;
import com.exedosoft.plat.bo.DOService;
import com.exedosoft.plat.bo.org.SessionParterFactory;
import com.exedosoft.plat.util.DOGlobals;

public class LoginMain {

	private static Log log = LogFactory.getLog(LoginMain.class);
	private static DOService insertLoginLog = DOService
			.getService("do_log_insert");

	public static final String DEPTUID = "deptuid";
	public static final String ALLAUTH = "allAuth";
	public static final String ALLAUTHMENUS = "allAuthMenus";
	public static final String USERINFO = "userInfo";

	// ////////////刷新当前登录单位

	// ///////xes专用，刷新对应的角色

	// private static DOService findRoleService =
	// DOService.getService("do_bx_role_findbyuserid_xes");

	public static Map<String, HttpSession> globalSessions = new HashMap<String, HttpSession>();

	static {
		globalSessions = Collections.synchronizedMap(globalSessions);
	}

	// private static Object lockObj = new Object();

	public static SessionContext makeLogin(BOInstance user,
			HttpServletRequest request) {

		// /SAE Environment Special
		user.putValue("deptuid_login", user.getValue(DEPTUID));

		// /////////////sae 暂时不支持这个特性
		if (!"sae".equals(DOGlobals.getValue("cloud.env"))) {

			// /注册全局session 用户
			// /只能有一个用户登陆系统。
			HttpSession session = globalSessions.get(user.getUid());
			// //这个策略是踢出原登陆者
			// //另外的策略是不可登陆
			if (session != null && !session.equals(request.getSession())) {
				// session.invalidate();
				// session = null;
				// globalSessions.remove(user.getUid());

			}

			// if (request.getSession().equals(session)) {
			globalSessions.put(user.getUid(), request.getSession());
			// }
		}

		SessionContext us = (SessionContext) request.getSession().getAttribute(
				USERINFO);

		log.info("LoginMain:::Session::::" + us);

		if (us == null) {

			us = new SessionContext();
			request.getSession().setAttribute(USERINFO, us);
		}

		us.setSysTreeRoot(user.getName());
		us.setUser(user);
		try {
			// /设置tenant_id 和 tenant_name
			if ("true".equals(DOGlobals.getValue("multi.tenancy"))) {
				user.putValue("tenenat_id", DOGlobals.getInstance()
						.getSessoinContext().getTenancyValues().getTenant()
						.getUid());
				user.putValue("tenenat_name", DOGlobals.getInstance()
						.getSessoinContext().getTenancyValues().getTenant()
						.getName());

			}
			us.setIp(DOGlobals.getInstance().getServletContext().getRequest()
					.getRemoteAddr());
			us.setSessionuid(DOGlobals.getInstance().getServletContext()
					.getRequest().getSession().getId());
		} catch (Exception e1) {
			// TODO Auto-generated catch block
			// e1.printStackTrace();
		}

		String findDeptService = DOGlobals
				.getValue("data.access.finddept.service");
		String findDeptColumn = DOGlobals
				.getValue("data.access.finddept.column");

		if (findDeptService != null && findDeptColumn != null) {
			DOService aService = DOService.getService(findDeptService);
			if (aService != null) {
				BOInstance biDept = aService.getInstance(user.getUid());
				if (biDept != null) {
					user.putValue(findDeptColumn,
							biDept.getValue(findDeptColumn));
					System.out.println("test_user::" + user);
				}
			}
		}

		if ("sae".equals(DOGlobals.getValue("cloud.env"))) {
			request.getSession().setAttribute("userInfo", us);
		}

		try {
			if (user != null) {
				List allAuthParter = SessionParterFactory.getSessionParter()
						.getParterAuths(user.getUid());
				user.putValue(ALLAUTH, allAuthParter);

				List allAuthMenus = SessionParterFactory.getSessionParter()
						.getMenuAuthConfigByAccount(user.getUid());

				log.info(" allAuthMenus::::::::::" + allAuthMenus);

				if (allAuthMenus != null && !allAuthMenus.isEmpty()) {
					user.putValue(ALLAUTHMENUS, allAuthMenus);
				}
			} else {
				log.warn("User is null!");
			}
		} catch (Exception e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}

		BOInstance aInsertLog = new BOInstance();
		aInsertLog.putValue("userName", user.getName());
		aInsertLog.putValue("ip", us.getIp());
		aInsertLog.putValue("sessionid", us.getSessionuid());
		try {
			// synchronized(lockObj){
			if (insertLoginLog != null) {
				BOInstance biLog = insertLoginLog.invokeUpdate(aInsertLog);
				if (biLog != null) {
					user.putValue("loginlogid", biLog.getUid());
				}
			}
			// }
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.info(e.fillInStackTrace());
		}

		log.info("LoginMain:::Session::::" + us.getUser());
		if ("sae".equals(DOGlobals.getValue("cloud.env"))) {
			request.getSession().setAttribute("userInfo", us);
		}

		// /SAE Environment Special

		return us;
	}

	public static boolean checkOnline(String userUid) {

		return globalSessions.containsKey(userUid);
	}

	/**
	 * @param args
	 * @throws ExedoException
	 */
	public static void main(String[] args) throws ExedoException {
		// TODO Auto-generated method stub
		DOService insertLoginLog = DOService.getService("do_log_insert");
		Map map = new HashMap();
		map.put("userName", "tttt");
		map.put("sessionid", "aaaaaaaaaaa");
		insertLoginLog.invokeUpdate(map);

	}

}
