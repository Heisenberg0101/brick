$(function() {
    var course = new Vue({
        el: "#classTable",
        data: {
        	organizationID: null,
            className: "",
            schedule: {},
            currentFunction: null,
            students: [],
            schoolYear: null,
            organize:null,
            auth:null,
            organizeID:0,
            isHeadmaster:null,
            exportUrl : baseURL + "/studentExport",
        },

        methods: {
            //添加学生
            addStudent:function(){
                layui.use('layer', function(){
                    var layer = layui.layer;
                       layer.open({
                        type: 2,
                        shadeClose: true,
                        shade: false,
                        maxmin: true, //开启最大化最小化按钮
                        area: ['400px','450px'],
                        content: './studentList_add.html?organizeID=' + $("#classId").val()
                    });
                });
            },
            //跳转学生档案
            skipStudent:function(studentId){
              window.location.href="studentFile.html?studentId="+studentId;
            },
            exportQRCode: function() {
                var classId = $("#classId").val();
                window.open("./qrcode.html?organizationID=" +  classId);
            },
            //删除学生信息
            deleteStudent: function(student) {
                // alert(student.ID);
                layer.confirm("请问是否要删除" + student.name + "的学生信息?",function(){
                    $.ajax({
                        type: "POST",
                        url: baseURL + '/deletestudent/'+student.ID,
                        success: function(data) {
                            layer.alert("已成功删除该学生信息",{
                                icon:1,
                            },function(){
                                location.reload();
                            });
                        },
                        error: function(data) {
                            layer.alert("删除失败",{icon:2});
                        }
                    });
                })
            },
            //修改学生用户
            editStudent:function(id){
                layui.use('layer', function(){
                  var layer = layui.layer;
                       layer.open({
                        type: 2,
                        shadeClose: true,
                        shade: false,
                        maxmin: true, //开启最大化最小化按钮
                        area: ['380px','400px'],
                        content: './studentList_edit.html'+ '?id=' + id
                    });
                });

            },
            removeRelationShip: function(student, parent) {
                if (!confirm("请问是否要解除" + student.name + parent.relationship + "的微信绑定?")) {
                    return;
                }

                $.ajax({
                    type: "DELETE",
                    url: baseURL + '/parentbind?parentID=' + parent.ID + "&studentID=" + student.ID,
                    success: function(response) {
                        student.parent.$remove(parent);
                    },
                    error: function(response) {
                        alert("解除" + student.name + parent.relationship + "的微信时出错！");
                    }
                });
            }

        }
    });

    // $("#classTable #downloadStudentTable").attr("href", baseURL + "/download/班牌系统学生名单模板.xls");
    $("#classTable #downloadStudentTable").attr("href", baseURL + "/download/学生信息模板.xls");

    studentajax();
    function studentajax(){

    	$.ajax({
            type: "GET",
            url: baseURL + '/teacherClass',
            success: function(response) {
                course.organize = response;
                course.organizeID = response[0]!=undefined?response[0].ID:response[1].ID;
                var  organizationID= args.id!=undefined?args.id:course.organizeID;
                //判断教师身份
                $.ajax({
                    type: "GET",
                    url: baseURL + '/teacherIdentity',
                    data: {
                        organizationID: organizationID
                    },
                    success: function(response) {
                        if (response == 'headmaster') {
                            course.isHeadmaster = true;
                        }else{
                            course.isHeadmaster = false;
                        }
                    },
                    error: function(response) {
                        // alert('您没有权限访问!');
                    }
                });
                if (args.studentId==undefined) {
                    $.ajax({
                        type: "GET",
                        url: baseURL + '/student',
                        data: {
                            organizationID: organizationID
                        },
                        success: function(data) {
                            // for (var i = 0; i < data.length; i++) {
                            //     data[i].name1 = ConvertPinyin(data[i].name);
                            // }
                            // data.sort(compare);
                            course.students = data;
                            course.exportUrl = baseURL + "/studentExport?organizationID="+organizationID;
                        }
                    });
                }else{
                    $.ajax({
                        type: "GET",
                        url: baseURL + '/student',
                        data: {
                            organizationID: organizationID,
                            studentId:args.studentId
                        },
                        success: function(data) {
                            // for (var i = 0; i < data.length; i++) {
                            //     data[i].name1 = ConvertPinyin(data[i].name);
                            // }
                            // data.sort(compare);
                            course.students = data;
                            course.exportUrl = baseURL + "/studentExport?organizationID="+organizationID+"&studentId="+args.studentId;
                        }
                    });
                }
            }
        });


    }

     //搜索查询
    $("#classId").change(function(){
        var classId = $("#classId").val();
        //判断教师身份
        $.ajax({
            type: "GET",
            url: baseURL + '/teacherIdentity',
            data: {
                organizationID: classId
            },
            success: function(response) {
                if (response == 'headmaster') {
                    course.isHeadmaster = true;
                }else{
                    course.isHeadmaster = false;
                }

            },
            error: function(response) {
                // alert('您没有权限访问!');
            }
        });
        // 发送给后台搜索
        $.ajax({
            type: "GET",
            url: baseURL + '/student',
            data:{organizationID:classId},
            success: function(data) {
                // for (var i = 0; i < data.length; i++) {
                //     data[i].name1 = ConvertPinyin(data[i].name);
                // }
                // data.sort(compare);
                course.students = data;
                course.exportUrl = baseURL + "/studentExport?organizationID="+classId;
            },
            error: function(response) {
                layer.alert('您查看的班级无学生信息！',{
                    icon : 2,
                })
            },
        });
    })

    //  // 绑定学生关系表
    // window.bindExcelImporter("uploadStudentTable");
    // // 接收到待上传数据
    // $(document).on("_importExcelFileuploadStudentTable", function(e, fileInfo) {
    //     var nowDate = new Date();
    //     var nowYear=nowDate.getFullYear();
    //     var nowMonth=nowDate.getMonth()+1;
    //     if(nowMonth<8){
    //       var time=nowYear-1;
    //     }else{
    //       var time=nowYear;
    //     }
    //     var sheets = fileInfo.result;
    //     var schoolYear = time;
    //     var columnNames = ["班号", "班级名称", "姓名", "学籍号", "身份证号", "学号", "出生日期", "性别", "籍贯", "家庭地址", "联系电话", "emisID"];
    //     var needColumnNames = ["班级名称", '身份证号', '姓名'];
    //     var parsedRows = [];
    //     var value;

    //     for (var sheetNo in sheets) {
    //         var sheet = sheets[sheetNo];
    //         for (var rowNo in sheet) {
    //             var row = sheet[rowNo];
    //             var lineNo = parseInt(rowNo) + 2;
    //             var parsedRow = {};

    //             for (var key in row) {
    //                 // 如果不在计划字段里面，跳过
    //                 if (columnNames.indexOf(key) == -1) {
    //                     continue;
    //                 }

    //                 value = row[key];
    //                 if (value.trim) {
    //                     value = value.trim();
    //                 }

    //                 // if (key == "班级名称") {
    //                 //     var className = value.match(/([一二三四五六七八九])[^\d]*(\d+)/);
    //                 //     value = className[1] + "(" + className[2] + ")班";
    //                 // }

    //                 parsedRow[key] = value;
    //             }

    //             for (var pos in needColumnNames) {
    //                 key = needColumnNames[pos];
    //                 value = parsedRow[key];
    //                 if (!value) {
    //                     alert("导入时发现错误，第" + lineNo + "行，缺少必填字段" + key + "，停止本次导入，所有数据未入库！");
    //                     return;
    //                 }
    //             }

    //             if (!parsedRow["学籍号"]){
    //               parsedRow["学籍号"] = parsedRow["身份证号"];
    //             }

    //             parsedRows.push(parsedRow);
    //         }
    //     }

    //     // 向服务器导入学生信息
    //     $.ajax({
    //         type: "POST",
    //         url: baseURL + '/studentImport',
    //         data: {
    //             schoolYear: time,
    //             excelDatas: JSON.stringify(parsedRows)
    //         },
    //         success: function(response) {
    //             // 刷新课程表
    //             $(document).trigger("_showClassTable", {
    //                 className: course.className,
    //                 organizationID: course.organizationID
    //             });

    //             // 提示
    //             alert("导入成功!");
    //         },
    //         error: function(response) {
    //             alert('提交学生信息表时出错!' + JSON.stringify(response));
    //         }
    //     });
    // });
     // 绑定学生关系表
    window.bindExcelImporter("uploadStudentTable");
    // 接收到待上传数据
    $(document).on("_importExcelFileuploadStudentTable", function(e, fileInfo) {
        var nowDate = new Date();
        var nowYear=nowDate.getFullYear();
        var nowMonth=nowDate.getMonth()+1;
        if(nowMonth<8){
          var time=nowYear-1;
        }else{
          var time=nowYear;
        }
        var sheets = fileInfo.result;
        var schoolYear = time;
        var columnNames = ["班级名称", "姓名","性别","身份证号", "学号", "IC卡号","登录账号","联系电话"];
        var needColumnNames = ["班级名称", '身份证号', '姓名'];
        var parsedRows = [];
        var value;

        for (var sheetNo in sheets) {
            var sheet = sheets[sheetNo];
            for (var rowNo in sheet) {
                var row = sheet[rowNo];
                var lineNo = parseInt(rowNo) + 2;
                var parsedRow = {};

                for (var key in row) {
                    // 如果不在计划字段里面，跳过
                    if (columnNames.indexOf(key) == -1) {
                        continue;
                    }

                    value = row[key];
                    if (value.trim) {
                        value = value.trim();
                    }

                    // if (key == "班级名称") {
                    //     var className = value.match(/([一二三四五六七八九])[^\d]*(\d+)/);
                    //     value = className[1] + "(" + className[2] + ")班";
                    // }

                    parsedRow[key] = value;
                }

                for (var pos in needColumnNames) {
                    key = needColumnNames[pos];
                    value = parsedRow[key];
                    if (!value) {
                        alert("导入时发现错误，第" + lineNo + "行，缺少必填字段" + key + "，停止本次导入，所有数据未入库！");
                        return;
                    }
                }

                // if (!parsedRow["学籍号"]){
                //   parsedRow["学籍号"] = parsedRow["身份证号"];
                // }

                parsedRows.push(parsedRow);
            }
        }
        // alert(JSON.stringify(parsedRows));return;
        // 向服务器导入学生信息
        $.ajax({
            type: "POST",
            url: baseURL + '/studentExcelImport',
            data: {
                schoolYear: time,
                excelDatas: JSON.stringify(parsedRows)
            },
            success: function(response) {
                // 刷新课程表
                $(document).trigger("_showClassTable", {
                    className: course.className,
                    organizationID: course.organizationID
                });

                // 提示
                alert("导入成功!");
                studentajax();
            },
            error: function(response) {
                alert('提交学生信息表时出错!' + JSON.stringify(response));
            }
        });
    });
    //检查权限
    authCheck();
    function authCheck(){
      $.ajax({
          type: "GET",
          url: baseURL + '/authCheck',
          data:{action:"studentList/edit"},
          success: function(data) {
            // alert(JSON.stringify(data.auth));
              course.auth = data.auth;
          },
          error: function(response) {
              layer.alert('失败,请重试',{
                  icon : 2,
              })
          },
      });
    }

    // var compare = function (obj1, obj2) {
	// 	var val1 = obj1.name1;
	// 	var val2 = obj2.name1;
	// 	if (val1 < val2) {
	// 		return -1;
	// 	} else if (val1 > val2) {
	// 		return 1;
	// 	} else {
	// 		return 0;
	// 	}
	// }

});
