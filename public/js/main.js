$(function(){
	var flag = true;
	$('#search').on('keyup', function(e){

	    var parameters = { name: $(this).val()};

    	if (flag) {
			flag = false;

	    if (parameters.name) {

	    		$.post('/search', parameters, function(data) {
			   		//$('#result').html(data);
			   		var emptybox = $('#result').empty();
			   		console.log(data);
			   		for (x in data) {
			   			$(emptybox).append('<option value="'+data[x]+'">');
		   		}
	
		 	});
    	}
    	else {
    		$('#result').empty();
    	}

	    	setTimeout(function(){
				flag = true;
		 	}, 300);
	};
});
});