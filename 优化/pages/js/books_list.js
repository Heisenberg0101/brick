$(function(){
	var books_list = new Vue({
		el:"#books_list",
		data:{
			lists:null,
			project:null,
			chapter:null,
		  class:null,
		  curr:null,
      lim:null,
      con:null,
      curr1:null,
      lim1:null,
      con1:null,
      type:null, //判断是否为搜索条件下的删除
      projectType:null,
      projectId:null,
      organizeID:null,
      term:null,
      stage:0,
      project1:'',
      project2:''
		},
		methods:{
			enter:function(){
				//跳转到添加课本页面
				window.location.href="./add_books.html";
			},
			detail:function(id){
				$.ajax({
		            type: "GET",
		            url: baseURL + '/oneClassBook/'+id,
		            success: function(data) {
		                books_list.chapter = data.introduction;
		  				$('#information').html(data.introduction);
		            },
		            error: function(response) {
		                layer.alert('课本列表加载失败，请重试',{
		                    icon : 2,
		                })
		            },
		        });
				ope('课本简介','#information','400px','450px');
			},
			edit:function(id){
				//编辑书本
				window.location.href="./edit_books.html"+ '?id=' + id;
			},
      removeClassBook: function (id) {
		  layer.confirm("确定删除？", {fixed: false, shade: false}, function(){
			  // 发送给后台删除
	          $.ajax({
	              type: "DELETE",
	              url: baseURL + '/bookDel/' + id,
	              success: function(data) {
	                  // 获取新数据赋值
	                  for(var i=0;i<data.length;i++){
	                  		if(data[i].coverImage){
	        	                data[i].coverImage= baseURL +'/public'+data[i].coverImage;
	                  		}
	        	        }
	                  if(books_list.type==0){
	                    var now=books_list.curr;
	                    var con=books_list.con;
	                    var number=books_list.lim;
	                    var start1=(now-1)*number;
	                    var end1=now*number;
	                    if(con%number==1 && con-start1==1){
	                      start1 = start1-number;
	                    }
	                    begin(start1,end1);
	                  }else{
	                    var now=books_list.curr1;
	                    var con=books_list.con1;
	                    var number=books_list.lim1;
	                    var start1=(now-1)*number;
	                    var end1=now*number;
	                    if(con%number==1 && con-start1==1){
	                      start1 = start1-number;
	                    }
	                    conditionbegin(start1,end1,books_list.projectType,books_list.projectId,books_list.organizeID,books_list.term);
	                  }

	                  layer.alert('删除成功!');

	              },
	              error: function(response) {
	                  layer.alert('删除失败,请重试!');
	              },
	          });
		  })

      },
      bind:function(id,projectId){
        $.ajax({
            type: "POST",
            url: baseURL + '/bindBooks',
            data:{
              id:id,
              projectId:projectId
            },
            success: function(response) {
              layui.use(['form'], function(){
                  var form = layui.form;
                  form.render();
              });
              layer.alert('绑定成功',{
                  icon : 1,
                  shadeClose: true,
                  fixed: false,
                  shade: false,
              });
              begin(0,10);
            },
            error: function(response) {
              layui.use('layer', function(){
                  var layer = layui.layer;
                    layer.msg('课程信息获取失败 !', {icon: 5});
                });
            }
        });
      },
      unbind:function(id,projectId){
        $.ajax({
            type: "POST",
            url: baseURL + '/unbindBooks',
            data:{
              id:id,
              projectId:projectId
            },
            success: function(response) {
              layui.use(['form'], function(){
                  var form = layui.form;
                  form.render();
              });
              layer.alert('解绑成功',{
                  icon : 1,
                  shadeClose: true,
                  fixed: false,
                  shade: false,
              });
              begin(0,10);
            },
            error: function(response) {
              layui.use('layer', function(){
                  var layer = layui.layer;
                    layer.msg('课程信息获取失败 !', {icon: 5});
                });
            }
        });
      },
		}
	})
	//页面初始化
	begin(0,10);
	function begin(start,end){
    //判断是否是幼儿园，幼儿园课程类型为普适性课程和园本课程
    $.ajax({
      type: "GET",
      url: baseURL + '/schoolInformationShow',
      success: function(response) {
          books_list.stage = response[0].stage;
          if (books_list.stage=='4') {
            books_list.project1 = '普适性课程';
            books_list.project2 = '园本课程';
          }else{
            books_list.project1 = '国家课程';
            books_list.project2 = '校本课程';
          }
      },
    });
		//获取全部课程列表
		$.ajax({
      	type: "GET",
      	url: baseURL + '/project',
      	success: function(response) {
          books_list.project = response;
      	},
      	error: function(response) {
         	layui.use('layer', function(){
             	var layer = layui.layer;
              	layer.msg('课程信息获取失败 !', {icon: 5});
            });
      	}
    });
    //获取年级
    $.ajax({
      	type: "GET",
      	url: baseURL + '/getClass',
      	success: function(response) {
          books_list.class = response;
      	},
      	error: function(response) {
         	layui.use('layer', function(){
             	var layer = layui.layer;
              	layer.msg('年级获取失败 !', {icon: 5});
            });
      	}
    });
    //课本列表
    $.ajax({
        type: "GET",
        url: baseURL + '/classBookList',
        success: function(data) {
          books_list.type=0;
        	for(var i=0;i<data.length;i++){
          		if(data[i].coverImage){
                  data[i].coverImage= baseURL +'/public'+data[i].coverImage;
          		}
          }
            books_list.lists = data.slice(start,end);
            layui.use('laypage', function(){
              var laypage = layui.laypage;
              laypage.render({
                   elem: 'pages'
                  ,count: data.length
                  ,limit:10
                  ,limits:[5,10,20]
                  ,curr:books_list.curr
                  ,layout: ['count', 'prev', 'page', 'next', 'limit']
                  ,jump: function(obj, first){
                    var nowpage=obj.curr;
                    var nownumber=obj.limit;
                    books_list.curr = obj.curr;
                    books_list.lim = obj.limit;
                    books_list.con = data.length;
                    if(!first){
                      var start=(nowpage-1)*nownumber;
                      var end=nowpage*nownumber;
                      books_list.lists =data.slice(start,end);
                    }
                 }
              });
            });
        },
        error: function(response) {
            layer.alert('课本列表加载失败，请重试',{
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
          fixed: false,
          shade: false,
          maxmin: true,
			  	content: $(obj),
			  	end: function(index, layero){
				   	$(obj).css({display:"none"});
				},
			});
		});
     }

     //搜索查询
    $("#chooselist").click(function(){
        books_list.type=1;
        var projectType = $("#projectType").val();
        var projectId = $("#projectId").val();
        var organizeID = $("#organizeID").val();
        var term = $("#term").val();
        books_list.projectType=projectType;
        books_list.projectId=projectId;
        books_list.organizeID=organizeID;
        books_list.term=term;
        conditionbegin(0,10,projectType,projectId,organizeID,term);

    })

    // 按条件搜索
    function conditionbegin(start,end,projectType,projectId,organizeID,term){
        // 发送给后台搜索
        $.ajax({
            type: "GET",
            url: baseURL + '/classBookList',
            data:{projectType:projectType,projectId:projectId,organizeID:organizeID,term:term},
            success: function(data) {
              for(var i=0;i<data.length;i++){
                if(data[i].coverImage){
                    data[i].coverImage= baseURL +'/public'+data[i].coverImage;
                }
             }
              books_list.lists = data.slice(start,end);

              layui.use('laypage', function(){
              var laypage = layui.laypage;
              laypage.render({
                   elem: 'pages'
                  ,count: data.length
                  ,limit:10
                  ,limits:[5,10,20]
                  ,curr:books_list.curr1
                  ,layout: ['count', 'prev', 'page', 'next']
                  ,jump: function(obj, first){
                    var nowpage=obj.curr;
                    var nownumber=obj.limit;
                    books_list.curr1 = obj.curr;
                    books_list.lim1= obj.limit;
                    books_list.con1 = data.length;
                    if(!first){
                      var start=(nowpage-1)*nownumber;
                      var end=nowpage*nownumber;
                      books_list.lists =data.slice(start,end);
                    }
                  }
                });
              });
            },
            error: function(response) {
                layer.alert('课本列表加载失败，请重试',{
                    icon : 2,
                })
            },
        });
    }

});
