var ChartEdit = function () {

    var updateOutput = function (e) {
    };

    var check_id=2;
    var tdata_max = [];
    var t_id = [];
    var qdata_max = [];
    var q_id = [];
    var ExpressionCalculation = function(){
        var question_list=[];
        var textgroup_list=[];
        for (var i=1;i<content.length;i++)
        {
            for (var j=1;j<content[i].length;j++)
            {
                var expression = [];
                expression = equation_extraction(content[i][j]);  
                var infix_expression = infixToPostFix(expression);
                content[i][j]=infix_expression;
                for (var k=0;k<infix_expression.length;k++)
                {
					if(infix_expression[k] !=undefined){
						if(infix_expression[k].includes("question") ===true)
						{
							var q_flag = 0;
							var q_item= infix_expression[k].split("question")[1];
							for (var m=0;m<question_list.length;m++)
							{
								if(question_list[m]== q_item)
								{
									q_flag= 1;
									break;
								}
							}
							if (q_flag===0)
								question_list.push(q_item);
						}
						else if(infix_expression[k].includes("textgroup")===true)
						{
							var t_flag = 0;
							var t_item= infix_expression[k].split("textgroup")[1];
							for (var m=0;m<textgroup_list.length;m++)
							{
								if(textgroup_list[m]== t_item)
								{
									t_flag= 1;
									break;
								}
							}
							if (t_flag===0)
								textgroup_list.push(t_item);
						}
					}
                }
            }
        }
        //e.preventDefault();
        $.ajax({
            data: {question_list:question_list,textgroup_list:textgroup_list},
            url: "../get_info",
            type: "GET",
            dataType: 'json',
            success: function(response){
              
                var qdata_cnt = response['qdata'].length;
                for (var i=0;i<qdata_cnt;i++)
                {
                    var qdata = JSON.parse(response['qdata'][i][0]['score']);
                    q_id[i] = JSON.parse(response['qdata'][i][0]['id']);
                    qdata_max[i] =0;
                    for (var j = 0; j<qdata.length; j++)
                    {
                        if (qdata[j] > qdata_max[i]) qdata_max[i] = qdata[j];
                    }
                }
             
                var tdata_cnt = response['tdata'].length;
                for (var i=0;i<tdata_cnt;i++)
                {
                    var tdata = JSON.parse(response['tdata'][i][0]['score']);
                    t_id[i] = JSON.parse(response['tdata'][i][0]['id']);
                    tdata_max[i] =0;
                    for (var j = 0; j<tdata.length; j++)
                    {
                        if (tdata[j] > tdata_max[i]) tdata_max[i] = tdata[j];
                    }
                }

                for (var i=1;i<content.length;i++)
                {
                    for (var j=1;j<content[i].length;j++)
                    {
                        var real_expression= convert_real_expression(content[i][j]);
                        content[i][j]= infix_evaluation(real_expression);
                    }
                }
            },
            error: function(response){
                console.log(response);
            }
        });
    };

    $("#create_chart").on('click',function(){
        var selected_text= $( "#chart_type option:selected").text();
        
        $("#pie-chartdiv").hide();
        $('#bar-chartdiv').hide();
        $('#donut-chartdiv').hide();
        $('#d3bar-chartdiv').hide();
        $('#table_result').hide();

        switch(selected_text)
        {
            case "pie chart":
                {                        
                    pie_chart_draw(content, "");
                    $('#pie-chartdiv').show();
                    break;
                }  
            case "donut chart":
                {
                    donut_chart_draw(content, "");
                    $('#donut-chartdiv').show();
                    break;
                }                
                
            case "bar chart": 
                {
                    bar_chart_draw(content, "");
                    $('#bar-chartdiv').show();
                    break;
                } 
            case "3D bar chart": 
                {
                    d3bar_chart_draw(content, "");
                    $('#d3bar-chartdiv').show();
                    break;
                }               
               
            case "table":
                {   
                    var html_content= `
                                <tr>
                                    <td><input type="text" placeholder="" class="form-control empty-cell" value="  " disabled></td>`;
            
                    for (var j=1;j< content[0].length ; j++)
                    {
                        html_content +=`<td><input type="text" placeholder="" class="form-control head" value="`+content[0][j]+`" disabled></td>`;
                    }
                    html_content += `</tr>`;
            
                    for (var i=1;i<content.length ; i++)
                    {
                        html_content +=`<tr>`;
                        html_content += `<td><input type="text" placeholder="" class="form-control head" value="`+content[i][0]+`" disabled></td>`;

                        for (var j=1;j< content[i].length; j++)
                        {
                            html_content += `<td> <input type="text"  value="`+ content[i][j] +`" class="form-control" ></td>`;
                        }
                        html_content +=`</tr>`;
                    }

                    $('#table_result').html(html_content);
                    $('#table_result').show();
                    break;
                }                       
            {                        
                pie_chart_draw(content);
                $('#pie-chartdiv').show();
                break;
            }
        }
    });      

    $('#col_panel').on('click','.del-btnx',function(){
        $(this).parent().parent().remove();
        matrix_update();
    });

    $('#row_panel').on('click','.del-btnx',function(){
        $(this).parent().parent().remove();
        matrix_update();
    });

    var html_cont;
    $(document).on('change','#mat_set',function(){
        matrix_update();
    });

    let table_td_vals = [];
    var keep_matrix_val = function () {
        $('#real_matrix td input[type="text"]').each(function (i,ele) {
            let input = $(ele).val();
            let id = $(ele).attr("id");
            let td_vals = [];
            if (id != null && id != "") {
                td_vals.push(id);
                td_vals.push($(ele).val());
                table_td_vals.push(td_vals);
            }
            console.log(td_vals);
        });
    }
    var set_matrix_val = function () {
        $('#real_matrix td input[type="text"]').each(function (i,ele) {
            let id = $(ele).attr("id");
            for(let i = 0; i < table_td_vals.length; i++) {
                if(id == table_td_vals[i][0]) {
                    $(ele).val(table_td_vals[i][1]);
                    break;
                }
            }
        });
    }
    var matrix_update=function(){
        table_td_vals = [];
        keep_matrix_val();
        $('#real_matrix').children().remove();
        html_cont= `
                    <tr>
                        <td><input type="text" placeholder="" class="form-control empty-cell" value="  " disabled></td>`;

        for (var i=2;i<= $("#col_panel").children().length ; i++)
        {
            html_cont +=`<td>`;
            var caption = $("#col_panel div:nth-child("+i+")").find("input").val();
            html_cont += `<input type="text" placeholder="" class="form-control head" value="`+caption+`" disabled>`;
            html_cont += `</td>`;
        }
        html_cont += `</tr>`;

        for (var j=2;j<= $("#row_panel").children().length ; j++)
        {
            html_cont +=`<tr><td width="15%">`;
            var caption = $("#row_panel div:nth-child("+j+")").find("input").val();
            html_cont += `<input type="text" placeholder="" class="form-control head" value="`+caption+`" disabled></td>`;

            var row_idx = j - 1;
            for (var i=2;i<= $("#col_panel").children().length ; i++)
            {
                var col_idx = i - 1;
                var idx = col_idx + "_" + row_idx;
                html_cont += `<td> <input type="text"  placeholder="" class="form-control" id="`+idx+`" onfocus="selectItemFunction(event)"></td>`;
            }
            html_cont +=`</tr>`;
        }
        $("#real_matrix").append(html_cont);
        set_matrix_val();
    }
    
    $("#col_add").on('click',function(){
        $("#col_panel").append(`
        <div class="row" >
            <div class="col-2">
                <select class="form-control input-small select2me" data-placeholder="Select..." disabled>
                    <option >Single Input</option>
                    <option >Checkbox</option>
                    <option >Radiogroup</option>
                    <option >Imagepicker</option>
                </select>
            </div>
            <div class="col-2">
                <input type="text" value="Input" style="z-index:20;"  class="form-control">
                
            </div>
            <div class="col-2">
                <a class="btn btn-xs mb-2 btn-danger del-btnx" style="cursor:pointer;" data-id="81">
                    <i class="fa fa-trash" style="color:white"></i>
                </a>
            </div>
        </div>
       `);
       matrix_update();
    });

    $("#row_add").on('click',function(){
        $("#row_panel").append(`
        <div class="row" >
            <div class="col-2">
                <select class="form-control input-small select2me" data-placeholder="Select..." disabled>
                    <option >Single Input</option>
                    <option >Checkbox</option>
                    <option >Radiogroup</option>
                    <option >Imagepicker</option>
                </select>
                      
            </div>
            <div class="col-2">
                <input type="text" value="Input" style="z-index:20;" class="form-control">
                
            </div>
            <div class="col-2">
                <a class="btn btn-xs mb-2 btn-danger del-btnx" style="cursor:pointer;" data-id="11">
                    <i class="fa fa-trash" style="color:white"></i>
                </a>
            </div>
        </div>
       `);
       matrix_update();
    });


    $("#create_chart").hide();
    $("#pie-chartdiv").show();
    $('#bar-chartdiv').hide();
    $('#donut-chartdiv').hide();
    $('#d3bar-chartdiv').hide();
    $('#table_result').hide();

    var content;
    var data = [];
    $('#save_data').on('click',function(e){

        var selected=[],selected_cat=[];
        $('#tests_id option:selected').each(function(){
         selected[$(this).val()]=$(this).val();
           });

         var k=0;
         for (var i=0;i<selected.length; i++)
         {
            if (selected[i] != null && selected[i]!="" )
            {
                selected_cat[k]= selected[i];k++;
            }
                
         }

        content=[];            
        for (var j=0;j< $("#row_panel").children().length ; j++)
        {
            content[j]=[];
            for (var i=0;i< $("#col_panel").children().length ; i++)
                content[j][i] = $('#real_matrix tr:eq('+j+')').find("td:eq("+i+") input[type='text']").val();
        }

        data = {
            'id':$("#chart_id").val(),
            'title':$("#title").val(),
            'test_ids' : JSON.stringify(selected_cat),
            'type_id' : $("#chart_type option:selected").val(),
            'content': JSON.stringify(content)
        }; 
        e.preventDefault();
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        $.ajax({
          data: data ,
          url: "../update",
          type: "POST",
          dataType: 'json',
          complete: function (response) {
            //alert("Data is successfully stored.");             
         
          },
          error: function (response) {
              console.log('Error:', response);
          }
      });

      //location.reload(); 
      ExpressionCalculation();
      $("#create_chart").show();
      $("#save_data").hide();
    });   
  
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });




    var equation_extraction = function(origin_expression){
        var operator=["+","-","*","/","(",")"];
        //var origin_expression="6*(5+(2+3)*8+3)";
        var expression=[];
        expression[0]="";
        var i=0;
        var operator_flag=0;
        for (var t=0;t<origin_expression.length;t++)
        {
            operator_flag=0;
            for (var j=0;j<operator.length;j++)
            {
                if (origin_expression[t]==operator[j])
                {   
                    operator_flag =1 ;break;
                }
            }
            if(operator_flag == 0)
                expression[i]+=origin_expression[t];
            else
            {
                if (expression[i].length>0)
                    i++;
                expression[i]= operator[j];
                if (t != origin_expression.length-1)
                {
                    i++;expression[i]="";
                }  
            }
         
        }

        return expression;
    }
    var precedence =function(c){
        switch (c){
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
  
    var infixToPostFix =function(expression){

        var result = [];
        stack = [];
        for (var i = 0; i <expression.length ; i++) {

            //check if char is operator
            if(precedence(expression[i])>0){
                while(stack.length>0 && precedence(stack[stack.length-1]) >=precedence(expression[i])){
                    result.push(stack.pop());
                }
                stack.push(expression[i]);
            }else if(expression[i]==')'){
                var x = stack.pop();
                while(x!='('){
                    result.push(x);
                    x = stack.pop();
                }
            }else if(expression[i]=='('){
                stack.push(expression[i]);
            }else{
                //character is neither operator nor ( 
                result.push(expression[i]);
            }
        }
      
        for (var i = 0; i <=stack.length ; i++) {
            result.push(stack.pop());
        }
    
        return result;
    }

    var convert_real_expression = function(infix_expression){
        for (var i=0;i<infix_expression.length;i++)
        {
			if(infix_expression[i] !=undefined){
				if (infix_expression[i].includes("question") == true)
				{
                    var queid = infix_expression[i].split("question");
					for (var j=0;j<qdata_max.length; j++)
					{
						if (queid[1] == q_id[j])
							infix_expression[i] =qdata_max[j];
					} 
				}
				else if (infix_expression[i].includes("textgroup") == true)
				{
                    var textid = infix_expression[i].split("question");
					for (var j=0;j<tdata_max.length; j++)
					{
						if (textid[1] == t_id[j])
							infix_expression[i] = tdata_max[j];
					} 
				}
			}
              
        }
        return infix_expression;
    };

    var infix_evaluation= function(infix_expression)
    {
        var temp=[];
        for (var i=0; i<infix_expression.length;i++)
        {
            if(infix_expression[i]=="+" || infix_expression[i]=="-" || infix_expression[i]=="*" || infix_expression[i]=="/")
            {
                var first_num = parseFloat(temp.pop());
                var second_num = parseFloat(temp.pop());
                if (infix_expression[i]=="+" )
                    temp.push( first_num + second_num);
                else if(infix_expression[i]=="-" )
                    temp.push( first_num - second_num);
                else if(infix_expression[i]=="*" )
                    temp.push( first_num * second_num);
                else
                    temp.push( first_num / second_num);                
            }
            else{
                temp.push(infix_expression[i]);
            }
        }
        return temp.pop();
    }



    return {
        //main function to initiate the module
        init: function () {
    

        }

    };

}();

var selectedItemID = "1_1";
function selectItemFunction(e){
    selectedItemID = e.target.id;
}


function selectQuestion(e,data_testid,data_count) {
    if(data_count != null) {
        var questionItem = document.getElementsByClassName('question-item');
        var text = e.target.innerText;
        var t_a = text.split('.');
        text = 'question' + t_a[0];
        var data_testid = data_testid;
        var selected_val = text;
        if ($('#' + selectedItemID).val() != "" && $('#' + selectedItemID).val() != " ")
            selected_val = $('#' + selectedItemID).val() + "+" + text;
        $("#" + selectedItemID).val(selected_val);
    }
}
function selectMatrixQuestion(e,data_testid,data_count) {
    var text = e.target.innerText;
    var t_a = text.split('.');
    if(data_count != 4)
        text = 'question'+t_a[0];
    var selected_val = text;
    if($('#'+selectedItemID).val() != "" && $('#'+selectedItemID).val() != " ")
        selected_val = $('#'+selectedItemID).val() + "+" + text;
    $("#"+selectedItemID).val(selected_val);
}


