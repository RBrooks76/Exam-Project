var ReportCreate = function () {
    var chart_data;
    var textgroup_data;


/*
    CKEDITOR.instances["summary-ckeditor"].on('change',function(){
         var ck_content = CKEDITOR.instances["summary-ckeditor"].getData();
             
         if (ck_content.includes('[text id=')==true)
         {
            for (var i=0;i<textgroup_data.length;i++)
            {
                var con= JSON.parse(textgroup_data[i]['content']);
                ck_content= ck_content.replace(textgroup_data[i]['short_code'],con[0]);
            } 
            $("#preview").html(ck_content);
         }

        if (ck_content.includes('[chart id=')==true)
         {
            
            for (var i=0;i<chart_data.length;i++)
            {
                if(ck_content.includes(chart_data[i]['short_code'])==true)
                {
                    var content_chart=[["","col1"],["row1","42"],["row2","32"]];
                    if (chart_data[i]['type']==0)
                    {
                        var chartdiv=`<div id="pie-chartdiv" class="col-12" style="width:500px;height:500px;"></div>`;
                        ck_content=ck_content.replace(chart_data[i]['short_code'],chartdiv);
                        $("#preview").html(ck_content);  
                        pie_chart_draw(content_chart, "");
                    }
                    else if (chart_data[i]['type']==1)
                    {
                        var chartdiv=`<div id="donut-chartdiv" class="col-12" style="width:500px;height:500px;"></div>`;
                        ck_content=ck_content.replace(chart_data[i]['short_code'],chartdiv);
                        $("#preview").html(ck_content);  
                        donut_chart_draw(content_chart, "");
                    }
                    else if (chart_data[i]['type']==2)
                    {
                        var chartdiv=`<div id="bar-chartdiv" class="col-12" style="width:500px;height:500px;"></div>`;
                        ck_content=ck_content.replace(chart_data[i]['short_code'],chartdiv);
                        $("#preview").html(ck_content);  
                        bar_chart_draw(content_chart, "");
                    }
                    else if (chart_data[i]['type']==3)
                    {
                        var chartdiv=`<div id="d3bar-chartdiv" class="col-12" style=style="width:500px;height:500px;">chart</div>`;
                        ck_content=ck_content.replace(chart_data[i]['short_code'],chartdiv);
                        $("#preview").html(ck_content);  
                        d3bar_chart_draw(content_chart, "");
                    }
                    else if (chart_data[i]['type']==4)
                    {
                        var chartdiv=`<div id="d3bar-chartdiv" class="col-12" style=style="width:500px;height:500px;">chart</div>`;

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

                        ck_content=ck_content.replace(chart_data[i]['short_code'],chartdiv);
                        $("#preview").html(ck_content);  
                    }
                }                  
            }
         }
    });  */

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
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
            if (selected[i]!= null || typeof(selected[i]) !=  "undefined") 
                {
                    selected_cat[k]= selected[i];
                    k++;
                }
         }

        var origin_content = CKEDITOR.instances["summary-ckeditor"].getData();
        origin_content = origin_content.toString();
        content = "";
        //content = $("#preview").html().toString();

        data = {  
            'title':$("#title").val(),              
            'test_ids' : JSON.stringify(selected_cat),
            'origin_content': JSON.stringify(origin_content),
            'content': JSON.stringify(content),
        }; 
        e.preventDefault();
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        $.ajax({
          data: {data:data} ,
          url: "store",
          type: "POST",
          dataType: 'json',
          complete: function (response) {
          
            alert("Data is successfully stored");             
         
          },
          error: function (response) {
              console.log('Error:', response);
          }
      });

      //location.reload(); 
   
    }); 

    return {
        //main function to initiate the module
        init: function () {   
          
                $.ajax({
                    //data: {id:qt_id},
                    url: "get_code",
                    type: "GET",
                    dataType: 'json',
                    success: function(response){
                        chart_data=response.charts;
                        textgroup_data =response.textgroups;   
                    },
                    error: function(response){
                        console.log(response);
                    }
                });
             
        }
    };

}();





