$(function(){
  var repairlist = new Vue({
      el:"#repair",
      data:{
        lists:null,
        img:null,
        auth:null,
        exportUrl : baseURL + "/repairExport",
      },
      methods:{
          big:function(id){
              $.ajax({
                  type: "GET",
                  url: baseURL + '/repairClickShow',
                  data:{id:id},
                  success: function(data) {
                      //alert(JSON.stringify(data));
                      repairlist.img=data[0].background.split(',');
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
              cancel: function(id) {
              layer.confirm('确定删除？', function(){
                  var admin = 'admin';
                  // var name = 'admin';
                  // var choose = '审批';
                  var admin = 'admin';
                  var data = '{"people":"admin","choose":"撤销","id":""}';
                  data = JSON.parse(data);
                  // alert(data.people);
                  data.id = id;
                  admin = JSON.parse(JSON.stringify(admin));
                  // alert(JSON.stringify(data));
                  $.ajax({
                    type: "GET",
                    data: data,
                    url: baseURL + '/repairView/'+admin,
                    success: function(data) {
                      // alert(JSON.stringify(data.message));
                      layer.alert('删除成功！',{
                          icon: 1,
                      });
                      repair_list();
                    },
                    error: function(response) {
                      layer.alert('删除失败！'), {
                          icon: 2,
                      };
                    }
                  });
              })


            },
           finish: function(id) {
              // alert(id);
              var admin = 'admin';
              // var name = 'admin';
              // var choose = '审批';
              var admin = 'admin';
              var data = '{"people":"admin","choose":"维修完成","id":""}';
              data = JSON.parse(data);
              // alert(data.people);
              data.id = id;
              admin = JSON.parse(JSON.stringify(admin));
              // alert(JSON.stringify(data));
              $.ajax({
                type: "GET",
                data: data,
                url: baseURL + '/repairView/'+admin,
                success: function(data) {
                  // alert(JSON.stringify(data.message));
                  alert('操作成功');
                  repair_list();
                },
                error: function(response) {
                  alert('操作报修失败');
                }
              });

            },
            start: function(id) {
              var admin = 'admin';
              var admin = 'admin';
              var data = '{"people":"admin","choose":"开始维修","id":""}';
              data = JSON.parse(data);
              data.id = id;
              admin = JSON.parse(JSON.stringify(admin));
              $.ajax({
                type: "GET",
                data: data,
                url: baseURL + '/repairView/'+admin,
                success: function(data) {
                  alert('操作成功');
                  repair_list();
                },
                error: function(response) {
                  alert('操作报修失败');
                }
              });

            },
            //搜索
            search:function(){
              var createtime = $('#createtime').val();
              var people = $('#people').val();
              repair_list(createtime,people);
            }
      }
  });

//初始化报修列表
repair_list();
function repair_list(createtime,people){
      var param = {};
      if (createtime!='') param['createtime'] = createtime;
      if (people!='') param['people'] = people;
      $.ajax({
          type: "GET",
          url: baseURL + '/repairlist',
          data:param,
          success: function(data) {
            for(var i=0;i<data.length;i++){
              if(data[i].background){
                data[i].background=data[i].background.split(',');
              }else{
                data[i].background="";
              }
            }
            if (createtime!=undefined && (people==undefined||people=='')) {
              repairlist.exportUrl = baseURL + "/repairExport?createtime="+createtime;
            }else if((createtime==undefined||createtime=='') && people!=undefined && people!=''){
              repairlist.exportUrl = baseURL + "/repairExport?people="+people;
            }else if(createtime!=undefined && people!=undefined && createtime!='' && people!=''){
              repairlist.exportUrl = baseURL + "/repairExport?createtime="+createtime+"&people="+people;
            }else{
              repairlist.exportUrl = baseURL + "/repairExport";
            }
            repairlist.lists = data.slice(0,15);
            //alert(JSON.stringify(repairlist.lists));

           //分页
           layui.use('laypage',function(){
              var laypage=layui.laypage;
              laypage.render({
                  elem:"repairPage",
                  count:data.length,
                  limit:15,
                  layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'],
                  jump: function(obj, first){
                    //obj包含了当前分页的所有参数，比如：
                    // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                    // console.log(obj.limit); //得到每页显示的条数

                    //首次不执行
                    if(!first){
                      var start=(obj.curr-1)*obj.limit;
                      var end=obj.curr*obj.limit;
                      repairlist.lists = data.slice(start,end);
                    }
                }
              });
           });

          },
          error: function(response) {
            alert('无法加载报修列表！');
          }
        });
    }

    //检查权限
    authCheck();
    function authCheck(){
      $.ajax({
          type: "GET",
          url: baseURL + '/authCheck',
          data:{action:"repairList/edit"},
          success: function(data) {
              repairlist.auth = data.auth;
          },
          error: function(response) {
              layer.alert('失败,请重试',{
                  icon : 2,
              })
          },
      });
    }

    //
    var repairperson = new Vue({
      el:"#repairperson",
      data:{
        lists:null,
        auth:null
      },
      methods:{
            delauditor: function(id,index) {
            layer.confirm("确定删除？", function(){
                $.ajax({
                type: "GET",
                url: baseURL + '/delauditor/'+index,
                success: function(data) {
                //alert(JSON.stringify(data));
                  layer.alert('操作成功',{icon:1});
                  repair_person();
                },
                error: function(response) {
                  layer.alert('无法加载维修人员列表！',{icon:2});
                }
              });
            })


          }
      }
  });

 //初始化维修人员列表
repair_person();
function repair_person(){
     $.ajax({
        type: "GET",
        url: baseURL + '/auditorlist',
        success: function(data) {
         //alert(JSON.stringify(data));
         repairperson.lists = data;
        },
        error: function(response) {
          alert('无法加载维修人员列表！');
        }
      });
    }
   //检查权限
    authCheck1();
    function authCheck1(){
      $.ajax({
          type: "GET",
          url: baseURL + '/authCheck',
          data:{action:"repairPerson/edit"},
          success: function(data) {
              repairperson.auth = data.auth;
          },
          error: function(response) {
              layer.alert('失败,请重试',{
                  icon : 2,
              })
          },
      });
    }

 var addrepairperson = new Vue({
    el: "#addrepairperson",
    data: {
     organization: [],
      school: null,
      currentFunction: null,
      teacher: null,
      teachers: null,
      data: {},
      choosename:null
    },

    methods: {
      // 同步所有结构
      addrepairperson: function(data) {

      // alert(data.choosename);
      if(data.choosename == ""||data.choosename == undefined){
        alert("请输入维修人员姓名");
      }else{

          $.ajax({
          type: "GET",
          data:data,
          url: baseURL + '/confirmname',
          success: function(data) {
            // 返回教师信息
           //alert(JSON.stringify(data));
           addrepairperson.repairphone=data.phone;

          },
          error: function(data) {
            alert('请填写已绑定教师为维修人员');
            location.reload();
          }
        });

          }
        },
        addauditor: function(data){
            $.ajax({
            type: "GET",
            data:data,
            url: baseURL + '/auditor',
            success: function(data) {
              // 返回教师信息
               layui.use('layer', function(){
                  var layer = layui.layer;

                  layer.msg('保存成功',{icon: 1});
                });

              },
            error: function(data) {
              alert(data.responseJSON.message);
            }
          });
        }

    }
  });


});
