{{--File Upload--}}
<div id="file_upload_input" class="question-box" @if(isset($display)) style="display:{{$display}};" @endif>
    <div class="form-group">
        <input type="text" class="form-control" placeholder="File Input" readonly>
    </div>
</div>                          
{{-- End File Upload --}}