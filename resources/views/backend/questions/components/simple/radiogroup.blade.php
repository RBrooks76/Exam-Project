{{-- Radio Group --}}
<div id="radiogroup" class="row question-box" @if(isset($display)) style="display:{{$display}};" @endif>
    <div class="col-12">
        <a id="radio_add" href="javascript:void(0);" class="btn btn-success">+ New</a>
    </div>
    <div class="col-12">
        <label for="">Select Display</label>
        <select name="display_radio" class="form-control" id="display_radio">
            <option value="col-12">1</option>
            <option value="col-6">2</option>
            <option value="col-3">3</option>
            <option value="col-4">4</option>
        </select>
    </div>
    <div class="col-12  form-group " id="sortable-11">
    <!-- <form> --> 
    @if(isset($content) && $content !=  '')
        @php
            $radioContent = json_decode($content);  
        @endphp

        @foreach($radioContent as $key=>$c)
            @if(($key+1) != sizeof($radioContent))
            <div class="radio">
                <label  style="color:transparent"><input type="radio" name="optradio" checked>Option 1</label>
                <input class="radio_label" type="text" value="{{$c->label}}" style="margin-left:-2vw;;margin-right:5vw;z-index:20;border:none;">
                <label  >Score</label>
                <input  class ="radio_score" type="text"   value="{{$c->score}}" style="margin-right:1vw">
                <a class="btn btn-xs mb-2 btn-danger del-btnx" style="cursor:pointer;" data-id="41">
                    <i class="fa fa-trash" style="color:white"></i>
                </a>
            </div>
            @endif
        @endforeach
    @else
        <div class="radio">
            <label  style="color:transparent"><input type="radio" name="optradio" checked>Option 1</label>
            <input class="radio_label" type="text" value="radio1" style="margin-left:-2vw;;margin-right:5vw;z-index:20;border:none;">
            <label  >Score</label>
            <input  class ="radio_score" type="text"   value="" style="margin-right:1vw">
            <a class="btn btn-xs mb-2 btn-danger del-btnx" style="cursor:pointer;" data-id="41">
                <i class="fa fa-trash" style="color:white"></i>
            </a>
        </div>
        <div class="radio">
            <label  style="color:transparent"><input type="radio" name="optradio" >Option 2</label>
            <input class="radio_label" type="text" value="radio1" style="margin-left:-2vw;;margin-right:5vw;z-index:20;border:none;">
            <label  >Score</label>
            <input  class ="radio_score" type="text"   value="" style="margin-right:1vw">
            <a class="btn btn-xs mb-2 btn-danger del-btnx" style="cursor:pointer;" data-id="42">
                <i class="fa fa-trash" style="color:white"></i>
            </a>
        </div>
        <div class="radio">
            <label  style="color:transparent"><input type="radio" name="optradio" >Option 2</label>
            <input class="radio_label" type="text" value="radio1" style="margin-left:-2vw;;margin-right:5vw;z-index:20;border:none;">
            <label  >Score</label>
            <input   class ="radio_score"  type="text"   value="" style="margin-right:1vw">
            <a class="btn btn-xs mb-2 btn-danger del-btnx" style="cursor:pointer;" data-id="43">
                <i class="fa fa-trash" style="color:white"></i>
            </a>
        </div>
    @endif
    </div>
</div>
{{-- End Radio Group --}}