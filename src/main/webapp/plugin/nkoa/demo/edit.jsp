<%@ page contentType="text/html;charset=gb2312" %>
<%@ page language="java" import="java.sql.*,java.util.*" %>
<%@ page language="java" import="com.exedosoft.plat.bo.DODataSource" %>

<HTML>
<HEAD>
<meta http-equiv="content-type" content="text/html;charset=gb2312">
<SCRIPT LANGUAGE="JavaScript" src="ntkoocx.js"></SCRIPT>
<TITLE>NTKO Office�ĵ��ؼ�JSPʾ��-�༭�ĵ�</TITLE>
<style>
button.op{
width:90px;
background-color:#9DC2DB;
border:1px #EEEEEE solid;
cursor: hand;
}
</style>
</HEAD>
<%
  Connection conn = null; 
  Statement stmt = null; 
  ResultSet rs = null; 
  String filename="";
  String docid = request.getParameter("docid");

  if ( null == docid) //���ĵ�
  {
  	docid = "";
  	Calendar rightNow = Calendar.getInstance();
  	filename = (new Integer(rightNow.get(Calendar.MONTH))).toString()+ rightNow.get(Calendar.YEAR) 
  		+ rightNow.get(Calendar.DAY_OF_MONTH)
  		+ rightNow.get(Calendar.MINUTE) + rightNow.get(Calendar.SECOND)+".doc"; //ȱʡ�ļ���
  }
  else //�޸������ĵ�
  {
	//��DBMS�������� 
	try
	{ 
		conn = DODataSource.getDefaultCon(); 
		stmt = conn.createStatement();		
	} 
	catch(SQLException ex)
	{ 
		System.err.println("error: " + ex.getMessage()); 
	}
	//��ȡ�ļ���Ϣ
  	try
	{ 			
		rs = stmt.executeQuery("select * from MyUploadTable where id="+docid); 		
	} 
	catch(SQLException ex)
	{ 
		System.err.println("aq.executeQuery: " + ex.getMessage()); 
	}
	while(rs.next())
	{
		try
		{
			long id = rs.getLong("id");			
			filename = rs.getString("filename").trim();//new String( rs.getBytes("filename"),"gb2312");
		}
		catch(Throwable e)
		{
			System.out.println(e.toString());
			throw new ServletException(e.toString());
		}
		break;
	}
	rs.close();
  }  
%>
<BODY >
<center>
<h3>NTKO Office�ĵ��ؼ�JSPʾ��</h3>

<FORM id="myForm" METHOD="POST" ENCTYPE="multipart/form-data" ACTION="uploadedit.jsp">
<TABLE BORDER=0 width = 500>	
	<tr>
		<td align="center"><INPUT type=BUTTON VALUE="�����ĵ������ݿ�" onclick="TANGER_OCX_SaveEditToServer();"></td>
		<td align="center"><INPUT type=BUTTON VALUE="�رմ���" onclick="javascript:window.close();"></td>
	</tr>
</TABLE>
<TABLE BORDER=0 width = 700>
	<tr>
		<td>��¼ID��<input name="docid" disabled=true value="<%= docid %>"></td>		
		<td>�ļ�����<input id="filename" name="filename" MAXLENGTH=50 size=30 value="<%= filename %>"></td>	
	</tr>
</TABLE>

<style>
button.op{
width:90px;
background-color:#9DC2DB;
border:1px #EEEEEE solid;
cursor: hand;
}
</style>
<table width=100% height=700 border=1 cellpadding=0 cellspacing=0 style="border:1px #9dc2db solid">
<tr height=26><td colspan=2><font color="red">��ʾ������ӡ����Ҫʹ��ר�ŵ�ӡ���������ߣ�<a href="SignPicTool.exe">SignPicTool.exe</a></font></td>
</tr>
<tr height=26><td colspan=2><font color="red">��ʾ������Զ��ӡ��(�����£���ͬ�£�������)�Ŀ�����8��1��11111111</font></td>
</tr>
<tr width=100%><td valign=top width=90>
	<button class="op" onclick="TANGER_OCX_OBJ.Titlebar = true;">��ʾ������</button>
	<button class="op" onclick="TANGER_OCX_OBJ.Titlebar = false;">���ر�����</button>
	<button class="op" onclick="TANGER_OCX_OBJ.Menubar=false;">���ز˵�</button>
	<button class="op" onclick="TANGER_OCX_OBJ.Menubar=true;">��ʾ�˵�</button>
	<button class="op" onclick="TANGER_OCX_OBJ.Toolbars=false;">���ع�����</button>
	<button class="op" onclick="TANGER_OCX_OBJ.Toolbars=true;">��ʾ������</button>
	<button class="op" onclick="TANGER_OCX_OBJ.IsShowToolMenu=false;">���ع��߲˵�</button>
	<button class="op" onclick="TANGER_OCX_OBJ.IsShowToolMenu=true;">��ʾ���߲˵�</button>
	<button class="op" onclick="TANGER_OCX_OBJ.IsNoCopy=true;">��ֹ����</button>
	<button class="op" onclick="TANGER_OCX_OBJ.IsNoCopy=false;">������</button>		
	<button class="op" onclick="TANGER_OCX_EnableFileNewMenu(false)">��ֹ�½�</button>
	<button class="op" onclick="TANGER_OCX_EnableFileNewMenu(true)">�����½�</button>
	<button class="op" onclick="TANGER_OCX_EnableFileSaveMenu(false)">��ֹ����</button>
	<button class="op" onclick="TANGER_OCX_EnableFileSaveMenu(true)">������</button>
	<button class="op" onclick="TANGER_OCX_EnableFileSaveAsMenu(false)">��ֹ���</button>
	<button class="op" onclick="TANGER_OCX_EnableFileSaveAsMenu(true)">�������</button>
	<button class="op" onclick="TANGER_OCX_EnableFilePrintMenu(false)">��ֹ��ӡ</button>
	<button class="op" onclick="TANGER_OCX_EnableFilePrintMenu(true)">�����ӡ</button>
	<button class="op" onclick="TANGER_OCX_SetMarkModify(true)">�����ۼ�</button>
	<button class="op" onclick="TANGER_OCX_SetMarkModify(false)">������</button>
	<button class="op" onClick="AddPictureFromLocal()">��ӱ���ͼƬ</button>
	<button class="op" onclick="AddPictureFromURL('200_80Logo.jpg')">��URL���ͼƬ</button>
	<button class="op" onclick="AddSignFromLocal()">��ӱ���ӡ��</button>
	<button class="op" onclick="AddSignFromURL('zhang_caiwu.gif.esp')">��Ӳ�����</button>
	<button class="op" onclick="AddSignFromURL('zhang_hetong.gif.esp')">��Ӻ�ͬ��</button>
	<button class="op" onclick="AddSignFromURL('zhang_xingzheng.gif.esp')">���������</button>
	<button class="op" onclick="DoHandSign()">��дǩ��</button>
	<button class="op" onclick="DoHandDraw()">�ֹ���ͼ</button>
	<button class="op" onclick="DoCheckSign()">ӡ����֤</button>
	<button class="op" onclick="TANGER_OCX_AddDocHeader('ĳĳ�������غ�ͷ�ļ�')">�ļ��׺�</BUTTON>
	<button class="op" onclick="TANGER_OCX_ChgLayout()">ҳ�沼��</button>
	<button class="op" onclick="TANGER_OCX_ShowRevisions(true)">��ʾ�ۼ�</button>
	<button class="op" onclick="TANGER_OCX_ShowRevisions(false)">���غۼ�</button>
	<button class="op" onclick="TANGER_OCX_PrintDoc()">��ӡ</button>
</td>
<td width=100% valign="top">		
	<object id="TANGER_OCX" classid="clsid:A39F1330-3322-4a1d-9BF0-0BA2BB90E970" codebase="OfficeControl.cab#version=5,0,0,6" width="100%" height="550">
        <param name="BorderStyle" value="1">
	 	<param name="BorderColor" value="14402205">        
	 	<param name="TitlebarColor" value="14402205">
        <param name="TitlebarTextColor" value="0">	 
        <param name="Caption" value="NTKO OFFICE�ĵ��ؼ�JSPʾ����V4.0.0.6�汾��http://www.ntko.com">
        <param name="IsShowToolMenu" value="-1">
        <param name="IsNoCopy" value="-1">
		<SPAN STYLE="color:red">����װ���ĵ��ؼ������ڼ���������ѡ���м��������İ�ȫ���á�</SPAN>
	</object>
	<!-- ���º�����Ӧ�ؼ��������¼�:OnDocumentClosed,��OnDocumentOpened -->
	<script language="JScript" for=TANGER_OCX event="OnDocumentClosed()">
		TANGER_OCX_OnDocumentClosed();
	</script>
	<script language="JScript" for=TANGER_OCX event="OnDocumentOpened(TANGER_OCX_str,TANGER_OCX_obj)">
		TANGER_OCX_OnDocumentOpened(TANGER_OCX_str,TANGER_OCX_obj);
	</script>
	
	<script language="JScript">
		TANGER_OCX_OpenDoc("<%= docid %>");
	</script>
</td>
</tr>

</table>	
</FORM>
</center>
</BODY>
</HTML>