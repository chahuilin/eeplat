package com.exedosoft.plat.action.customize.tools;

import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import com.exedosoft.plat.action.DOAbstractAction;
import com.exedosoft.plat.bo.BOInstance;
import com.exedosoft.plat.bo.DOBO;
import com.exedosoft.plat.bo.DODataSource;
import com.exedosoft.plat.gene.jquery.SqlCol;
import com.exedosoft.plat.util.DOGlobals;
import com.exedosoft.plat.util.I18n;

/**
 * 
 * 
 * 做增加，不做修改和删除
 * 
 * 可以对增加做扫描
 * 
 * @author anolesoft
 * 
 */

public class DOCreateTable extends DOAbstractAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public String excute() {

		BOInstance form = DOGlobals.getInstance().getSessoinContext()
				.getFormInstance();

		String tableName = form.getValue("tableName");
		String[] colNames = form.getValueArray("col_name");
		String[] dbtypes = form.getValueArray("dbtype");
		String[] dbsizes = form.getValueArray("dbsize");

		StringBuffer sb = new StringBuffer("create table ");
		sb.append(tableName).append(" (");
		for (int i = 0; i < colNames.length; i++) {

			String colName = colNames[i];
			if (!colName.equals("")) {
				sb.append(colName).append("  ").append(dbtypes[i]);

				if (dbsizes[i] != null && !dbsizes[i].equals("")) {
					sb.append(" (").append(dbsizes[i]).append(")");
				}
				if (i < (colNames.length - 1)) {
					sb.append(", \n");
				}
			}
		}
		sb.append(")");
		
	
		DODataSource dss = null; 
		///多租户情况`
		
		if ("true".equals(DOGlobals.getValue("multi.tenancy"))) {
			dss = DOGlobals.getInstance().getSessoinContext()
					.getTenancyValues().getDataDDS();
			///多租户暂时只支持mysql
			
			System.out.println("DSSSSSS:::" + dss);
			
			if(dss.isMySql()){
				sb.append(" ENGINE=InnoDB DEFAULT CHARSET=utf8");
			}
		} else {//单租户情况
			DOBO bo = DOBO.getDOBOByName("do_datasource");
			dss = DODataSource.getDataSourceByL10n(bo
					.getCorrInstance().getValue("l10n"));
		}
		
		System.out.println("Create table Sql::" + sb);

		

		List list = new ArrayList();
		Connection con = null;
		try {
			con = dss.getConnection();
			PreparedStatement pstmt = con.prepareStatement(sb.toString());
			pstmt.executeUpdate();
			pstmt.close();
		} catch (SQLException ex) {
			this.setEchoValue(ex.getMessage());
			return NO_FORWARD;

		} finally {
			try {
				if (!con.isClosed()) {
					con.close();
				}
			} catch (SQLException ex1) {
				this.setEchoValue(ex1.getMessage());
				return NO_FORWARD;

			}

		}
		// TODO Auto-generated method stub
		this.setEchoValue(I18n.instance().get("保存成功!"));
		return DEFAULT_FORWARD;
	}

}
