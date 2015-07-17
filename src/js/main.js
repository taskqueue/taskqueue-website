$(function(){

    $('textarea[name="curl_command"]').text('curl https://api.taskqueue.io/v1/tasks \\ \n -X POST \ \n -u BQokikJDjEA2HlWgH4olfQ2 \\ \n -H "X-TQ-Endpoint: https://requetb.in/3k91ps" \\  \n -d { "message": "Hello World"}');

});
