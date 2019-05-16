$(function(){
	var book_editor = new Vue({
		el:"#book_editor",
		data:{
			editorData:null,
		 	name: null,
            phone: null,
            openID: null,
            persons: null,
		},
		methods:{
			edit:function(id){
				ope(2,'编辑','400px','420px',"./person_edit.html"+'?id='+id);
			},
			delete:function(id){
				layer.confirm("确定删除？", {fixed: false, shade: false}, function(){
					// 发送给后台删除
	   	          	$.ajax({
	   		              type: "DELETE",
	   		              url: baseURL + '/delEditor/' + id,
	   		              success: function(data) {

	               			book_editor.persons = data;
	   	                 	// // layui更新渲染
	   	                  	// layui.use(['form'], function(){
	   	                    //   	var form = layui.form;
	   	                    //   	form.render();
	   	                  	// });
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
		 	// 添加编辑员
            addperson: function (type) {
                var name = book_editor.name;
                var phone = book_editor.phone;
                var openID = book_editor.openID;
                if (name == null) {
                    layer.alert('请选择教职员工姓名')
                }else{
                    // 发送给后台添加
                    $.ajax({
                        type: "POST",
                        url: baseURL + '/addEditor',
                        data:{name:name, phone:phone, openID:openID,type:type},
                        success: function(data) {
                            // 获取新数据赋值
                            book_editor.persons = data;
                            book_editor.name = null;
                            // 清空输入框
                            $("#edit_person_select").attr('selected', true);
                            $("#edit_person_tel").val('');
                            // layui更新渲染
                            layui.use(['form'], function(){
                                var form = layui.form;
                                form.render();
                            });
                            // 友好提示
                            layer.alert('添加成功',{
                                icon : 1,
                            })
                        },
                        error: function(response) {
                            // 友好提示
                            layer.alert('添加失败或该用户已存在,请重试',{
                                icon : 2,
                            })
                        },
                    });
                }

            },
		}
	})

	//弹窗
	function ope(type,title,width,height,href){
		layui.use('layer',function(){
		var layer = layui.layer;
	    layer.open({
		  type: type,
		  title:title,
		  area: [width, height],
          shadeClose: true,
          fixed: false,
          shade: false,
		  content: href
		});
	});
   }


    ajaxEditor();
    // Ajax请求数据方法
    function ajaxEditor() {
        // 页面加载请求,打开遮罩层
        var index = layer.load(0, {
          shade: [0.2,'#fff']
        });
        //请求地址列表
        $.ajax({
            type: "GET",
            url: baseURL + '/ajaxEditorList',
            success: function(data) {
                // 获取已添加的教师
                var teachers = data.teacher;
                var str = "";
                for (var i in teachers) {
                    str += "<option value='" + i +"'>" + teachers[i].name + "</option>";
                }
                $("#edit_person_name").append(str);
                // layui
                layui.use(['form'], function(){
                    var form = layui.form;
                    // 监听select切换
                    form.on('select(teacher)', function(data){
                        var i = data.value;
                        if (i != '') {
                            book_editor.name = teachers[i]['name'];
                            book_editor.phone = teachers[i]['phone'];
                            book_editor.openID = teachers[i]['openID'];
                        }else{
                            book_editor.name = null;
                            book_editor.phone = null;
                            book_editor.openID = null;
                        }
                    });
                    // 更新layui渲染
                    form.render();
                });
                // 获取已添加的巡查人员
                book_editor.persons = data.person;
                layer.close(index);
            },
            error: function(response) {
                layer.close(index);
                layer.alert('巡查人员加载失败，请重试',{
                    icon : 2,
                })
            },
        });
    }

})
