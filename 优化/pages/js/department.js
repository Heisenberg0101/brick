$(function(){
	var index = null;
	var department = new Vue({
		el:"#department",
		data:{
			list:null
		},
		methods:{
			adddepartment:function(){
				index = ope("添加部门",'#departmentname');
			},
			departSub:function(){
				var depart = $('#depart').val();
				if(!depart){
					opeFail("部门名称为必填项！",5);
					return;
				}
				$.ajax({
					type:"POST",
					url: baseURL + '/departmentAdd',
					data:{
						department:depart
					},
					success:function(){
						opeFail("部门添加成功！",6);
						begin();
						layer.closeAll('page');
					},
					error:function(){
						opeFail("部门添加失败！",5);
					}
				})
			},
			delet:function(id){
				layer.confirm("确定删除？", function() {
					$.ajax({
						type:"GET",
						url: baseURL + '/departmentDel/' + id,
						success:function(){
							// opeFail("删除成功！",6);
							layer.alert("删除成功！", {
								icon: 1,
							})
							begin();
						},
						error:function(){
							// opeFail("部门删除失败！",5);
							layer.alert("删除失败！", {
								icon: 2,
							})
						}
					});
				})
			},
			edit:function(id){
				 layui.use('layer', function(){
                  var layer = layui.layer;
                       layer.open({
                        type: 2,
                        shadeClose: true,
                        shade: false,
                        maxmin: true, //开启最大化最小化按钮
                        area: ['390px', '370px'],
                        content: './department_edit.html?id=' + id
                    });
                });
			}
		}
	});

	//初始化部门设置
	begin();
	function begin(){
		$.ajax({
			type:"GET",
			url: baseURL + '/departmentShow',
			success:function(data){
				department.list=data;
				//alert(JSON.stringify(data));
			},
			error:function(){
				opeFail("部门列表获取失败！",5);
			}
		});
	}

	//失败提示弹窗
	function opeFail(text,num){
		layui.use('layer', function(){
		  var layer = layui.layer;
		  layer.alert(text,{icon:num});
		});
	}

	//弹窗
	function ope(title,obj){
   		layui.use('layer',function(){
			var layer = layui.layer;
		    layer.open({
			  type: 1,
			  title:title,
			  area: ['390px', '370px'],
			  content: $(obj),
			  end: function(index, layero){
				   $(obj).css({display:"none"});
				},
			});
		});
   }

});
