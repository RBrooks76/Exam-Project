<?php

namespace App\Http\Controllers;

use App\Helpers\Auth\Auth;
use App\Mail\Frontend\LiveLesson\StudentMeetingSlotMail;
use App\Models\Lesson;
use App\Models\LessonSlotBooking;
use App\Models\LiveLessonSlot;
use App\Models\Media;
use App\Models\Question;
use App\Models\QuestionsOption;
use App\Models\Test;
use App\Models\TestsResult;
use App\Models\VideoProgress;
use Illuminate\Http\Request;
use DB;
use Faker\Provider\Barcode;

class LessonsController extends Controller
{
    private $path;

    public function __construct()
    {
        $path = 'frontend';
        if (session()->has('display_type')) {
            if (session('display_type') == 'rtl') {
                $path = 'frontend-rtl';
            } else {
                $path = 'frontend';
            }
        } else if (config('app.display_type') == 'rtl') {
            $path = 'frontend-rtl';
        }
        $this->path = $path;
    }

    public function updateprofilepic(Request  $request){
            $user_id = auth()->user()->id;
           $question_id= $request->post('question_id');
                
            if($_FILES["fileUpload"]["name"] != '')
                {
                 $test = explode('.', $_FILES["fileUpload"]["name"]);
                 $ext = end($test);
                 $name = rand(100, 999) . '.' . $ext;
                 $location = public_path('/assets/img/').$name;  
                 move_uploaded_file($_FILES["fileUpload"]["tmp_name"], $location);
                 //$request->image->move(public_path('/assets/img'), $name);

                 $data = [
                'answer' => $name,
                ];
                
                 $question_data = DB::table('questions')
                ->where('id',$question_id)      
                ->first();
            $score = json_decode($question_data->score);

            if ($question_data->questiontype ==1 || $question_data->questiontype == 2 || $question_data->questiontype == 3 || $question_data->questiontype ==7)
            {
                $k =0; $score_temp=0;
                
            }
            else if ($question_data->questiontype == 0)
            {
                $score_temp =$score;
            }

            else if ($question_data->questiontype == 4)
            {
                $score_temp = $score[1][1];
            }

            $ii=DB::table('user_answer')
            ->where('question_id',$question_id)
            ->where('user_id',$user_id)->count();
            if ($ii ==0)
            {
                DB::table('user_answer')
                ->insert([
                        'question_id' => $question_id,
                        'answer' => json_encode($data),
                        'user_id' =>$user_id ,
                        'score' => $score_temp
                ]);
            }
                //echo 'true';
             echo '<img src="'.url('/assets/img/').'/'.$name.'" height="150" width="150" class="responsive-img" id="proimage" alt="profile"/>';
            
        }else{
            echo 'false';
        }

        //redirect( $this->agent->referrer());
    }

    public function store_answer(Request  $request)
    {
        
        $user_id = auth()->user()->id;
        $answer_data = json_decode($request->data['answer']);
        $len = count($answer_data);
        for ($i =0;$i<$len;$i++)
        {
            $question_id= $request->data['question_id'][$i];

            $question_data = DB::table('questions')
                ->where('id',$question_id)
                ->get()->toArray();
            $score = json_decode($question_data[0]->score);

            if ($question_data[0]->questiontype ==1 || $question_data[0]->questiontype == 2 || $question_data[0]->questiontype == 3)
            {
                $k =0; $score_temp=0;
                $answer_temp = $answer_data[$i];
                while($answer_temp/2 !=0)
                {
                    $k++;
                    $score_temp += ($answer_temp % 2) * floatval($score[count($score)-$k]);
                    $answer_temp = ( $answer_temp - $answer_temp % 2)/2; 
                }
            }
            else if ($question_data[0]->questiontype == 0)
            {
                $score_temp =$score;
            }

            else if ($question_data[0]->questiontype == 4)
            {
                $score_temp = $score[1][1];
            }

            $ii=DB::table('user_answer')
            ->where('question_id',$request->data['question_id'][$i])
            ->where('user_id',$user_id)->count();
            if ($ii ==0)
            {
                DB::table('user_answer')
                ->insert([
                        'question_id' => $request->data['question_id'][$i],
                        'answer' => json_encode($answer_data[$i]),
                        'user_id' =>$user_id ,
                        'score' => $score_temp
                ]);
            }

            else
            {var_dump("sssss");
                DB::table('user_answer')
                ->where('question_id',$request->data['question_id'][$i])
                ->where('user_id',$user_id)
                ->update([                        // 'question_id' => $request->data['question_id'][$i],
                         'answer' =>json_encode($answer_data[$i]),
                         'score'=>$score_temp
                        //'user_id' =>$user_id 
                ]);      
            }
           
        }
        $tid= DB::table('textgroup_test')->select('text_id')->where("test_id", $request->data['test_id'])->get()->toArray();
       
        $text_id=  json_decode(json_encode($tid), true);
        
        $tg = DB::table('textgroups')->where("id", $text_id[0])->get();
        $textgroup =  json_decode(json_encode($tg), true);
        $logic = json_decode($textgroup[0]["logic"]);
        $content = json_decode($textgroup[0]["content"]);
        $score = json_decode($textgroup[0]["score"]);
        $flag =1;
        for($i=0;$i<count($logic);$i++)
        {
            
            for ($j=0; $j<count($logic[$i]); $j++)
            {
                if ($j==0)
                {
                    if ($logic[$i][$j][0] == 0)
                        $flag =1;
                   else
                    $flag=0;
                }
                $qt_id = $logic[$i][$j][1];
                $ans= $logic[$i][$j][3];
                $operator= $logic[$i][$j][2];
            
                $d =DB::table("user_answer")->select("answer")->where("user_id",$user_id)
                ->where("question_id",$qt_id)->get()->toArray(); 
                     
                $d=json_decode(json_encode( $d));
                $real_ans= json_decode($d[0]->answer);
               
                $process_flag =0;
                if (is_array($real_ans))
                {
                    for ($t=0;$t<count($real_ans);$t++)
                    {
                        if ($operator ==0 )
                        {
                            if ($real_ans[$t]==$ans) {$process_flag = 1;break;}
                            else    $process_flag = 0;
                        }
                            
                        else if($operator == 1)
                        {
                            if ($real_ans[$t] !=$ans) {$process_flag = 1;break;}
                            else    $process_flag = 0;
                        }                            
                        else if($operator == 2)
                        {
                            if (strpos($real_ans[$t],$ans) != false) {$process_flag = 1;break;}
                            else    $process_flag = 0;
                        }
                           
                        else if($operator == 3)
                        {
                            if (strpos($real_ans[$t],$ans) == false) {$process_flag = 1;break;}
                            else    $process_flag = 0;
                        }
                           
                        else if($operator == 4)
                        {
                            if (floatval($real_ans[$t]) > floatval($ans)) {$process_flag = 1;break;}
                            else    $process_flag = 0;
                        }
                            
                        else if($operator == 5)
                        {
                            if (floatval($real_ans[$t]) < floatval($ans)) {$process_flag = 1;break;}
                            else    $process_flag = 0;
                        }
                        else if($operator == 6)
                        {
                            if (floatval($real_ans[$t]) >= floatval($ans)) {$process_flag = 1;break;}
                            else    $process_flag = 0;
                        }
                        else if($operator == 7)
                        {
                            if (floatval($real_ans[$t]) <= floatval($ans)) {$process_flag = 1;break;}
                            else    $process_flag = 0;
                        }
                           
                    }
                }
                else
                {
                    if ($operator ==0 )
                    {
                        if ($real_ans==$ans) {$process_flag = 1;}
                        else    $process_flag = 0;
                    }
                            
                    else if($operator == 1)
                    {
                        if ($real_ans !=$ans) {$process_flag = 1;}
                        else    $process_flag = 0;
                    }                            
                    else if($operator == 2)
                    {
                        if (strpos($real_ans,$ans) != false) {$process_flag = 1;}
                        else    $process_flag = 0;
                    }
                        
                    else if($operator == 3)
                    {
                        if (strpos($real_ans,$ans) == false) {$process_flag = 1;}
                        else    $process_flag = 0;
                    }
                        
                    else if($operator == 4)
                    {
                        if (floatval($real_ans) > floatval($ans)) {$process_flag = 1;}
                        else    $process_flag = 0;
                    }
                        
                    else if($operator == 5)
                    {
                        if (floatval($real_ans) < floatval($ans)) {$process_flag = 1;}
                        else    $process_flag = 0;
                    }
                    else if($operator == 6)
                    {
                        if (floatval($real_ans) >= floatval($ans)) {$process_flag = 1;}
                        else    $process_flag = 0;
                    }
                    else if($operator == 7)
                    {
                        if (floatval($real_ans) <= floatval($ans)) {$process_flag = 1;}
                        else    $process_flag = 0;
                    }
                }

                if ($logic[$i][$j][0]==0)                
                    $flag *= $process_flag;
                else
                    $flag += $process_flag;
            }

            if($flag !=0)
            {
                $textresult = $content[$i];
                $scoreresult= $score[$i];
                break;
            }
        }
        if($flag == 0)
        {
            $textresult = $content[count($content)-1];
            $scoreresult= $score[count($score)-1];
        }
            
        $output = array(
            'textresult'=>$textresult
            );
        DB::table('user_textgroup')
        ->insert([
                'textgroup_id' => $text_id[0]['text_id'],
                'answer' => $textresult,
                'score'=>$scoreresult,
                'user_id' =>$user_id 
        ]);

         echo json_encode($output); 
    }

    public function get_answer(Request  $request)
    {
        $user_id = auth()->user()->id;

        $data= DB::table('user_answer')
        ->select('answer')
        ->where('question_id','=',$request->question_id)
        ->where('user_id','=',$user_id)
        ->get();  
         echo json_encode($data);   
    }

    public function get_report(Request  $request)
    {
        $data = $request->test;
        $test_id = $request->test_id;
        $user_id = auth()->user()->id;
        //$score_temp = '0';

        foreach($data as $obj){
            $dataset = (array)$obj;

            $question_val = DB::table('questions')
                ->select('content', 'questiontype')
                ->where('id','=', $dataset['key'])
                ->first();
            if($dataset['key'] == null)
                continue;
            if($question_val != null) {
                $val = $dataset['value'];
                if ($question_val->questiontype == 5) {
                    $content = json_decode($question_val->content);
                    $vals = $content[intval($dataset['value']) - 1];
                    $val = $vals->score;
                } else if ($question_val->questiontype == 7) {
                    $val = 0;
                } else if ($question_val->questiontype == 8) {
                    $content = json_decode($question_val->content);
                    $vals = $content[intval($dataset['value']) - 1];
                    $val = $vals->score;
                }
            }

            $ii=DB::table('user_answer')
                ->where('question_id',$dataset['key'])
                ->where('test_id',$test_id)
                ->where('user_id',$user_id)->count();
            if ($ii ==0)
            {
                DB::table('user_answer')
                    ->insert([
                        'question_id' => $dataset['key'],
                        'q_id' => $dataset['qid'],
                        'answer' => $dataset['value'],
                        'user_id' =>$user_id ,
                        'test_id' =>$test_id ,
                        'score' => $val
                    ]);
            }
            else{
                DB::table('user_answer')
                    ->where('question_id',$dataset['key'])
                    ->where('q_id',$dataset['qid'])
                    ->where('user_id',$user_id)
                    ->where('test_id',$test_id)
                    ->update([                        // 'question_id' => $request->data['question_id'][$i],
                         'answer' =>$dataset['value'],
                         'score'=>$val
                ]);      
            }
        }

        $user_id = auth()->user()->id;
        $report_id = DB::table('testreport_test')
        ->select('testreport_id')
        ->where('test_id','=',$test_id)
        ->first();
        if($report_id != null){
            $id = $report_id->testreport_id;
            $report_data = DB::table('testreports')->where('id',$id)->get();
            $user_question = DB::table('user_answer')->select('question_id','answer','score')->where('user_id',$user_id)->where('test_id',$test_id)->get();
            $user_textgroup = DB::table('user_textgroup')->select('textgroup_id','answer','score')->where('user_id',$user_id)->get();
            $textgroup_data = DB::table('textgroups')->get();
            $chart_data = DB::table('charts')->get();
            //$questions_data = DB::table('questions')->get();
    
            $data = [
                "report_data" => $report_data,
                "user_question" => $user_question,
                "user_textgroup" => $user_textgroup,
                "chart_data" => $chart_data,
                "textgroup_data" => $textgroup_data,
                //"questions_data" => $questions_data
            ];
        } else {
            $data = [
                "error"=> "There are no report on this test"
            ];
        }

        //return response()->json($data, 200);
        echo json_encode($data);
        exit();
    }

    public function update_report(Request $request)
    {
        $user_id = auth()->user()->id;
        $report_cont = $request->report_content;
        $tg_ids = json_decode($request->tg_ids);
        $tg_answers = json_decode($request->tg_answers);
        $tg_scores = json_decode($request->tg_scores);
        for($i = 0; $i < count($tg_ids); $i++){
            $ii=DB::table('user_textgroup')
                ->where('textgroup_id',$tg_ids[$i])
                ->where('user_id',$user_id)->count();
            if ($ii ==0)
            {
                DB::table('user_textgroup')
                    ->insert([
                        'textgroup_id' => $tg_ids[$i],
                        'answer' => $tg_answers[$i],
                        'user_id' => $user_id ,
                        'score' => $tg_scores[$i]
                    ]);
            }
            else{
                DB::table('user_textgroup')
                    ->where('textgroup_id',$tg_answers[$i])
                    ->where('user_id',$user_id)
                    ->update([
                        'answer' => $tg_answers[$i],
                        'score' => $tg_scores[$i]
                    ]);
            }
        }
        $report_id = DB::table('testreport_test')
            ->select('testreport_id')
            ->where('test_id','=', $request->test_id)
            ->first();
        if($report_id != null){
            $id = $report_id->testreport_id;
            DB::table('testreports')->where('id', $id)->update([
                'content' => $report_cont,
            ]);
        }
        $output = array(
            'success'  => 'data is saved successfully'
        );

        echo json_encode($output);
    }

    public function show($course_id, $lesson_slug)
    {
        $test_id = $course_id; //add ckd
        if(isset($_GET['test_id'])){
            $test_id = (int)$_GET['test_id'];
        }

        $test_result = "";
        $completed_lessons = "";
        $lesson = Lesson::where('slug', $lesson_slug)->where('course_id', $course_id)->where('published', '=', 1)->first();
        if ($lesson == "") {
            $lesson = Test::where('slug', $lesson_slug)->where('course_id', $course_id)->where('published', '=', 1)->firstOrFail();
            
            $lesson->full_text = $lesson->description;
            //dd($lesson->questions);
            $test_result = NULL;
            if ($lesson) {
                $test_result = TestsResult::where('test_id', $lesson->id)
                    ->where('user_id', \Auth::id())
                    ->first();
            }
        }
        
        if ((int)config('lesson_timer') == 0) {
            if(!$lesson->live_lesson){
                if ($lesson->chapterStudents()->where('user_id', \Auth::id())->count() == 0) {
                    $lesson->chapterStudents()->create([
                        'model_type' => get_class($lesson),
                        'model_id' => $lesson->id,
                        'user_id' => auth()->user()->id,
                        'course_id' => $lesson->course->id
                    ]);
                }
            }
        }

        $course_lessons = $lesson->course->lessons->pluck('id')->toArray();
        $course_tests = ($lesson->course->tests ) ? $lesson->course->tests->pluck('id')->toArray() : [];
        $course_lessons = array_merge($course_lessons,$course_tests);

        $previous_lesson = $lesson->course->courseTimeline()
            ->where('sequence', '<', $lesson->courseTimeline->sequence)
            ->whereIn('model_id',$course_lessons)
            ->orderBy('sequence', 'desc')
            ->first();

        $next_lesson = $lesson->course->courseTimeline()
            ->whereIn('model_id',$course_lessons)
            ->where('sequence', '>', $lesson->courseTimeline->sequence)
            ->orderBy('sequence', 'asc')
            ->first();
        var_dump($lesson);
        $lessons = $lesson->course->courseTimeline()
            ->whereIn('model_id',$course_lessons)
            ->orderby('sequence', 'asc')
            ->get();



        $purchased_course = $lesson->course->students()->where('user_id', \Auth::id())->count() > 0;
        $test_exists = FALSE;

        if (get_class($lesson) == 'App\Models\Test') {
            $test_exists = TRUE;
        }

        $completed_lessons = \Auth::user()->chapters()
            ->where('course_id', $lesson->course->id)
            ->get()
            ->pluck('model_id')
            ->toArray();
        $percentage = [];
        $test_questions = \DB::select("SELECT GROUP_CONCAT(q.id) as questions_id, t.id as testid,count(t.id) as question_count FROM courses c LEFT JOIN tests t ON c.id = t.course_id LEFT JOIN questions q ON t.id = q.test_id WHERE c.id = '$course_id' GROUP BY t.id ");
        $test_id_f = $lesson->id;
        
        
        foreach($test_questions as $q_a){
            if(!empty($q_a->questions_id)){
                $user_answers = \DB::select("SELECT count(id) as answer_count FROM user_answer WHERE question_id IN ($q_a->questions_id) AND user_id = '".\Auth::id()."'");
                
                $percentage[$q_a->testid]= ($user_answers[0]->answer_count/$q_a->question_count)*100;
            }
        }
		$testreport =DB::table('testreports')->where('id',$lesson->course->id)->get();
		//echo "<pre>"; print_r($test_exists); die();
        // return compact('lesson', 'previous_lesson', 'next_lesson', 'test_result', 'purchased_course', 'test_exists', 'lessons', 'completed_lessons','percentage','test_id_f','test_id');

        return view($this->path . '.courses.lesson', compact('lesson', 'previous_lesson', 'next_lesson', 'test_result',
            'purchased_course', 'test_exists', 'lessons', 'completed_lessons','percentage','test_id_f','test_id'));
    }

    public function test($lesson_slug, Request $request)
    {
        $test = Test::where('slug', $lesson_slug)->firstOrFail();
        $answers = [];
        $test_score = 0;
        if(!$request->get('questions')){

            return back()->with(['flash_warning'=>'No options selected']);
        }
        foreach ($request->get('questions') as $question_id => $answer_id) {
            $question = Question::find($question_id);
            $correct = QuestionsOption::where('question_id', $question_id)
                    ->where('id', $answer_id)
                    ->where('correct', 1)->count() > 0;
            $answers[] = [
                'question_id' => $question_id,
                'option_id' => $answer_id,
                'correct' => $correct
            ];
            if ($correct) {
                if($question->score) {
                    $test_score += $question->score;
                }
            }
            /*
             * Save the answer
             * Check if it is correct and then add points
             * Save all test result and show the points
             */
        }
        $test_result = TestsResult::create([
            'test_id' => $test->id,
            'user_id' => \Auth::id(),
            'test_result' => $test_score,
        ]);
        $test_result->answers()->createMany($answers);


        if ($test->chapterStudents()->where('user_id', \Auth::id())->get()->count() == 0) {
            $test->chapterStudents()->create([
                'model_type' => $test->model_type,
                'model_id' => $test->id,
                'user_id' => auth()->user()->id,
                'course_id' => $test->course->id
            ]);
        }


        return back()->with(['message'=>'Test score: ' . $test_score,'result'=>$test_result]);
    }

    public function retest(Request $request)
    {
        $test = TestsResult::where('id', '=', $request->result_id)
            ->where('user_id', '=', auth()->user()->id)
            ->first();
        $test->delete();
        return back();
    }

    public function videoProgress(Request $request)
    {
        $user = auth()->user();
        $video = Media::findOrFail($request->video);
        $video_progress = VideoProgress::where('user_id', '=', $user->id)
            ->where('media_id', '=', $video->id)->first() ?: new VideoProgress();
        $video_progress->media_id = $video->id;
        $video_progress->user_id = $user->id;
        $video_progress->duration = $video_progress->duration ?: round($request->duration, 2);
        $video_progress->progress = round($request->progress, 2);
        if ($video_progress->duration - $video_progress->progress < 5) {
            $video_progress->progress = $video_progress->duration;
            $video_progress->complete = 1;
        }
        $video_progress->save();
        return $video_progress->progress;
    }

    public function courseProgress(Request $request)
    {
        if (\Auth::check()) {
            $lesson = Lesson::find($request->model_id);
            if ($lesson != null) {
                if ($lesson->chapterStudents()->where('user_id', \Auth::id())->get()->count() == 0) {
                    $lesson->chapterStudents()->create([
                        'model_type' => $request->model_type,
                        'model_id' => $request->model_id,
                        'user_id' => auth()->user()->id,
                        'course_id' => $lesson->course->id
                    ]);
                    return true;
                }
            }
        }
        return false;
    }

    public function bookSlot(Request $request)
    {
        $lesson_slot = LiveLessonSlot::find($request->live_lesson_slot_id);
        $lesson = $lesson_slot->lesson;

        if ((int)config('lesson_timer') == 0) {
            if ($lesson->chapterStudents()->where('user_id', \Auth::id())->count() == 0) {
                $lesson->chapterStudents()->create([
                    'model_type' => get_class($lesson),
                    'model_id' => $lesson->id,
                    'user_id' => auth()->user()->id,
                    'course_id' => $lesson->course->id
                ]);
            }
        }

        if(LessonSlotBooking::where('lesson_id', $request->lesson_id)->where('user_id', auth()->user()->id)->count() == 0){
            LessonSlotBooking::create(
                ['lesson_id' => $request->lesson_id, 'live_lesson_slot_id' => $request->live_lesson_slot_id, 'user_id' => auth()->user()->id]
            );
            \Mail::to(auth()->user()->email)->send(new StudentMeetingSlotMail($lesson_slot));
        }
        return back()->with(['success'=> __('alerts.frontend.course.slot_booking')]);
    }

}
