
// Dynamic loading of CSS
	var bootstrapCSSLink = $('<link rel="stylesheet" type="text/css" href="http://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">');
	var bootstrapThemeCSSLink = $('<link rel="stylesheet" type="text/css" href="http://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap-theme.min.css">');
	var bootstrapJavaScriptLink = $('<script type="text/javascript" src="http://netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js"></script>');
	var bootstrapToggleCSS = $('<link href="https://gitcdn.github.io/bootstrap-toggle/2.2.0/css/bootstrap-toggle.min.css" rel="stylesheet">');
	var bootstrapToggleJS = $('<script src="https://gitcdn.github.io/bootstrap-toggle/2.2.0/js/bootstrap-toggle.min.js"></script>');
	$('body').append(bootstrapCSSLink);
	$('body').append(bootstrapThemeCSSLink);
	$('body').append(bootstrapJavaScriptLink);	
	$('body').append(bootstrapToggleCSS);
	$('body').append(bootstrapToggleJS);	
//

// EXPERIMENT WITH INPUT BOXES
   var counter = 3;
		
    $("#addButton").click(function () {
				
	if(counter > 10){
            alert("Only 10 textboxes allowed for now");
            return false;
	}   
		
	var newTextBoxDiv = $(document.createElement('div'))
	     .attr("id", 'TextBoxDiv' + counter);
                
	newTextBoxDiv.after().html('<input class="form-control" type="text" name="textbox' + counter + 
	      					   '" id="textbox' + counter + '" value="" >');
            
	newTextBoxDiv.appendTo("#TextBoxesGroup");

				
	counter++;
     });

     $("#removeButton").click(function () {
	if(counter == 2){
          alert("No more textbox to remove");
          return false;
       }   
        
	counter--;
			
        $("#TextBoxDiv" + counter).remove();
			
     });
		
     $("#getButtonValue").click(function () {
		
	var msg = '';
	for(i=2; i<counter; i++){
   	  msg += "\n Textbox #" + i + " : " + $('#textbox' + i).val();
	}
    	  alert(msg);
     });

// QUERYING DISEASES

$('#inputdisease').bind('input', function() {
	var input = $(this).val();

	var query = 'PREFIX owl:  <http://www.w3.org/2002/07/owl#>' + 
				  'PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ' +
				  'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>' +
				  'PREFIX : <http://huiqingao.com/ontology/interactingDrugs.ttl#>' +
				  ' ' +
				  'SELECT ?label ?disease WHERE {' +
    			  '    ?disease a :Disease;' +
    			  '             rdfs:label ?label. ' +
    			  '    FILTER regex(?label, "' + input + '", "i")' +
				  '}' +
				  'ORDER BY ?label';
	var endpoint = 'http://localhost:5820/interdrugs/query';
	var format = 'JSON';
	var reasoning = 'yes';

	$.get('/sparql',data={'endpoint': endpoint, 'query': query, 'format': format, 'reasoning': reasoning}, function(json){
		console.log(json);
		
		try {
			var vars = json.head.vars;
	
			var ul = $('<ul></ul>');
			ul.addClass('list-group');
		
			$.each(json.results.bindings, function(index,value){
				var li = $('<li></li>');
				li.addClass('list-group-item');
			
				$.each(vars, function(index, v){
					var v_type = value[v]['type'];
					var v_value = value[v]['value'];
				
					// If the value is a URI, create a hyperlink
					if (v_type == 'uri') {
						var a = $('<a></a>');
						a.attr('href',v_value);
						a.text(v_value);
						li.append(a);
					// Else we're just showing the value.
					} else {
						li.append(v_value);
					}
					li.append('<br/>');
					
				});
				li.append("<button type='button' class='btn btn-secondary addDisease'>Add</button>");
				ul.append(li);
			
			});
			
			$('#linktarget1').html(ul);

		} catch(err) {
			$('#linktarget1').html('Something went wrong!');
		}
		

		
	});
	
});

// QUERYING POSSIBLE DRUGS AND INTERACTING DRUGS

$('#button2').on('click',function(e){
	var input = $('#inputdrugs').val();

	//possible drugs

	var query = 'PREFIX owl:  <http://www.w3.org/2002/07/owl#>' + 
				  'PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ' +
				  'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>' +
				  'PREFIX : <http://huiqingao.com/ontology/interactingDrugs.ttl#>' +
				  ' ' +
				  'SELECT ?label ?drug WHERE {' +
    			  '{<' + input +'> :possibleDrug ?drug .}';

    for(i = 1; i < counter; i++){
   	    query += 'UNION' +
   	  			 '{<' + $('#textbox' + i).val() + '> :possibleDrug ?drug .}';
	}

    query += '?drug rdfs:label ?label.' +
			 '}' +
			 'ORDER BY ?label';
	var endpoint = 'http://localhost:5820/interdrugs/query';
	var format = 'JSON';
	var reasoning = 'yes';

	$.get('/sparql',data={'endpoint': endpoint, 'query': query, 'format': format, 'reasoning': reasoning}, function(json){
		console.log(json);
		
		try {
			var vars = json.head.vars;
	
			var ul = $('<ul></ul>');
			ul.addClass('list-group');
		
			$.each(json.results.bindings, function(index,value){
				var li = $('<li></li>');
				li.addClass('list-group-item');
			
				$.each(vars, function(index, v){
					var v_type = value[v]['type'];
					var v_value = value[v]['value'];
				
					// If the value is a URI, create a hyperlink
					if (v_type == 'uri') {
						var a = $('<a></a>');
						a.attr('href',v_value);
						a.text(v_value);
						li.append(a);
					// Else we're just showing the value.
					} else {
						li.append(v_value);
					}
					li.append('<br/>');
					
				});
				ul.append(li);
			
			});
			
			$('#linktarget2').html(ul);

		} catch(err) {
			$('#linktarget2').html('Something went wrong!');
		}
	});

	//interacting drugs
		
	var query2 = 'PREFIX owl:  <http://www.w3.org/2002/07/owl#>' + 
				  'PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ' +
				  'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>' +
				  'PREFIX : <http://huiqingao.com/ontology/interactingDrugs.ttl#>' +
				  ' ' +
				  'SELECT ?label1 ?drug1 ?label2 ?drug2 WHERE {' +
    			  '{<' + input +'> :possibleDrug ?drug1 .}';

    for(i = 1; i < counter; i++){
   	    query2 += 'UNION' +
   	  			 '{<' + $('#textbox' + i).val() + '> :possibleDrug ?drug1 .}';
	}

    query2 += '{<' + input +'> :possibleDrug ?drug2 .}';

    for(i = 1; i < counter; i++){
   	    query2 += 'UNION' +
   	  			 '{<' + $('#textbox' + i).val() + '> :possibleDrug ?drug2 .}';
	}

    query2 += '?drug1 rdfs:label ?label1;' +
    		  '       :interactsWith ?drug2.' +
    		  '?drug2 rdfs:label ?label2.' +
			  '}' +
			  'ORDER BY ?label1';

	$.get('/sparql',data={'endpoint': endpoint, 'query': query2, 'format': format, 'reasoning': reasoning}, function(json){
		console.log(json);
		
		try {
			var vars = json.head.vars;
	
			var ul = $('<ul></ul>');
			ul.addClass('list-group');
		
			$.each(json.results.bindings, function(index,value){
				var li = $('<li></li>');
				li.addClass('list-group-item');
			
				$.each(vars, function(index, v){
					var v_type = value[v]['type'];
					var v_value = value[v]['value'];
				
					// If the value is a URI, create a hyperlink
					if (v_type == 'uri') {
						var a = $('<a></a>');
						a.attr('href',v_value);
						a.text(v_value);
						li.append(a);
					// Else we're just showing the value.
					} else {
						li.append(v_value);
					}
					li.append('<br/>');
					
				});
				ul.append(li);
			
			});
			
			$('#linktarget2b').html(ul);

		} catch(err) {
			$('#linktarget2b').html('Something went wrong!');
		}
	
	});

	
});

// Removing disease results
$(document).on("click", "button.removeDisease", function(){
	$(this).parent("li").remove();
});

var i = 0;

$(document).on("click", "button.addDisease", function(){
	var li = $('<li></li>');
	li.text(i + '  ' + $(this).parent("li").text());
	li.addClass("list-group-item");
	li.append('<button type="button" class="btn btn-sm btn-danger pull-right removeDisease" aria-label="Remove"> <span class="glyphicon glyphicon-remove" aria-hidden="true"></span> </button>');
	$('#diseaselist').append(li);
	i++;
});
