package com.exedosoft.plat.ui.jquery.form;


/**
 *除了下拉框不分页外，取当前对应值时，如果没有值，会从当前定义的
 *服务对应的业务对象中取当前值。
 *这和DOResultListPopup DOResultList等不一样。
 *
 *					theValue = fm.getData().getValue(
					fm.getRelationProperty().getColName());
					
	这个地方有改动。
 * @author IBM
 * 

 */
public class DOResultListPopupNoSplitPageNoDefault extends DOResultListPopup {

	public DOResultListPopupNoSplitPageNoDefault() {
		super();
		max_pagesize = 1000;//表示不分页 
		default_data = false;
	}

}
