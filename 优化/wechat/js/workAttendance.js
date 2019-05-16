$(function(){
	var workAttendance = new Vue({
		el:"#workAttendance",
		data:{
			type:'上学签到',
			state:'勤',
			id:null,
			nowtime:null,
			students:null,
		},
		methods:{
			showType:function(id){
				//点击头像弹出考勤弹窗
				var obj = '.name'+id;
				workAttendance.id = obj;
				if(workAttendance.type == '上学签到'){
				    $('.normalWork').show();
				}else{
					$('.courseWork').show();
				}
			},
			sub:function(){
				// 获取当前时间
				$('#btnSub').attr('disabled', true);
		        $.ajax({
		            type: 'GET',
		            url: baseURL + '/wechattime',
		            success: function(data) {
		                workAttendance.nowtime = data;
		                var arr = [];
		             	var len = $('input[type="checkbox"]:checked').length;
						if(len){
							//部分提交
							for(var i=0;i<len;i++){
								arr[i] = [];
								var id = $('input[type="checkbox"]:checked').eq(i).parent().prev().find('input').val();
							    var type = $('input[type="checkbox"]:checked').eq(i).parent().prev().find('span').html();
							    //班级id
							    arr[i].push(args.ID);
							    //学生id
								arr[i].push(id);
								//考勤种类
								arr[i].push(type);
								//当前时间
								arr[i].push(workAttendance.nowtime);
							}
						}else{
							 // 全部提交
							for(var i=0;i<$('.name').length;i++){
							    arr[i] = [];
							   	//班级
								arr[i].push(args.ID);
								//学生id
								arr[i].push($('.studentId').eq(i).val());
								//考勤种类
								arr[i].push($('.type').eq(i).html());
								//当前时间
								arr[i].push(workAttendance.nowtime);
							}
						}

						//数据传到后台
						// alert(arr);return;
						//保存接口
						var interface = '';
						if (workAttendance.type=='上学签到') {
							interface = 'attenceSave';
						}else{
							interface = 'schoolAttendance';
						}
						//数据传到后台
						$.ajax({
							type:"post",
							url: baseURL + '/' + interface,
							data:{
								message:arr,
								openID:args.u
							},
							success:function(){
								layer.alert("考勤成功", {icon: 1}, function(){
									window.location.href = "./attendance/workAttendanceList.html?u="+ args.u +"&ID=" + args.ID
								});
							},
							error:function(){
								layer.alert("考勤失败", {icon: 2});
							}
						})
		            }
		        });
			}
		}
	})

	//加载学生列表
	begin();
	function begin(){
		//判断教师身份，只有班主任有权限考勤
		$.ajax({
            type: "GET",
            url: baseURL + '/student',
            data: {
                organizationID: args.ID
            },
            success: function(response) {
                for (var i = 0; i < response.length; i++) {
                	if(response[i].photo!=''){
                		 var photo = response[i].photo.substring(0,4);
				         if(photo == 'http'){
				            //微信端上传头像
				            response[i].photo = response[i].photo;
				          }
				          else{
				            //pc端上传头像
				            response[i].photo = baseURL +'/public'+ response[i].photo;
				          }
			        }
                }
                workAttendance.students = response;
                // $("#school").css('color','#3499DB');
            },
            error: function(response) {
                alert('加载学生清单时出错!');
            }
        });
	}

	//选择上学签到 考勤原因
	$('.normalWork li').click(function(){
		var html = $(this).html();
 		if(html == "已出勤"){
			html = '勤';
		}else if(html == "迟到"){
			html = '迟';
		}else if(html == "病假"){
			html = '病';
		}else if(html == "事假"){
			html = '事';
		}else{
			html = '缺';
		}
		$(workAttendance.id).html(html);
		$('.normalWork').hide();
		$(workAttendance.id).addClass('bak');
	})

	//选择放学签离 考勤原因
	$('.courseWork li').click(function(){
		var html = $(this).html();
 		if(html == "放学"){
			html = '放';
		}else{
			html = '留';
		}
		$(workAttendance.id).html(html);
		$('.courseWork').hide();
		$(workAttendance.id).addClass('bak');
	})

	//选择考勤类型
	$('.btn-group button').click(function(){
		$('.btn-group button').removeClass('active');
		$(this).addClass('active');
		var text = $(this).text();
		workAttendance.type = text;
		// $(this).css('color','#3499DB');
		if (workAttendance.type=='上学签到') {
			workAttendance.state = '勤';
		}else{
			workAttendance.state = '放';
		}
		//alert(workAttendance.type);
	})

})
