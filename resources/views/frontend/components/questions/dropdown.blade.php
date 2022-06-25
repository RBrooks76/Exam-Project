<div class="mb-2 dropdowninput" data-required="@if($question->required=="1") 1 @else 0 @endif">

    <div class="form-group">
        <label for="">Select Value</label>
        <select class="form-control dropdown"  id="{{$question->id}}">
        
          <option value="" selected>Select Option</option>
          
            @foreach($content as $key=>$c)
              @if($key != (sizeof($content)-1))
              <option value="{{$c->score}}">{{$c->label}}</option>
              @endif
            @endforeach
        </select>
  </div>
  <span class="message mt-2"></span>
</div>