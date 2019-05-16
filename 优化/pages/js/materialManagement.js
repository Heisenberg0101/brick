$(function(){
	var materialManagement = new Vue({
		el:"#materialManagement",
		data:{
			auth:null,
			list:null,
			pageDetail:null,
			lists:null,
			isShow:0,
			curr:null,
		    lim:null,
		    con:null,
		},
		methods:{
			addMaterial:function(){
				window.location.href="addMaterial.html";
			},
			detail:function(id){
				layer.confirm("确定删除?", function(){
					$.ajax({
			          	type: "GET",
			          	url: baseURL + '/materialDetails/'+id,
			          	success: function(data) {
			              	materialManagement.pageDetail = data;
		  					$('#addDetail_text').html(data.description);
							layer.alert("删除成功！", {
								icon: 1,
							})
			          	},
			          	error: function(response) {
			              layer.alert('失败,请重试',{
			                  icon : 2,
			              })
			          	},
			      	});
				})

				ope("详情页面","#addDetail","400px",'480px');
			},
			edit:function(id){
				window.location.href="editMaterial.html"+'?id='+id;
			},
			removeM:function(id){
				layer.confirm("确定删除?", function(){
					//获取校本课程
					$.ajax({
			          	type: "GET",
			          	url: baseURL + '/removeMarterial/'+id,
			          	success: function(data) {
			          		var now=materialManagement.curr;
		                    var con=materialManagement.con;
		                    var number=materialManagement.lim;
		                    var start1=(now-1)*number;
		                    var end1=now*number;
		                    if(con%number==1 && con-start1==1){
		                      start1 = start1-number;
		                    }
	                    	begin(start1,end1);
	                    	layer.alert('删除成功!');
			          	},
			          	error: function(response) {
			              layer.alert('失败,请重试',{
			                  icon : 2,
			              })
			          	},
			      	});
				})

			},
			chooseProject:function(pId){
				$.ajax({
		          	type: "GET",
		          	url: baseURL + '/getMarterialByPid/'+pId,
		          	success: function(data) {
		              	materialManagement.list = data;
		              	for(var i=0;i< materialManagement.list.length;i++){
		                    materialManagement.list[i].picUrl =  materialManagement.list[i].picUrl.split(',');
		                }
		          	},
		          	error: function(response) {
		              layer.alert('失败,请重试',{
		                  icon : 2,
		              })
		          	},
		      	});
			},
			chooseType:function(tId){
				$.ajax({
		          	type: "GET",
		          	url: baseURL + '/getMarterialByTid/'+tId,
		          	success: function(data) {
		              	materialManagement.list = data;
	              	    for(var i=0;i< materialManagement.list.length;i++){
		                  materialManagement.list[i].picUrl =  materialManagement.list[i].picUrl.split(',');
		                }
		          	},
		          	error: function(response) {
		              layer.alert('失败,请重试',{
		                  icon : 2,
		              })
		          	},
		      	});
			},

		}
	});

	//检查权限
    authCheck();
    function authCheck(){
      	$.ajax({
          	type: "GET",
          	url: baseURL + '/authCheck',
          	data:{action:"materialManagement/edit"},
          	success: function(data) {
              materialManagement.auth = data.auth;
          	},
          	error: function(response) {
              layer.alert('失败,请重试',{
                  icon : 2,
              })
          	},
      	});
    }

    //弹窗
	function ope(title,obj,width,height){
		layui.use('layer',function(){
			var layer = layui.layer;
		    layer.open({
			  type: 1,
			  title:title,
			  area: [width, height],
			  shadeClose: true,
	          shade: false,
	          fixed: false,
			  content: $(obj),
			  end: function(index, layero){
				   $(obj).css({display:"none"});
				},
			});
		});
   	}

   	begin(0,10);
    function begin(start,end){
    	//获取校本课程
    	$.ajax({
	        type: "GET",
	        url: baseURL + '/getElective',
	        success: function(data) {
	            materialManagement.lists = data;

	        },
	        error: function(response) {
	          layer.alert('失败,请重试',{
	              icon : 2,
	          })
	        },
    	});
      	$.ajax({
          	type: "GET",
          	url: baseURL + '/materialList',
          	success: function(data) {
              	materialManagement.isShow = data.isShow;
	          	materialManagement.list = data.list.slice(start,end);
	          	for(var i=0;i< materialManagement.list.length;i++){
                     materialManagement.list[i].picUrl =  materialManagement.list[i].picUrl.split(',');
                 }
		            layui.use('laypage', function(){
		              var laypage = layui.laypage;
		              laypage.render({
		                   elem: 'pages'
		                  ,count: data.list.length//数据总数，从服务端得到
		                  ,limit:10
		                  ,limits:[5,10,20]
		                  ,curr:materialManagement.curr
		                  ,layout: ['count', 'prev', 'page', 'next', 'limit']
		                  ,jump: function(obj, first){
		                    var nowpage=obj.curr;
		                    var nownumber=obj.limit;
		                    materialManagement.curr = obj.curr;
		                    materialManagement.lim = obj.limit;
		                    materialManagement.con = data.list.length;
		                    if(!first){
		                      var start=(nowpage-1)*nownumber;
		                      var end=nowpage*nownumber;
		                      materialManagement.list =data.list.slice(start,end);
		                      for(var i=0;i< materialManagement.list.length;i++){
				                    materialManagement.list[i].picUrl =  materialManagement.list[i].picUrl.split(',');
				                }
		                    }
		                 }
		              });
		            });
          	},
          	error: function(response) {
              layer.alert('失败,请重试',{
                  icon : 2,
              })
          	},
      	});

    }

});
