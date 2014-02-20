package com.exedosoft.plat.ui.jquery.form;

import com.exedosoft.plat.ui.DOFormModel;
import com.exedosoft.plat.ui.DOIModel;

public class DOInputCheckBox extends DOStaticList {

	public DOInputCheckBox() {
		super();
	}

	public String getHtmlCode(DOIModel iModel) {
		
		if(isUsingTemplate){
			return super.getHtmlCode(iModel);
		}

		
		DOFormModel property = (DOFormModel)iModel;			

		StringBuffer buffer = new StringBuffer();
		buffer.append("<input name='").append(property.getFullColName())
		.append("' id='").append(
						property.getFullColID());
		if (property.getInputConfig() != null
				&& !"".equals(property.getInputConfig())) {
			String configValue = property.getInputConfig().substring(0,
					property.getInputConfig().indexOf(","));
			buffer.append("' value='").append(configValue);
		} else {
			buffer.append("' value='").append("Y");
		}
		
		buffer.append("'  type='checkbox' ");
		
		buffer.append(getDecoration(property));
		
		buffer.append(this.appendValidateConfig(property));

		
		// /////////////判断是否缺省选中
		boolean isDefaultChecked = false;
		if (property.getInputConfig() != null
				&& property.getInputConfig().indexOf("@") != -1) {
			String configValue = property.getInputConfig().substring(0,
					property.getInputConfig().indexOf(","));
			String defaultCheck = property.getInputConfig().substring(
					property.getInputConfig().indexOf("@") + 1);
			if (configValue.equalsIgnoreCase(defaultCheck)) {
				isDefaultChecked = true;
			}
		}

		if (property.getValue() != null || isDefaultChecked) {
			buffer.append(" checked ");
		}
		if (isReadOnly(property)) {
			buffer.append(" DISABLED  ");
		}
		if (property.getDoClickJs() != null
				&& !"".equals(property.getDoClickJs().trim())) {
			buffer.append(" onclick='").append(
					property.getEscapeDOClickJs()).append("'");
		}
		
		buffer.append("/>");
		
		if (property.isNotNull()) {
			buffer.append("&nbsp;<font color='red'>*</font>");
		}
		
		if (property.getNote() != null && !"".equals(property.getNote())) {
			buffer.append(property.getNote());
		}
		return buffer.toString();
	}

}
