var invokeDomId = "";
var invokeDomRef;
var mirrorEditor ;
var mirrorEditor2 ;
var kindEditor;
var ie6len = 1000;
// 在js里面直接调用action类
/**
 * p的定义 p.btn p.actionName p.formName p.paras p.callback
 * 
 * @param p
 * @return
 */
function callAction(p){
	
	if(p.btn){
		p.btn.disabled = true;
	}
    if(p.actionName==null && p.actionConfigName==null){
    	if(p.btn){
		    p.btn.disabled = false; 
    	}
    	return;
     }
    
	var async = true;
	
	if(p.async == false){
		async = false;
	}
	var aMsg = EELang.dealDaemon;
	if(p.msg){
		aMsg = p.msg;
	}

    //表单验证
	if(!validate(p.formName)){
		if(p.btn){
			if(p.btn.nodeName=='A'){
    			p.btn.flag = false;
			}else{
				p.btn.disabled = false;
			}
		}	
		return;
	}
	
	
	///支持pml的两种形式 
	var pmlName = "";
	if(p.pml!=null &&  p.pml.indexOf('mvccontroller')==-1 && p.pml.indexOf('.pml')==-1){
		pmlName = p.pml;
		p.pml =  globalURL + p.pml + ".pml?1=1";
	}
	//如果没有设置参数，自动从表单中获取
	var paras = "";
	if(p.paras){
		paras = p.paras;
		if(p.formName!=null && $.trim(p.formName)!=""){
			paras = paras + "&" + getParasOfForms(p.formName);
		}
	}else if(p.paras==null && p.formName!=null && $.trim(p.formName)!=""){
		paras =  getParasOfForms(p.formName);
	}
	
	var callType = "as";
	if(p.callType){
		callType = p.callType;
	}
	
	if(p.actionName){
		paras = "callType=" + callType + "&greenChannel=true&userDefineClass="+p.actionName + "&" + urlCodeDeal(paras);
	}
	if(p.actionConfigName){
		paras = "callType=" + callType + "&contextServiceName=do_auth_owner_browse&greenChannel=true&actionConfigName="+p.actionConfigName + "&" + urlCodeDeal(paras);
	}
	
	loading(aMsg);
	$.ajax({
		type: "post",
		url: globalService,
		data: paras,
		async: async,
		success: function (data, textStatus){
		
		   closeWin();
    	
		   if(data!=null && data.echo_msg!=null  && $.trim(data.echo_msg)!=''){
		   		var echo_msg = unescape(data.echo_msg);
		   		if(data.success  && 
		   				(data.success=='success'  || data.success=='true')){///成功也有可能含有提示
		   			if(echo_msg!='success'  && echo_msg!='null' && echo_msg!='undefined'){
			   			alert(echo_msg);
		   			}
		   		}else{
			   		if(echo_msg!='success'  && echo_msg!='null' && echo_msg!='undefined'){
			   			alert(echo_msg);
			   		}
	   	    		if(p.btn.nodeName=='A'){
	   	    			p.btn.flag = false;
	   	    		}else{
	   	    			p.btn.disabled = false;
	   	    		}		 				   		
	   				return;
		   		}
		   }
	   	   if(p.pml!=null) {
	   		   
	   		   if(p.target &&  $.trim(p.target)!=""){
  				    var resourcePath = p.resourcePath;
   				    if(resourcePath==null){
   				    	resourcePath = p.pml;
   				    }
   				 if(resourcePath!=null && resourcePath.indexOf("?")==-1){
   					resourcePath = resourcePath + "?1=1";		
   			     }
	   			  if(p.target=='_opener_window'){
	   				    window.open(resourcePath + "&"  + getShorterParas(paras),title,'height=650,width=1012,left=0,top=0,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no');
	   			  }else  if(p.target=='_opener_location'){
	   				  	window.location = resourcePath + "&"  + getShorterParas(paras) + "&isApp=true";
	   			  }  
	   			  else if(p.target=='_opener_tab'){
						createNewTab(pmlName,title,p.pml);
				  }else if(p.target=='_opener'){
						popupDialog(pmlName,title,p.pml,p.pmlWidth,p.pmlHeight);
				  }else{
					  if($("#" + p.target).size() > 0 && (pmlName == p.target) ){
						  
 						  var pageNo = $("#"+pmlName+" .pageNo").text();
 						  var pageSize = $("#"+pmlName+" .pageSize").text();
 						  var dataParas = $("#" + p.target).data('paras');
 						  
 						  if(pageNo!=null && pageSize!=null){
 							dataParas = dataParas + "&pageSize="+pageSize+"&pageNo="+pageNo; 
 						  }
 						  $("#" + p.target).empty().loadUrl(p.pml,getShorterParas(dataParas));
					  }else{
						  $("#" + p.target).empty().loadUrl(p.pml);
					  }
				  }	
	   		   }else if(pmlName!=""){
	   		     $("#" + pmlName).empty().loadUrl(p.pml);  
	   		   }
	   		   else{
				 alert(EELang.notDefineGoal);
	   		   }	 
		   }
	   	   if(p.callback){
	   		   p.callback(data);
	   	   }
		   if(p.btn){
	    		if(p.btn.nodeName=='A'){
	   	    			p.btn.flag = false;
	   	    	}else{
	   	    			p.btn.disabled = false;
	   	    	}	
	   	   }
        },
		dataType: "json"});
 }


//在js里面直接调用action类
/**
 * p的定义
 * 
 * p.btn p.serviceUid p.serviceName p.formName p.paras p.title p.pml p.pmlHeight
 * p.pmlWidth p.target p.echoJs p.async 缺省 true p.callType //触发类别 default: us ;
 * others: uf p.callback //回调函数
 * 
 */

function callService(p){
	
	if(p==null){
		return;
	}
	
	var aMsg = EELang.dealDaemon;
	if(p.msg){
		aMsg = p.msg;
	}
	
	if(p.btn){
		if(p.btn.nodeName=='A'){
			if(p.btn.flag){
				alert(EELang.clickRepeat);
				return;
			}
			p.btn.flag = true;
		}else{
			p.btn.disabled = true;
		}
	}	
	var async = true;
	
	if(p.async == false){
		async = false;
	}
    if(p.serviceUid==null && p.serviceName==null){
    	if(p.btn){
    		if(p.btn.nodeName=='A'){
    			p.btn.flag = false;
    		}else{
    			p.btn.disabled = false;
    		}	
    	}	
    	return;
    }


	if(!validate(p.formName)){
		if(p.btn){
			if(p.btn.nodeName=='A'){
    			p.btn.flag = false;
			}else{
				p.btn.disabled = false;
			}
		}	
		return;
	}
	
	
	///支持pml的两种形式 
	var pmlName = "";
	if(p.pml!=null &&  p.pml.indexOf('mvccontroller')==-1 && p.pml.indexOf('.pml')==-1){
		pmlName = p.pml;
		p.pml =  globalURL + p.pml + ".pml?1=1";
	}
		
	/////提示性问题
	if(p.echoJs!=null && !eval(unescape(p.echoJs))){
    	if(p.btn){
    		if(p.btn.nodeName=='A'){
    			p.btn.flag = false;
    		}else{
    			p.btn.disabled = false;
    		}	
    	}
		return;
	}
	//初始化FckEditor值 
	updateEditorFormValue();
	// 只要设置了formName，就从表单中获取
	var paras = "";
	if(p.paras){
		paras = p.paras;
		if(p.formName!=null && $.trim(p.formName)!=""){
			paras = paras + "&" + getParasOfForms(p.formName);
		}
	}else if(p.paras==null && p.formName!=null && $.trim(p.formName)!=""){
		paras =  getParasOfForms(p.formName);
	}
	var callType = "us";
	if(p.callType){
		callType = p.callType;
	}

	var  callServStr = "";
	if(p.serviceUid){
		callServStr = "contextServiceUid="+ p.serviceUid;
	}else{
		callServStr = "contextServiceName="+ p.serviceName;
	}

	paras = callServStr + "&callType=" + callType  + "&" + urlCodeDeal(paras);
	
	loading(aMsg);
	$.ajax({
		type: "post",
		url: globalService,
		data: paras,
		async:async,
		success: function (data, textStatus){

				   closeWin();
				   if(data!=null && data.echo_msg!=null && $.trim(data.echo_msg)!=''){
				   		var errmsg = unescape(data.echo_msg);
				   		
				   		if(data.success  && 
				   				(data.success=='success'  || data.success=='true')){///成功也有可能含有提示
				   			if(errmsg!='success'  && errmsg!='null' && errmsg!='undefined'){
					   			alert(errmsg);
				   			}
				   		}else{
					   		if(errmsg!='success'  && errmsg!='null'  && errmsg!='undefined'){
	 		   		 			alert(errmsg);
					   		}
	 		   	    		if(p.btn.nodeName=='A'){
	 		   	    			p.btn.flag = false;
	 		   	    		}else{
	 		   	    			p.btn.disabled = false;
	 		   	    		}		 				   		
 			   				return;
				   		}
				   }
    			   if(data.returnPath!=null && data.returnPath!=null){
    				   
   				    var arrayPath = data.returnPath.split(",");
   				    var arrayTarget = data.targetPane.split(",");
   				    var arrayTitle = data.returnTitle.split(",");
   				    for(ai = 0; ai < arrayPath.length;ai++){
   				        var aPath = arrayPath[ai];
   				        var target = arrayTarget[ai];
   				        var aTitle= arrayTitle[ai];
   				        if(aTitle==null){
   				        	aTitle = EELang.infoDialog;
   				        }
   				        if(aPath!=null && aPath!=""
   				        && target!=null && target!=""){
   				   			  if(target=='_opener_window'){
   		  		   				  	window.open(aPath + "&"  + getShorterParas(paras),aTitle,'height=650,width=1012,left=0,top=0,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no');
   		  		   			  }else  if(target=='_opener_location'){
   		  		   				  	window.location = aPath + "&"  + getShorterParas(paras) + "&isApp=true";
   		  		   			  }  
   		  		   			  else if(target=='_opener_tab'){
   		  							createNewTab(pmlName,aTitle,aPath);
   		  					  }else if(target=='_opener'){
   	  								popupDialog(pmlName,aTitle,aPath,p.pmlWidth,p.pmlHeight);
   		  					  }else{
   		  						  
   		  	 		   			 $("#" + target).empty().loadUrl(aPath);  
   		  					  }	
   			        	}
   			         }
   				   }
                   var title = EELang.newDialog;
                   if(p.title != null && p.title != "")
                	  title = p.title;
			 
 		   	   if(p.pml!=null) {
  		   		   var conParas = "";
				   if(p.conFormName){
						conParas =  getParasOfForms(p.conFormName);
				   }
				   
  		   		   if(p.target &&  $.trim(p.target)!=""){
  	  				    var resourcePath = p.resourcePath;
  	   				    if(resourcePath==null){
  	   				    	resourcePath = p.pml;
  	   				    }
  	   				 if(resourcePath!=null && resourcePath.indexOf("?")==-1){
  	   					 resourcePath = resourcePath + "?1=1";		
  	   				 }
  		   			  if(p.target=='_opener_window'){
  		   				  	window.open(resourcePath + "&"  + getShorterParas(paras),title,'height=650,width=1012,left=0,top=0,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no');
  		   			  }else  if(p.target=='_opener_location'){
  		   				  	window.location = resourcePath + "&"  + getShorterParas(paras) + "&isApp=true";
  		   			  }  
  		   			  else if(p.target=='_opener_tab'){
  							createNewTab(pmlName,title,p.pml);
  					  }else if(p.target=='_opener'){
  							popupDialog(pmlName,title,p.pml,p.pmlWidth,p.pmlHeight);
  					  }else{

  						  if($("#" + p.target).size() > 0  ){

  	  						  var pageNo = $("#"+p.target+" .pageNo").text();
  	  						  var pageSize = $("#"+p.target+" .pageSize").text();
  	  						  var dataParas = $("#" + p.target).data('paras');

  	  						  if(pageNo!=null && pageSize!=null){
  	  							dataParas = dataParas + "&pageSize="+pageSize+"&pageNo="+pageNo + "&" + getShorterParas(conParas); 
  	  						  }
  	  						  
  	  						var hei = $('#' + p.target).find('.gridScroller:eq(0)').height();
  	  						$("#" + p.target).empty().wrap("<div/>");
  	  						var part = $("#" + p.target).parent();
  	  				//		alert(getShorterParas(urlCodeDeal(dataParas)));
  	  						part.load(p.pml,getShorterParas(urlCodeDeal(dataParas)),function(a){
	  	  						part.html(a).initUI();
	  	  						var scroller = part.find('.gridScroller:eq(0)');
	  	  						scroller.height(hei);
	  	  						$("#" + p.target).unwrap("<div/>");
  	  						});
//  	  						  $("#" + p.target).empty().loadUrl(p.pml,getShorterParas(urlCodeDeal(dataParas))
//  	  								  ,function(a){
//  	  							  		
//  	  						  		});
  						  }else{
  							  $("#" + p.target).empty().loadUrl(p.pml,getShorterParas(urlCodeDeal(conParas)));
  						  }
  					  }	
 		   		   }else if(pmlName!=""){

 		   		     $("#" + pmlName).empty().loadUrl(p.pml,getShorterParas(urlCodeDeal(conParas)));  
 		   		   }
 		   		   else{
					 alert(EELang.noDefinedTaegetPane);
 		   		   }	 
			   }
 		   	   if(p.callback){
 		   		   p.callback(data);
 		   	   }
 		   	   if(p.btn){
	 		  		if(p.btn.nodeName=='A'){
	 	    			p.btn.flag = false;
	 				}else{
	 					p.btn.disabled = false;
	 				}
 		   	   }
	  },
	  dataType: "json" });
}

/**
 * p.paras
 * @param p
 * @return
 */
function callPlatBus(p){
	
	if(p==null){
		return;
	}
	
	if(p.paras==null){
		return;
	}
	
    $.ajax({   type: "POST",
    		   url: globalService,
    		   data: p.paras,
    		   async: false
    		});
}


/**
 * p的定义 
 * p.formName
 * p.paras
 * p.target
 * p.pml
 * p.pmlName
 * p.showLoadMsg 是否loading进度
 * p.pmlWidth 弹出Dialog方式，宽度(px) 
 * p.pmlHeight 弹出Dialog方式，高度(px)
 * urlCodeDeal(paras)  改写可以加快速度
 * @param p
 * @return
 */
function loadPml(p){
	if(p==null){
		return;
	}
	if(p.pml ==  null){
		return;
	}
	var pmlName = "";
	
	if(p.pmlName){
		pmlName = p.pmlName;
	}
	/////提示性问题
	if(p.echoJs!=null && !eval(unescape(p.echoJs))){
    	if(p.btn){
    		if(p.btn.nodeName=='A'){
    			p.btn.flag = false;
    		}else{
    			p.btn.disabled = false;
    		}	
    	}
		return;
	}


/**
 * 是否为简化配置 
 * 如果直接把pml配置为面板的名称即为简化配置 
 */
	var simpleConfig = false;
	if(p.pml!=null &&  p.pml.indexOf('mvccontroller')==-1 
			&& p.pml.indexOf('.pml')==-1 
			&& p.pml.indexOf('.jsp')==-1
			&& p.pml.indexOf('.htm')==-1){
		pmlName = p.pml;
		simpleConfig = true;
		p.pml =  globalURL + p.pml + ".pml?1=1";

	}
	
	if(p.pml!=null && p.pml.indexOf("?")==-1){
		p.pml = p.pml + "?1=1";		
	}
	
	var showLoadMsg = true;
	
	if(p.showLoadMsg!=null && p.showLoadMsg == false){
		showLoadMsg = false;
	}


	var paras = "";
	if(p.paras){
		paras = p.paras;
	}else if(p.paras==null && p.formName!=null && $.trim(p.formName)!=""){
		paras =  getParasOfForms(p.formName);
	}

	try{
		 var resourcePath = p.resourcePath;

		 if(resourcePath==null){
		 resourcePath = p.pml;
		 }
		 if(resourcePath!=null && resourcePath.indexOf("?")==-1){
				resourcePath = resourcePath + "?1=1";		
		  }

	   if(p.target=='_opener_window'){
				  	window.open(resourcePath + "&"  + getShorterParas(paras),title,'height=650,width=1012,left=0,top=0,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no');
		}else  if(p.target=='_opener_location'){
				  	window.location = resourcePath + "&"  + getShorterParas(paras) + "&isApp=true";
	   } 
	   else	if(p.target && $.trim(p.target)!="" && p.target!='_opener_tab'){
			if(p.target=='_opener'){
				var title = "";
				if(p.title){
					title = p.title;
				}
				
				popupDialog(pmlName,title,p.pml + "&" +  getShorterParas(urlCodeDeal(paras)),p.pmlWidth,p.pmlHeight);
			}else{
				if(showLoadMsg){
					loading();
				}
				if(p.target==pmlName){
					
					$("#" + pmlName).empty().wrap("<div/>").parent().loadUrl(p.pml,getShorterParas(urlCodeDeal(paras)),function(){
						$("#" + pmlName).unwrap("<div/>");
						if(showLoadMsg){
							closeWin();
						}
					});

				}else{
					
					$("#" + p.target).empty().loadUrl(p.pml,getShorterParas(urlCodeDeal(paras)),function(a){
						
						if(showLoadMsg){
							closeWin();
						}
					});
				}
			
				$("#" + pmlName).data('paras',paras);
			}
		}else{
	
			
			if(pmlName!=""){
				
				////如果采用简化配置的情况 
				if(p.target!='_opener' && p.target!='_opener_tab' && simpleConfig && $("#" + pmlName).size() > 0){
					
					if(showLoadMsg){
						loading();
					}
					var hei = $("#" + pmlName).find('.gridScroller:eq(0)').height();
					$("#" + pmlName).empty().wrap("<div/>");
					
					var part = $("#" + pmlName).parent();
					part.load(p.pml,getShorterParas(urlCodeDeal(paras)),function(a){
						part.html(a).initUI();
						
						
						var scroller = part.find('.gridScroller:eq(0)');
						scroller.height(hei);
						$("#" + pmlName).unwrap("<div/>");
						if(showLoadMsg){
							closeWin();
						}
					});
					$("#" + pmlName).data('paras',paras);
				}else{
					var title = "";
					if(p.title){
						title = p.title;
					}
					var thisPml = p.pml;
					if(paras!="" && urlCodeDeal(paras)!=""){
						thisPml = p.pml + "&" +  getShorterParas(urlCodeDeal(paras));
					}
					if(p.target=='_opener_tab'){
						createNewTab(pmlName,title,thisPml);
					}else{
						
						popupDialog(pmlName,title,thisPml,p.pmlWidth,p.pmlHeight);
					}	
				}
			}else{
				alert(EELang.noDialogName);
			}	
		}
	}catch(e){
		
		
	}
}

/**
 * 根据form转换为字符串形式的paras
 * @param targetForms
 * @return
 */
function  getParasOfForms(targetForms){

	var paras = "";
	if(targetForms.indexOf(" ")!=-1){
		var forms = targetForms.split(" ");
		for(var i = 0; i < forms.length; i++ ){
			var aForm = forms[i];
			if(paras==""){
				paras = $("#"+aForm).serialize();
			}else{
				paras = paras + "&" +  $("#"+aForm).serialize();
			}	
		}	
	}else{
		paras = $("#"+targetForms).serialize();
	}
	return paras;
}

/**
 * 
 * IE6、7 URL长度的限制
 * @param paras
 * @return
 */
function getShorterParas(paras){
	
	if(paras!=null && paras.length>ie6len && $.browser.msie && 
			($.browser.version=='6.0' 
		||	 $.browser.version=='7.0')){
		return paras.substr(0,ie6len);
    }
	return paras;
}


function updateEditorFormValue()
{	 
	try {
			 ///fckeditor
                for (var i = 0; i < parent.frames.length; ++i )
                        if ( parent.frames[i].FCK )
                                parent.frames[i].FCK.UpdateLinkedField();
	}catch(e){
	 }
	
	try{
	    ////codemirror
	    if(mirrorEditor){
		    mirrorEditor.save();
	    }
	    if(mirrorEditor2){
	    	mirrorEditor2.save();
	    }
	    if(kindEditor){
	    	kindEditor.sync();
	    }
	}catch(e){
	}
	
	
}


////////////////////////设计器相关的函数
function  sortUp(o,boName,serviceName){

	var trO = $(o).parent().parent();
	var base = trO.attr('value');
	var trPre  = trO.prev();
	var pre = trPre.attr('value');
	
	if(trPre.attr('value')){
		var trOClone = trO.clone(true);
		trO.remove();
		trPre.before(trOClone);
	}
	var paras = "dataBus=setContext&contextKey=" + boName + "&contextValue=" + pre
	+ '&base=' + base + '&pre=' + pre;

	
	callService(
		{
		serviceName:serviceName,
		paras:paras,
		callType:'uf'
		}
	);

}
function  sortDown(o,boName,serviceName){

	var trO = $(o).parent().parent();
	var pre = trO.attr('value');
	var trNext  = trO.next();
	var base = trNext.attr('value');
	if(trNext.attr('value')){
		var trOClone = trO.clone(true);
		trO.remove();
		trNext.after(trOClone);
	}
	
	var paras = "dataBus=setContext&contextKey=" + boName + "&contextValue=" + pre
	+ '&base=' + base + '&pre=' + pre;
	
	callService(
		{
		serviceName:serviceName,
		paras:paras,
		callType:'uf'
		}
	);
	
}


////////////////////////////////无刷新 flash上传
function uploadify(uploadifyID,uploadifyQueueID,fileDesc,fileExt,autoUpload,sessionid,uploadActionFile){
	
	if(fileDesc==null || $.trim(fileDesc)==""){
		fileDesc= 'All Files';//EELang.onlySelectFile;
	}
	if(fileExt==null || $.trim(fileExt)==""){
		fileExt = '*.*'; //'*.jpg;*.gif;*.bmp';
	}
	if(autoUpload==null){
		autoUpload = true;
	}
	if(uploadActionFile==null || uploadActionFile==""){
		uploadActionFile = "upload_action_uploadify.jsp";
	}
	
	var o = $("#" + uploadifyID).prev().find(":only-child");
	$("#" + uploadifyID).uploadify({
		'swf'            : 'web/default/js/jquery-plugin/fileuploader/uploadify.swf',
		'formData'       : {'jsessionid':sessionid},
		'uploader'       : 'web/default/' + uploadActionFile + ';jsessionid=' + sessionid , /// /eestorage/    ec2 upload
		'checkExisting'  : 'web/default/upload_action_uploadify_exists.jsp;jsessionid=' + sessionid ,
		'auto'           : autoUpload,
		'multi'          : false,
		'simUploadLimit' : 2,
		'buttonText'     : EELang.browse, 
		'wmode'          : 'transparent',
		'width'          : 75,
		'height'         : 25,
		'fileTypeDesc'   : fileDesc,
		'fileTypeExts'	 : fileExt,
		'onSelect'       : function(fileObj){ o.val(fileObj.name);},
		'onProgress'     : function(fileObj){o.val(fileObj.name);},
		'onCheck'        : function(file, exists) {
	            if (exists) {
	                alert('The file ' + file.name + ' exists on the server.');
	            }
	     } 
		
		
	});
}

////////////////////////////////无刷新 flash上传 ,可以上传多个文件
function uploadifyMulti(uploadifyID,uploadifyQueueID,fileDesc,fileExt,autoUpload,sessionid,uploadActionFile){
	

	if(fileDesc==null || $.trim(fileDesc)==""){
		fileDesc= 'All Files';//EELang.onlySelectFile;
	}
	if(fileExt==null || $.trim(fileExt)==""){
		fileExt = '*.*'; //'*.jpg;*.gif;*.bmp';
	}
	if(autoUpload==null){
		autoUpload = true;
	}
	if(uploadActionFile==null || uploadActionFile==""){
		uploadActionFile = "upload_action_uploadify.jsp";
	}
	
	var o = $("#" + uploadifyID).prev().find(":only-child");
	$("#" + uploadifyID).uploadify({
		'swf'            : 'web/default/js/jquery-plugin/fileuploader/uploadify.swf',
		'formData'       : {'jsessionid':sessionid},
		'uploader'       : 'web/default/' + uploadActionFile + ';jsessionid=' + sessionid ,
		'checkExisting'  : 'web/default/upload_action_uploadify_exists.jsp;jsessionid=' + sessionid ,
		'queueID'        : uploadifyQueueID,
		'auto'           : autoUpload,
		'multi'          : true,
		'simUploadLimit' : 2,
		'buttonText'     : EELang.browse, 
		'wmode'          : 'transparent',
		'width'          : 75,
		'height'         : 25,
		'fileTypeDesc'   : fileDesc,
		'fileTypeExts'	 : fileExt,
		'onSelect'       : function(fileObj){if(o.val()==""){ o.val(o.val() +fileObj.name);}else{ o.val(o.val() + ";"+fileObj.name);}},
		'onCancel'       : function(fileObj){o.val(o.val().replace(fileObj.name,""));}
	});
}

/**
 * 分页
 * @param dataKey
 * @param pmlName
 * @param formName
 */
function pageSplit(dataKey,pmlName,formName){
	
	if($(document.body).data(dataKey)==null){
		$(document.body).data(dataKey,1);
	}

	$("#"+dataKey+" .firstPage").bind('click',function(){
		    if($(document.body).data(dataKey)=="1"){
		    	return;
		    }
	  		$(document.body).data(dataKey,"1");
		    var pmlUrl = getPmlUrl(pmlName,1,$("#"+dataKey+" .rowSize").text().replace(",","") );
		    loadPml({'pml':pmlUrl,'target':pmlName,'formName':formName});
	});
	
	$("#"+dataKey+" .prevPage").bind('click',function(){
		    if($(document.body).data(dataKey)=="1"){
		    	return;
		    }
		    var curPageNo = parseInt($(document.body).data(dataKey).replace(",","")) - 1;
		    $(document.body).data(dataKey,"" + curPageNo);
		    var pmlUrl = getPmlUrl(pmlName,curPageNo,$("#"+dataKey+" .rowSize").text().replace(",","") );
		    loadPml({'pml':pmlUrl,'target':pmlName,'formName':formName});
	});
	
	$("#"+dataKey+" .nextPage").bind('click',function(){

		    if(parseInt($("#"+dataKey+" .pageNo").text().replace(",",""))>=parseInt(($("#"+dataKey+" .pageSize").text().replace(",",""))) ){
		    	return;
		    }
		    var curPageNo = parseInt($("#"+dataKey+" .pageNo").text().replace(",","")) + 1;
		    $(document.body).data(dataKey,"" + curPageNo);
		    var pmlUrl = getPmlUrl(pmlName,curPageNo,$("#"+dataKey+" .rowSize").text().replace(",","") );
		    loadPml({'pml':pmlUrl,'target':pmlName,'formName':formName});
	});
	
	$("#"+dataKey+" .lastPage").bind('click',function(){
		    if(parseInt($("#"+dataKey+" .pageNo").text().replace(",",""))==$("#"+dataKey+" .pageSize").text().replace(",","")){
		    	return;
		    }
		    $(document.body).data(dataKey,$("#"+dataKey+" .pageSize").text().replace(",",""));
		    var pmlUrl = getPmlUrl(pmlName,$("#"+dataKey+" .pageSize").text().replace(",",""),$("#"+dataKey+" .rowSize").text().replace(",","") );
		    loadPml({'pml':pmlUrl,'target':pmlName,'formName':formName});
	});

}

function getPmlUrl(pmlName,pageNo,pageSize){
	return  globalURL + pmlName + ".pml?pageSize="+pageSize+"&pageNo="+pageNo; 
}

/**
 * jquery validator 扩展
 */
try{
	//手机号码验证
	$.validator.addMethod("mobile", function(value, element) {
	    var length = value.length;
	    var mobile =  /^(((13[0-9]{1})|(15[0-9]{1}))+\d{8})$/;
	    return this.optional(element) || (length == 11 && mobile.test(value));
	},  EELang.vMobile);   

	// 电话号码验证   
	$.validator.addMethod("phoneChina", function(value, element) {
	    var tel = /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;
	    return this.optional(element) || (tel.test(value));
	},  EELang.vPhone);

	//兼容老版本的校验类型
	$.validator.addMethod("telphone", function(value, element) {
	    var tel = /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;
	    return this.optional(element) || (tel.test(value));
	},  EELang.vPhone);

	//兼容老版本的校验类型  
	$.validator.addMethod("Integer", function(value, element) {
	    return this.optional(element) || (!checkErrNum(value));
	}, EELang.vInt);

	//兼容老版本的校验类型
	$.validator.addMethod("RealNumber", function(value, element) {
	    return this.optional(element) || (!checkErrFloat(value));
	}, EELang.vNumber);

	//兼容老版本的校验类型
	$.validator.addMethod("nochin", function(value, element) {
	    return this.optional(element) || (!funcChin(value));
	}, EELang.vSBC);

	//兼容老版本的校验类型
	$.validator.addMethod("NoSBCDot", function(value, element) {
	    return this.optional(element) || (!funcSBCDot(value));
	}, EELang.vSBCDOT);

	//兼容老版本的校验类型
	$.validator.addMethod("idcard", function(value, element) {
	    var checkResult = checkIdCard(value);
	    return this.optional(element) || (checkResult=="yes");
	}, "请输入正确的身份证号码");
}catch(e){
	
	alert(e);
}


//检查是否含有汉字
function funcChin(value){
	return (/.*[\u4e00-\u9fa5]+.*$/.test(value)); 
} 


//检查是否含有全角和点
function funcSBCDot(value){
	
	if(value==null){
		return false;
	}
	
	if(value.indexOf(".")>-1){
		return true;
	}
	for   (var   i=0;   i<value.length;   i++)   {   
	  if   (value.charCodeAt(i)   >   128) return true;   
   }
	
} 
// 检查Email
function checkErrEmail(value){
	return !/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(value);
}
// 检查Url
function checkErrUrl(value){
	return !/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
}

// 检查Integer
function checkErrNum(value){
	return !/^\d+$/.test(value);
}
// 检查RealNumber
function checkErrFloat(value){
	return !/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value);
}
// 检查IDCard
function checkIdCard(idcard){
	//判断身份证是否合法
    var Errors=new Array(
    "yes",
    "身份证号码位数不对!",
    "身份证号码出生日期超出范围或含有非法字符!",
    "身份证号码校验错误!",
    "身份证地区非法!"
    );
    var area=
    {
        11:"??",12:"??",13:"??",14:"??",15:"???",21:"??",22:"??",23:"???",31:"??",32:"??",33:"??",34:"??",35:"??",36:"??",37:"??",41:"??",42:"??",43:"??",44:"??",45:"??",46:"??",50:"??",51:"??",52:"??",53:"??",54:"??",61:"??",62:"??",63:"??",64:"??",65:"??",71:"??",81:"??",82:"??",91:"??"
    }
    var idcard,Y,JYM;
    var S,M;
    var idcard_array = new Array();
    idcard_array = idcard.split("");
    if(area[parseInt(idcard.substr(0,2))]==null) return Errors[4];
	switch(idcard.length){ 
		case 15: 
		if ( (parseInt(idcard.substr(6,2))+1900) % 4 == 0 || ((parseInt(idcard.substr(6,2))+1900) % 100 == 0 && (parseInt(idcard.substr(6,2))+1900) % 4 == 0 )){ 
		ereg=/^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/; 
		}else { 
		ereg=/^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/; 
		} 
		if(ereg.test(idcard)) return Errors[0]; 
		else return Errors[2]; 
		break; 
		case 18: 
		if ( parseInt(idcard.substr(6,4)) % 4 == 0 || (parseInt(idcard.substr(6,4)) % 100 == 0 && parseInt(idcard.substr(6,4))%4 == 0 )){ 
		ereg=/^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;// ???????????????
		} else { 
		ereg=/^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/;// ???????????????
		} 
		if(ereg.test(idcard)){
            S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7
            + (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9
            + (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10
            + (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5
            + (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8
            + (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4
            + (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2
            + parseInt(idcard_array[7]) * 1
            + parseInt(idcard_array[8]) * 6
            + parseInt(idcard_array[9]) * 3 ;
            Y = S % 11;
            M = "F";
            JYM = "10X98765432";
            M = JYM.substr(Y,1);
            if(M == idcard_array[17]) return Errors[0];
            else return Errors[3];
        }else return Errors[2];
        break;
        default:
        return Errors[1];
        break;
    }
}
// 检查MoBile
function checkNotMobile(value){
	return !/(\d){11}/.test(value);
}
// 检查固定电话 Telphone
function checkNotTelphone(value){
	return !/(^[0-9]{3,4}\-[0-9]{3,8}$)|(^[0-9]{3,8}$)|(^\([0-9]{3,4}\)[0-9]{3,8}$)/.test(value);
}

//检查是否含有空格

function checkBlank(value){
	return /(\s)/.test(value);
}


function toggleContent(obj1){

	var isShow = $(obj1).parents('.box').find('.box-content').toggle();
	
	if($(obj1).find("i").attr('class') == 'icon-chevron-up'){
		$(obj1).find("i").attr('class','icon-chevron-down');
	}else{
		$(obj1).find("i").attr('class','icon-chevron-up');
	}
	

}

function validate(formName) {
	if (formName != null && formName != "") {
		var ay = formName.split(" ");
		for ( var ii = 0; ii < ay.length; ii++) {
			var aFName = $.trim(ay[ii]);
			var formJquery = $("#" + aFName);
			try {
				var validator = formJquery.validate({
				   		ignoreTitle: true,
					  });
				if (!formJquery.valid()) {
					validator.focusInvalid();
					return false;
				}
			} catch (e) {
				//alert(e);
			}
		}
	}
	return true;
}
////验证表单函数
//function validate(formName){
//	
//if(formName==null || $.trim(formName)==""){
//	return true;
//}
//
//try{  
//  var el;
//  var exedo_notnull;
//  var exedo_validconfig ;
//  var exedo_length;
//  var exedo_script;
//  var title;
//  
//  
//  var ay = formName.split(" ");
//for(var ii = 0 ; ii < ay.length ; ii++){
//  var aFName = ay[ii];
//  var formJquery = $("#"+aFName);
//  var form = formJquery[0];
//  if(form==null){
//  	continue;
//  }
//  for (var i = 0; i < form.elements.length;i++)
//  {
//      el = form.elements[i];
//      var theValue = el.value;
//      var theId = el.id;
//      if(el.attributes["exedo_validconfig"])
//      {
//          exedo_validconfig = el.attributes["exedo_validconfig"].value;
//      }
//      else
//      {
//          exedo_validconfig = null;
//      }
//      if(el.attributes["exedo_notnull"])
//      {
//          exedo_notnull = el.attributes["exedo_notnull"].value;
//      }
//      else
//      {
//          exedo_notnull = null;
//      }
//      if(el.attributes["exedo_length"]){
// 	      	exedo_length = el.attributes["exedo_length"].value;
// 	    }else{
// 	      	exedo_length = null;
// 	    }
// 	    
// 	    if(el.attributes["exedo_script"]){
// 	      	exedo_script = el.attributes["exedo_script"].value;
// 	    }else{
// 	      	exedo_script = null;
// 	    }
//      
//      title = el.title;
//      if(title==null || title=="")
//      {
//      	if(el.attributes["msglabel"]!=null){
//      		title =  el.attributes["msglabel"].value;
//      	}
//      }
//      if(exedo_notnull!=null&& exedo_notnull=="NotNull")
//      {
//          theValue = $.trim(theValue);
//          if(el.type=='radio'  ||  el.type=='checkbox'){
//          	 var checks = formJquery.find("input:checked");
//          	 if(checks.size() == 0){
//          		 alert(title + EELang.required);
//	                 el.focus();
//          		 return false;
//          	 }
//          	 var isChecked = false;
//          	 checks.each(
//          			 function(i){
//          				 if($(this).attr("name")==el.name){
//          					 isChecked = true;
//          				 }            				             				 
//          			 }
//          	 );
//          	 if(!isChecked){
//          		 alert(title + EELang.required);
//	                 el.focus();
//          		 return false;
//          	 }
//          	
//          	
//          }else{         
//	            if(theValue==null || ""==theValue)
//	            {
//	                alert(title + EELang.required);
//	                el.focus();
//	                return false;
//	            }
//          }
//      }
//
//      if(theValue!=null && ""!=theValue)
//      {
//          if(exedo_validconfig!=null && exedo_validconfig.toLowerCase()=="email")
//          {
//              if(checkErrEmail(theValue))
//              {
//                  alert(EELang.vEmail);
//                  el.focus();
//                  return false;
//              }
//          }
//          if(exedo_validconfig!=null && exedo_validconfig.toLowerCase()=="url")
//          {
//              if(checkErrUrl(theValue))
//              {
//                  alert(EELang.vUrl);
//                  el.focus();
//                  return false;
//              }
//          }
//          if(exedo_validconfig!=null && (exedo_validconfig.toLowerCase()=="integer" ||  exedo_validconfig.toLowerCase()=="digits") )
//          {
//              if(checkErrNum(theValue))
//              {
//                  alert(title + EELang.vInt);
//                  el.focus();
//                  return false;
//              }
//          }
//          if(exedo_validconfig!=null && (exedo_validconfig.toLowerCase()=="realnumber" || exedo_validconfig.toLowerCase()=="number") )
//          {
//              if(checkErrFloat(theValue))
//              {
//                  alert(title + EELang.vNumber);
//                  el.focus();
//                  return false;
//              }
//          }
//          if(exedo_validconfig!=null && exedo_validconfig.toLowerCase()=="idcard")
//          {
//              var checkResult = checkIdCard(theValue);
//              if(checkResult!="yes")
//              {
//                  alert(checkResult);
//                  return false;
//              }
//          }
//          if(exedo_validconfig!=null && exedo_validconfig.toLowerCase()=="mobile")
//          {
//              if(checkNotMobile(theValue))
//              {
//                  alert(title + EELang.vMobile);
//                  el.focus();
//                  return false;
//              }
//          }
//          if(exedo_validconfig!=null && exedo_validconfig.toLowerCase()=="telphone")
//          {
//              if(checkNotTelphone(theValue))
//              {
//                  alert(title + EELang.vPhone);
//                  el.focus();
//                  return false;
//              }
//          }
//          
//          if(exedo_validconfig!=null && exedo_validconfig.toLowerCase()=="nochin")
//          {
//              if(funcChin(theValue))
//              {
//                  alert(title + EELang.vSBC);
//                  el.focus();
//                  return false;
//              }
//          }
//          
//          if(exedo_validconfig!=null && exedo_validconfig.toLowerCase()=="nosbcdot")
//          {
//              if(funcSBCDot(theValue))
//              {
//                  alert(title + EELang.vSBCDOT);
//                  el.focus();
//                  return false;
//              }
//          }
//
//          if(exedo_length!=null && ""!=exedo_length)
//          {
//              if(theValue.length>exedo_length)
//              {
//                  alert( title +EELang.vLeng+exedo_length+EELang.vLeng2);
//                  el.focus();
//                  return false;
//              }
//          }
//      }
//  }
// }
//}catch(e){
//   return false;
//}
//  return true;
//}



