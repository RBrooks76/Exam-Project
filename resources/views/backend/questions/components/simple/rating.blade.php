{{-- Rating --}}
<div id="rating_part" class="row question-box" @if(isset($display)) style="display:{{$display}};" @endif>
    <div class="col-12">
        <!--  <a id="rating_add" class="btn btn-success" style="color:white; margin-top:10px;">+ New</a> -->
        <div class="mb-3">
            <label for="color">Select Color</label>
            <input type="color" name="color" id="color" class="form-control" >
        </div>
    </div>
    <div class="col-12">
        <label for="">Select Display</label>
        <select name="display_rating" class="form-control" id="display_rating">
            <option value="col-12">1</option>
            <option value="col-6">2</option>
            <option value="col-3">3</option>
            <option value="col-4">4</option>
        </select>
    </div>
    <div class="col-12 form-group" id="sortable_rating">
    
        @if(isset($content))
            @php
                $content = json_decode($content);
            @endphp
            
            @foreach($content as $key=>$c)
                @if(($key) <= (sizeof($content)-3))

                <div class="radio">
                    <label  style="color:transparent"><input type="radio" name="optradio" checked>Option</label>
                    <input class="radio_label" type="text" value="{{$c->label}}" style="margin-left:-2vw;;margin-right:5vw;z-index:20;" required>
                    <label  >Score</label>
                    <input  class ="radio_score" type="text"   value="{{$c->score}}" style="margin-right:1vw" required>
                    <a class="btn btn-xs mb-2 btn-danger del-btnx" style="cursor:pointer;" data-id="41">
                        <i class="fa fa-trash" style="color:white"></i>
                    </a>
                </div>
                @endif
            @endforeach
        @else
            <div class="radio">
                <label  style="color:transparent"><input type="radio" name="optradio" checked>Option</label>
                <input class="radio_label" type="text" value="1" style="margin-left:-2vw;;margin-right:5vw;z-index:20;" required>
                <label  >Score</label>
                <input  class ="radio_score" type="text"   value="0" style="margin-right:1vw" required>
                <a class="btn btn-xs mb-2 btn-danger del-btnx" style="cursor:pointer;" data-id="41">
                    <i class="fa fa-trash" style="color:white"></i>
                </a>
            </div>
            <div class="radio">
                <label  style="color:transparent"><input type="radio" name="optradio" >Option</label>
                <input class="radio_label" type="text" value="2" style="margin-left:-2vw;;margin-right:5vw;z-index:20;" required>
                <label  >Score</label>
                <input  class ="radio_score" type="text"   value="0" style="margin-right:1vw" required>
                <a class="btn btn-xs mb-2 btn-danger del-btnx" style="cursor:pointer;" data-id="42">
                    <i class="fa fa-trash" style="color:white"></i>
                </a>
            </div>
    
            <div class="radio">
                <label  style="color:transparent"><input type="radio" name="optradio" >Option</label>
                <input class="radio_label" type="text" value="3" style="margin-left:-2vw;margin-right:5vw;z-index:20;" required>
                <label  >Score</label>
                <input  class ="radio_score" type="text"   value="0" style="margin-right:1vw" required>
                <a class="btn btn-xs mb-2 btn-danger del-btnx" style="cursor:pointer;" data-id="42">
                    <i class="fa fa-trash" style="color:white"></i>
                </a>
            </div>
    
            <div class="radio">
                <label  style="color:transparent"><input type="radio" name="optradio" >Option</label>
                <input class="radio_label" type="text" value="4" style="margin-left:-2vw;;margin-right:5vw;z-index:20;" required>
                <label  >Score</label>
                <input  class ="radio_score" type="text"   value="0" style="margin-right:1vw" required>
                <a class="btn btn-xs mb-2 btn-danger del-btnx" style="cursor:pointer;" data-id="42">
                    <i class="fa fa-trash" style="color:white"></i>
                </a>
            </div>
            <div class="radio">
                <label  style="color:transparent"><input type="radio" name="optradio" >Option</label>
                <input class="radio_label" type="text" value="5" style="margin-left:-2vw;;margin-right:5vw;z-index:20;" required>
                <label  >Score</label>
                <input  class ="radio_score" type="text"   value="0" style="margin-right:1vw" required>
                <a class="btn btn-xs mb-2 btn-danger del-btnx" style="cursor:pointer;" data-id="42">
                    <i class="fa fa-trash" style="color:white"></i>
                </a>
            </div>
        @endif

        <p class="help-block"></p>
        @if($errors->has('question'))
            <p class="help-block">
                {{ $errors->first('question') }}
            </p>
        @endif
    </div>
</div>
{{-- End Rating --}}