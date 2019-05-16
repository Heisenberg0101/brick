$(function(){
    // 巡查列表
    var patrollist = new Vue({
        el: "#box",
        data: {
            listimgurl : baseURL + "/patrolexcel",
            patrol_list_task: null,
            patrol_list_place: null,
            patrol_list_date: null,
            tasks: null,
            allplaces: null,
            places: null,
            date: null,
            lists: null,
            currentFunction: null,
            patrol_list_situation: null,
            img:null,
            auth:null
        },
        methods: {
         delete:function(id){
             layer.comfirm("确定删除？", function(){
                 $.ajax({
                     type:"GET",
                     url: baseURL + '/patrolDel/' + id,
                     success:function(){
                         layer.alert("删除成功！");
                         patrollistajax();
                     },
                     error:function(){
                         layer.alert("删除失败！");
                     }
                 });
             })

          },
          big:function(id){
                $.ajax({
                    type: "GET",
                    url: baseURL + '/patrolClickShow',
                    data:{id:id},
                    success: function(data) {
                        //alert(JSON.stringify(data));
                        patrollist.img=data[0].img.split(',');
                        //alert(JSON.stringify(patrollist.img));
                        var mySwiper = new Swiper('.swiper-container', {
                          observer: true,
                          observeParents: true,
                        });
                        $('#bigImg').css('opacity', 1);
                        $('#bigImg').css('z-index', 99);

                    }

                });
            },
            changetask:function () {
                // 巡查地点关联巡查任务切换
                patrollist.patrol_list_place = null;
                var task_id = patrollist.patrol_list_task;
                patrollist.places = patrollist.allplaces[task_id];
            },
            chooselist: function(){
                // 获取搜索条件
                var task_id = patrollist.patrol_list_task;
                var place_id = patrollist.patrol_list_place;
                var time = $("#patrol_list_date").val();
                var situation = $("#patrol_list_situation option:selected").val();
                var taskname = $("#taskname option:selected").html();
                // 发送给后台搜索
                $.ajax({
                    type: "POST",
                    url: baseURL + '/patrollist',
                    data:{task_id:task_id, place_id:place_id, time:time, situation:situation},
                    success: function(data) {
                        console.log(data)
                        for (var i = 0; i < data.length; i++) {
                            imgs = data[i].img.split(",");
                            if(!data[i].task_name){
                                data[i].img = imgs;
                                data[i].task_name = taskname;
                                data[i].place_name = data[i].place_id;
                            }else{
                                data[i].img = imgs;
                                continue;
                            }
                        }
                        // 获取巡查记录
                        patrollist.lists = data.slice(0,10);
						//alert(JSON.stringify(data));
                        patrollist.listimgurl = baseURL + "/patrolexcel?task_id="+task_id+"&place_id="+place_id+"&time="+time+"&situation="+situation;
						//获取列表总数
							patrollist.count=data.length;
							layui.use("laypage",function(){
							var laypage=layui.laypage;

							//实例化分页
							laypage.render({
								 elem: 'patrolPage1' //注意，这里的 test1 是 ID，不用加 # 号
								,count: patrollist.count //数据总数，从服务端得到
								,limit:10
								,limits:[5,10,15]
								,layout: ['count', 'prev', 'page', 'next', 'limit']
								,jump: function(obj, first){
									//obj包含了当前分页的所有参数，比如：
									var nowpage=obj.curr; //得到当前页，以便向服务端请求对应页的数据。
									var nownumber=obj.limit; //得到每页显示的条数
									  var start=(nowpage-1)*nownumber;
									  var end=nowpage*nownumber;
									  patrollist.lists = data.slice(start,end);
								  }
							});

						});
                    },
                    error: function(response) {
                        layer.alert('查询失败,请重试',{
                            icon : 2,
                        })
                    },
                });
            },

        },
    });

    patrollistajax();

    // Ajax请求数据方法
    function patrollistajax() {

        // 页面加载请求,打开遮罩层
        var index = layer.load(0, {
          shade: [0.2,'#fff']
        });
                layer.photos({
            photos: '.sss'
        });
        //请求搜索的巡查列表
        $.ajax({
            type: "GET",
            url: baseURL +'/patrollist',
            success: function(data){
               // alert(JSON.stringify(data.lists));
                // 获取巡查任务

                patrollist.tasks = data.tasks;
                // 获取所有巡查地点
                patrollist.allplaces = data.allplaces;
                for (var i = 0; i < data.lists.length; i++) {
                    imgs = data.lists[i].img.split(",");
                    if(data.lists[i].task_name == null){
                        data.lists[i].img = imgs;
                        data.lists[i].task_name = data.taskname;
                        data.lists[i].place_name = data.lists[i].place_id;
                    }else{
                        data.lists[i].img = imgs;
                        continue;
                    }
                }
                // 获取巡查记录
                patrollist.lists = data.lists.slice(0,10);
				//获取列表总数
				 patrollist.count=data.count;
				layui.use("laypage",function(){
					var laypage=layui.laypage;

					//实例化分页
					laypage.render({
						 elem: 'patrolPage1' //注意，这里的 test1 是 ID，不用加 # 号
						,count: patrollist.count //数据总数，从服务端得到
						,limit:10
						,limits:[5,10,20]
						,layout: ['count', 'prev', 'page', 'next', 'limit']
						,jump: function(obj, first){
							//obj包含了当前分页的所有参数，比如：
							var nowpage=obj.curr; //得到当前页，以便向服务端请求对应页的数据。
							var nownumber=obj.limit; //得到每页显示的条数


							if(!first){
							  var start=(nowpage-1)*nownumber;
							  var end=nowpage*nownumber;
							  patrollist.lists = data.lists.slice(start,end);
							}
						  }
					});

				});
                layer.close(index);
            },
            error: function () {
                layer.close(index);
                layer.alert('巡查任务加载失败，请重试',{
                    icon : 2,
                })
            }
        })
    }

    //检查权限
    authCheck1();
    function authCheck1(){
      $.ajax({
          type: "GET",
          url: baseURL + '/authCheck',
          data:{action:"patrolList/edit"},
          success: function(data) {
              patrollist.auth = data.auth;
          },
          error: function(response) {
              layer.alert('失败,请重试',{
                  icon : 2,
              })
          },
      });
    }


       // 添加巡查人员
    var patrolperson = new Vue({
        el: "#patrol_person",
        data: {
            name: null,
            phone: null,
            openID: null,
            persons: null,
            currentFunction: null,
            taskid: null,
            auth:null
        },
        methods: {
            // 添加巡查人员
            allotTask: function(uid) {
                console.log(uid);
                $("#nodeid").val(uid);
                //加载层
                index2 = layer.load(0, {shade: false}); //0代表加载的风格，支持0-2
                // 获取权限信息
                $.getJSON(baseURL + '/allotTask/'+uid, function(res){
                    console.log(res['taskid']);
                    patrolperson.taskid = res['taskid'];
                    layer.close(index2);
                    //页面层
                    index = layer.open({
                        type: 1,
                        area:['350px', '400px'],
                        title:'分配发布权限',
                        skin: 'layui-layer-demo', //加上边框
                        content: $('#task')
                    });
                     //设置zetree
                    var setting = {
                        check:{
                            enable:true,
                            chkStyle: "checkbox",
                            chkboxType: { "Y": "", "N": "" }
                        },
                        data: {
                            simpleData: {
                                enable: true
                            }
                        }
                    };
                    $.fn.zTree.init($("#treeTypeTask"), setting, res['task']);
                    var zTree = $.fn.zTree.getZTreeObj("treeTypeTask");
                    zTree.expandAll(true);
                });
            },
            // 添加巡查人员
            addperson: function () {
                var name = patrolperson.name;
                var phone = patrolperson.phone;
                var openID = patrolperson.openID;
                if (name == null) {
                    layer.alert('请选择教职员工姓名')
                }else{
                    // 发送给后台添加
                    $.ajax({
                        type: "POST",
                        url: baseURL + '/patrolperson',
                        data:{name:name, phone:phone, openID:openID},
                        success: function(data) {
                            // 获取新数据赋值
                            patrolperson.persons = data;
                            patrolperson.name = null;
                            // 清空输入框
                            $("#patrol_person_select").attr('selected', true);
                            $("#patrol_person_tel").val('');
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
            // 删除巡查人员
            delperson: function (id) {
                // 发送给后台删除
                layer.confirm("确定删除?", function(){
                    $.ajax({
                        type: "DELETE",
                        url: baseURL + '/patrolperson/' + id,
                        success: function(data) {
                            // 获取新数据赋值
                            patrolperson.persons = data;
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
            }
        }
    });


//巡查人员
  patrolpersonajax();
    // Ajax请求数据方法
    function patrolpersonajax() {
        // 页面加载请求,打开遮罩层
        var index = layer.load(0, {
          shade: [0.2,'#fff']
        });
        //请求地址列表
        $.ajax({
            type: "GET",
            url: baseURL + '/patrolperson',
            success: function(data) {
                // 获取已添加的教师
                // patrolperson.teachers = data.teacher;
                var teachers = data.teacher;
                var str = "";
                for (var i in teachers) {
                    str += "<option value='" + i +"'>" + teachers[i].name + "</option>";
                }
                $("#patrol_person_name").append(str);
                // layui
                layui.use(['form'], function(){
                    var form = layui.form;
                    // 监听select切换
                    form.on('select(teacher)', function(data){
                        var i = data.value;
                        if (i != '') {
                            patrolperson.name = teachers[i]['name'];
                            patrolperson.phone = teachers[i]['phone'];
                            patrolperson.openID = teachers[i]['openID'];
                        }else{
                            patrolperson.name = null;
                            patrolperson.phone = null;
                            patrolperson.openID = null;
                        }
                    });
                    // 更新layui渲染
                    form.render();
                });
                // 获取已添加的巡查人员
                patrolperson.persons = data.person;
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
    //确认分配
    $("#postformTask").click(function(){
        var zTree = $.fn.zTree.getZTreeObj("treeTypeTask");
        var nodes = zTree.getCheckedNodes(true);
        var NodeString = '';
        $.each(nodes, function (n, value) {
            if(n>0){
                NodeString += ',';
            }
          NodeString += value.id;
        });
        var uid = $("#nodeid").val();
        console.log(NodeString+' '+uid)
        console.log(patrolperson.taskid)
        var data = {};
        data.id = NodeString;
        data.uid = uid;
        if(patrolperson.taskid == NodeString ){
            layer.msg('无操作请点击右上角取消', {icon: 5});
            return false;
        }
        //写入库
        $.ajax({
          type: "POST",
          url: baseURL + '/allotTask',
          data:data,
          success: function(data) {
            layer.msg(data.message);
            layer.close(index);
          },
          error: function(response) {
            layer.alert(response.responseJSON.message,{
                icon : 5,
            })
          }
        });
    })

    //检查权限
    authCheck();
    function authCheck(){
      $.ajax({
          type: "GET",
          url: baseURL + '/authCheck',
          data:{action:"patrolPerson/edit"},
          success: function(data) {
              patrolperson.auth = data.auth;
          },
          error: function(response) {
              layer.alert('失败,请重试',{
                  icon : 2,
              })
          },
      });
    }

    // 巡查任务
    var patroltask = new Vue({
        el: "#patroltask",
        data: {
            lists: null,
            currentFunction: null,
        },
        methods: {
            // 添加巡查任务
            addtask: function () {
                // 获取表单数据
                var name = $("#patrol_task_name").val();
                var time = $("#patrol_task_time").val();
                // 发送给后台添加
                $.ajax({
                    type: "POST",
                    url: baseURL + '/patroltask',
                    data:{name:name, time:time},
                    success: function(data) {
                        // 获取新数据赋值
                        patroltask.lists = data;
                        // 清空输入框
                        $("#patrol_task_name").val('');
                        $("#patrol_task_time").val('');
                        // 友好提示
                        layer.alert('添加成功',{
                            icon : 1,
                        })
                    },
                    error: function(response) {
                        // 友好提示
                        layer.alert('添加失败,请重试',{
                            icon : 2,
                        })
                    },
                });
            },
            editpatrol:function(id){
                layui.use('layer', function(){
                  var layer = layui.layer;

                       layer.open({
                        type: 2,
                        shadeClose: true,
                        shade: false,
                        maxmin: true, //开启最大化最小化按钮
                        area: ['450px','400px'],
                        content: '../patroleditpublish.html'+ '?id=' + id

                    });
                });

            },
            // 删除巡查任务
            deltask: function (id) {
                // 发送给后台删除
                $.ajax({
                    type: "DELETE",
                    url: baseURL + '/patroltask/' + id,
                    success: function(data) {
                        // 获取新数据赋值
                        patroltask.lists = data;
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
            }
        }
    });

    patroltaskajax();
    // Ajax请求数据方法
    function patroltaskajax() {
        //请求地址列表
        $.ajax({
            type: "GET",
            url: baseURL + '/patroltask',
            success: function(data) {
                // 获取已添加的巡查任务
                patroltask.lists = data;
            },
            error: function(response) {
                layer.alert('巡查任务加载失败，请重试',{
                    icon : 2,
                })
            },
        });
    }

    // 巡查地点
    var patrolplace = new Vue({
        el: "#patrolplace",
        data: {
            lists: null,
            tasks: null,
            currentFunction: null,
        },
        methods: {
            // 添加巡查地点
            addplace: function () {
                // 获取表单数据
                var name = $("#patrol_place_name").val();
                var task_id = $("#patrol_place_task_id").val();
                // 发送给后台添加
                $.ajax({
                    type: "POST",
                    url: baseURL + '/patrolplace',
                    data:{name:name, task_id:task_id},
                    success: function(data) {
                        // 获取新数据赋值
                        patrolplace.lists = data;
                        // 清空输入框
                        $("#patrol_place_name").val('');
                        // 友好提示
                        layer.alert('添加成功',{
                            icon : 1,
                        })
                    },
                    error: function(response) {
                        // 友好提示
                        layer.alert('添加失败,请重试',{
                            icon : 2,
                        })
                    },
                });
            },
            editplace:function(id){
                layui.use('layer', function(){
                  var layer = layui.layer;

                       layer.open({
                        type: 2,
                        shadeClose: true,
                        shade: false,
                        maxmin: true, //开启最大化最小化按钮
                        area: ['450px','400px'],
                        content: '../patrolplacedit.html'+ '?id=' + id

                    });
                });

            },
            // 删除巡查地点
            delplace: function (id) {
                // 发送给后台删除
                $.ajax({
                    type: "DELETE",
                    url: baseURL + '/patrolplace/' + id,
                    success: function(data) {
                        // 获取新数据赋值
                        patrolplace.lists = data;
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
            }
        }
    });
    patrolplaceajax();
    // Ajax请求数据方法
    function patrolplaceajax() {
        // 页面加载请求,打开遮罩层
        var index = layer.load(0, {
          shade: [0.2,'#fff']
        });
        //请求地址列表
        $.ajax({
            type: "GET",
            url: baseURL + '/patrolplace',
            success: function(data) {
                var task = data.task;
                var place = data.place;
                // 获取巡查任务放置option
                patrolplace.tasks = task;
                // 获取已添加的巡查地点
                patrolplace.lists = place;
                // 关闭遮罩层
                layer.close(index);
            },
            error: function(response) {
                layer.close(index);
                layer.alert('巡查任务加载失败，请重试',{
                    icon : 2,
                })
            },
        });
    }


});
