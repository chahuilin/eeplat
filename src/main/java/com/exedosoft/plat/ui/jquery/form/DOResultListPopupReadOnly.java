package com.exedosoft.plat.ui.jquery.form;

import com.exedosoft.plat.bo.BOInstance;
import com.exedosoft.plat.bo.DOBO;
import com.exedosoft.plat.ui.DOFormModel;
import com.exedosoft.plat.ui.DOIModel;
import com.exedosoft.plat.util.DOGlobals;

public class DOResultListPopupReadOnly extends DOBaseForm {

	public DOResultListPopupReadOnly() {
		super();
	}

	public String getHtmlCode(DOIModel iModel) {
		
		if(isUsingTemplate){
			return super.getHtmlCode(iModel);
		}

		DOFormModel property = (DOFormModel) iModel;

		return getPopupForm(property);
	}

	/**
	 * 获取动态列表形式的Select Form
	 * 
	 * @param property
	 *            TODO
	 * @param db
	 * @return
	 */
	String getPopupForm(DOFormModel fm) {

		if (fm.getLinkService() == null) {
			return "&nbsp;";
		}
		StringBuffer buffer = new StringBuffer();

		String theValue = fm.getValue();

		// / System.out.println("The Value:::" + theValue);

		if (theValue == null && fm.getData() != null
				&& fm.getRelationProperty() != null) {
			theValue = fm.getData().getValue(
					fm.getRelationProperty().getColName());

		}

		BOInstance data = null;
		
		if (theValue != null && !"".equals(theValue.trim())) {

			DOBO corrBO = fm.getLinkBO();

			if (corrBO == null && fm.getLinkService() != null) {
				corrBO = fm.getLinkService().getBo();
			}
			data = DOValueResultList
					.getAInstance(fm, corrBO, theValue);
		}
				
		
		

		buffer.append("	<input class='resultlistpopup' type='hidden'   name='").append(
				fm.getColName()).append("' id='").append(
				fm.getFullColID()).append("' serviceName='")
				.append(fm.getLinkService().getName())
				.append("' ");
		appendHtmlJs(buffer, fm);


		if (theValue != null) {

			buffer.append(" value='").append(theValue).append("'");
		}
		
		buffer.append(this.appendValidateConfig(fm));
		buffer.append("/>");

		buffer.append("<input type='text'  onchange=\"if(this.value==''){this.previousSibling.value=''};");

		buffer.append("\"")
		.append("  name='").append(fm.getFullColID())
				.append("_show' id='").append(fm.getFullColID()).append(
						"_show' class='").append(fm.getFullColID()).append(
								"_show' ");
		buffer.append(getDecoration(fm));



		
		if (data != null) {
			buffer.append(" value='").append(data.getName())
					.append("'");
		}
		
		if(data!=null){
			buffer.append(" title='").append(data.getName()).append("'");
		}else{
			buffer.append(" title='").append(fm.getL10n()).append("'");
		}	
		buffer.append(" readonly='readonly' ");

		buffer.append(" size=\"").append(getInputSize(fm)).append("\"/>");


		return buffer.toString();
	}

}
