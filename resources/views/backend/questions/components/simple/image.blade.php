{{-- Image --}}
@php
    $image_count = 2;
    if(isset($question->content) && $question->content != null){
        $content = json_decode($question->content);
        if(is_array($content)){
            $col = isset($content[(sizeof($content))-1]->col)?$content[(sizeof($content))-1]->col:'';
        }
        else{
            $col = '';
        }
        
    }
@endphp
<div id="image_part" class="row question-box" @if(isset($display)) style="display:{{$display}};" @endif>
    <div class="col-12">
        <label for="">Select Display</label>
        <select name="image_file_display" class="form-control" id="image_file_display">
            <option value="col-12" {{isset($content)?($col == 'col-12')?'selected':'':''}}>1</option>
            <option value="col-6" {{isset($content)?($col == 'col-6')?'selected':'':''}}>2</option>
            <option value="col-3" {{isset($content)?($col == 'col-3')?'selected':'':''}}>3</option>
            <option value="col-4" {{isset($content)?($col == 'col-4')?'selected':'':''}}>4</option>
        </select>
    </div>
    <div class="col-md-12 form-body">                                    
        <div class="form-group ">
            <!-- <label class="control-label col-md-3">Image Upload</label> -->
            <div class="col-md-9">
                <form method="POST" enctype="multipart/form-data" class="image-upload-form" action="javascript:void(0)" id="sortable-13">
                    @csrf
                    <div class="form-group " id="sortable-11">
                        <div class="input-group hdtuto control-group lst increment image_part_file" >
                                <input type="file" name="file[]" class="b-images myfrm form-control images" value="">
                                <input  class="imge_names" type="hidden"  value="">
                                <div class="input-group-btn"> 
                                    <button class="btn btn-success add-btn" type="button">+</button>
                                </div>
                                <label  style="margin-left:5vw;margin-right:1vw;">Score</label>
                                <input  class="image_score" type="text"   value="" style="margin-right:1vw">
                        </div>
                        <div class="clone">
                            @if(isset($content) && !empty($content[0]->image))
                                    @foreach($content[0]->image as $key=>$c)
                                            <div class="image_part_file" >
                                                <div class="hdtuto control-group lst input-group" style="margin-top:10px">
                                                    <input type="file" name="file" class="b-images images myfrm form-control" value="{{$c}}">
                                                    <input  class="imge_names" type="hidden"  value="{{$c}}">
                                                    <div class="input-group-btn"> 
                                                    <button class="btn btn-danger del-btn" type="button"><i class="fa fa-trash" style="color:white"></i></button>
                                                    </div>
                                                    <label  style="margin-left:5vw;margin-right:1vw;">Score</label>
                                                    <input  class="image_score" type="text"   value="{{$content[0]->score[$key]}}" style="margin-right:1vw">
                                                </div>                                    
                                            </div>
                                    @endforeach
                                @else
                                    <div class="image_part_file" >
                                        <div class="hdtuto control-group lst input-group" style="margin-top:10px">
                                            <input type="file" name="file[]" class="b-images images myfrm form-control q">
                                            <div class="input-group-btn"> 
                                            <button class="btn btn-danger del-btn" type="button"><i class="fa fa-trash" style="color:white"></i></button>
                                            </div>
                                            <label  style="margin-left:5vw;margin-right:1vw;">Score</label>
                                            <input  class="image_score" type="text"   value="" style="margin-right:1vw">
                                    
                                        </div>                                  
                                    </div>
                                @endif
                        </div>
                    </div>
                    
            
                {{-- <button type="submit" class="btn btn-success" style="margin-top:10px">Submit</button>     --}}
                </form>
            </div>
        </div>            
    </div>
</div>   
{{-- End Image --}}