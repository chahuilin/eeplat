package com.exedosoft.plat.ui.jquery.menu;

import java.util.Iterator;
import com.exedosoft.plat.ui.DOIModel;
import com.exedosoft.plat.ui.DOMenuModel;
import com.exedosoft.plat.bo.BOInstance;
import com.exedosoft.plat.util.DOGlobals;

public class JqueryMenuXP extends DOBaseMenu {

	public String getHtmlCode(DOIModel aModel) {

		DOMenuModel rootMenu = (DOMenuModel) aModel;
		StringBuffer buffer = new StringBuffer();

		for (Iterator it = rootMenu.retrieveChildren().iterator(); it.hasNext();) {
			DOMenuModel aMenu = (DOMenuModel) it.next();

			buffer.append("<DIV class=mTitle id=").append(aMenu.getObjUid())
					.append(" name=").append(aMenu.getL10n()).append("><a>");
			buffer.append(aMenu.getL10n()).append("</a></div>");
			buffer.append("<div class=mHi>");
			if (aMenu.retrieveChildren() != null) {

				for (Iterator itChild = aMenu.retrieveChildren().iterator(); itChild
						.hasNext();) {
					DOMenuModel aChildMenu = (DOMenuModel) itChild.next();
					buffer.append("<div class=mMenu id=\""
							+ aChildMenu.getObjUid() + "\" name =\""
							+ aChildMenu.getL10n() + "\"");
					if (aChildMenu.getMenuType() != null
							&& aChildMenu.getMenuType().intValue() == DOMenuModel.MENUTYPE_LINK) {
						buffer.append(" paneid=\"")
								.append(aChildMenu.getNote()).append("\"");
					} else

					if (aChildMenu.getLinkPane() != null) {
						BOInstance bi = DOGlobals.getInstance()
								.getRuleContext().getInstance();
						buffer.append(" paneName=\"")
								.append(aChildMenu.getLinkPane().getName())
								.append("\" ");
						buffer.append(" paneid=\"")
								.append(aChildMenu.getLinkPane()
										.getFullCorrHref(bi, null))
								.append("\"");
					}

					if (aChildMenu.getTargetPane() != null) {
						buffer.append(" target=\"")
								.append(aChildMenu.getTargetPane().getName())
								.append("\" ");
					}

					if (aChildMenu.getDoClickJs() != null) {
						buffer.append(" clickjs=\"")
								.append(aChildMenu.getDoClickJs())
								.append("\" ");
					}

					buffer.append(">").append("<A>")
							.append(aChildMenu.getL10n()).append("</A></div>");
				}

			}
			buffer.append("</div>");
		}

		buffer.append("<script language=\"javascript\">bindMenuHoverCss();bindClickMenu();resscrEvt();</script>");

		return buffer.toString();
	}
}
