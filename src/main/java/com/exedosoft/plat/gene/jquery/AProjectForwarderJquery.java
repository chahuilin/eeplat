package com.exedosoft.plat.gene.jquery;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

import com.exedosoft.plat.DAOUtil;
import com.exedosoft.plat.ExedoException;
import com.exedosoft.plat.Transaction;
import com.exedosoft.plat.bo.BOInstance;
import com.exedosoft.plat.bo.BusiPackage;
import com.exedosoft.plat.bo.DOApplication;
import com.exedosoft.plat.bo.DOBO;
import com.exedosoft.plat.bo.DODataSource;
import com.exedosoft.plat.bo.DOResource;
import com.exedosoft.plat.bo.DOService;
import com.exedosoft.plat.gene.jquery.multi.AProjectForwarderMulti;
import com.exedosoft.plat.ui.DOController;
import com.exedosoft.plat.ui.DOMenuModel;
import com.exedosoft.plat.ui.DOPaneLinks;
import com.exedosoft.plat.ui.DOPaneModel;
import com.exedosoft.plat.ui.jquery.menu.JqueryMenuXP;
import com.exedosoft.plat.ui.jquery.pane.ContentPane;
import com.exedosoft.plat.ui.jquery.pane.ContentPaneScroll;
import com.exedosoft.plat.ui.jquery.pane.LayOutLeft;
import com.exedosoft.plat.ui.jquery.pane.LayOutSplitPane;
import com.exedosoft.plat.ui.jquery.pane.MainPage;
import com.exedosoft.plat.util.DOGlobals;
import com.exedosoft.plat.util.StringUtil;

/**
 * 使用分布式配置库，实现起来太复杂 但是可以动态切换配置库 还是使用导入、导出方式，实现团队协作开发
 * 
 * 导入、导出的方式可以使用xml文件，sql文件。 导入、导出的粒度： 1，工程 2，业务包 3，业务对象 4，服务 5，面板 6，表格
 * 
 * 还有一种 可以按日期。 就是某个日期之后的，全部导出去
 * 
 * 其它更小粒度（最后实现是否考虑）
 * 
 * 属性 参数 表格元素 树 树节点 菜单
 * 
 * 
 * 
 * 
 * 
 * @author IBM
 * 
 */

public class AProjectForwarderJquery {

	DOController layOutHeader = DOController
			.getControllerByName("com.exedosoft.plat.ui.jquery.pane.LayOutHeader");

	DOController layOutLeft = DOController.getControllerByName(LayOutLeft.class
			.getName());

	DOController mainPage = DOController.getControllerByName(MainPage.class
			.getName());

	DOController contentScroll = DOController
			.getControllerByName(ContentPaneScroll.class.getName());

	DOController ccSplitePane = DOController
			.getControllerByName(LayOutSplitPane.class.getName());

	DOController contentPane = DOController
			.getControllerByName(ContentPane.class.getName());
	/**
	 * MenuController,但是有滚动条
	 */
	DOController menuController = DOController
			.getControllerByName(JqueryMenuXP.class.getName());

	public void forwardBaseUI(String projectUid) {
		
		
		if("true".equals(DOGlobals.getValue("multi.tenancy"))
		|| "true".equals(DOGlobals.getValue("multi.project"))		){
			
			AProjectForwarderMulti  afm = new AProjectForwarderMulti();
			afm.forwardBaseUI(projectUid);
			return;

		}
		
		
		DOApplication project = DOApplication.getApplicationByID(projectUid);

		if (DOBO.getDOBOByName(project.getName() + "_global_bo") != null) {
			return;
		}
		// HbmDAO dao = new HbmDAO();
		// dao.setAutoClose(false);

		// //定义主业务包,同名业务包
		BusiPackage bp = new BusiPackage();
		bp.setApplication(project);
		bp.setL10n(project.getL10n());
		bp.setName(project.getName());

		DOBO aBO = new DOBO();
		aBO.setType(DOBO.TYPE_BUSINESS);
		aBO.setName(project.getName() + "_global_bo");
		aBO.setL10n(project.getL10n() + "_Global");

		DODataSource dds = DODataSource.parseGlobals();

		Transaction t = dds.getTransaction();

		t.begin();

		DOService aService = DOService.getService("DO_UI_PaneLinks_copy");
		try {
			// //////////保存业务包
			DAOUtil.INSTANCE().currentDataSource(dds);

			DAOUtil.INSTANCE().store(bp);

			// //保存业务对象
			aBO.setPakage(bp);

			DAOUtil.INSTANCE().store(aBO);
			
			///////关联组织权限相关的业务包到初始化的工程下面

			DOService updateBPService = DOService.getService("DO_BusiPackage_Update_copy");
			BusiPackage bporg = BusiPackage.getPackageByName("dorgauth");
			
			if(bporg==null){
				 bporg = BusiPackage.getPackageByName("organization");
			}
			
			bporg.setApplication(project);
			DAOUtil.INSTANCE().store(bporg,updateBPService);
			

			BusiPackage bpAuthSys = BusiPackage.getPackageByName("auth_system_imp");
			
			if(bpAuthSys==null){// mysql 版本
				 bpAuthSys = BusiPackage.getPackageByName("authorization");
			}
			
			bpAuthSys.setApplication(project);
			DAOUtil.INSTANCE().store(bpAuthSys,updateBPService);

			
			BusiPackage bpLog = BusiPackage.getPackageByName("log_default_imp");
			if(bpLog==null){//mysql 版本
				 bpLog = BusiPackage.getPackageByName("log");
			}
			bpLog.setApplication(project);
			DAOUtil.INSTANCE().store(bpLog,updateBPService);
			

			BusiPackage liuchengceshi = BusiPackage.getPackageByName("liuchengceshi");
			if(liuchengceshi==null){ ///mysql 版本
				 liuchengceshi = BusiPackage.getPackageByName("workflow_test");
			}
			
			liuchengceshi.setApplication(project);
			DAOUtil.INSTANCE().store(liuchengceshi,updateBPService);
			
			BusiPackage workflow = BusiPackage.getPackageByName("gongzuoliu");
			if(workflow==null){   // mysql 版本
				workflow = BusiPackage.getPackageByName("workflow_instance");
			}
			workflow.setApplication(project);
			DAOUtil.INSTANCE().store(workflow,updateBPService);
			
			BusiPackage wf_history = BusiPackage.getPackageByName("wf_history");
			if(wf_history==null){//mysql 版本
				wf_history = BusiPackage.getPackageByName("workflow_history");
			}
			wf_history.setApplication(project);
			DAOUtil.INSTANCE().store(wf_history,updateBPService);

			/**
			 * 存储应用的根面板
			 */
			DOPaneModel pmRoot = new DOPaneModel();
			pmRoot.setCategory(aBO);
			pmRoot.setName("pane_" + project.getName());
			pmRoot.setL10n("pane_" + project.getL10n());
			pmRoot.setTitle(project.getDescription());

			// //////////////ccLayOutPane
			pmRoot.setController(contentPane);

			DAOUtil.INSTANCE().store(pmRoot);

			// ///////业务对象发布为一个应用
			project.setDobo(aBO);
			DAOUtil.INSTANCE().store(project);
			
			////头部jsp
			DOResource rs = new DOResource();
			rs.setResourceName("jspheader_" + project.getName());
			rs.setResourcePath(project.getName() + "/FormHeader.jsp");
			rs.setResourceType(1);
			DAOUtil.INSTANCE().store(rs);
																	
			/**
			 * 建立新的头面板
			 */
			DOPaneModel pmTop = new DOPaneModel();

			pmTop.setController(layOutHeader);
			pmTop.setLinkType(DOPaneModel.LINKTYPE_RESOURCE);
			pmTop.setLinkUID(rs.getObjUid());
			pmTop.setLayoutAlign("top");
			pmTop.setCategory(aBO);
			pmTop.setL10n(project.getL10n() + "_headerPane");
			pmTop.setName(project.getName() + "_headerPane");
			DAOUtil.INSTANCE().store(pmTop);

			/**
			 * 建立根面板和头面板的关联关系
			 */
			DOPaneLinks pmTopLink = new DOPaneLinks();
			pmTopLink.setParentPane(pmRoot);
			pmTopLink.setChildPane(pmTop);
			pmTopLink.setOrderNum(new Integer(5));
			DAOUtil.INSTANCE().store(pmTopLink, aService);

			/**
			 * 创建下方的面板
			 */
			DOPaneModel pmBottom = new DOPaneModel();
			pmBottom.setCategory(aBO);
			pmBottom.setL10n(project.getL10n()  + "_mainpane");
			pmBottom.setName(project.getName() + "_mainpane");

			pmBottom.setController(ccSplitePane);
			DAOUtil.INSTANCE().store(pmBottom);
			/**
			 * 建立根面板和工作区域面板的关联
			 */

			DOPaneLinks pmBottomLink = new DOPaneLinks();
			pmBottomLink.setParentPane(pmRoot);
			pmBottomLink.setChildPane(pmBottom);
			pmBottomLink.setOrderNum(new Integer(10));
			DAOUtil.INSTANCE().store(pmBottomLink, aService);

			// /左边面板

			DOMenuModel dmRoot = new DOMenuModel();
			dmRoot.setCategory(aBO);
			dmRoot.setController(menuController); 
			// ////////同名DOMenuModel
			dmRoot.setName(project.getName() + "_root");
			dmRoot.setL10n("Welcome " + project.getL10n());
			DOService storeRootMenu = DOService.getService("DO_UI_MenuModel_Insert_firstlevel");
			DAOUtil.INSTANCE().store(dmRoot,storeRootMenu);			
			
			////更新菜单获取的sql语句
		 	DOService menuService = DOService.getService("s_menumodel_byName");
		 	menuService.setMainSql("select * from do_ui_menumodel where name = '" + dmRoot.getName() + "'");
		 	DAOUtil.INSTANCE().store(menuService);
		 	 

			DOMenuModel dmBP = new DOMenuModel();
			dmBP.setCategory(aBO);
			dmBP.setParentMenu(dmRoot);
			dmBP.setController(menuController);
			// ////////同名DOMenuModel
			dmBP.setName(project.getName());
			dmBP.setL10n(project.getL10n());
			DAOUtil.INSTANCE().store(dmBP);
			
			
			///////组织权限相关的菜单 初始化到工程根菜单下面
			DOMenuModel dmmAuth = DOMenuModel.getMenuModelByName("dorgauth_bp");
			if(dmmAuth==null){// mysql
				dmmAuth = DOMenuModel.getMenuModelByName("Organization");
			}
			dmmAuth.setParentMenu(dmRoot);
			DAOUtil.INSTANCE().store(dmmAuth);
						
			///把工作流相关的菜单初始化到工程根菜单下面
			DOMenuModel dorgauth_flow_test  = DOMenuModel.getMenuModelByName("dorgauth_flow_test");
			if(dorgauth_flow_test==null){
				dorgauth_flow_test  = DOMenuModel.getMenuModelByName("WorkFlowTest");
			}
			dorgauth_flow_test .setParentMenu(dmRoot);
			DAOUtil.INSTANCE().store(dorgauth_flow_test );
						
			
			
			////工作台jsp
			rs = new DOResource();
			rs.setResourceName("workbenchjsp_" + project.getName());
			rs.setResourcePath(project.getName() + "/workbench.jsp");
			rs.setResourceType(1);
			DAOUtil.INSTANCE().store(rs);
			
			DOPaneModel pmContent = new DOPaneModel();// ///主内容显示区。
			pmContent.setCategory(aBO);
			pmContent.setName(project.getName() + "_MainContent");
			pmContent.setL10n(project.getL10n() + "_MainContent");
			pmContent.setController(mainPage);
			pmContent.setLinkType(DOPaneModel.LINKTYPE_RESOURCE);
			pmContent.setLinkUID(rs.getObjUid());
			DAOUtil.INSTANCE().store(pmContent);

			DOPaneLinks pmContentLink = new DOPaneLinks();
			pmContentLink.setParentPane(pmBottom);// //bottomPane为父亲
			pmContentLink.setChildPane(pmContent);
			pmContentLink.setOrderNum(new Integer(17));
			DAOUtil.INSTANCE().store(pmContentLink, aService);

			DOPaneModel pmLeft = new DOPaneModel();
			pmLeft.setController(layOutLeft);
			pmLeft.setLinkType(DOPaneModel.LINKTYPE_MENU);
			pmLeft.setLinkUID(dmRoot.getObjUid());
			pmLeft.setCategory(aBO);
			pmLeft.setL10n(project.getL10n() + "_leftindex_pane");
			pmLeft.setName(project.getName() + "_leftindex_pane");
			
			
			/**
			 * 存储Mobile索引菜单的面包
			 */
			DOPaneModel pmMobile = new DOPaneModel();
			pmMobile.setCategory(aBO);
			pmMobile.setName( project.getName() + "_mobile_pane");
			pmMobile.setL10n(project.getL10n() + "_Mobile");
			pmMobile.setTitle(project.getDescription());
			pmMobile.setExedoJsp("../mobile/exedo.jsp");
			
			pmMobile.setLinkType(DOPaneModel.LINKTYPE_MENU);
			pmMobile.setLinkUID(dmRoot.getObjUid());
			// //////////////ccLayOutPane
			pmMobile.setController(contentPane);

			DAOUtil.INSTANCE().store(pmMobile);

			/**
			 * 保存左边的左边的索引菜单
			 */
			pmLeft.setTargetPane(pmContent);
			DAOUtil.INSTANCE().store(pmLeft);

			DOPaneLinks pmLeftLink = new DOPaneLinks();
			pmLeftLink.setParentPane(pmBottom);// //bottomPane为父亲
			pmLeftLink.setChildPane(pmLeft);
			pmLeftLink.setOrderNum(new Integer(15));
			DAOUtil.INSTANCE().store(pmLeftLink, aService);
			
////最后copy
			this.copyDir(project);

		} catch (Exception e) {

			t.rollback();
			e.printStackTrace();
		} finally {
			t.end();
		}
	
		// /执行目录copy工作
	}

	void copyDir(DOApplication dop) {


		URL url = DOGlobals.class.getResource("/globals.xml");
		String fullFilePath = url.getPath();
		String prefix = fullFilePath.substring(0, fullFilePath.toLowerCase()
				.indexOf("web-inf"));

		try {
			StringUtil.copyDirectiory(prefix + dop.getName(), prefix
					+ "exedo/baseproject/");

			dealAFile(prefix + dop.getName() +"/index.jsp","pane_dorgauth","pane_" + dop.getName());
			dealAFile(prefix + dop.getName() +"/FormHeader.jsp","baseproject/logoff.jsp",dop.getName() + "/logoff.jsp");
			
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	private void dealAFile(String theFile,String theSrc, String theRepla)
			throws UnsupportedEncodingException, FileNotFoundException,
			IOException {
		File indexFile = new File(theFile);

		BufferedReader in = new BufferedReader(new InputStreamReader(new FileInputStream(indexFile),"utf-8"));   
		StringBuffer sb = new StringBuffer();
		while (true) {
			String aLine = in.readLine();
			if(aLine==null){
				break;
			}
			System.out.println(aLine);
			if(aLine.indexOf(theSrc)!=-1){
				aLine =	aLine.replace(theSrc, theRepla); 
			}
			sb.append(aLine).append("\n\r");
		}
		in.close();

		
		BufferedWriter out = new BufferedWriter(new OutputStreamWriter(new  FileOutputStream(indexFile),"utf-8"));
		out.append(sb.toString());
		out.flush();
		out.close();
	}

	public static void main(String[] args) throws ExedoException {
		
		DOApplication project = DOApplication.getApplicationByID("ccc");
		DOService updateBPService = DOService.getService("DO_BusiPackage_Update_copy");

		BusiPackage gongzuoliu = BusiPackage.getPackageByName("gongzuoliu");
		System.out.println("gongzuoliu:::" + gongzuoliu);
		if(gongzuoliu==null){   // mysql 版本
			 gongzuoliu = BusiPackage.getPackageByName("workflow");
				System.out.println("gongzuoliu222222222:::" + gongzuoliu);
		}
		gongzuoliu.setApplication(project);
		DAOUtil.currentDataSource(DODataSource.parseGlobals()).INSTANCE().store(gongzuoliu,updateBPService);

		
//
//		DOService resourceInsert  = DOService.getService("do_bo_insert");
//		Map paras = new HashMap();
//		paras.put("resourceName", "jspheader_aaaa");
//		paras.put("resourcePath", "aaaa/FormHeader.jsp");
//		paras.put("resourceType", "1");
////		BOInstance newResource = resourceInsert.invokeUpdate(paras);
////
////		////头部jsp
////		DOResource rs = DOResource.getResourceByID(newResource.getUid());
//		System.out.println("Hello:::::::::" + resourceInsert);
																
	}

}
