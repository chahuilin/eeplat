package com.exedosoft.plat.ui.jquery.pane;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.exedosoft.plat.ui.DOIModel;
import com.exedosoft.plat.ui.DOPaneModel;
import com.exedosoft.plat.ui.DOViewTemplate;

public class Wizard extends DOViewTemplate {

	public Wizard() {
		
		dealTemplatePath(  "/panel/Wizard.ftl");
	}

	public Map<String, Object> putData(DOIModel doimodel) {

		DOPaneModel pm = (DOPaneModel) doimodel;
		List items = pm.retrieveChildren();
		Map<String, Object> data = new HashMap<String, Object>();
		data.put("model", pm);
		data.put("items", items);
		return data;
	}

}
