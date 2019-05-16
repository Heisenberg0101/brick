$(function(){
	var time = new Vue({
		el:"#time",
		data: {
            auth:null,
            plists:null
        },
		methods:{
			addtime:function(){
				layui.use(['layer','laydate'],function(){
					var layer = layui.layer;
					var laydate = layui.laydate;
				    layer.open({
					  type: 1,
					  title:"添加作息时间",
					  area: ['360px', '410px'],
					  btn:['提交'],
					  content: $('#timeTable'),
					  closeBtn: 1,
					  end: function(index, layero){
						   $('#timeTable').css({display:"none"});
						},
					  yes: function(index, layero){
						   	var tablename=$('#tablename').val();
						   	var tabletime=$('#tabletime').val();
					        if(tabletime==''){
					        	layer.alert('时间为空，不允许保存',{icon : 2});
					        	return false;
					        }
					        //新增作息时间
					        $.ajax({
					          	type:'POST',
    							url: baseURL + '/ProjectTimeSave',
					          	data:{
						            name:tablename,
						            tabletime:tabletime
					          	},
					          	success:function(data){
					             	layui.use('layer',function(){
						              	var layer = layui.layer;
						                layer.alert("新增成功！",{icon:1});
					            	})
					          	},
					          	error:function(){
					             	alert('新增失败！');
					          	}
					        });
					        beginProjectTime();
						   	layer.closeAll();
			 			}
					});
					laydate.render({
					  elem: '#tabletime',
					  type: 'time',
					  format: 'HH:mm',
					  range: true,
					});
				});
			},
			editNotice:function(id){
		        layui.use('layer',function(){
		            var layer = layui.layer;
		            layer.open({
		            type: 2,
		            title: '编辑',
		            area: ['550px', '470px'],
		            shade: 0,
		            content: './time_edit.html' + '?id=' + id,
		          });
		        });
	      	},
	      	 // 删除
            delpTime: function (id) {
                // 发送给后台删除
				layer.confirm("确定删除？", function(){
					$.ajax({
	                    type: "DELETE",
	                    url: baseURL + '/pTimeDel/' + id,
	                    success: function(data) {
	                        // 获取新数据赋值
	                        time.plists = data;
	                        // layui更新渲染
	                        layui.use(['form'], function(){
	                            var form = layui.form;
	                            form.render();
	                        });
	                        // 友好提示
	                        layer.alert('删除成功',{
	                            icon : 1,
	                        })
	                    },
	                    error: function(response) {
	                        // 友好提示
	                        layer.alert('删除失败,请重试',{
	                            icon : 2,
	                        })
	                    },
	                });
				})  
            },

		}
	});
	//检查权限
    authCheck();
    function authCheck(){
      $.ajax({
          type: "GET",
          url: baseURL + '/authCheck',
          data:{action:"timeTable/edit"},
          success: function(data) {
              time.auth = data.auth;
          },
          error: function(response) {
              layer.alert('失败,请重试',{
                  icon : 2,
              })
          },
      });
    }

    //初始化作息时间
   beginProjectTime();
   function beginProjectTime(){
   		$.ajax({
   			type:"GET",
   			url:baseURL + '/ProjectTime',
   			data:{},
   			success:function(data){
   				time.plists = data.show;
   			},
   			error:function(){
   				//alert("初始化教室管理失败！");
   			}
   		});
   }

});
