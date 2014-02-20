package com.exedosoft.plat.action.customize.tools;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.exedosoft.plat.CacheFactory;
import com.exedosoft.plat.ExedoException;
import com.exedosoft.plat.Transaction;
import com.exedosoft.plat.action.DOAbstractAction;
import com.exedosoft.plat.bo.BOInstance;
import com.exedosoft.plat.bo.DOBO;
import com.exedosoft.plat.bo.DOService;
import com.exedosoft.plat.cache.busi.BusiCache;

public class DORemoveConfigDOBO extends DOAbstractAction {
	

	/**
	 * 
	 */
	private static final long serialVersionUID = -8093868865224942852L;
	private static Log log = LogFactory.getLog(DORemoveConfigDOBO.class);


	public String excute() {
		
		//DOService DO_BusiPackage_deletebyapplicationuid = DOService.getService("DO_BusiPackage_deletebyapplicationuid");
		
		DOBO bo = DOBO.getDOBOByName("DO_BO");
		BOInstance instance = bo.getCorrInstance();
		
		removeBO(instance);
	
		return DEFAULT_FORWARD;
	}

	public static  void removeBO(BOInstance instance) {
		DOService deletes = DOService.getService("DO_Parameter_deletebybouid");
		Transaction t = deletes.currentTransaction();
		t.begin();
		try {
			deletes.invokeUpdate(instance.getUid());
			
			deleteRubbish(instance,"DO_BO_Property_deletebybouid");
			deleteRubbish(instance,"DO_Rule_deletebybouid");
			deleteRubbish(instance,"DO_Service_deletebybouid");
			deleteRubbish(instance,"DO_Service_Rule_DeleteRubbish");
			deleteRubbish(instance,"DO_Parameter_Service_deleterubbish");
			deleteRubbish(instance,"DO_UI_PaneModel_deletebyboduid");
			deleteRubbish(instance,"DO_UI_PaneLinks_Deleterubbish");
		 	 
			deleteRubbish(instance,"DO_UI_GridModel_deletebycategoryUid");
			deleteRubbish(instance,"DO_UI_FormModel_deleterubbish");
			deleteRubbish(instance,"DO_UI_FormTargets_deleterubbish");
			deleteRubbish(instance,"DO_UI_FormLinks_deleterubbish");
			 
			 
			deleteRubbish(instance,"DO_UI_MenuModel_deletebycategoryUid");
			deleteRubbish(instance,"DO_UI_MenuModel_Deleterubbish");
			deleteRubbish(instance,"DO_UI_MenuModel_Deleterubbish");
			deleteRubbish(instance,"DO_UI_MenuModel_Deleterubbish");
			deleteRubbish(instance,"DO_UI_MenuModel_Deleterubbish");


			deleteRubbish(instance,"DO_UI_TreeModel_deletebycategoryUid");
			deleteRubbish(instance,"DO_UI_TreeModel_Deleterubbish");
			deleteRubbish(instance,"DO_UI_TreeModel_Deleterubbish");
			deleteRubbish(instance,"DO_UI_TreeModel_Deleterubbish");
			deleteRubbish(instance,"DO_UI_TreeModel_Deleterubbish");
			deleteRubbish(instance,"DO_UI_TreeModel_Deleterubbish");
			 

//			DOService formTargetInsert = DOService
//					.getService("DO_UI_FormTargets_Insert");
//
//			DOService formLinksInsert = DOService
//					.getService("DO_UI_FormLinks_Insert");
//
//			DOService treeModelInsert = DOService
//					.getService("DO_UI_TreeModel_Insert");


			
			deleteRubbish(instance,"DO_BO_Delete");
			///清除缓存
			CacheFactory.getCacheData().clear();
			CacheFactory.getCacheRelation().getData().clear();
			BusiCache.flushAll();
			CacheFactory.getCacheData().fromSerialObject();
		
		} catch (ExedoException e) {
			t.rollback();
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		t.end();
	}

	private static  void deleteRubbish(BOInstance instance,String serviceName) throws ExedoException {
		DOService deletes = DOService.getService(serviceName);
		deletes.invokeUpdate(instance.getUid());
	}

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub

	}

}
