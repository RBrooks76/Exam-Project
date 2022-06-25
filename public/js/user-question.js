
var UserQuestion = function () {

    var id_list;
    $(document).ready(function (e) {

        id_list = $('.main-content').map(function () {
            return $(this).attr('id');
        });

        var tid = 0;
        var tval = 0;
        var tj = 0;
        if(id_list.length == 0)
            return;
        for (var t = 0; t < id_list.length; t++) {
            if ($("#" + id_list[t]).find(".logic_cnt").val() == 0)
                $("#" + id_list[t]).show();
            else {
                $("#" + id_list[t]).hide();

            }
            var logic_val = 0;
            var cnt = $("#" + id_list[t]).find(".logic_cnt").val();

            for (var j = 0; j < cnt; j++) {
                var current_val = 0;
                var logic_qt_id = "q_" + $("#" + id_list[t]).find(".logic_" + j + " .logic_qt").val();
                var logic_val = $("#" + id_list[t]).find(".logic_" + j + " .logic_cont").val();
                var qt_existed = 0;
                for (var k = 0; k < id_list.length; k++) {
                    if (logic_qt_id == id_list[k])
                        qt_existed = 1;
                }

                if (qt_existed == 0) {
                    tid = t;
                    tval = logic_val;
                    tj = j;

                    $.ajax({
                        data: {question_id: logic_qt_id.split('_')[1]},
                        url: "../get_answer",
                        type: "GET",
                        dataType: 'json',
                        success: function (response) {
                            if (response.length > 0) {
                                current_val = response[0]['answer'];
                                if (tval == current_val) {
                                    $('#' + id_list[tid] + " .logic_" + tj + " .logic_state").val(1);
                                } else
                                    $('#' + id_list[tid] + " .logic_" + tj + " .logic_state").val(0);
                            } else
                                $('#' + id_list[tid] + " .logic_" + tj + " .logic_state").val(0);
                        }
                    });
                }
            }
        }
    });

    $(document).on('change', 'form', function (e) {
        var get_answer_id = 0;
        if(id_list.length == 0)
            return;

        for (var i = 0; i < id_list.length; i++) {

            var logic_val = 0;
            var cnt = $("#" + id_list[i]).find(".logic_cnt").val();

            for (var j = 0; j < cnt; j++) {
                var current_val = 0;
                var logic_qt_id = "q_" + $("#" + id_list[i]).find(".logic_" + j + " .logic_qt").val();
                logic_val = $("#" + id_list[i]).find(".logic_" + j + " .logic_cont").val();
                var qt_existed = 0;
                for (var k = 0; k < id_list.length; k++) {
                    if (logic_qt_id == id_list[k])
                        qt_existed = 1;
                }

                if (qt_existed != 0) {

                    var qt_type = $("#" + logic_qt_id).find(".qt_type").val();

                    if (qt_type == 0) {
                        var current_val = $.trim($("#" + logic_qt_id).find("textarea").val());
                    } else if (qt_type == 1) {
                        current_val = 0;
                        var len = $('#' + logic_qt_id).find(".check_content").children().length;

                        for (var k = 1; k <= len; k++) {
                            if ($('#' + logic_qt_id + ' .check_content .checkbox_' + k).is(':checked') == true)
                                current_val += Math.pow(2, len - k);
                        }

                    } else if (qt_type == 2) {
                        current_val = 0;
                        var len = $('#' + logic_qt_id).find(".radio_content").children().length;

                        for (var k = 1; k <= len; k++) {
                            if ($('#' + logic_qt_id + ' .radio_content .radio_' + k + ':checked').val() == "on")
                                current_val += Math.pow(2, len - k);
                        }
                    } else if (qt_type == 3) {
                        current_val = 0;
                        var len = $('#' + logic_qt_id).find(".image_content").children().length;

                        for (var k = 1; k <= len; k++) {
                            if ($('#' + logic_qt_id + ' .image_content .imagebox_' + k).is(':checked') == true)
                                current_val += Math.pow(2, len - k);
                        }
                    } else {
                        current_val = [];
                        current_val = $('#' + logic_qt_id).find("input[type='text']").map(function () {
                            return $(this).val();
                        });

                    }
                }

                var logic_operator = $('#' + id_list[i]).find(".logic_" + j + " .logic_operator").val();

                if (logic_operator == 0) //equals
                {
                    if (qt_type == 4) {
                        for (var t = 0; t < current_val.length; t++) {
                            if (logic_val == current_val[t]) {
                                $('#' + id_list[i] + " .logic_" + j + " .logic_state").val(1);
                                break;
                            } else
                                $('#' + id_list[i] + " .logic_" + j + " .logic_state").val(0);
                        }
                    } else {
                        if (logic_val == current_val) {
                            $('#' + id_list[i] + " .logic_" + j + " .logic_state").val(1);
                        } else
                            $('#' + id_list[i] + " .logic_" + j + " .logic_state").val(0);
                    }


                } else if (logic_operator == 1) //not equals
                {

                    if (qt_type == 4) {
                        for (var t = 0; t < current_val.length; t++) {
                            if (logic_val != current_val[t]) {
                                $('#' + id_list[i] + " .logic_" + j + " .logic_state").val(1);
                                break;
                            } else
                                $('#' + id_list[i] + " .logic_" + j + " .logic_state").val(0);
                        }

                    } else {
                        if (logic_val != current_val) {
                            $('#' + id_list[i] + " .logic_" + j + " .logic_state").val(1);
                        } else
                            $('#' + id_list[i] + " .logic_" + j + " .logic_state").val(0);
                    }
                } else if (logic_operator == 2) //contains
                {

                    if (qt_type == 4) {
                        for (var t = 0; t < current_val.length; t++) {
                            if (current_val[t].includes(logic_val) == true) {
                                $('#' + id_list[i] + " .logic_" + j + " .logic_state").val(1);
                                break;
                            } else
                                $('#' + id_list[i] + " .logic_" + j + " .logic_state").val(0);
                        }
                    } else {
                        if (current_val.includes(logic_val) == true) {
                            $('#' + id_list[i] + " .logic_" + j + " .logic_state").val(1);
                        } else
                            $('#' + id_list[i] + " .logic_" + j + " .logic_state").val(0);
                    }
                } else if (logic_operator == 3) //not contains
                {
                    if (qt_type == 4) {
                        for (var t = 0; t < current_val.length; t++) {
                            if (current_val[t].includes(logic_val) == false) {
                                $('#' + id_list[i] + " .logic_" + j + " .logic_state").val(1);
                                break;
                            } else
                                $('#' + id_list[i] + " .logic_" + j + " .logic_state").val(0);
                        }
                    } else {
                        if (current_val.includes(logic_val) == false) {
                            $('#' + id_list[i] + " .logic_" + j + " .logic_state").val(1);
                        } else {
                            $('#' + id_list[i] + " .logic_" + j + " .logic_state").val(0);
                        }

                    }
                } else if (logic_operator == 4) //greater
                {
                    if (qt_type == 4) {
                        for (var t = 0; t < current_val.length; t++) {
                            if (current_val[t] > parseFloat(logic_val)) {
                                $('#' + id_list[i] + " .logic_" + j + " .logic_state").val(1);
                                break;
                            } else
                                $('#' + id_list[i] + " .logic_" + j + " .logic_state").val(0);

                        }
                    } else {
                        if (current_val > parseFloat(logic_val)) {
                            $('#' + id_list[i] + " .logic_" + j + " .logic_state").val(1);
                        } else
                            $('#' + id_list[i] + " .logic_" + j + " .logic_state").val(0);
                    }
                } else if (logic_operator == 5) //less
                {
                    if (qt_type == 4) {
                        for (var t = 0; t < current_val.length; t++) {
                            if (current_val[t] < parseFloat(logic_val)) {
                                $('#' + id_list[i] + " .logic_" + j + " .logic_state").val(1);
                                break;
                            } else
                                $('#' + id_list[i] + " .logic_" + j + " .logic_state").val(0);
                        }
                    } else {
                        if (current_val < parseFloat(logic_val)) {
                            $('#' + id_list[i] + " .logic_" + j + " .logic_state").val(1);
                        } else
                            $('#' + id_list[i] + " .logic_" + j + " .logic_state").val(0);
                    }

                } else if (logic_operator == 6) //greater or equals
                {
                    if (qt_type == 4) {
                        for (var t = 0; t < current_val.length; t++) {
                            if (current_val[t] >= parseFloat(logic_val)) {
                                $('#' + id_list[i] + " .logic_" + j + " .logic_state").val(1);
                                break;
                            } else
                                $('#' + id_list[i] + " .logic_" + j + " .logic_state").val(0);
                        }
                    } else {
                        if (current_val >= parseFloat(logic_val)) {
                            $('#' + id_list[i] + " .logic_" + j + " .logic_state").val(1);
                        } else
                            $('#' + id_list[i] + " .logic_" + j + " .logic_state").val(0);

                    }
                } else if (logic_operator == 7) //less or equals
                {
                    if (qt_type == 4) {
                        for (var t = 0; t < current_val.length; t++) {
                            if (current_val[t] <= parseFloat(logic_val)) {
                                $('#' + id_list[i] + " .logic_" + j + " .logic_state").val(1);
                                break;
                            } else
                                $('#' + id_list[i] + " .logic_" + j + " .logic_state").val(0);
                        }
                    } else {
                        if (current_val <= parseFloat(logic_val)) {
                            $('#' + id_list[i] + " .logic_" + j + " .logic_state").val(1);
                        } else
                            $('#' + id_list[i] + " .logic_" + j + " .logic_state").val(0);
                    }
                }

            }

            var current_state = 0;
            for (var j = 0; j < cnt; j++) {
                var logic_type = $('#' + id_list[i]).find(".logic_" + j + " .logic_type").val();

                if (j == 0)
                    current_state = parseInt($('#' + id_list[i]).find(".logic_" + j + " .logic_state").val());

                if (logic_type == 0)
                    current_state *= parseInt($('#' + id_list[i]).find(".logic_" + j + " .logic_state").val());
                else
                    current_state += parseInt($('#' + id_list[i]).find(".logic_" + j + " .logic_state").val());
            }

            if (current_state != 0)
                $('#' + id_list[i]).show();
            else if ($('#' + id_list[i]).find(".logic_cnt").val() != 0)
                $('#' + id_list[i]).hide();
        }
    });

    $(document).on('click', '#answer_submit', function (e) {
        var current_val = [];

        for (var i = 0; i < id_list.length; i++) {
            var qt_type = $("#" + id_list[i]).find(".qt_type").val();
            if (qt_type == 0) {
                current_val[i] = $.trim($("#" + id_list[i]).find("textarea").val());

            } else if (qt_type == 1) {
                current_val[i] = 0;

                var len = $('#' + id_list[i]).find(".check_content").children().length;

                for (var k = 1; k <= len; k++) {
                    if ($('#' + id_list[i] + ' .check_content .checkbox_' + k).is(':checked') == true)
                        current_val[i] += Math.pow(2, len - k);
                }
            } else if (qt_type == 2) {
                current_val[i] = 0;
                var len = $('#' + id_list[i]).find(".radio_content").children().length;
                for (var k = 1; k <= len; k++) {
                    if ($('#' + id_list[i] + ' .radio_content .radio_' + k + ':checked').val() == "on")
                        current_val[i] += Math.pow(2, len - k);
                }
            } else if (qt_type == 3) {
                current_val[i] = 0;
                var len = $('#' + id_list[i]).find(".image_content").children().length;

                for (var k = 1; k <= len; k++) {
                    if ($('#' + id_list[i] + ' .image_content .imagebox_' + k).is(':checked') == true)
                        current_val[i] += Math.pow(2, len - k);
                }
            } else {
                current_val[i] = []
                dd = $('#' + id_list[i]).find("input[type='text']").map(function () {
                    return $(this).val();
                });
                for (var k = 0; k < dd.length; k++)
                    current_val[i].push(dd[k]);
            }
        }

        var question_id = [];

        for (var k = 0; k < id_list.length; k++) {
            question_id[k] = id_list[k].split('_')[1];
        }
        data = {
            'question_id': question_id,
            'answer': JSON.stringify(current_val),
            'test_id': $("#test_id").val()
        };

        e.preventDefault();

        $.ajax({
            data: {data: data},
            url: "../store_answer",
            type: "GET",
            dataType: 'json',
            success: function (response) {
                $("#textresult").text(response.report_data[0]['origin_content']);

            },
            error: function (response) {
                console.log('Error:', response);
            }
        });
        //location.reload();
    });

    let user_question;
    let user_textgroup;
    let textgroup_data;
    let arr = [];
    let textgroup_ids = [];
    let answers = [];
    let scores = [];

    $(document).on('click', '#create-report', function (e) {
        arr = [];
        var single_input_ids = $('input[name^=single_input]').map(function (idx, elem) {
            return $(elem).attr('id');
        }).get();
        var radiogroup_id = $('input[name^=radiogroup]:checked').map(function (idx, elem) {
            return $(elem).attr('id');
        }).get();
        var img_radiogroup_id = $('input[name^=imgradiogroup]:checked').map(function (idx, elem) {
            return $(elem).attr('id');
        }).get();

        var checkbox = $('input[type^=checkbox]:checked').map(function (idx, elem) {
            return $(elem).attr('id');
        }).get();
        var rating = $('input[name^=b_rating]').map(function (idx, elem) {
            if ($(elem).data('selected')) {
                return $(elem).data('qid');
            }
        }).get();
        var dropdown = $('.dropdown').map(function (idx, elem) {
            return $(elem).attr('id');
        }).get();
        var stars = $('.starinput').map(function (idx, elem) {
            return $(elem).data('qid');
        }).get();
        var files = $('input[name^=files]').map(function (idx, elem) {
            return $(elem).attr('id');
        }).get();
        var ranges = $('input[name^=b_range]').map(function (idx, elem) {
            return $(elem).data('id');
        }).get();
        var matrix = $('table[name^=matrix]').map(function (idx, elem) {
            return $(elem).data('id');
        }).get();
        var images = $('input[name^=images]').map(function (idx, elem) {
            return $(elem).attr('id');
        }).get();
        var count = 0;
        $.each(img_radiogroup_id, function (i, v) {
            if ($("#" + v).val() != "") {
                var obj = {};
                obj.key = v;
                obj.qid = v;
                obj.value = $('input[name^=imgradiogroup]:checked').val().trim();
                arr.push(obj);
                // arr[v] = $("#"+v).val().trim();
            }
        });
        $.each(single_input_ids, function (i, v) {
            if ($("#" + v).val() != "") {
                var obj = {};
                obj.key = v;
                obj.qid = v;
                obj.value = 0;//$("#"+v).val().trim();
                arr.push(obj);
                // arr[v] = $("#"+v).val().trim();
            }
        });
        $.each(radiogroup_id, function (i, v) {
            if ($("#" + v).val() != "") {
                var obj = {};
                obj.key = v;
                obj.qid = v;
                obj.value = $('input[name^=radiogroup]:checked').val().trim();
                arr.push(obj);
                // arr[v] =$('input[name^=radiogroup]:checked').val().trim();
            }
        });
        $.each(rating, function (i, v) {
            if ($("#" + v).val() != "") {
                var obj = {};
                obj.key = v;
                obj.qid = v;
                obj.value = $('#scoreNow' + v).val().trim();
                arr.push(obj);
                // arr[v] =$('input[name^=radiogroup]:checked').val().trim();   
            }
        });
        $.each(checkbox, function (i, v) {
            if ($("#" + v).val() != "") {
                var obj = {};
                obj.key = v;
                obj.qid = v;
                obj.value = $('#' + v).val().trim();
                arr.push(obj);
                // arr[v] =$('input[name^=radiogroup]:checked').val().trim();   
            }
        });
        $.each(ranges, function (i, v) {
            if ($('input[data-id="' + v + '"]').val() != "") {
                var obj = {};
                obj.key = v;
                obj.qid = v;
                obj.value = $('input[data-id="' + v + '"]').val().trim();
                arr.push(obj);
                // arr[v] =$('input[name^=radiogroup]:checked').val().trim();   
            }
        });
        $.each(dropdown, function (i, v) {
            if ($("#" + v).val() != "") {
                var obj = {};
                obj.key = v;
                obj.qid = v;
                obj.value = $('#' + v).val().trim();
                arr.push(obj);
                // arr[v] =$('input[name^=radiogroup]:checked').val().trim();   
            }
        });
        $.each(files, function (i, v) {
            if ($("#" + v).val() != "") {
                var obj = {};
                obj.key = v;
                obj.qid = v;
                obj.value = $('#' + v).val().trim();
                arr.push(obj);
                // arr[v] =$('input[name^=radiogroup]:checked').val().trim();   
            }
        });
        $.each(stars, function (i, v) {
            if ($("#" + v).val() != "") {
                var obj = {};
                obj.key = v;
                obj.qid = v;
                obj.value = $('#' + v).val().trim();
                arr.push(obj);
                // arr[v] =$('input[name^=radiogroup]:checked').val().trim();   
            }
        });
        $("table[name='matrix']").each(function (idx, ele) {
            let id = $(this).data("id");
            let input = $(this).find("input");
            let v = 0;
            if (input.length > 0) {
                for (let i = 0; i < input.length; i++) {
                    var obj = {};
                    let index = i + 1;
                    if ($(input[i]).val() != "")
                        v = $(input[i]).val();
                    obj.key = id;
                    obj.qid = "q_id" + index;
                    obj.value = v;
                    arr.push(obj);
                }
            } else {
                var obj = {};
                let index = 1;
                if ($(input).val() != "")
                    v = $(input).val();
                obj.key = id;
                obj.qid = "q_id" + index;
                obj.value = v;
                arr.push(obj);
            }

        })
        /*$.each(matrix,function(i,v){
            if($("<div />").append($("*[data-id="+v+"]").clone()).html() != ""){
                var obj = {};
                obj.key = v;
                obj.value = $("<div />").append($("*[data-id="+v+"]").clone()).html();
                arr.push(obj);
            }
        });*/
        var img_question_id = '';
        var images_names = {};
        var temp_arr = [];
        let contents = [];
        let types = [];
        $.each(images, function (i, v) {
            if ($("#" + v).val() != "") {
                images_names[v] = $("#" + v).val().trim();
                img_question_id = $("#" + v).data('id');
                // var obj = {};
                // obj.key = v;
                // obj.value = $('#'+v).val().trim(); 
                // arr.push(obj);
                // arr[v] =$('input[name^=radiogroup]:checked').val().trim();   
            }
        });
        temp_arr.push(images_names);
        var obj = {};
        obj.key = img_question_id;
        obj.qid = img_question_id;
        obj.value = JSON.stringify(temp_arr);
        arr.push(obj);
        // var imgobj = {};
        // imgobj.key = $("#img_q_id").val();
        // imgobj.value = $("#user_upload_img").val();
        // arr.push(imgobj);
        $(".report-card").show();
        var flag = true;
        var test_id = $("#test_id").val();
        e.preventDefault();

        $('input[type=text]').each(function (i) {
            if ($(this).prop('required') && $(this).val() == "") {
                $(this).siblings('.message').html("<p class='text-danger'>Compila i dettagli.</p>");
                flag = false;
                $(this).closest('.question-card').css('border', 'solid 1px #ff0000');
            } else {
                $(this).siblings('.message').html("");
            }
        });

        $('.rating-box').each(function (i) {
            var required = parseInt($(this).data('required'));
            if (required == 1) {
                var data = $(this).find('.ratinginput').data('selected');
                if (!data) {
                    $(this).find('.message').html("<p class='text-danger'>E' necessario rispondere a questa domanda.</p>");
                    flag = false;
                    $(this).closest('.question-card').css('border', 'solid 1px #ff0000');
                } else {
                    $(this).find('.message').html('');
                }
            }
        });

        $('.rating-stars').each(function (i) {

            var required = parseInt($(this).data('required'));
            if (required == 1) {
                var data = $(this).find('.starinput').data('selected');
                if (!data) {
                    $(this).find('.message').html("<p class='text-danger'>E' necessario rispondere a questa domanda.</p>");
                    flag = false;
                    $(this).closest('.question-card').css('border', 'solid 1px #ff0000');
                } else {
                    $(this).find('.message').html('');
                }
            }
        });

        $('.checkbox-input').each(function (i) {
            var required = parseInt($(this).data('required'));
            if (required == 1) {
                var data = $(this).find('input:checked').length;
                if (data <= 0) {
                    $(this).siblings('.message').html("<p class='text-danger'>E' necessario rispondere a questa domanda.</p>");
                    flag = false;
                    $(this).closest('.question-card').css('border', 'solid 1px #ff0000');
                } else {
                    $(this).siblings('.message').html('');
                }
            }
        });

        $('.radiogroup').each(function (i) {
            var required = parseInt($(this).data('required'));
            if (required == 1) {
                var data = $(this).find('input:checked').length;
                if (data <= 0) {
                    $(this).find('.message').html("<p class='text-danger'>E' necessario rispondere a questa domanda.</p>");
                    flag = false;
                    $(this).closest('.question-card').css('border', 'solid 1px #ff0000');
                } else {
                    $(this).find('.message').html('');
                }
            }
        });
        $('.images_files').each(function (i) {
            var required = parseInt($(this).data('required'));
            if (required == 1) {
                var data = $(this).find('input:checked').length;
                if (data <= 0) {
                    $(this).find('.message').html("<p class='text-danger'>E' necessario rispondere a questa domanda.</p>");
                    flag = false;
                    $(this).closest('.question-card').css('border', 'solid 1px #ff0000');
                } else {
                    $(this).find('.message').html('');
                }
            }
        });

        $('.dropdowninput').each(function (i) {
            var required = parseInt($(this).data('required'));
            if (required == 1) {
                var data = $(this).find('select').val();
                alert("rating" + data);
                if (data == "") {
                    $(this).find('.message').html("<p class='text-danger'>E' necessario rispondere a questa domanda.</p>");
                    flag = false;
                    $(this).closest('.question-card').css('border', 'solid 1px #ff0000');
                } else {
                    $(this).find('.message').html('');
                }
            }
        });
        // var formData = JSON.stringify(arr);
        // Original Code
        if (flag != false) {
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
            $.ajax({
                data: {test_id: test_id, test: arr},
                url: "../get_report",
                type: "POST",
                dataType: "json",
                success: function (response) {
                    user_question = response.user_question;
                    user_textgroup = response.user_textgroup;
                    textgroup_data = response.textgroup_data;

                    contents = [];
                    types = [];
                    var con = JSON.parse(response.report_data[0]['origin_content']);
                    let chart_type = 0;
                    var content_str = con;
                    const con_str = con.split('\n');
                    $("#report").html($.parseHTML(content_str));
                    let tg_idx = 0;
                    let idx = 1;

                    for (var i = 0; i < con_str.length; i++) {
                        if (con_str[i].includes("[text id=") == true) {
                            var text_index = con_str[i].split("[text id=")[1].replace("]</p>", "");
                            var text_val = text_index.split(["]"])[0];
                            for (var j = 0; j < textgroup_data.length; j++) {
                                if (text_val == textgroup_data[j]['id']) {
                                    textgroup_ids.push(text_val);
                                    content_str = $("#report").html();
                                    let tg_strs = JSON.parse(textgroup_data[j]['content']);
                                    let tg_scores = JSON.parse(textgroup_data[j]['score']);
                                    let tg_content = "";
                                    let tg_score = 0;
                                    for(let tg = 0; tg < tg_strs.length; tg++) {
                                        tg_content += tg_strs[tg];
                                        if(tg_scores[tg] != "")
                                            tg_score += parseInt(tg_scores[tg]);
                                    }
                                    answers.push(tg_content);
                                    scores.push(tg_score);
                                    //let tg_html = '<div id="textgroup'+text_index+'" class="col-12">'+tg_content+'</div>';
                                    content_str = content_str.replace("[text id=" + text_val + "]", tg_content);
                                    $("#report").html($.parseHTML(content_str));
                                    tg_idx++;
                                    break;
                                }
                            }
                        }

                        if (con_str[i].includes("[chart id=") == true) {
                            let con_split = con_str[i].split("[chart id=")
                            for(let k = 1; k < con_split.length; k++) {
                                let con_style = con_split[0].split("text-align:");
                                let style = "";
                                if (con_style.length > 1) {
                                    let style1 = con_style[1].replace('">', '');
                                    if (style1 == "center")
                                        style = 'style="justify-content: center;"';
                                    if (style1 == "right")
                                        style = 'style="justify-content: right;"';
                                }
                                var chart_index = con_split[k].replace("]</p>", "");
                                var chart_val = chart_index.split(["]"])[0];
                                for (var j = 0; j < response.chart_data.length; j++) {
                                    if (chart_val == response.chart_data[j]['id']) {
                                        chart_type = response.chart_data[j]['type'];
                                        var content = JSON.parse(response.chart_data[j]['content']);
                                        contents.push(ExpressionCalculation(content));
                                        types.push(chart_type);
                                        content_str = $("#report").html();
                                        if (chart_type == 0) {
                                            content_str = content_str.replace('[chart id=' + chart_val + ']', '<div id="pie-chartdiv' + idx + '" class="col-12" ' + style + '></div>');
                                            $("#report").html($.parseHTML(content_str));
                                            //pie_chart_draw(content, j);
                                        } else if (chart_type == 1) {
                                            content_str = content_str.replace('[chart id=' + chart_val + ']', '<div id="donut-chartdiv' + idx + '" class="col-12" ' + style + '></div>');
                                            $("#report").html($.parseHTML(content_str));
                                            //donut_chart_draw(content, j);
                                        } else if (chart_type == 2) {
                                            content_str = content_str.replace('[chart id=' + chart_val + ']', '<div id="bar-chartdiv' + idx + '" class="col-12" ' + style + '></div>');
                                            $("#report").html($.parseHTML(content_str));
                                            //bar_chart_draw(content, j);
                                        } else if (chart_type == 3) {
                                            content_str = content_str.replace('[chart id=' + chart_val + ']', '<div id="d3bar-chartdiv' + idx + '" class="col-12" ' + style + '></div>');
                                            $("#report").html($.parseHTML(content_str));
                                            //d3bar_chart_draw(content, j);
                                        } else {
                                            content_str = content_str.replace('[chart id=' + chart_val + ']', ' <div id="table_result" class="col-12" ' + style + '>');
                                            $("#report").html($.parseHTML(content_str));
                                        }
                                        idx++;
                                    }
                                }
                            }
                        }
                    }
                    drawChart(contents, types);
                    setTimeout(function () {
                        $("#report_div").css('display', 'none');
                        $("#update_report_div").css('display', 'block');
                    },2000);
                },
                error: function (error) {
                    var err = error.responseText;
                    console.log(err);
                }
            });
        }
    });

    var drawChart = function (contents, types) {
        let idx = 1;
        for(let j = 0; j < contents.length; j++) {
            let content = contents[j];
            if (types[j] == 0) {
                pie_chart_draw(content, idx);
            } else if (types[j] == 1) {
                donut_chart_draw(content, idx);
            } else if (types[j] == 2) {
                bar_chart_draw(content, idx);
            } else if (types[j] == 3) {
                d3bar_chart_draw(content, idx);
            } else {
                var html_content = `<tr><td><input type="text" placeholder="" class="form-control empty-cell" value=" " disabled></td>`;

                for (var k = 1; k < content[0].length; k++) {
                    html_content += `<td><input type="text" placeholder="" class="form-control head" value="` + content[0][k] + `" disabled></td>`;
                }
                html_content += `</tr>`;

                for (var i = 1; i < content.length; i++) {
                    html_content += `<tr>`;
                    html_content += `<td><input type="text" placeholder="" class="form-control head" value="` + content[i][0] + `" disabled></td>`;

                    for (var s = 1; s < content[i].length; j++) {
                        let val = content[i][s];
                        if(val == undefined || isNaN(val))
                            val = 0;
                        html_content += `<td> <input type="text"  value="` + val + `" class="form-control" ></td>`;
                    }
                    html_content += `</tr>`;
                }
                $('#table_result').html(html_content);
                $('#table_result').show();
            }
            idx++;
        }
    }
    var equation_extraction = function (origin_expression) {
        var operator = ["+", "-", "*", "/", "(", ")"];
        //var origin_expression="6*(5+(2+3)*8+3)";
        var expression = [];
        expression[0] = "";
        var i = 0;
        var operator_flag = 0;
        for (var t = 0; t < origin_expression.length; t++) {
            operator_flag = 0;
            for (var j = 0; j < operator.length; j++) {
                if (origin_expression[t] == operator[j]) {
                    operator_flag = 1;
                    break;
                }
            }
            if (operator_flag == 0)
                expression[i] += origin_expression[t];
            else {
                if (expression[i].length > 0)
                    i++;
                expression[i] = operator[j];
                if (t != origin_expression.length - 1) {
                    i++;
                    expression[i] = "";
                }
            }

        }

        return expression;
    }
    var precedence = function (c) {
        switch (c) {
            case '+':
            case '-':
                return 1;
            case '*':
            case '/':
                return 2;
            case '^':
                return 3;
        }
        return -1;
    }
    var infixToPostFix = function (expression) {

        var result = [];
        stack = [];
        for (var i = 0; i < expression.length; i++) {

            //check if char is operator
            if (precedence(expression[i]) > 0) {
                while (stack.length > 0 && precedence(stack[stack.length - 1]) >= precedence(expression[i])) {
                    result.push(stack.pop());
                }
                stack.push(expression[i]);
            } else if (expression[i] == ')') {
                var x = stack.pop();
                while (x != '(') {
                    result.push(x);
                    x = stack.pop();
                }
            } else if (expression[i] == '(') {
                stack.push(expression[i]);
            } else {
                //character is neither operator nor ( 
                result.push(expression[i]);
            }
        }

        for (var i = 0; i <= stack.length; i++) {
            result.push(stack.pop());
        }

        return result;
    }
    var infix_evaluation = function (infix_expression) {
        var temp = [];
        let cnx = "";
        for( let j = 0; j < infix_expression.length; j++){
            cnx += infix_expression[j];
        }
        cnx = cnx.replace("++", "+");
        cnx = cnx.replace("+*", "*");
        cnx = cnx.replace("+-", "-");
        cnx = cnx.replace("+/", "/");
        cnx = cnx.replace("-*", "*");
        cnx = cnx.replace("--", "-");
        cnx = cnx.replace("-+", "+");
        cnx = cnx.replace("-/", "/");
        cnx = cnx.replace("**", "*");
        cnx = cnx.replace("*-", "-");
        cnx = cnx.replace("*+", "+");
        cnx = cnx.replace("*/", "/");
        cnx = cnx.replace("/*", "*");
        cnx = cnx.replace("/-", "-");
        cnx = cnx.replace("/+", "+");
        cnx = cnx.replace("//", "/");
        cnx = cnx.replace("(+", "(");
        cnx = cnx.replace(")+", ")");
        cnx = cnx.replace("(*", "(");
        cnx = cnx.replace(")*", ")");
        cnx = cnx.replace("(-", "(");
        cnx = cnx.replace(")-", ")");
        cnx = cnx.replace("(/", "(");
        cnx = cnx.replace("/)", ")");
        let formula = eval(cnx);
        return formula;
        /*for (var i = 0; i < infix_expression.length; i++) {
            if (infix_expression[i] == "+" || infix_expression[i] == "-" || infix_expression[i] == "*" || infix_expression[i] == "/") {
                var first_num = parseFloat(temp.pop());
                var second_num = parseFloat(temp.pop());
                if (infix_expression[i] == "+")
                    temp.push(first_num + second_num);
                else if (infix_expression[i] == "-")
                    temp.push(first_num - second_num);
                else if (infix_expression[i] == "*")
                    temp.push(first_num * second_num);
                else
                    temp.push(first_num / second_num);
            } else {
                temp.push(infix_expression[i]);
            }
        }
        return temp.pop();*/
    }
    var ExpressionCalculation = function (content) {

        for (var i = 1; i < content.length; i++) {
            for (var j = 1; j < content[i].length; j++) {
                var expression = [];
                expression = equation_extraction(content[i][j]);
                var infix_expression = expression;//infixToPostFix(expression);

                for (var k = 0; k < infix_expression.length; k++) {
                    if(infix_expression[k] == undefined || infix_expression[k] == "" || infix_expression[k] == null)
                        continue;
                    if (infix_expression[k].includes("question") == true) {
                        var q_item = infix_expression[k].split("question")[1];
                        for (var m = 0; m < user_question.length; m++) {
                            if (user_question[m]['q_id'] == q_item) {
                                infix_expression[k] = user_question[m]['score'];
                                break;
                            }
                            else
                                infix_expression[k] = 0;
                        }
                    } else if (infix_expression[k].includes("textgroup") == true) {
                        var t_item = infix_expression[k].split("textgroup")[1];
                        for (var m = 0; m < user_textgroup.length; m++) {
                            if (user_textgroup[m]['textgroup_id'] == q_item) {
                                infix_expression[k] = user_textgroup[m]['score'];
                                break;
                            }
                        }
                    }
                    else{
                        let names = infix_expression[k].split(".");
                        if(names.length >= 3){
                            let num = names.length - 1;
                            $("table[name='matrix']").each(function (idx, ele) {
                                let id = $(this).data("id");
                                if(id === parseInt(names[0])){
                                    let input = $(this).find("input[id='q_id" + names[num] + "']");
                                    let value = $(input).val();
                                    if($(input).attr("type") == "checkbox")
                                    {
                                        if($(input).is(':checked') == false)
                                            value = 0;
                                    }
                                    if(value == "" || value == null)
                                        value = 0;
                                    value = parseInt(value);
                                    infix_expression[k] = value;
                                }
                            })
                        }
                    }
                }

                content[i][j] = infix_expression;
            }
        }

        for (var i = 1; i < content.length; i++) {
            for (var j = 1; j < content[i].length; j++) {
                content[i][j] = infix_evaluation(content[i][j]);
            }
        }
        return content;
    }

    $(document).on('click', '#update-report', function (e) {
        let test_id = $("#test_id").val();
        let report_str = JSON.stringify($("#report").html());
        let tg_ids = JSON.stringify(textgroup_ids);
        let tg_answers = JSON.stringify(answers);
        let tg_scores = JSON.stringify(scores);

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
        $.ajax({
            data: {
                test_id : test_id,
                report_content : report_str,
                tg_ids : tg_ids,
                tg_answers : tg_answers,
                tg_scores : tg_scores
            },
            url: "../update_report",
            type: "POST",
            dataType: "json",
            success: function (response) {
                alert(response.success);
                $("#report_div").css('display', 'block');
                $("#update_report_div").css('display', 'none');
            },
            error: function (error) {
                var err = error.responseText;
                console.log(err);
            }
        });
    });

    return {
        //main function to initiate the module
        init: function () {
        }
    };
}();







