package com.exedosoft.plat.ui.customize.ace;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.exedosoft.plat.ui.DOViewTemplate;

/**
 * @author aa
 */
public class RHINO extends JS {

	private static Log log = LogFactory.getLog(RHINO.class);


	public RHINO() {
		dealTemplatePath(  "/customize/ace/rhino.ftl" );
	}

	public static void main(String[] args) {

		int i = (int) Math.round( 0.51);
		System.out.println("i:::::::::" + i);
	}

}
