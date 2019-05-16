$(function(){
	var conference_place = new Vue({
		el:"#conference_place",
		data:{
			lists:null
		},
		methods:{
			addconference:function(){
				ope('添加会议室','#conferencePlace');
			},
			// 编辑添加提交操作
			sub:function(){
				var addName = $('#addName').val();
				var addPlace = $('#addPlace').val();
				if(!addName || !addPlace){
					layer.alert('会议室名称和会议室位置为必填项！', {icon: 5});
					return;
				}
				var id = $('#is_operation').val();
				if(id != ''){
					// 编辑
					$.ajax({
					type:"POST",
					url:baseURL +'/editLocation',
					data:{
						id:id,
						location_name:addName,
						location_position:addPlace
					},
					success:function(data){
						layer.closeAll();
						$('#conferencePlace').css({display:"none"});
						// 清除标记
						$('#is_operation').val("");
						begin();
						layer.msg(data.message);
					},
					error:function(){
						layer.alert("保存失败！", {icon: 5});
					}
					});
				}else{
					// 添加
					$('#addName').val("");
					$('#addPlace').val("");
					$.ajax({
					type:"POST",
					url:baseURL +'/addLocation',
					data:{
						location_name:addName,
						location_position:addPlace
					},
					success:function(data){
						layer.closeAll();
						$('#conferencePlace').css({display:"none"});
						// 初始化
						begin();
						layer.msg(data.message);
					},
					error:function(){
						layer.alert("保存失败！", {icon: 5});
					}
					});
				}
			},
			located:function(id){
				var items = [];
				// var urlurl = "http://test.easyong.cn/admin/getlocation.html?p="+id;
				var urlurl = rawURL+"/admin/getlocation.html?p="+id;
				items.push('<a href="' + urlurl + '"></a>');
				$('#' + 'code').qrcode({
				 	text: urlurl,
				 	correctLevel : 1,
				});
				ope('定位','#located');
			},
			edit:function(location_name,location_position,id){
				$('#addName').val(location_name);
				$('#addPlace').val(location_position);
				$('#is_operation').val(id);
				ope('编辑会议室','#conferencePlace');
			},
			delete:function(id,name){
				layer.confirm('确定要删除会议室名称为['+name+']的记录吗?', function(index){
				  //do something
				  $.ajax({
					type:"POST",
					url:baseURL +'/delLocation',
					data:{
						id:id
					},
					success:function(data){
						// layer.msg(data.message);
						layer.alert("删除成功！", {
							icon: 1,
						})
						begin();
					},
					error:function(){
						layer.alert("删除会议室失败！", {icon: 5});
					}
				});
				  layer.close(index);
				});
			}
		},
		ready(){
			begin();
		}
	});
	// 列表
	function begin(){
		$.ajax({
			type:"GET",
			url:baseURL +'/getLocation',
			success:function(data){
				conference_place.lists = data;
			},
			error:function(){

			}
		});
	}
	//弹窗
	 function ope(title,obj){
   		layui.use('layer',function(){
			var layer = layui.layer;
		    name = layer.open({
			type: 1,
			title:title,
			area: ['600px', '500px'],
			content: $(obj),
			cancel: function(index,layero){
			    $('#conferencePlace').css({display:"none"});
			    $('#located').css({display:"none"});
			    $('#code').empty();
			},
			});
		});
   }

});
