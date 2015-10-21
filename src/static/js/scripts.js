
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

//I'll fix this one day: a list to contain the disease selected
//I don't know javascript have mercy

var diseases = [];
indexd = 0;

// Selecting diseases

$(document).on("click", "input.addDisease", function(){
	var li = $('<li></li>');
	label = $(this).parent("li").text();
	uri = $(this).parent("li").children("a").attr("href");		// javascript is disgusting

	li.addClass("list-group-item");

	var a = $('<a></a>');
	a.attr('href', uri);							
	a.text(label);
	li.append(a);

	li.append('<button type="button" indexd="' + indexd + '" class="btn btn-sm btn-danger pull-right removeDisease" aria-label="Remove"> <span class="glyphicon glyphicon-remove" aria-hidden="true"></span> </button>');
	$('#diseaselist').append(li);
	diseases[indexd] = uri; 			// Add the uri to the array
	indexd = indexd + 1;
});

// Removing selected diseases
$(document).on("click", "button.removeDisease", function(){
	diseases[$(this).attr("indexd")] = "";
	$(this).parent("li").remove();
});

// Test button looking at selected diseases array
$(document).on("click", "button.testButton", function(){
	var dump = "";
	for (var i = 0; i < indexd; i++) {
        dump = dump + diseases[i] + '<br/>'; 
	}
	$("#testbox").html(dump);
});

// QUERYING DISEASES

$('#inputdisease').bind('input', function() {
	var input = $(this).val();

	var query = 'PREFIX owl:  <http://www.w3.org/2002/07/owl#>' + 
				  'PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ' +
				  'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>' +
				  'PREFIX : <http://huiqingao.com/ontology/interactingDrugs.ttl#>' +
				  ' ' +
				  'SELECT DISTINCT ?label ?disease WHERE {' +
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
			var ul = $('<ul></ul>');		// Build a list with all the results
			ul.addClass('list-group');
		
			$.each(json.results.bindings, function(index, result){		// For every single result
				var li = $('<li></li>');								// build an element of the list
				li.addClass('list-group-item');
			
				var label = result['label']['value'];			// Retrieve the label
				var uri = result['disease']['value'];			// Retrieve the URI of the disease resource
				var a = $('<a></a>');
				a.attr('href', uri);							// Build a tag with a link to the resource (should work)
				a.text(label);
				li.append(a);

				li.append("<input type='button' class='btn btn-secondary pull-right addDisease' value='Add' >");		// Button to add the disease 
																											// to the ones we're querying
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

	if (indexd > 0) {			// Not checking if the first one is deleted!
		var query = 'PREFIX owl:  <http://www.w3.org/2002/07/owl#>' + 
					  'PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ' +
					  'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>' +
					  'PREFIX : <http://huiqingao.com/ontology/interactingDrugs.ttl#>' +
					  ' ' +
					  'SELECT DISTINCT ?label ?drug WHERE {' +
	    			  '{<' + diseases[0] +'> :possibleDrug ?drug .}';

	    // Get the diseases selected
	    for(i = 1; i < indexd; i++){
	    	if (diseases[i] != "") {
	    		query += 'UNION' +
	   	  				'{<' + diseases[i] + '> :possibleDrug ?drug .}';
	    	}
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

				var ul = $('<ul></ul>');
				ul.addClass('list-group');
			
				$.each(json.results.bindings, function(index,result){
					var li = $('<li></li>');
					li.addClass('list-group-item');
				
					var label = result['label']['value'];			// Retrieve the label
					var uri = result['drug']['value'];			// Retrieve the URI of the drug resource
					var a = $('<a></a>');
					a.attr('href', uri);							// Build a tag with a link to the resource (should work)
					a.text(label);
					li.append(a);
					ul.append(li);
				
				});
				
				$('#linktarget2').html(ul);

			} catch(err) {
				$('#linktarget2').html('Something went wrong!');
			}
		});

		// Interacting drugs
			
		var query2 = 'PREFIX owl:  <http://www.w3.org/2002/07/owl#>' + 
					  'PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ' +
					  'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>' +
					  'PREFIX : <http://huiqingao.com/ontology/interactingDrugs.ttl#>' +
					  ' ' +
					  'SELECT DISTINCT ?label1 ?drug1 ?label2 ?drug2 WHERE {' +
	    			  '{<' + diseases[0] + '> :possibleDrug ?drug1 .}';

	    for(i = 1; i < indexd; i++){
	    	if (diseases[indexd] != "") {
	    		query2 += 'UNION' +
	   	  				'{<' + diseases[i] + '> :possibleDrug ?drug1 .}';
	    	}
		}

	    query2 += '{<' + diseases[0] +'> :possibleDrug ?drug2 .}';

	    for(i = 1; i < indexd; i++){
	    	if (diseases[indexd] != "") {
	    		query += 'UNION' +
	   	  				'{<' + diseases[i] + '> :possibleDrug ?drug2 .}';
	    	}
		}

	    query2 += '?drug1 rdfs:label ?label1;' +
	    		  '       :interactsWith ?drug2.' +
	    		  '?drug2 rdfs:label ?label2.' +
				  '}' +
				  'ORDER BY ?label1';

		$.get('/sparql',data={'endpoint': endpoint, 'query': query2, 'format': format, 'reasoning': reasoning}, function(json){
			console.log(json);
			
			try {

				var ul = $('<ul></ul>');
				ul.addClass('list-group');
			
				$.each(json.results.bindings, function(index,result){
					var li = $('<li></li>');
					li.addClass('list-group-item');
				
// ADAPT FOR TWO DRUGS AND TWO LABELS

					var label = result['label']['value'];			// Retrieve the label
					var uri = result['disease']['value'];			// Retrieve the URI of the drug resource
					var a = $('<a></a>');
					a.attr('href', uri);							// Build a tag with a link to the resource (should work)
					a.text(label);
					li.append(a);
					ul.append(li);
				
				});
				
				$('#linktarget2b').html(ul);

			} catch(err) {
				$('#linktarget2b').html('Something went wrong!');
			}
		
		});
	}
	
});
