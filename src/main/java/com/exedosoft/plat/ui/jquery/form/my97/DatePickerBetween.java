package com.exedosoft.plat.ui.jquery.form.my97;

import com.exedosoft.plat.ui.DOFormModel;
import com.exedosoft.plat.ui.DOIModel;
import com.exedosoft.plat.ui.DOPaneModel;
import com.exedosoft.plat.ui.jquery.form.DOBaseForm;
import com.exedosoft.plat.util.Escape;

public class DatePickerBetween extends DOBaseForm {

	@Override
	public String getHtmlCode(DOIModel aModel) {
		DOFormModel property = (DOFormModel) aModel;

		StringBuffer buffer = new StringBuffer();

		getAInputTimeStr(property, buffer, "");
		buffer.append("&nbsp; 至  &nbsp;");
		getAInputTimeStr(property, buffer, "2");

		return buffer.toString();
	}

	/**
	 * @param fm
	 * @param buffer
	 */
	private void getAInputTimeStr(DOFormModel fm, StringBuffer buffer,
			String aNext) {

		buffer.append("<input type='text' name='").append(fm.getFullColName())
				.append(aNext).append("' id='").append(fm.getFullColName())
				.append(aNext).append("'");

		buffer.append(getDecoration(fm));

		buffer.append(" title='").append(fm.getL10n().trim()).append("'");

		String theValue = fm.getValue();

		DOPaneModel cPaneModel = null;
		if (fm.getGridModel() != null) {
			cPaneModel = fm.getGridModel().getContainerPane();
		}

		if (theValue != null) {

			buffer.append(" value='").append(theValue).append("'");
		}

		/**
		 *  WdatePicker({maxDate:'#F{$dp.$D(\'��id\');}'}
		 * WdatePicker({minDate:'#F{$dp.$D(\'ǰid\');}'}
		 * */
		buffer.append(" onClick=\"WdatePicker({");
		if (fm.getInputConstraint() != null) {
			String cons = fm.getInputConstraint().trim();
			if(cons.indexOf("{") != -1) {
				cons = cons.substring(1, cons.indexOf("}"));
			}
			buffer.append(cons);
			buffer.append(",");
		}
		if("".equals(aNext)) {
			String id = fm.getFullColName()+"2";
			String cons = "maxDate:'#F{$dp.$D(\\'"+id+"\\')}'";
			buffer.append(cons);
		} else {
			String id = fm.getFullColName();
			String cons = "minDate:'#F{$dp.$D(\\'"+id+"\\')}'";
			buffer.append(cons);
		}
		
		buffer.append("})\" ");

		buffer.append(this.appendValidateConfig(fm));

		buffer.append(" size=\"").append(getInputSize(fm)).append("\"/>");

		if (fm.isNotNull()) {
			buffer.append("&nbsp;<font color='red'>*</font>");
		}
	}

}
