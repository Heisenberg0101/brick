$(function () {
	var sport = new Vue({
		el: "#index",
		data: {
			lists: [],
			editList: []
		},
		methods: {
			// 添加
			add: function () {
				ope(1, '添加项目', $('.addPopUp'), '400px', '350px', $('.addPopUp'));
				//ope(1, '添加项目', '.addPopUp', $('.addPopUp'), '400px', '350px');
			},
			// 编辑
			edit: function (id) {
				ope(1, '修改项目', $('.popUp'), '400px', '350px', $('.popUp'));
				//ope(1, '修改项目', '.popUp', $('.popUp'), '400px', '350px');
				$.ajax({
					type: "GET",
					url: baseURL + '/criterionLat/' + id,
					success: function (data) {
						sport.editList = data;
					},
					error: function (response) {
						layer.alert('失败,请重试', {
							icon: 2,
							fixed: false
						})
					},
				});
			},
			//删除
			del: function (id) {
				layer.confirm("确定删除？", function(){
					$.ajax({
						type: "DELETE",
						url: baseURL + '/criterionLat/' + id,
						success: function (data) {
							layer.alert('删除成功！', {
								icon: 1,
								fixed: false
							})
							initPage();
						},
						error: function (response) {
							layer.alert('删除失败,请重试', {
								icon: 2,
								fixed: false
							})
						},
					});
				})
			},
			//提交添加
			subAdd: function () {
				var name = $('#name').val();
				var memo = $('#memo').val();
				if (!name) {
					alert("请填写纬度名称！"); return;
				}
				$.ajax({
					type: "POST",
					url: baseURL + '/criterionLat',
					data: {
						name: name,
						memo: memo
					},
					success: function (data) {
						layer.alert('保存成功！', {
							icon: 1,
						})
						initPage();
						layer.closeAll('page');
					},
					error: function (response) {
						layer.alert('失败,请重试', {
							icon: 2,
						})
						layer.closeAll('page');
					},
				});
			},
			//提交编辑
			subEdit: function (id) {
				var name = $('#nameEdit').val();
				var memo = $('#memoEdit').val();
				if (!name) {
					alert("请填写纬度名称！"); return;
				}
				$.ajax({
					type: "POST",
					url: baseURL + '/criterionLat',
					data: {
						name: name,
						memo: memo,
						id: id
					},
					success: function (data) {
						layer.alert('保存成功！', {
							icon: 1,
						})
						initPage();
						layer.closeAll('page');
					},
					error: function (response) {
						layer.alert('失败,请重试', {
							icon: 2,
						})
						layer.closeAll('page');
					},
				});
			},
		}
	});

	initPage();
	function initPage() {
		$.ajax({
			type: "GET",
			url: baseURL + '/criterionLat',
			data: { schoolYear: args.schoolYear },
			success: function (data) {
				sport.lists = data;
			},
			error: function (response) {
				layer.alert('失败,请重试', {
					icon: 2,
					fixed: false
				})
			},
		});
	}

})
