package com.exedosoft.plat.ui.jquery.form;

import com.exedosoft.plat.ui.DOFormModel;
import com.exedosoft.plat.ui.DOIModel;
import com.exedosoft.plat.util.StringUtil;

public class DOTextArea extends DOBaseForm {

	public DOTextArea() {
		super();
		// TODO Auto-generated constructor stub
	}

	public String getHtmlCode(DOIModel aModel) {
		
		if(isUsingTemplate){
			return super.getHtmlCode(aModel);
		}

		StringBuffer buffer = getTextAreaStr(aModel);

		return buffer.toString();
	}

	 StringBuffer getTextAreaStr(DOIModel aModel) {
		DOFormModel property = (DOFormModel) aModel;

		StringBuffer buffer = new StringBuffer();
		String areaConfig = property.getInputConfig();
		int cols = 50;
		int rows = 5;
		if (areaConfig != null && !areaConfig.equals("")) {
			String[] configs = areaConfig.split(";");
			if (configs != null && configs.length == 2) {
				if (Integer.parseInt(configs[0]) != 0) {
					cols = Integer.parseInt(configs[0]);
				}
				if (Integer.parseInt(configs[1]) != 0) {
					rows = Integer.parseInt(configs[1]);
				}
			}
		}

		buffer.append("<textarea  name='").append(property.getColName())
				.append("' id='").append(property.getFullColID()).append("'");
		// buffer .append("\" dojoType=\"");
		// if (property.getExedojoType() != null
		// && !"".equals(property.getExedojoType().trim())) {
		// buffer.append(property.getExedojoType()).append("\"");
		// } else {
		// buffer.append("ValidationTextBox\"");
		// }

		buffer.append(" title='").append(property.getL10n().trim()).append("'");

		buffer.append(this.appendValidateConfig(property));

		if (isReadOnly(property)) {
			buffer.append(" readonly='readonly' ");

		}

		buffer.append(" cols=").append("\"").append(cols).append("\" rows=")
				.append("\"").append(rows).append("\">");
		if (property.getValue() != null) {
			buffer.append(property.getValue());
		}
		buffer.append("</textarea>");

		if (property.isNotNull()) {
			buffer.append("&nbsp;<font color='red'>*</font>");
		}

		if (property.getNote() != null && !"".equals(property.getNote())) {
			buffer.append("<br/>" + property.getNote());

		}
		return buffer;
	}

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub

	}

}
