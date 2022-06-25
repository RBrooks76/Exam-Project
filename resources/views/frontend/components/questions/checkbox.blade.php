<div class="mb-2">
    <div class="checkbox-input" data-required="@if($question->required=="1") 1 @else 0 @endif">
        @php
            $temp_val =1;
            $content = json_decode($question->content);
        @endphp
        <div class="row">
            @foreach($content as $key => $c)
            @if(($key+1) != (sizeof($content)))
            <div class="{{$content[(sizeof($content)-1)]->col}}">
                <div class="form-check">
                    <div class="square-check gradient-bg">
                    <!-- <input class="form-check-input" type="checkbox" data-qid="{{$question->id}}" data-score="{{$c->score}}" name="flexRadioDefault"  id="checkbox_{{$question->id."_".$temp_val}}"> -->
                        <input class="form-check-input" type="checkbox" data-qid="{{$question->id}}"  value="{{$c->score}}" {{(isset($identy[$question->id]))?($identy[$question->id]==$c->score)?'data-opendiv='.$ids[$question->id]:'':''}} name="flexRadioDefault"  id="{{$question->id}}">
                        {{$c->label}}
                        <div class="square-check--content"></div>
                    </div>
                </div>
            </div>
            @endif
                @php
                    $temp_val++;
                @endphp
            @endforeach
        </div>
    </div>
    <span class="message mt-2"></span>
</div>