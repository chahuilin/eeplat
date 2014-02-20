var  sc_page_no = 1;
var  sc_page_size  = 100;
var objGlobals;

function createDmLayer(obj,aFormName,serviceName,searchColName,pageNo,pageSize,configClearOtherUid){
	

    objGlobals = obj;
	// sc_page_size(每页多少条),sc_page_no(第几页)。
	/////联动菜单清楚其它的
	if(configClearOtherUid!=null){
	  var clears = configClearOtherUid.split(",");
	  for(i = 0; i < clears.length; i++){
	      var clearOtherUid = clears[i];
	      if(clearOtherUid==""){
	      	continue;
	      }
		  if( $(clearOtherUid)!=null){
	  	  	$(clearOtherUid).value = "";
	  	  }
	  	  if($(clearOtherUid)!=null && $(clearOtherUid).previousSibling!=null){
		  	$(clearOtherUid).previousSibling.value = "";
		  }
	  }
	}
	var aService = serviceName;
	
	
	var inputconfig = $(obj).attr('inputconfig');
	var linkformid = $(obj).attr('linkformid');	
	
	if(inputconfig!=null && linkformid!=null){
		
		var theValue = $("#" + linkformid).val();
		

		if(theValue!=null && inputconfig.indexOf(";")>0){
			var pairs = inputconfig.split(";");
			if(pairs!=null && pairs.length >0){
				for(var i = 0; i < pairs.length; i++){
					var aPair = pairs[i];
					if(aPair.indexOf(",")>0){
						var a = aPair.split(",");
						if(theValue==a[0]){
							aService = a[1];
						}
					}
				}
			}
	   }
	
		
	}
	
	
	if(pageNo!=null){
		sc_page_no = pageNo;
	}
	if(pageSize!=null){
	   sc_page_size = pageSize;
	}

	
	var Col_Value = encodeURIComponent(escape(objGlobals.value));
	var paras = "";
	if(aFormName!=null && aFormName!=""){
		paras = $("#"+aFormName).serialize();	
	}
	//if(paras==null || paras==""){
		///用sbling的属性判断它的兄弟是否有resultlistpop

		try{
			var rs = $(obj).parent().parent().parent().parent().parent().find('.resultlistpopup');
			if(rs.length==1){
				rs = $(obj).parent().parent().parent().parent().parent().parent().find('.resultlistpopup');
			}
			var  not2This = true;
			 if(rs.length > 1){
				 rs.each(function(i){
					 

					    if(not2This){
						 	if($(rs.get(i)).attr("id") ==  $(obj.previousSibling).attr("id")){
						 		not2This = false;
						 	}
						 
						 	var o = $(rs.get(i));
						 	paras = paras + "&" + o.attr('name')+"="+o.val();
				 		}
				 	}
				 );		
				 
			 } 
		}	 
		catch(e){
		  alert(e);	
		}	 
	//}



	paras = urlCodeDeal(paras);
	var url = globalURL + "servicecontroller?contextServiceName="+aService+"&callType=ss";

	////如果sc_page_size设为1000及以上就不分页了。
	if(sc_page_size < 1000){
		url = url + "&sc_page_no="
			+ sc_page_no+"&sc_page_size="+sc_page_size;
	}
	url = url +"&"+searchColName+"="+ Col_Value +"&"+paras;

	$.post(url,function(result){
		   var ret = result;
		   if(ret!=null && ret.items!=null && ret.items.length>0){
			   
			   
		   
		    var popHeight = 250;
		    var height = 25*(ret.items.length+1);
		    if(popHeight > height){
		    	popHeight = height;
		    }

		    $("#dmLayer").css("height",popHeight);
		    setTip(obj,popHeight);
		    
		    
  			var dmLayer = "<div>";

  			dmLayer = dmLayer + '<table id="dmLayerTable" class="dmBody" style="word-break:keep-all;font-size:10pt;cursor:pointer">';
						//输出一个空行
			dmLayer = dmLayer + '<tr height="25px"  codeID="" ><td style="padding: 1px;" ></td></tr>';
			
			for(var i = 0 ;  i < ret.items.length; i++){
	 		    var content = ret.items[i];
	 		   	dmLayer = dmLayer + '<tr codeID="'
	 		   	+ content.objuid +
	 		   	'" height="25px"  >'
				+' <td style="padding: 1px;" title="' 
				  + content.name   +  '">'+ 
					content.name
				+'</td> </tr> ';
			}
				
			dmLayer = dmLayer + '</table>';
			
			if(!(pageNo==1 && i < sc_page_size)){
			
				dmLayer = dmLayer + '<table class="table table-bordered table-hover dataTable"   height="20" style="margin-left:5px;width:90%;font-size:9pt;cursor:pointer"  border="0" cellpadding="0" cellspacing="0"><tr>';
				
				if(pageNo>1){
					dmLayer = dmLayer + '<td  align="center" class="dmLayerPageCss"><span onClick="pageUp(\''
					+ serviceName + '\',\'' + searchColName + '\',\'' + sc_page_no + '\',\'' + sc_page_size 
					+ '\')">上一页</span></td>';//上一页
				}
				

				
				if(i == sc_page_size){
					dmLayer = dmLayer + '<td  align="left" class="dmLayerPageCss" onclick="pageDown(\''
					+ serviceName + '\',\'' + searchColName + '\',\'' + sc_page_no + '\',\'' + sc_page_size 
					+
					'\')">下一页</td>';//下一页
				}
				dmLayer = dmLayer + '</tr></table>';
			}
			
			dmLayer = dmLayer + '</div>';				
			$("#dmLayer").empty().append(dmLayer);
			
			var dmWTableWidth = $("#dmLayerTable").width();
			if(dmWTableWidth < 220){
				$("#dmLayerTable").css('width',220);
				dmWTableWidth = 220;
			}

			$("#dmLayer").css('width',dmWTableWidth);

			$(".dmBody tr").bind('click',selInputValue)
 		                 .bind('mouseover',function(){$(this).find("td").addClass("dmLayerMouseOverCss")})
 		                 .bind('mouseout',function(){$(this).find("td").removeClass("dmLayerMouseOverCss")});
 		                 
			  $(".dmBody tr:even").css("background","#e6EEEE"); 
			//mOver($("#dmBody")[0].firstChild.firstChild);
	   }else{
		   

		   if(ret.success=='false' && ret.msg.indexOf("err001")!=-1){
			   window.location = "web/default/logoff.jsp";
		   }else{
			   $("#dmLayer").css('width',220);
			   $("#dmLayer").empty().append("&nbsp;&nbsp;&nbsp;&nbsp;" + EELang.noData + "!").show();
		   }
	   }	                            
   });
   
   
}


function popupHide2()
{
	$("#dmLayer").hide();
	$(document).unbind("click",popupHide2);
	$(document).unbind("mouseover",popupHide);
}
function popupHide()
{
	if($("#dmLayer").css("display")!="none")
	{
		$(document).bind("click",popupHide2);
	}
}
$(document).ready(
function (){
	$("#dmLayer").bind('mouseover',function(){
		$(document).unbind("click",popupHide2);
		$(document).unbind("mouseover",popupHide);
		})
	 .bind('mouseout',function(){
		 $(document).bind("mouseover",popupHide);
	 });
}		
);


function invokePopup(obj,aFormName,searchColName,pageNo,pageSize,clearOtherUid){

	if($("#dmLayer").css("display")=="none"){


		  if(obj!=null){ ///obj is img 
			  	obj = $(obj).parent()[0].previousSibling;
		  }
		  var t = $(obj);
		  var serviceName = t.prev().attr('serviceName');

		  $("#dmLayer").css("top", t.offset().top -  $(document).scrollTop() + t.height()+10).css("left",t.offset().left);
		  

		  $("#dmLayer").empty().append("<font color='red'>正在加载.............</font>").show();
		  createDmLayer(obj,aFormName,serviceName,searchColName,pageNo,pageSize,'');
		  
		  $(document).bind("mouseover",popupHide);
	}else{
		 $("#dmLayer").hide();
	}	  
}


function invokePopupPml(obj,anInvokeDomId,linkPaneName,pmlWidth,pmlHeight,title,formName,target){
	
	////全局domid变量
		//invokeDomId=anInvokeDomId;
		invokeDomRef = $(obj).parent()[0].previousSibling.previousSibling;
		var p = {};
		p.pml = linkPaneName;
		if(pmlWidth!=null && pmlWidth!=''){
			p.pmlWidth = pmlWidth;
		}
		if(pmlHeight!=null && pmlHeight!=''){
			p.pmlHeight = pmlHeight;
		}
		
		if(title!=null && title!=''){
			p.title = title;
		}
		
		if(formName!=null && formName!=''){
			p.formName = formName;
		}
		
		if(target!=null && target!=''){
			p.target = target;
		}
		
		loadPml(p);
 }

function textInvokePopup(obj,aFormName,serviceName,searchColName,pageNo,pageSize,clearOtherUid){
  
	$(obj).bind("keydown",function(event){
			var myEvent = event||window.event;
        	var keyCode = myEvent.keyCode;
        	if(keyCode==40){
        		if(times==0){
        			times =1;
        			$(obj).unbind("keydown");
        			setTip(obj);
  					createDmLayer(obj,aFormName,serviceName,searchColName,pageNo,pageSize,'');
        		}
        	}
		});
		times =0;
}

//obj 录入框 , height 是弹出层的高度
function setTip(obj,height){
    $("#dmLayer").attr("sname",obj.id);//sname存放对应的文本框的id，目的是方便以后赋值
	var  t = $(obj);
	if( (t.offset().top + t.height() + height) > ($(window).height()-5) ){
		$("#dmLayer").css("top", t.offset().top - height - 1).css("left",t.offset().left+1);
	}
}
function selInputValue(){

//	var objID = $("#dmLayer").attr("sname");//得到对应文本框的id
//	 if(objID.length>0){
//	 	$("."+objID).attr("value",$(this).children().html());	//input chinese value
//	 	
//	 	$("."+objID).unbind("keydown");
//		if($("."+objID).prev()!=null){
//			$("."+objID).prev().val($(this).attr("codeID"));//把codeID存放到对应的隐藏域中
//		}else{
//		 	alert("赋值失败，发生错误!!!!!!");
//		}
//	}else{
		if(objGlobals!=null){
			objGlobals.value = $(this).children().html();
			$(objGlobals).attr('title', $(this).children().html() );
			if(objGlobals.previousSibling!=null){
				objGlobals.previousSibling.value= $(this).attr("codeID");//把codeID存放到对应的隐藏域中

				try{
					///执行onchange
					eval($(objGlobals).attr('changejs'));
					///执行校验
					$(objGlobals).parents("form").validate().element(objGlobals);
				}catch(e){
					//alert(e);
				}

			}else{
			  alert("赋值失败，发生错误!!!!!!");
			}
		}
//	}
	
	$("#dmLayer").hide();
}


function pageUp(serviceName,searchColName,pageNo,pageSize){
     if(pageNo!=null && pageNo<=1){
       return;
     }
	 createDmLayer(objGlobals,null,serviceName,searchColName,parseInt(pageNo)-1,pageSize);
}
function pageDown(serviceName,searchColName,pageNo,pageSize){
	createDmLayer(objGlobals,null,serviceName,searchColName,parseInt(pageNo)+1,pageSize);
}

function  clearSelect(obj){
	var objID = $("#dmLayer").attr("sname");//得到对应文本框的id
 	 if(objID.length>0){
		$("."+objID).attr("value","");
		if($("."+objID).prev()!=null){
			$("."+objID).prev().val(''); //把codeID存放到对应的隐藏域中
		}else{
		 	alert("赋值失败，发生错误!!!!!!");
		}
	}else{
	  	objGlobals.value='';
	   	if(objGlobals.previousSibling!=null){
			objGlobals.previousSibling.value='';//把codeID存放到对应的隐藏域中
		}
	}
}

function changeServiceName(obj,inputConfig,widgitID){
	

	if(obj==null || inputConfig==null || widgitID==null){
		return;
	}
	var theValue = $(obj).val();
	var groups = inputConfig.split(";");
	for(var i = 0 ; i < groups.length; i++){
		var aGroup = groups[i];
		var ones = aGroup.split(",");
		if(ones[0] == theValue){
			$('#' + widgitID).attr('serviceName',ones[1]);
			return;
		}
	}
}

