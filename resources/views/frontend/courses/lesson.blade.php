@extends('frontend.layouts.app'.config('theme_layout'))

@push('after-styles')
    {{--<link rel="stylesheet" href="{{asset('plugins/YouTube-iFrame-API-Wrapper/css/main.css')}}">--}}
    <link rel="stylesheet" href="https://cdn.plyr.io/3.5.3/plyr.css"/>
    <link href="{{asset('plugins/touchpdf-master/jquery.touchPDF.css')}}" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
    <link href="https://unpkg.com/survey-core@1.8.63/modern.min.css" type="text/css" rel="stylesheet"/>
    {{-- Custom CSS --}}
    <link rel="stylesheet" href="{{asset('css/custom.css')}}">
  
    <script type="text/javascript" src="{{asset('js/3.5.1/jquery.min.js')}}"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
    <script src="https://unpkg.com/knockout@3.5.1/build/output/knockout-latest.js"></script>
    <script src="https://unpkg.com/survey-knockout@1.8.63/survey.ko.min.js"></script>
    <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
        
    <script type="text/javascript" src="{{asset('js/user-question.js')}}"></script>
@endpush

@section('content')
    {{-- Breadcrumb Section --}}
    <section id="breadcrumb" class="breadcrumb-section relative-position backgroud-style">
        <div class="blakish-overlay"></div>
        <div class="container">
            <div class="page-breadcrumb-content text-center">
                <div class="page-breadcrumb-title">
                    <h2 class="breadcrumb-head black bold">
                        <span>{{$lesson->course->title}}</span><br> {{$lesson->title}} </h2>
                </div>
            </div>
        </div>
    </section>
    {{-- End Breadcrumb Section --}}

    <section id="course-details" class="course-details-section">
        <div class="container">
         <!--  <div class="circle_percent" data-percent="{{ $lesson->course->progress()  }}">
            <div class="circle_inner">
                <div class="round_per"></div>
            </div>
          </div> -->
          
        <div class="row">
            
           {{-- Progress Bar --}}
            <!-- <div class="col-md-12 text-center">
                <b><p>Progress {{ $lesson->course->progress()  }}% Completed</p></b>
                <div class="progress mx-auto custom-progress-bar" style="width: 50%;">
                    <div class="progress-bar progress-bar-striped bg-danger" style="width:{{ $lesson->course->progress()  }}%"></div>
                    <div class="circle" style="left:{{$lesson->course->progress()-5}}%;">
                        {{ $lesson->course->progress() }}%
                    </div>
                </div>
            </div> -->
            <!-- Bilal Code -->
            <!-- <div class="row w-100  justify-content-md-center mb-5">
                <div class="b_progress_container ">
                    <div class="b_progress_bar" style="width:{{$lesson->course->progress()}}%;">
                        
                    </div>
                    <div class="b_progress" >
                        {{ $lesson->course->progress() }}%
                    </div>
                </div>
            </div> -->
            @php          
                            
                $percent = $lesson->course->progress();
                $exists = \DB::table('courses')->where('id',$lesson->course_id)->count();
                if($exists){
                    $percent = (isset($percentage[$test_id_f]))?$percentage[$test_id_f]:'0';
                    $percent = round($percent,2);
                }
            @endphp
            <div class="row w-100  justify-content-md-center mb-5">
                <div class="b_progress_container">
                    <div class="b_progress_bar gradient-bg" style="width:{{$percent}}%;">
                        
                    </div>
                    <div class="b_progress gradient-bg" style="left:{{ $percent == 0 ? $percent: $percent- 7.5}}%;">
                        {{ $percent }}%
                    </div>
                </div>
            </div>
            <!-- End Bilal Code -->
            {{-- End Progress Bar --}}
        </div>
        <div class="row mt-5">
                {{-- Content --}}
                <div class="col-md-8">

                    
                    @if(session()->has('success'))
                        <div class="alert alert-dismissable alert-success fade show">
                            <button type="button" class="close" data-dismiss="alert">&times;</button>
                            {{session('success')}}
                        </div>
                    @endif
                    @include('includes.partials.messages')
                    <input type="hidden" id="test_id" name="lesson_id" value="{{$lesson->id}}" >
                    
                    <div class="course-details-item border-bottom-0 mb-0">

                        @if($lesson->lesson_image != "")
                            <div class="course-single-pic mb30">
                                <img src="{{asset('storage/uploads/'.$lesson->lesson_image)}}"
                                     alt="">
                            </div>
                        @endif

                        @if ($test_exists)
                            <div class="course-single-text">
                                <div class="course-title mt10 headline relative-position">
                                    <h3>
                                        <b>@lang('labels.frontend.course.test')
                                            : {{$lesson->title}}</b>
                                    </h3>
                                </div>
                                <div class="course-details-content">
                                    <p> {!! $lesson->full_text !!} </p>
                                </div>
                            </div>
                            <hr/>
                            @if (!is_null($test_result))
                                <div class="alert alert-info">
                                    @lang('labels.frontend.course.your_test_score') : {{ $test_result->test_result }}
                                </div>

                                @if(config('retest'))
                                    <form action="{{route('lessons.retest',[$test_result->test->slug])}}" method="post" >
                                        @csrf
                                        <input type="hidden" name="result_id" value="{{$test_result->id}}">
                                        <button type="submit" class="btn gradient-bg font-weight-bold text-white"
                                                href="">
                                            @lang('labels.frontend.course.give_test_again')
                                        </button>
                                        
                                    </form>
                                @endif

                                @if(count($lesson->questions) > 0  )
                                    <hr>
                                    @foreach ($lesson->questions as $question)
                                        <h4 class="mb-0">
                                            {{ $loop->iteration }}. {!! $question->question !!}
                                            @if(!$question->isAttempted($test_result->id))
                                                <small class="badge badge-danger"> @lang('labels.frontend.course.not_attempted')</small>
                                            @endif
                                        </h4>
                                        <br/>
                                        <ul class="options-list pl-4">
                                            @foreach ($question->options as $option)
                                                <li class="@if(($option->answered($test_result->id) != null && $option->answered($test_result->id) == 1) || ($option->correct == true)) correct @elseif($option->answered($test_result->id) != null && $option->answered($test_result->id) == 2) incorrect  @endif"> {{ $option->option_text }}
                                                    @if($option->correct == 1 && $option->explanation != null)
                                                        <p class="text-dark">
                                                            <b>@lang('labels.frontend.course.explanation')</b><br>
                                                            {{$option->explanation}}
                                                        </p>
                                                    @endif
                                                </li>
                                            @endforeach
                                        </ul>
                                        <br/>
                                    @endforeach
                                @else
                                    <h3>@lang('labels.general.no_data_available')</h3>
                                @endif
                            @else
                                {{-- Test --}}
                                <div class="test-form">
                                    @if(count($lesson->questions) > 0  )
                                        <form action="{{ route('lessons.test', [$lesson->slug]) }}" method="post">
                                            @csrf
                                            <div id="question_form">
                                                @include('frontend.components.questions.questions')
                                            </div>
                                        </form>
                                    @endif
                                </div>
                                {{-- End Test --}}
                            @endif
                        @endif

                    </div>
                    
                    {{-- Report --}}
                    <div  id="report">

                    </div>
                    {{-- End Report --}}

                </div>
                {{-- End Content --}}

                {{-- Right Side Bar --}}
                <div class="col-md-4">
                    <div id="sidebar" class="sidebar">
                        <div class="course-details-category ul-li">
                            @if ($previous_lesson)
                                <p><a class="btn btn-block gradient-bg font-weight-bold text-white"
                                      href="{{ route('lessons.show', [$previous_lesson->course_id, $previous_lesson->model->slug]) }}"><i
                                                class="fa fa-angle-double-left"></i>
                                        @lang('labels.frontend.course.prev')</a></p>
                            @endif

                            <p id="nextButton">
                                @if($next_lesson)
                                    @if((int)config('lesson_timer') == 1 && $lesson->isCompleted() )
                                        <a class="btn btn-block gradient-bg font-weight-bold text-white"
                                           href="{{ route('lessons.show', [$next_lesson->course_id, $next_lesson->model->slug]) }}">@lang('labels.frontend.course.next')
                                            <i class='fa fa-angle-double-right'></i> </a>
                                    @else
                                        <a class="btn btn-block gradient-bg font-weight-bold text-white"
                                           href="{{ route('lessons.show', [$next_lesson->course_id, $next_lesson->model->slug]) }}">@lang('labels.frontend.course.next')
                                            <i class='fa fa-angle-double-right'></i> </a>
                                    @endif
                                @endif
                            </p>
                            @if($lesson->course->progress() == 100)
                                @if(!$lesson->course->isUserCertified())
                                    <form method="post" action="{{route('admin.certificates.generate')}}">
                                        @csrf
                                        <input type="hidden" value="{{$lesson->course->id}}" name="course_id">
                                        <button class="btn btn-success btn-block text-white mb-3 text-uppercase font-weight-bold"
                                                id="finish">@lang('labels.frontend.course.finish_course')</button>
                                    </form>
                                @else
                                    <div class="alert alert-success">
                                        @lang('labels.frontend.course.certified')
                                    </div>
                                @endif
                            @endif


                            <span class="float-none">@lang('labels.frontend.course.course_timeline')</span>
                            <ul class="course-timeline-list">
                                @foreach($lesson->course->courseTimeline()->orderBy('sequence')->get() as $key=>$item)
                                    @if($item->model && $item->model->published == 1)
                                        {{--@php $key++; @endphp--}}
                                        <li class="@if($lesson->id == $item->model->id) active @endif ">
                                            <a @if(in_array($item->model->id,$completed_lessons))href="{{route('lessons.show',['course_id' => $lesson->course->id,'slug'=>$item->model->slug])}}"@endif>
                                                {{$item->model->title}}
                                                @if($item->model_type == 'App\Models\Test')
                                                    <p class="mb-0 text-primary">
                                                        - @lang('labels.frontend.course.test')</p>
                                                @endif
                                                @if(in_array($item->model->id,$completed_lessons)) <i
                                                        class="fa text-success float-right fa-check-square"></i> @endif
                                            </a>
                                        </li>
                                    @endif
                                @endforeach
                            </ul>
                        </div>
                        <div class="couse-feature ul-li-block">
                            <ul>
                                <li>@lang('labels.frontend.course.chapters')1111111111111
                                    <span> {{$lesson->course->chapterCount()}} </span></li>
                                <li>@lang('labels.frontend.course.category') <span><a
                                                href="{{route('courses.category',['category'=>$lesson->course->category->slug])}}"
                                                target="_blank">{{$lesson->course->category->name}}</a> </span></li>
                                <li>
                                    @lang('labels.frontend.course.author')
                                    <span>
                                        @foreach($lesson->course->teachers as $key=>$teacher)
                                            @php $key++ @endphp
                                            <a href="{{route('teachers.show',['id'=>$teacher->id])}}" target="_blank">
                                            {{$teacher->full_name}}@if($key < count($lesson->course->teachers )), @endif
                                            </a>
                                        @endforeach
                                    </span>
                                </li>
                               {{-- <li>@lang('labels.frontend.course.progress') <span> <b> {{ $lesson->course->progress()  }}
                                            % @lang('labels.frontend.course.completed')</b></span></li> --}}
                            </ul>

                        </div>
                    </div>
                </div>
                {{-- End Right Side Bar --}}
            </div>
        </section>

@endsection

@push('after-scripts')
    <script>
        
        function test(ele){
            alert("$(ele).val()");
        }
        if(document.getElementById('range') != null){
        $(function() {
            const range = document.getElementById('range'),
            tooltip = document.getElementById('tooltip'),
            setValue = ()=>{
                const
                    newValue = Number( (range.value - range.min) * 100 / (range.max - range.min) ),
                    newPosition = 16 - (newValue * 0.32);
                tooltip.innerHTML = `<span>${(parseInt(range.value))}</span>`;
                tooltip.style.left = `calc(${newValue}% + (${newPosition}px))`;
                document.documentElement.style.setProperty("--range-progress", `calc(${newValue}% + (${newPosition}px))`);
            };
            document.addEventListener("DOMContentLoaded", setValue);
            range.addEventListener('input', setValue);
            setValue();
        });
       }
        $('.rangeslider').on('input',function(){
                $(this).val();
                $(this).parent('.range').find('output').html($(this).val());
            });
        $(".btn-minus").click(function(){
            var value = $(this).closest('.radiogroup').find(".rangevalue").val();
            value--;
           $(this).closest('.radiogroup').find(".rangevalue").val(value);
        });
        $(".btn-plus").click(function(){
            var value = $(this).closest('.radiogroup').find(".rangevalue").val();
            value++;
            $(this).closest('.radiogroup').find(".rangevalue").val(value);
        });
        $(".rating-stars .star").click(function(){
           var value = $(this).data('value');
           $(this).closest('.rating-stars').find('.star i').css('color','#cccccc');
           $(this).closest('.rating-stars').find('.starinput').val(value);
           var color = $(this).closest('.rating-stars').find('.star_color').val();
           for(i=1;i<=value;i++){
               $(this).closest('.rating-stars').find('.star-'+i+' i').css('color',color);
           }
        });
        $(".rate").click(function(){
           var value = $(this).data('value');
           $(this).closest('.rating-box').find('.rate').css('background','#cccccc');
           var color = $(this).closest('.rating-box').find('.star_color').val() ?? '#fcb103';
           $(this).closest('.rating-box').find('.ratinginput').data("selected","true");
           var rating_input = $(this).closest('.rating-box').find('.ratinginput')[0];
           rating_input.dataset.selected = true;
           console.log(rating_input.dataset.selected);
           $(this).closest('.rating-box').find('.ratinginput').val(value);
           $(this).css('background',color);
        });
        $(".btn-add-answer").click(function(){
            var html = '<div class="mb-2"><input type="text" class="form-control" placeholder="Write your answer"><span class="message"></span></div>';
            $(this).closest('.single-input').find('.more_answers').append(html);
        });
        $(".square-check").click(function(){
            var opendivid = $(this).find('input[type=checkbox]').data('opendiv')
            if(opendivid != undefined){
                // $("#question"+opendivid).removeClass('d-none');
                $("#question"+opendivid).toggleClass('d-none');
                // $("#question"+opendivid).addClass('bilal-hide-class');
            }
       
           var v = $(this).find('input[type=checkbox]').prop('checked');
           $(this).find('input[type=checkbox]').prop('checked',!v);
           $(this).toggleClass('toggle_btn_active');
        });
        var image_part_data = [];
       
    var question_img_data = [];
    $("#file").on('change', function(e) {
        e.preventDefault();
        // var formData = new FormData($("#user_type_image")[0]);
        // var formData = new FormData();
        // formData.append("file",$("#question_type_image").files[0]);
        var data = new FormData();
        // $.each($('#img')[0].files, function(i, file) {
        console.log("aaa =" + $('#file')[0].files[0]);
        data.append('file', $('#file')[0].files[0]);
        // });
        // var a, index, entry;
        // a = $("#question_type_image").serializeArray();
        // for (index = 0; index < a.length; ++index) {
        // entry = a[index];
        // console.log("a[" + index + "]: " + entry.name + "=" + entry.value);
        // }
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
        $.ajax({
            type: 'POST',
            url: `{{route('user_upload_images')}}`,
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            success: function(response) {
                swal('Immagine salvata con successo','Image uploaded to the server.','success');
                $("#user_upload_file").val(response.img_name);
                $(".files_user").val(response.img_name);
            },
            error: function(response) {
                swal('error','Error in uploading the image.','error');
                console.log(response);
            }
        })
    });
   
        /*var questions = $(".question-card").length;
        var $current_page = 1;
        if(questions>10){
            $("#navigation-btns").show();
            $("#pre-pg").prop('disabled',true);
            $("#create-report").hide();

            $(".fields").slice(0, 3).each(function(index) {
                // Do whatever you want to the first three elements
            }
        }
        $("#next-pg").click(function(){
            
        });*/
    </script>
@endpush
