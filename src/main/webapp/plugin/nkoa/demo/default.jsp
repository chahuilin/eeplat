<%@ page contentType="text/html;charset=gb2312" %>
<%@ page language="java" import="java.io.*,java.sql.*" %>
<%@ page language="java" import="com.exedosoft.plat.bo.DODataSource" %>

<HTML>
<HEAD>
<meta http-equiv="content-type" content="text/html;charset=gb2312">
<TITLE>NTKO Office�ĵ��ؼ�JSPʾ��</TITLE>
</HEAD>
<BODY>
<Center>
<h1>NTKO Office�ĵ��ؼ�JSPʾ��</h1>
<hr width=80%>
<h3><a href="edit.jsp" target="_blank">�����ĵ�</A>&nbsp;&nbsp;
<button onclick="window.location.reload();">ˢ��</button></h3>
<hr width=80%><B>���������ݿ��б�����ĵ�</B><hr width=80%>
<table width=700 border=1 cellpadding=0 cellspacing=0>
<tr bgcolor="#9cc3de"><td width=50>id</td><td width=350>�ļ���</td><td width=150>��С</td><td width=150>����</td></tr>
<!--��ȡ���ݿ��е��ļ�-->



<%
	//��ȡ���ݿ��е��ļ��б�
	
	Connection conn = null; 
	Statement stmt = null; 
	ResultSet rs = null; 


	
	//��DBMS�������� 
	try
	{ 
		conn = DODataSource.getDefaultCon(); 
		stmt = conn.createStatement();		
	} 
	catch(SQLException ex)
	{ 
		System.err.println("aq.executeQuery: " + ex.getMessage()); 
	}
	rs = stmt.executeQuery("select * from MyUploadTable"); 
	while(rs.next())
	{
		long id = rs.getLong("id");
		String filename = rs.getString("filename").trim();//new String( rs.getBytes("filename"),"gb2312");
		long filesize = rs.getLong("filesize");
		String outStr = "<tr><td>" + id + "</td><td>" + filename +"</td><td>" + filesize + "�ֽ�</td><td><a href=\"edit.jsp?docid=" + id + "\" target=_blank>�༭</a></td><tr>";
		out.println(outStr);		
	}

	rs.close();
%>
</table>
<BR><BR><BR>
<h3>@��Ȩ���У�����ѵ</h3>
<h3><a href="http://www.ntko.com" target="_blank">http://www.ntko.com</h3>
<h3><a href="mailto:tanger@ntko.com">tanger@ntko.com</a></h3>
</center>
</BODY>
</HTML>