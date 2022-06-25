<div class='rating-stars' data-required="@if($question->required=="1") 1 @else 0 @endif">
    <ul id='stars{{ $question->id }}'>
        <li class='star star-1' title='Poor' data-value='1'>
            <i class='fa fa-star fa-fw'></i>
        </li>
        <li class='star star-2' title='Fair' data-value='2'>
                <i class='fa fa-star fa-fw'></i>
        </li>
        <li class='star star-3' title='Good' data-value='3'>
                <i class='fa fa-star fa-fw'></i>
        </li>
        <li class='star star-4' title='Excellent' data-value='4'>
            <i class='fa fa-star fa-fw'></i>
        </li>
        <li class='star star-5' title='WOW!!!' data-value='5'>
            <i class='fa fa-star fa-fw'></i>
        </li>
    </ul>
    @php
        $i=1;
        $color = "#fcb103";
    @endphp
    @foreach($content as $c)
        @if(isset($c->color))
            @php
                $color = $c->color;
            @endphp
        @endif
    @endforeach
    <input type="hidden" name="star_color" class="star_color" value="{{$color}}">
    <input type="hidden" class="starinput" id="{{ $question->id }}" data-qid="{{ $question->id }}" value="0" data-selected="false">
    <span class="message mt-2"></span>
</div>