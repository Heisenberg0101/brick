$(function(){
	var settingAppraisers = new Vue({
		el:"#settingAppraisers",
		data:{
          name: null,
          phone: null,
          openID: null,
          persons: null,
          id:null
        },
		methods:{
      //添加考评员
      addperson: function () {
          var name = settingAppraisers.name;
          var phone = settingAppraisers.phone;
          var openID = settingAppraisers.openID;
          if (name == null) {
              layer.alert('请选择教职员工姓名')
          }else{
              // 发送给后台添加
              $.ajax({
                  type: "POST",
                  url: baseURL + '/addAssessor',
                  data:{name:name, phone:phone, openID:openID},
                  success: function(data) {
                      // 获取新数据赋值
                      settingAppraisers.persons = data;
                      settingAppraisers.name = null;
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
      delete:function(id){
		  layer.confirm("确定删除?", function(){
			  // 发送给后台删除
	          $.ajax({
	              type: "DELETE",
	              url: baseURL + '/delAssessor/' + id,
	              success: function(data) {
	                ajaxAssessorList();
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
      //分配班级
      task:function(id){
          settingAppraisers.id = id;
          $.getJSON(baseURL + '/getAssessorOrganization',{'uid':id}, function(res){
             ope('适用范围',$('#task'),'400px','415px');
              //设置zetree
              var setting = {
                  check:{
                      enable:true,
                      chkStyle: "checkbox",
                      chkboxType: { "Y": "s", "N": "ps" }
                  },
                  data: {
                      simpleData: {
                          enable: true
                      }
                  }
              };

              $.fn.zTree.init($("#treeType"), setting, res);
              var zTree = $.fn.zTree.getZTreeObj("treeType");
              zTree.expandAll(false);

          });
      },
      //确认分配班级
      sub:function(){
        //获取选择班级情况
        var zTree = $.fn.zTree.getZTreeObj("treeType");
        var nodes = zTree.getCheckedNodes(true);
        var NodeString = '';
        var organizeID = '';
        // alert(noticitons.ID);
        $.each(nodes, function (n, value) {
            var status = value.getCheckStatus(true);
            if(!status.half){
                if(n>0){
                    NodeString += ',';
                }
                NodeString += value.id;
            }
        });
        // alert(NodeString);return;
        $.ajax({
          type:"POST",
          url: baseURL + '/addAssessor',
          data:{
            id:settingAppraisers.id,
            organizeIDs:NodeString
          },
          success:function(data){
            ajaxAssessorList();
            layer.closeAll('page');
            layui.use('layer',function(){
              var layer = layui.layer;
              layer.alert('分配班级成功！', {icon: 1,fixed: false,});
            });
          },
          error:function(){
            layui.use('layer',function(){
              var layer = layui.layer;
              layer.alert('分配班级失败！', {icon: 5,fixed: false,});
            });
          }
        });
      }
		}
	})

    //弹窗
    function ope(title,obj,width,height,left){
        layui.use('layer',function(){
            var layer = layui.layer;
            layer.open({
              type: 1,
              title:title,
              area: [width, height],
              content: $(obj),
              offset: left,
              shadeClose: true,
              fixed: false,
              shade: false,
              end: function(index, layero){
                   $(obj).css({display:"none"});
                },
            });
        });
   }

    ajaxAssessorList();
    // Ajax请求数据方法
    function ajaxAssessorList() {
        // 页面加载请求,打开遮罩层
        var index = layer.load(0, {
          shade: [0.2,'#fff']
        });
        //请求地址列表
        $.ajax({
            type: "GET",
            url: baseURL + '/ajaxAssessorList',
            data:{type:0},//0教师  1学生
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
                            settingAppraisers.name = teachers[i]['name'];
                            settingAppraisers.phone = teachers[i]['phone'];
                            settingAppraisers.openID = teachers[i]['openID'];
                        }else{
                            settingAppraisers.name = null;
                            settingAppraisers.phone = null;
                            settingAppraisers.openID = null;
                        }
                    });
                    // 更新layui渲染
                    form.render();
                });
                // 获取已添加的巡查人员
                settingAppraisers.persons = data.person;
                layer.close(index);
            },
            error: function(response) {
                layer.close(index);
                layer.alert('考评人员加载失败，请重试',{
                    icon : 2,
                })
            },
        });
    }
});
