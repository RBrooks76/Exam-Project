var QuestionCreate = function() {

    // Global var
    var currentRow = 1;
    var numberCol = 0;
    var numberRow = 0;
    var updateOutput = function(e) {};
    
    /**
    * Set the Default Question Type to Signle Input
    **/
    //$("#question_type").val("0");
    
    /**
    * On Question Input Type Change
    * Show the Relevant Question Box
    **/
    $('#question_type').change(function() {
        //Hide All Input Question Types
        $(".question-box").hide();
        
        var selected_text = parseInt($("#question_type option:selected").val());
        $("#more_than_one_answer_box").hide();
        $("#score-box").hide();
        switch (selected_text) {
            //Single Input
            case 0:
                $('#single_input_part').show();
                $("#more_than_one_answer_box").show();
                //$("#score-box").show();
                break;
            //Checkbox
            case 1:
                $('#checkbox_part').show();
                $("#score-box").hide();
                break;
            //RadioGroup
            case 2:
                $('#radiogroup').show();
                $("#score-box").hide();
                break;
            //ImagePart
            case 3:
                $('#image_part').show();
                break;
            //Matrix
            case 4:
                $('#matrix_part').show();
                break;
            //Rating
            case 5:
                $('#rating_part').show();
                var increment = 10;
                $("#rating_part .radio").each(function(){
                    $(this).find('.radio_label').val(increment);
                    increment+=10;
                });
                $("#score-box").hide();
                break;
            //Dropdown
            case 6:
                $('#dropdown_part').show();
                break;
            //File
            case 7:
                $('#file_upload_input').show();
                break;
            //Star
            case 8:
                $('#rating_part').show();
                var i = 1;
                $("#rating_part .radio").each(function(){
                    $(this).find('.radio_label').val(i++);
                });
                $("#score-box").hide();
                break;
            //Range
            case 9:
                $('#rangs_part').show();
                break;
            //€
            case 10:
                $('#euro_part').show();
                break;
            default:
                $('#single_input').show();
                break;
        }

    });
    
    var image_part_data = [];
    $(".image-upload-form").on('change', function(e) {
        e.preventDefault();
        
        var v = $('.image_score').map(function(idx, elem) {
            return $(elem).val();
        }).get();
        console.log(v);
        let formData = new FormData(this);
        console.log(formData);
        $.ajax({
            type: 'POST',
            url: '/user/questions/upload-images',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function(response) {
                console.log(response);
                if (response) {
                    var temp_img = {};
                    temp_img['image'] = response.img_name;
                    temp_img['score'] = v;
                    console.log(temp_img);
                    image_part_data = temp_img;
                }

            },
            error: function(response) {
                console.log(response);
            }
        })
    });
    
    var question_img_data = [];
    $("#img").on('change', function(e) {
        e.preventDefault();
        let formData = new FormData($("#question_type_image")[0]);
        var route = '/user/questions/upload-images';
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
        $.ajax({
            type: 'POST',
            url: route,
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function(response) {
                swal('success','Image uploaded to the server.','success');
                $("#quiz_img").val(response.img_name);
            },
            error: function(response) {
                swal('error','Error in uploading the image.','error');
                console.log(response);
            }
        })
    });
    
    var check_id = 2;
    var check_dro_id = 2;
    var col_add = 0;

    $('#checkbox_part').on('click', '.del-btnx', function() {
        $(this).parent().remove();
    });

    $("#check_add").on('click', function() {
        console.log(check_id);
        check_id++;
        $("#sortable-10").append(`
        <div class="checkbox">
            <label  style="color:transparent"><input type="checkbox" value="">Option 1 </label>  
            <input class="check_label" type="text" value="Check1" style="margin-left:-2vw;margin-right:5vw;z-index:20;border:none;">
            <label  >Score</label>
            <input type="text" class="checkbox_score" value="0" style="margin-right:1vw">
        
            <a class="btn btn-xs mb-2 btn-danger del-btnx" style="cursor:pointer;" data-id="` + 12 + `">
                <i class="fa fa-trash" style="color:white"></i>
            </a>
        </div>`);
    });
    
    $("#check_add_euro").on('click', function() {
        $("#euro_part #sortable-12").append(`
        <div class="checkbox">
            <label  style="color:transparent"><input type="checkbox" value="">Option 1 </label>  
            <input class="check_label" type="text" value="Check1" style="margin-left:-2vw;margin-right:5vw;z-index:20;border:none;">
            <label  >Score</label>
            <input type="text" class="checkbox_score" value="0" style="margin-right:1vw">
        
            <a class="btn btn-xs mb-2 btn-danger del-btnx" style="cursor:pointer;" data-id="` + 12 + `">
                <i class="fa fa-trash" style="color:white"></i>
            </a>
        </div>`);
    });


    $('#radio_part').on('click', '.del-btnx', function() {
        $(this).parent().remove();
    });
    $(document).on("click", "#euro_part #sortable-12 .checkbox .del-btnx", function(){
        $(this).parent().remove();
    })


    $("#radio_add").on('click', function() {
        console.log(check_id);
        check_id++;
        $("#sortable-11").append(`
        <div class="radio">
            <label  style="color:transparent"><input type="radio" name="optradio" checked>Option 1</label>
            <input class="radio_label" type="text" value="radio" style="margin-left:-2vw;margin-right:5vw;z-index:20;border:none;">
            <label label>Score</label>
            <input class="radio_score" type="text"  style="margin-right:1vw">
        
            <a class="btn btn-xs mb-2 btn-danger del-btnx" style="cursor:pointer;" data-id="` + 12 + `">
                <i class="fa fa-trash" style="color:white"></i>
            </a>
        </div>`);
    });

    $('#dropdown_part').on('click', '.del-btnx', function() {
        $(this).parent().remove();
    });


    $("#dropdown_add").on('click', function() {
        console.log(check_id);
        check_id++;
        $("#sortable_drop").append(`
        <div class="radio">
            <label  style="color:transparent"><input type="radio" name="optradio" checked>Option</label>
            <input class="radio_label" type="text" value="` + check_id + `" style="margin-left:-2vw;margin-right:5vw;z-index:20;border:none;">
            <label label>Score</label>
            <input class="radio_score" type="text"  style="margin-right:1vw">
        
            <a class="btn btn-xs mb-2 btn-danger del-btnx" style="cursor:pointer;" data-id="` + 12 + `">
                <i class="fa fa-trash" style="color:white"></i>
            </a>
        </div>`);
    });

    $('#rating_part').on('click', '.del-btnx', function() {
        $(this).parent().remove();
    });

    $('#rangs_part').on('click', '.del-btnx', function() {
        $(this).parent().remove();
    });

    $("#rating_add").on('click', function() {
        console.log(check_id);
        check_id++;
        $("#sortable_rating").append(`
        <div class="radio">
            <label  style=""><input type="radio" name="optradio" checked>Option</label>
            <input class="radio_label" type="text" value="` + check_id + `" style="margin-left:-2vw;margin-right:5vw;z-index:20;border:none;">
            <label label>Score</label>
            <input class="radio_score" type="text"  style="margin-right:1vw">
        
            <a class="btn btn-xs mb-2 btn-danger del-btnx" style="cursor:pointer;" data-id="` + 12 + `">
                <i class="fa fa-trash" style="color:white"></i>
            </a>
        </div>`);
    });

    $('#image_panel').on('click', '.del-btnx', function() {
        $(this).parent().parent().parent().parent().parent().remove();
    });




    $('#col_panel').on('click', '.del-btnx', function() {
        $(this).parent().parent().remove();
    });

    $('#row_panel').on('click', '.del-btnx', function() {
        $(this).parent().parent().remove();
    });

    var html_cont, score_cont;
    $('#mat_update').on('click', function() {
        $('#real_matrix').children().remove();
        $('#score_matrix').children().remove();
        html_cont = `
                        <tr>
                            <td><input type="text" placeholder="" class="form-control" value="  " disabled></td>`;

        for (var i = 2; i <= $("#col_panel").children().length; i++) {
            html_cont += `<td>`;
            var caption = $("#col_panel div:nth-child(" + i + ")").find("input").val();
            html_cont += `<input type="text" placeholder="" class="form-control" value="` + caption + `" disabled>`;
            html_cont += `</td>`;
        }
        html_cont += `</tr>`;

        for (var j = 2; j <= $("#row_panel").children().length; j++) {
            html_cont += `<tr><td width="15%">`;
            var caption = $("#row_panel div:nth-child(" + j + ")").find("input").val();
            html_cont += `<input type="text" placeholder="" class="form-control" value="` + caption + `" disabled></td>`;

            for (var i = 2; i <= $("#col_panel").children().length; i++) {
                html_cont += `<td> <input type="text"  placeholder="" class="form-control" ></td>`;
            }
            html_cont += `</tr>`;
        }
        $("#real_matrix").append(html_cont);

        $("#score_matrix").append(html_cont);

    });

   
    var no_coulmns = 0;
    var questiontype = '';
    $("#add_col").on('click', function() {
        questiontype = $("#matrix_symbol").val();
        $('#row_add').data('columns',parseInt($("#row_add").data('columns'))+1);
        var add_q_id = 1;
        col_add++;
        var last_Q_id = parseInt($('#last_q_id').val());
        var q_id = last_Q_id + add_q_id;
        numberCol--;
        var scoreinput = '';
        var radiocol = '';
        if($(".selecttype").val() == "checkbox"){
            scoreinput = '<input type="text" data-q_id="q_id'+col_add+'" data-value="" class="form-control col-10 d-inline radioscore" value=""  onchange="radioScore(this)">';
            radiocol = 'col-2';
        }
        if($('#add-matrix tr').length <= 2){
            var add_head_col = '<th scope="row" class="custom-border"><label contenteditable="true" class="form-label">Column</label></th>';
            var add_col = '<td class="col-3 custom-border"><input id="q_id'+col_add+'" type='+$(".selecttype").val()+' value="" name="matrix'+$(".selecttype").val()+'" class="form-control radioselected d-inline '+radiocol+' q_id[q_id]'+col_add+'" onchange="inputToData(this)" data-questiontype="'+questiontype+'" data-value="" data-selected="false" data-q_id="[q_id]'+col_add+'">'+scoreinput+'</td>';
        }else{
            if(numberCol > 2){
                var add_col = '<td class="col-3 custom-border"><input id="q_id'+col_add+'" type='+$(".selecttype").val()+' value="" name="matrix'+$(".selecttype").val()+'" class="form-control radioselected d-inline '+radiocol+'  q_id[q_id]'+col_add+'" onchange="inputToData(this)" data-questiontype="'+questiontype+'" data-value="" data-selected="false" data-q_id="[q_id]'+col_add+'">'+scoreinput+'</td>';
                
            }
        }
        $("#header_row_col"+(currentRow-1)).append(add_head_col);
        $("#mr"+(currentRow-1)).append(add_col);
    //     alert($(".selecttype").val());
    //     $("#col_panel").append(`
    //     <div class="row" >
    //         <div class="col-2">
    //             <select class="form-control input-small select2me" data-placeholder="Select..."disabled>
    //                 <option value="single_input" >Single Input</option>
	// 				<option value="checkbox">Checkbox</option>
	// 				<option value="radiogroup">Radiogroup</option>
	// 				<option value="file">File</option>
    //             </select>
    //         </div>
    //         <div class="col-2">
    //             <input type="text" value="Input" style="z-index:20;"  class="form-control">
                
    //         </div>
    //         <div class="col-2">
    //             <a class="btn btn-xs mb-2 btn-danger del-btnx" style="cursor:pointer;" data-id="81">
    //                 <i class="fa fa-trash" style="color:white"></i>
    //             </a>
    //         </div>
    //     </div>
    //    `);
    });

    // Delete Row
    $("#add-matrix").on("click", "#delete_matrix_row", function() {
        $(this).closest("tr").remove();
        if($('#add-matrix tr').length == 1){
            $("#header_row_col"+(($('#add-matrix tr').length))).remove();
            $("#add_col").slideDown();
            $('#row_add').data('columns',0);
        }
        currentRow--;
        numberRow--;
     });

    $("#row_add").on('click', function() {

        var columns = parseInt($(this).data('columns'));
        if($('#add-matrix tr').length>=1){
            currentRow =  $('#add-matrix tr').length;
        }
        if($("#question_id").val()){
            col_add = $('#add-matrix tr td').length;
            columns = (col_add/(currentRow-1))-2;
        }
        numberCol = $("#add-matrix tr th").length;
        numberRow = $('#add-matrix tr').length;
        // if($("#mr"+currentRow).length){
        //     currentRow = currentRow + 1;

        // }
        var add_row = '';
        if(numberRow <= 0){
            if(($('#add-matrix tr').length+1) == 1){
                add_row += '<tr id="header_row_col'+currentRow+'"><th class="custom-hide">Action</th><th class=""></th></tr>';
            }
        }
        
        var scoreinput = '';
        var radiocol = '';
        var add_col = '';
        
        if(currentRow > 1){
            $("#add_col").slideUp();
            for(var i=0;i<columns;i++){
                col_add++;
                if($(".selecttype").val() == "checkbox"){
                    scoreinput = '<input type="text" data-q_id="q_id'+col_add+'" data-value="" class="form-control col-10 d-inline radioscore" value="" onchange="radioScore(this)">';
                    radiocol = 'col-2';
                }
                add_col += '<td class="col-3 custom-border"><input id="q_id'+col_add+'" type='+$(".selecttype").val()+' value="" name="matrix'+$(".selecttype").val()+'" class="form-control radioselected d-inline '+radiocol+' q_id[q_id]'+col_add+'" onchange="inputToData(this)" data-questiontype="'+questiontype+'" data-value="" data-selected="false" data-q_id="[q_id]'+col_add+'">'+scoreinput+'</td>';
            }

        }
        add_row += '<tr id="mr'+currentRow+'"><td class="custom-hide"><button class="btn btn-danger" id="delete_matrix_row"><i class="fa fa-trash"></i></button></td><td scope="row" class="custom-border"><label contenteditable="true" class="form-label ">Row</label></td></tr>';
        
        $("#add-matrix").append(add_row);        
        $("#mr"+currentRow).append(add_col);        
        currentRow++;
        numberCol++;
        // alert($("</div>").append($("#add-matrix").clone()).html());
    //     $("#row_panel").append(`
    //     <div class="row" >
    //         <div class="col-2">
    //             <select class="form-control input-small select2me" data-placeholder="Select...">
    //                 <option value="single_input" >Single Input</option>
	// 				<option value="checkbox">Checkbox</option>
	// 				<option value="radiogroup">Radiogroup</option>
	// 				<option value="file">File</option>
    //             </select>
                      
    //         </div>
    //         <div class="col-2">
    //             <input type="text" value="Input" style="z-index:20;" class="form-control">
                
    //         </div>
    //         <div class="col-2">
    //             <a class="btn btn-xs mb-2 btn-danger del-btnx" style="cursor:pointer;" data-id="11">
    //                 <i class="fa fa-trash" style="color:white"></i>
    //             </a>
    //         </div>
    //     </div>
    //    `);
    });


    var content, score;
    var data = [];
    var matrix_data = '';
    $('#save_data').on('click', function(e) {
        
        // alert(document.getElementById("more_than_one_answer").checked);
        
        // alert($("<div />").append($("#add-matrix").clone()).html());
        // return;
        // If FormSubmitFlag is true then submit the form
        var formSubmitFlag = true;
        var errorMessage = "";
        
        //If the Question Text is Missing, Show Error Message
        // if(CKEDITOR.instances.question_content.getData().length<=0){
        //     swal("Warning","Please write the question!","warning");
        //     return;
        // }
        
        //Get Question Type
        var type_id = parseInt($("#question_type option:selected").val());
        //Get Score
        var score = $("#score").val();
        
        // Content for Question Type
        var content;
        // Validate Form Based on the Question Type
        switch(type_id) {
            //Single Input
            case 0:
                break;
            //Checkbox
            case 1:
                var temp_arr = [];
                $("#checkbox_part #sortable-10 .checkbox").each(function(e){
                    if($(this).find(".check_label").val().trim()==""){
                        formSubmitFlag = false;
                        errorMessage = "Checkbox Title Missing!";
                    }
                    var checkbox_content = {};
                    checkbox_content['label'] = $(this).find(".check_label").val();
                    checkbox_content['score'] = $(this).find(".checkbox_score").val().trim() ?? 0;
                    checkbox_content['is_checked'] =  $(this).find(".check_box_q").is(":checked") ? 1 : 0;
                    temp_arr.push(checkbox_content);
                });
                temp_arr.push({
                    'col' : $("#display_checkbox").val()
                });
                content = JSON.stringify(temp_arr);
                break;
            //RadioGroup
            case 2:
                var temp_arr = [];
                $("#radiogroup .radio").each(function(e){
                    if($(this).find(".radio_label").val().trim()==""){
                        formSubmitFlag = false;
                        errorMessage = "Radio Group Field Title Missing!";
                    }
                    var checkbox_content = {};
                    checkbox_content['label'] = $(this).find(".radio_label").val();
                    checkbox_content['score'] = $(this).find(".radio_score").val().trim() ?? 0;
                    temp_arr.push(checkbox_content);
                });
                temp_arr.push({
                    'col' : $("#display_radio").val()
                });
                content = JSON.stringify(temp_arr);
                break;
            //ImagePart
            case 3:
                var temp_arr = [];
                if($("#question_id").val()){
                    var v = $('.image_score').map(function(idx, elem) {
                        if($(elem).val() != ""){
                        return $(elem).val()}
                    }).get();
                    var images = $('.imge_names').map(function(idx, elem) {
                        
                        if($(elem).val() != ""){
                            return $(elem).val()}
                    }).get();
                    var temp_img = {};
                    temp_img['image'] = images;
                    temp_img['score'] = v;
                    image_part_data = temp_img;
                    temp_arr.push(image_part_data);
                    
                }else{
                    temp_arr.push(image_part_data);
                    // $("#image_part .image_part_file").each(function(e){
                    //     $(this).find(".image_score").val().trim()
                    //     if($(this).find(".image_score").val().trim() == ""){
                    //         formSubmitFlag = false;
                    //         errorMessage = "Image Score Missing!";
                    //     }
                    //     var image_files = {};
                    //     image_files['score'] = ($(this).find(".image_score").val().trim() == 'undefined')?0:$(this).find(".image_score").val().trim();
                    //     temp_arr.push(image_files);
                    // });
                }
                console.log(temp_arr);
                temp_arr.push({
                    'col' : $("#image_file_display").val()
                });
                content = JSON.stringify(temp_arr);
                $('#image_part').show();
                break;
            //Matrix
            case 4:
                let text_vals = [];
                $('.radioscore').each(function(){
                    let vals = [];
                    vals.push($(this).data('q_id'));
                    vals.push($(this).val());
                    text_vals.push(vals);
                });
                $("#symbol_matrix_value").html("<tr><th>Value in "+$("#matrix_symbol").val()+"</th></tr>");
                $('#add-matrix td input[type="text"]').each(function (i,ele) {
                    let id = $(ele).data("q_id");
                    for(let i = 0; i < text_vals.length; i++) {
                        if(id == text_vals[i][0]) {
                            $(ele).attr('value', text_vals[i][1]);
                            break;
                        }
                    }
                });
                matrix_data = $("<div />").append($("#add-matrix").clone()).html();
                if($("#add-matrix tr").length > 1){
                    formSubmitFlag = true;
                }
                $('#matrix_part').show();
                break;
            //Rating
            case 5:
            //Dropdown
            case 6:
                var temp_arr = [];
                $("#dropdown_part #sortable_drop .radio").each(function(e){
                    if($(this).find(".radio_label").val().trim()==""){
                        formSubmitFlag = false;
                        errorMessage = "Radio Title Missing!";
                    }
                    var checkbox_content = {};
                    checkbox_content['label'] = $(this).find(".radio_label").val();
                    checkbox_content['score'] = $(this).find(".radio_score").val().trim() ?? 0;
                    temp_arr.push(checkbox_content);
                });
                temp_arr.push($('#display_radio').val());
                content = JSON.stringify(temp_arr);
                break;
            //File
            case 7:
                $('#file_upload_input').show();
                break;
            //Star
            case 8:
                var temp_arr = [];
                $("#rating_part #sortable_rating .radio").each(function(e){
                    if($(this).find(".radio_label").val().trim()==""){
                        formSubmitFlag = false;
                        errorMessage = "Radio Group Field Title Missing!";
                    }
                    var checkbox_content = {};
                    checkbox_content['label'] = $(this).find(".radio_label").val();
                    checkbox_content['score'] = $(this).find(".radio_score").val().trim() ?? 0;
                    temp_arr.push(checkbox_content);
                });
                temp_arr.push({
                    'col' : $("#display_rating").val()
                });
                temp_arr.push({
                    'color' : $("#color").val()
                });
                content = JSON.stringify(temp_arr);
                break;
            //Range
            case 9:
                var temp_content = {};
                temp_content['min_value'] = $("#rangs_part #range_min_value").val() ?? 0 ;
                temp_content['max_value'] = $("#rangs_part #range_max_value").val() ?? 0;
                temp_content['steps'] = $("#step_value").val() ?? 0;
                score = $("#rangs_part .radio_score").val() ?? 0;
                temp_content['symbol'] = $("#rangs_part #range_symbol").val() ?? 0;
                temp_content['type'] = $("#rangs_part #range_type").val() ?? 0;
                content = JSON.stringify(temp_content);
                break;
            //€
            case 10:
                var temp_arr = [];
                $("#euro_part #sortable-12 .checkbox").each(function(e){
                    if($(this).find(".check_label").val().trim()==""){
                        formSubmitFlag = false;
                        errorMessage = "Checkbox Title Missing!";
                    }
                    var checkbox_content = {};
                    checkbox_content['label'] = $(this).find(".check_label").val();
                    checkbox_content['score'] = $(this).find(".checkbox_score").val().trim() ?? 0;
                    temp_arr.push(checkbox_content);
                });
                content = JSON.stringify(temp_arr);
                break;
            default:
                $('#single_input').show();
                break;
        }
        
        if(formSubmitFlag==false){
            swal("error",errorMessage,"error");
            return;
        }
        var selected = [],
            selected_cat = [];
        $('#tests_id option:selected').each(function() {
            selected[$(this).val()] = $(this).val();
        });
        var k = 0;
        for (var i = 0; i < selected.length; i++) {
            if (selected[i] != null) {
                selected_cat[k] = selected[i];
                k++;
            }
        }
        // Bilal Change
        // var route = '/user/questions/update';
        // Original One 
        var route = '/user/questions';
        var answerposition = $("#answerposition").val();
        var imageposition = $("#imageposition").val();
        var answer_aligment = $("#answer_aligment").val();
        var image_aligment = $("#image_aligment").val();
        console.log(score);
        var question_bg_color = $("#question_bg_color").val();
        // if(logic == ""){
        //     alert($(".qt_type").val());
        // }
        
        if($("#question_id").val()){
        
            route = route + "/update";
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
            route = route ;  
                // Orignal Ajax 
         //fin ajax 
            $.ajax({
                    data : {
                        /**
                    * Form Data
                    **/
                   'question_id': $("#question_id").val(),
                   '_method' : 'PUT',
                   'type_id': type_id,
                   'test_ids': selected_cat,
                   'question': CKEDITOR.instances.question_content.getData(), //$("#question_content").val(),
                   'help_info': CKEDITOR.instances["help-editor"].getData(), //$("#help-editor").val(),
                   'questionimage': $("#quiz_img").val() ?? null,
                   'score': score,
                   'content': content,
                   'logic': JSON.stringify(logic),
                   'answerposition' : answerposition,
                   'image_aligment' : image_aligment,
                   'answer_aligment' : answer_aligment,
                   'imageposition' : imageposition,
                   'question_bg_color': question_bg_color,
                   //Properties
                   
                   //'page' : $("#question_page").val(),
                   //'order' :$("#question_order").val(),
                   'required': $("#required").is(":checked") ? 1 : 0,
                   'more_than_one_answer': $("#more_than_one_answer").is(':checked') ? 1 : 0,
                   'state': $("#state option:selected").val() ?? null,
                   
                   'titlelocation': $("#title_location option:selected").val() ?? null,
                   'help_info_location': $("#help_info_location option:selected").val() ?? null,
                   
                   'indent': $("#indent").val() ?? null,
                   'width': $("#width").val() ?? null,
                   'min_width': $("#min_width").val() ?? null,
                   'max_width': $("#max_width").val() ?? null,
                   
                   'size': $("#size").val() ?? null,
                   'fontsize': $("#font_size").val() ?? "",
                   
                   'imagefit': $("#image_fit option:selected").val() ?? '',
                   'imagewidth': $.trim($("#image_width").val()) ?? '',
                   'imageheight': $.trim($("#image_height").val()) ?? '',
                   'matrix_data' : matrix_data,
                    },
                ////url: "{{ route('questions.store') }}",
                url: route,
                type: "POST",
                dataType: 'json',
                success: function(response) {
                    console.log(response);
                    swal("Success", "Question Updated!", "success");
                },
                error: function(response) {
                    console.log(response);
                    var responseTextObject = jQuery.parseJSON(response.responseText);
                    swal("Error!", "Fill in the form correctly!", "error");
                }
            });
        }
        else{
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
            //Bilal Change 
            // $.ajax({ 
            //     method      : 'POST', 
            //     url       : '/user/questions/store', 
            //     headers: {
            //         'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            //     },
            //     data      : {
            //         'type_id': type_id,
            //         'test_ids': selected_cat,
            //         'question_content': CKEDITOR.instances.question_content.getData(), //$("#question_content").val(),
            //         'help_info': CKEDITOR.instances["help-editor"].getData(), //$("#help-editor").val(),
            //         'questionimage': $("#quiz_img").val() ?? null,
            //         'score': score,
            //         'content': content,
            //         'logic': JSON.stringify(logic),
                    
            //         //Properties
                    
            //         //'page' : $("#question_page").val(),
            //         //'order' :$("#question_order").val(),
            //         'required': $("#required").is(":checked") ? 1 : 0,
            //         'more_than_one_answer': $("#more_than_one_answer").val() ?? 0,
            //         'state': $("#state option:selected").val() ?? null,
                    
            //         'titlelocation': $("#title_location option:selected").val() ?? null,
            //         'help_info_location': $("#help_info_location option:selected").val() ?? null,
                    
            //         'indent': $("#indent").val() ?? null,
            //         'width': $("#width").val() ?? null,
            //         'min_width': $("#min_width").val() ?? null,
            //         'max_width': $("#max_width").val() ?? null,
                    
            //         'size': $("#size").val() ?? null,
            //         'fontsize': $("#font_size").val() ?? "",
                    
            //         'imagefit': $("#image_fit option:selected").val() ?? '',
            //         'image_width': $.trim($("#image_width").val()) ?? '',
            //         'image_height': $.trim($("#image_height").val()) ?? '',

            //     }, // pass in json format 
            //     success   : function(data) {
            //         console.log(data);
            //     },
            //     error : function(err){
            //         var errors =  JSON.parse(err.responseText);
            //         $('.error').remove();
            //         $.each(errors,function(key, value){
                        
            //             if(key === "errors")
            //             $.each(value,function(i,v){
            //                 var el_input = "";
            //                 if($("#cke_"+i).length > 0){
            //                     el_input = $("#cke_"+i);
                               
            //                 }else{
            //                     if($("#"+i).is('input') || $("#"+i).is('select')){
            //                         el_input = $("#"+i+"1");
            //                     }else{
            //                         el_input = $("#"+i);
            //                     }
            //                 }
            //                 console.log($("#"+i));
            //                 console.log(el_input);
            //                 $(el_input).css("border","1px solid #f00");
            //                 $(el_input).append("<div style='border:1px solid #f00;color:#f00' class='error'>"+v+"</div>");
            //             });
            //         });
            //     }
            // });
            // Orignal Ajax
            $.ajax({
                data: {
                    /**
                    * Form Data
                    **/
                    'type_id': type_id,
                    'test_ids': selected_cat,
                    'question': CKEDITOR.instances.question_content.getData(), //$("#question_content").val(),
                    'help_info': CKEDITOR.instances["help-editor"].getData(), //$("#help-editor").val(),
                    'questionimage': $("#quiz_img").val() ?? null,
                    'score': score,
                    'content': content,
                    'logic': JSON.stringify(logic),
                    'answerposition' : answerposition,
                    'image_aligment' : image_aligment,
                   'answer_aligment' : answer_aligment,
                   'imageposition' : imageposition,
                   'question_bg_color': question_bg_color,
                    //Properties
                    
                    //'page' : $("#question_page").val(),
                    //'order' :$("#question_order").val(),
                    'required': $("#required").is(":checked") ? 1 : 0,
                    'more_than_one_answer': $("#more_than_one_answer").val() ?? 0,
                    'state': $("#state option:selected").val() ?? null,
                    
                    'titlelocation': $("#title_location option:selected").val() ?? null,
                    'help_info_location': $("#help_info_location option:selected").val() ?? null,
                    
                    'indent': $("#indent").val() ?? null,
                    'width': $("#width").val() ?? null,
                    'min_width': $("#min_width").val() ?? null,
                    'max_width': $("#max_width").val() ?? null,
                    
                    'size': $("#size").val() ?? null,
                    'fontsize': $("#font_size").val() ?? "",
                    
                    'imagefit': $("#image_fit option:selected").val() ?? '',
                    'imagewidth': $.trim($("#image_width").val()) ?? '',
                    'imageheight': $.trim($("#image_height").val()) ?? '',
                    'matrix_data' : matrix_data,
                },
                ////url: "{{ route('questions.store') }}",
                url: route,
                type: "POST",
                success: function(response) {
                    if(response.add == 1){
                        $("#add_another_question").css('display','inline');
                    }
                    console.log(response);
                    swal("Success", "Question Created!", "success");
                },
                error: function(response) {
                    console.log(response);
                    var responseTextObject = jQuery.parseJSON(response.responseText);
                    swal("Error!", "Fill in the form correctly!", "error");
                }
            });
        }
        //
    });

    $("#width").on('change', function() {
        $(".main-content").css("width", $("#width").val());
    });
    $("#font_size").on('change', function() {
        $('div').css("font-size", parseInt($("#font_size").val()));
        $('input').css("font-size", parseInt($("#font_size").val()));
    });
    $("#indent").on('change', function() {
        $(".main-content").css("margin-left", parseInt($("#indent").val()));
    });

    $("#image_width").on('change', function() {
        $(".fileinput-preview").css("width", parseInt($("#image_width").val()));
    });

    $("#image_height").on('change', function() {
        $(".fileinput-preview").css("height", parseInt($("#image_height").val()));
    });
    $("#image_fit").on('change', function() {
        $(".fileinput-preview").css("object-fit", $("#image_fit option:selected").text());
    });

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $('.file').change(function() {

        let reader = new FileReader();
        reader.onload = (e) => {
            $('.display-image-preview').attr('src', e.target.result);
        }
        reader.readAsDataURL(this.files[0]);

    });
    
    $('#img').change(function() {

        let reader = new FileReader();
        reader.onload = (e) => {
            $('#preview').attr('src', e.target.result);
        }
        reader.readAsDataURL(this.files[0]);

    });

    $(".image-upload-form").on('click', '.add-btn', function() {
        var lsthmtl = $(".clone").html();
        $(".increment").after(lsthmtl);
    });
    $(".image-upload-form").on("click", ".del-btn", function() {
        $(this).parents(".image_part_file").remove();
    });

    // $(".logic_part").on('click','#logic_open',function(){ 

    //     $("#sortable-14").show();

    // });

    $(".logic_part").on('click', '#condition_add', function() {

        var logichmtl = $(".clone_condition").html();
        logichmtl = `<div class="logic_condition row clone_condition" style="padding-top:10px;">` + logichmtl + `</div>`;
        UITree.init();
        // $(".first_logic_condition").after(logichmtl);
        $("#sortable-14").append(logichmtl);
    });

    $('.logic_part').on('click', '.del-btnx', function() {
        $(this).parent().parent().remove();
    });

    $(document).on('select_node.jstree','.tree_1', function(e,data) { 

        var str = $('#' + data.selected).text();
        var logiccontent=$(this).parent().siblings(".logic-content");
        var qt_type_in= $(this).parent().siblings(".qt_type");
        var qt_nm = $(this).siblings(".qt_name");

        var name= str.split(".");
        if (name.length>1)
        {
            var qt_id =name[0];            

        e.preventDefault();
    // $(this).html('Sending..');

        $.ajax({
            data: {id:qt_id},
        //url: "{{ route('questions.store') }}",
            url: "get_info",
            type: "GET",
            dataType: 'json',
            success: function(response){
            var type=response[0]['questiontype']; 
            var content= JSON.parse(response[0]['content']);
            var html_append=``; 

            qt_type_in.val(type);
            qt_nm.val(response[0]['id']);


            if (type == 0)
            {
                html_append =
                    `<div class="row main-content"  >
                        <div class="col-8 form-group">
                        <label>Please enter/select the value </label>  
                        <input type="textarea" class="form-control">

                        </div>
                        <div class="col-4">
                            <div class="form-body">                                    
                                <div class="form-group ">
                                    <img class="display-image-preview" src="/uploads/image/`+ response[0]['questionimage']+`"
                                     style="max-height: 150px;">
                                </div>

                            </div>
                        </div>
                    </div> `;
            }

            if (type == 1)
            {
                html_append =
            `
                <div class="col-8 form-group logic_view">`;
            for(var i = 0; i< content.length; i++)    
                html_append +=
                `<div  class="checkbox">
                    <label><input type="checkbox" >` + content[i]+ `</label>                      
                </div>`;

            html_append +=       
                `</div>                
                <div class="col-4">
                    <div class="form-body">                                    
                        <div class="form-group ">
                            <img class="display-image-preview" src="/uploads/image/`+ response[0]['questionimage']+`"
                             style="max-height: 150px;">
                        </div>

                    </div>

            </div>`;
            }

            if (type == 2)
            {
                html_append =`           
                <div class="col-8 form-group logic_view">`;
            for(var i = 0; i< content.length; i++)    
                html_append +=
                `<div  class="radio">
                    <label><input type="radio" name="optradio">` + content[i]+ `</label>                      
                </div>`;

            html_append +=       
                `</div>                
                <div class="col-4">
                    <div class="form-body">                                    
                        <div class="form-group ">
                            <img class="display-image-preview" src="/uploads/image/`+ response[0]['questionimage']+`"
                             style="max-height: 150px;">
                        </div>

                    </div>

            </div>`;
            }

            if (type == 3)
            {
                html_append =`           
                <div class="col-12 form-group logic_view">`;           

                    for(var i = 0;i< content.length; i++)
                        html_append +=
                        `<div class="col-md-3 col-sm-6 image_box" style="padding:10px;width:7vw;height:10vw;" display="inline-flex" >
                            <div  class="checkbox">
                                <input type="checkbox" class="img_check`+ i +`">                      
                                </div>
                            <img src="/uploads/image/` + content[i]+`"  width="90%" height="80%" style="max-width:100%; max-height:100%;">
                            </div>`;

                html_append += `</div>`;


            }

            if (type == 4)
            {
                html_append =
                    `<div class="row main-content"  >
                        <div class="col-12 form-group">
                        <label>Please enter/select the value </label>  
                        <input type="text" class="form-control">

                        </div>

                    </div> `;
            }
            logiccontent.html(html_append);


            },
            error: function(response){
            console.log(response);
            }
        });
        }

        $(this).hide();


    });

    $(".tree_1").hide();
    $(document).on('click', '.qt_name', function(e) {
        //debugger;
        $(this).siblings(".tree_1").show();

    });

    var logic = [];
    var logic_build = function() {

        var id_list;

        id_list = $('#sortable-14 .main-content').map(function() {
            return $(this).attr('id');
        });
       
        for (var i = 0; i < id_list.length; i++) {

            logic[i] = [];
            logic[i][0] = $("#sortable-14 div:nth-child(" + (i + 1) + ")").find(".first_operator").val();
            logic[i][1] = id_list[i].split("_")[1];
            logic[i][2] = $("#sortable-14 div:nth-child(" + (i + 1) + ")").find(".operators").val();
            var qt_type = $("#sortable-14 div:nth-child(" + (i + 1) + ")").find(".qt_type").val();

            if (qt_type == 0) {
                logic[i][3] = $("#" + id_list[i]).find("textarea").val();
            }
            if (qt_type == 1) {
                var cnt = $("#" + id_list[i]).find(".logic_check").children().length;
                logic[i][3] = 0;
                for (var j = 0; j < cnt; j++) {
                    if ($("#" + id_list[i]).find(".logic_check  .checkbox_" + j).is(':checked') == true)
                    
                        logic[i][3] += Math.pow(2, cnt - j - 1);
                }
            }
            if (qt_type == 2) {
                var cnt = $("#" + id_list[i]).find(".logic_radio").children().length; //is(':checked');
                logic[i][3] = 0;
                for (var j = 0; j < cnt; j++) {
                    if ($("#" + id_list[i]).find(".logic_radio  .radio_" + j + ":checked").val() == "on")
                        logic[i][3] += Math.pow(2, cnt - j - 1);
                }
            }
            if (qt_type == 3) {
                var cnt = $("#" + id_list[i]).children().length; //is(':checked');
                logic[i][3] = 0;
                for (var j = 0; j < cnt; j++) {
                    if ($("#" + id_list[i]).find(".imagebox_" + j).is(':checked') == true)
                        logic[i][3] += Math.pow(2, cnt - j - 1);
                }
            }
            if (qt_type == 4) {
                logic[i][3] = $("#" + id_list[i]).find("textarea").val();
            }



        }
    };


    return {
        //main function to initiate the module
        init: function() {


        }

    };


    

}();

