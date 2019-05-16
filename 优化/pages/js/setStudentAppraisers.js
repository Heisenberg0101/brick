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
	        var IDNumber = $("#IDNumber").val();
	        if (!IDNumber) {
	        	alert("请输入学生身份证号！");return;
	        }
            // 发送给后台添加
            $.ajax({
                type: "POST",
                url: baseURL + '/addStudentAssessor',
                data:{IDNumber:IDNumber},
                success: function(data) {
                    ajaxAssessorList();
                    // 友好提示
                    layer.alert('添加成功',{
                        icon : 1,
                        fixed:false,
                    })
                },
                error: function(response) {
                    // 友好提示
                    layer.alert(response.responseJSON,{
                        icon : 2,
                        fixed:false,
                    })
                },
            });
        },
        delete:function(id){
			layer.confirm("确定删除？", function(){
				// 发送给后台删除
		    	$.ajax({
		            type: "DELETE",
		            url: baseURL + '/delAssessor/' + id,
		            success: function(data) {
		              ajaxAssessorList();
		              // 友好提示
		              layer.alert('删除成功',{
		                  icon : 1,
	                    fixed:false,
		              })
		            },
		            error: function(response) {
		                // 友好提示
		                layer.alert('删除失败,请重试',{
		                    icon : 2,
	                      fixed:false,
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
            data:{type:1},//0教师  1学生
            success: function(data) {
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
