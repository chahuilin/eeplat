<#assign datatojson = "com.exedosoft.plat.template.Data2Json"?new()/> 
<#assign dataBind = "com.exedosoft.plat.template.BindData2FormModel"?new()/>  
<div id='${model.objUid}' class='wh100'>

</div>

<script>

(function(sid){
	var jq1 = $('#' +　sid);
	console.log(sid);
	var myChart = echarts.init(jq1.get(0));
	
	option = {
		    title : {
		        text: '${model.caption}',
		        x:'center'
		    },
		    tooltip : {
		        trigger: 'item',
		        formatter: "{a} <br/>{b} : {c} ({d}%)"
		    },
		    legend: {
		        orient : 'vertical',
		        x : 'left',
		        data: ${names}
		    },
		    toolbox: {
			        show : true,
                    feature : {
                        //mark : true,
                        dataView : {readOnly: false},
                        //magicType:['line', 'bar'],
                        restore : true,
                        saveAsImage : true
                    }
			    },
		    calculable : false,
		    series : [
		        {
		            name:'${model.headTitle}',
		            type:'pie',
		            data:${nameValues}
		        }
		    ]
		};
        myChart.setOption(option);
        
        $(window).resize(function(){
			myChart.resize();
		});
})('${model.objUid}');
</script>