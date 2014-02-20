package com.exedosoft.plat.ui.jquery.form;

import java.util.Iterator;
import java.util.List;

import com.exedosoft.plat.SSOController;
import com.exedosoft.plat.ui.DOFormModel;
import com.exedosoft.plat.ui.DOIModel;
import com.exedosoft.plat.ui.DOPaneModel;
import com.exedosoft.plat.util.DOGlobals;
import com.exedosoft.plat.util.StringUtil;

/**
 * 静态列表应该单独作为一个表
 * 
 * @author IBM
 * 
 */
public class DOStaticList extends DOBaseForm {

	public DOStaticList() {
		super();
	}

	public String getHtmlCode(DOIModel iModel) {
		
		if(isUsingTemplate){
			return super.getHtmlCode(iModel);
		}

		DOFormModel property = (DOFormModel) iModel;

		List list = StringUtil.getStaticList(property.getInputConfig());

		return formSelectStr(property, list);
	}

	public String formSelectStr(DOFormModel property, List list) {

		StringBuffer buffer = new StringBuffer();

		String value = property.getValue();
		// try {
		//
		// if (DOGlobals.getInstance().getSessoinContext()
		// .getFormInstance() != null) {
		// String refreshValue = DOGlobals.getInstance().getSessoinContext()
		// .getFormInstance().getValue(
		// property.getFullColName());
		// if(refreshValue!=null){
		// value = refreshValue;
		// }
		// }
		// } catch (RuntimeException e) {
		// // TODO Auto-generated catch block
		// e.printStackTrace();
		// }

		buffer.append("<select  class='resultlistpopup combox' style='");
		if (property.getStyle() != null) {
			if ("100".equals(property.getStyle())) {
				buffer.append(" ");
			} else {
				buffer.append(property.getStyle());
			}
		} else {
			try {
				if (! SSOController.isMobile() ) {
					buffer.append("width:100px");
				}
			} catch (Exception e) {
				buffer.append("width:100px");
			}

		}
		buffer.append("'");
		if (property.getInputConstraint() != null
				&& property.getInputConstraint().startsWith("@multi@")) {
			buffer.append(" size='10' multiple='multiple' ");
		}

		buffer.append(" id=\"").append(property.getFullColID()).append("\" ");

		buffer.append(" name=\"").append(property.getFullColName())
				.append("\" ");

		buffer.append(" title='").append(property.getL10n().trim()).append("'");

		if (isReadOnly(property)) {
			buffer.append(" disabled=\"disabled\" ");
		}

		this.appendHtmlJs(buffer, property);

		buffer.append(this.appendValidateConfig(property,true));

		buffer.append(getDecoration(property));

		buffer.append(" >\n");

		buffer.append("<option/>\n");

		if (list != null) {
			boolean isFirst = true;
			String defaultValue = getDefaultListValue(property);
			for (Iterator it = list.iterator(); it.hasNext();) {
				String[] half = (String[]) it.next();
				buffer.append("<option value=\"").append(half[0]);
				buffer.append("\"");
				if (isFirst) {
					if (value == null
							&& defaultValue == null
							&& (property.getDefaultValue() != null && !property
									.getDefaultValue().trim().equals(""))) {
						buffer.append(" selected=\"selected\"  ");
					}
					isFirst = false;
				}

				if (value != null) { // ////////修改的情况

					// ////////////////////add by weikx at 20070806
					// 只要修改的情况输出标签就可以了
					DOPaneModel cPaneModel = null;
					if (property.getGridModel() != null) {
						cPaneModel = property.getGridModel().getContainerPane();
					}

					if (cPaneModel != null
							&& cPaneModel.getIsCache() != null
							&& cPaneModel.getIsCache().intValue() == DOPaneModel.CACHE_DYN) {// ///当面板采用动态缓存

						String instanceName = "ins_"
								+ StringUtil.get_Name(property.getGridModel()
										.getService().getName());
						buffer.append("<% String theValue =")
								.append(instanceName).append(".getValue(\"")
								.append(property.getColName()).append("\");\n");

						buffer.append("if(DOStaticList.isChecked.(\"")
								.append(half[0]).append("\",theValue))\n{");
						buffer.append(" out.print(selected=\"selected\"); }\n");

						buffer.append("%>");

					} else {// //////////不用输出模板的情况
						if (isChecked(half[0], value)) {
							buffer.append(" selected=\"selected\"  ");
						}
					}
					// ////////////end add by weikx at 20070806

				} else { // //////添加的情况

					if (defaultValue != null && defaultValue.equals(half[0])) {
						buffer.append(" selected=\"selected\"  ");
					}

				}
				buffer.append(">");
				buffer.append(half[1]);
				buffer.append("</option>\n");
			}
		}
		buffer.append("</select><span/>");

		if (property.isNotNull()) {
			buffer.append("&nbsp;<font color='red'>*</font>");
		}
		
		if (property.getNote() != null && !"".equals(property.getNote())) {
			if (property.getStyle() != null && !"".equals(property.getStyle())) {
				buffer.append("&nbsp;&nbsp;&nbsp;<span style=\"").append(
						property.getStyle()).append("\">").append(property.getNote())
						.append("</span>");
			} else {
				buffer.append(property.getNote());
			}
		}
		return buffer.toString();
	}

	/**
	 * 静态下拉列表中,缺省的值
	 * 
	 * @param property
	 *            TODO
	 * @return
	 */
	protected String getDefaultListValue(DOFormModel property) {

		if (property.getInputConfig() != null) {
			if (property.getInputConfig().indexOf("@") != -1) {
				return property.getInputConfig().substring(
						property.getInputConfig().indexOf("@") + 1);
			}
		}
		return null;
	}

	/**
	 * 静态下拉列表情况,返回相应的值 翻译的作用；根据数据库存储的值，翻译为界面显示的值。
	 * 
	 * @param property
	 *            TODO
	 * @return 界面显示的值
	 */
	protected String getStaticListValue(DOFormModel property) {

		List list = StringUtil.getStaticList(property.getInputConfig());
		String value = property.getValue();
		if (value == null) {
			value = this.getDefaultListValue(property);
		}
		if (value!=null && value.indexOf(";") > 0) {
			
			String[] values = value.split(";");
			StringBuffer labels = new StringBuffer();
			for(int i =0; i < values.length ; i++){
				for (Iterator it = list.iterator(); it.hasNext();) {
					String[] halfs = (String[]) it.next();

					if ((values[i] != null && values[i].equals(halfs[0]))) {
						labels.append(halfs[1]).append(";");
					}
				}
				
			}
			if(labels.length()>0){
				return labels.substring(0,labels.length()-1);
			}
			
		} else {
			for (Iterator it = list.iterator(); it.hasNext();) {
				String[] halfs = (String[]) it.next();

				if ((value != null && value.equals(halfs[0]))) {
					return halfs[1];
				}
			}
		}
		// if (value != null) {
		// return value;
		// }
		return "&nbsp;";
	}

	/**
	 * 判断值是否被选中
	 * 
	 * @param aValue
	 * @param values
	 * @return
	 */

	public static boolean isChecked(String aValue, String values) {

		if (values == null || aValue == null) {
			return false;
		}
		if (aValue.equals(values)) {
			return true;
		}

		String[] strs = values.split(";");
		for (int i = 0; i < strs.length; i++) {
			if (strs[i].equals(aValue)) {
				return true;
			}
		}

		strs = values.split(",");
		for (int i = 0; i < strs.length; i++) {
			if (strs[i].equals(aValue)) {
				return true;
			}
		}

		return false;

	}

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		StringBuffer labels = new StringBuffer("fsdfds;");
		
		System.out.println("labels::" + labels.substring(0,labels.length()-1));
		

	}

}
