
// Dynamic loading of CSS
	var bootstrapCSSLink = $('<link rel="stylesheet" type="text/css" href="http://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">');
	var bootstrapThemeCSSLink = $('<link rel="stylesheet" type="text/css" href="http://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap-theme.min.css">');
	var bootstrapJavaScriptLink = $('<script type="text/javascript" src="http://netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js"></script>');
	$('body').append(bootstrapCSSLink);
	$('body').append(bootstrapThemeCSSLink);
	$('body').append(bootstrapJavaScriptLink);		
//

//I'll fix this one day: a list to contain the disease selected
//I don't know javascript have mercy

var diseases = [];
for (var i=0; i<3; i++){
	diseases[i] = [];
}
indexd = 0;

// Selecting diseases

$(document).on("click", "input.addDisease", function(){
	var label = $(this).parent("li").text();
	var uri = $(this).parent("li").children("a").attr("href");	

	if (diseases[0][0] == uri || diseases[1][0] == uri || diseases[2][0] == uri) {
		alert("Already selected");      //pls change
	} else if (indexd > 2) {
		alert("3 is enough!");			//pls change
	} else { 
		var li = $('<li></li>');
		li.addClass("list-group-item");

		var a = $('<a></a>');
		a.attr('href', uri);							
		a.text(label);
		li.append(a);

		li.append('<button type="button" indexd="' + indexd + '" class="btn btn-sm btn-danger pull-right removeDisease" aria-label="Remove"> <span class="glyphicon glyphicon-remove" aria-hidden="true"></span> </button>');
		$('#diseaselist').append(li);
		diseases[indexd][0] = uri; 			// Add the uri to the array
		diseases[indexd][1] = label;
		indexd = indexd + 1;
	}
});

// Removing selected diseases
$(document).on("click", "button.removeDisease", function(){
	// Remove from array and flush
	for (var i = parseInt($(this).attr("indexd")); i < indexd - 1; i++) {
		diseases[i][0] = diseases[i+1][0];
		diseases[i][1] = diseases[i+1][1];
		$("button[indexd='" + (i+1) + "']").attr("indexd", i);
	}
	diseases[indexd - 1] = [];
	diseases[indexd - 1] = [];
	indexd = indexd - 1;

	$(this).parent("li").remove();
});

// Test button looking at selected diseases array
$(document).on("click", "button.testButton", function(){
	var dump = "";
	for (var i = 0; i < indexd; i++) {
        dump = dump + diseases[i][0] + '<br/>'; 
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
    			  '    ?disease a :TreatableDisease;' +				// Find only diseases for which we have drugs available
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
/////////////////

	$('#drugresults0').empty();
	$('#drugresults1').empty();
	$('#drugresults2').empty();
	if (indexd > 0) {

		var query = 'PREFIX owl:  <http://www.w3.org/2002/07/owl#>' + 
					'PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ' +
					'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>' +
					'PREFIX : <http://huiqingao.com/ontology/interactingDrugs.ttl#>' +
					' ' +
					'SELECT DISTINCT ?label ?drug WHERE {' +
					'{<' + diseases[0][0] +'> :possibleDrug ?drug .}' +
					'?drug rdfs:label ?label.' +
					'}' +
					'ORDER BY ?label';

		var endpoint = 'http://localhost:5820/interdrugs/query';
		var format = 'JSON';
		var reasoning = 'yes';

		var panel0 = $("<div></div>");
		panel0.addClass("panel");
		panel0.addClass("panel-primary");

		var panelhead0 = $("<div></div>");
		panelhead0.addClass("panel-heading");
		panelhead0.append("<h3 class='panel-title'>" + diseases[0][1] + "</h3>");
		panel0.append(panelhead0);

		var panelbody0 = $("<div></div>");
		panelbody0.addClass("panel-body");

		$.get('/sparql',data={'endpoint': endpoint, 'query': query, 'format': format, 'reasoning': reasoning}, function(json){
			console.log(json);
			
			try {

				var ul = $('<ul></ul>');
				ul.addClass('list-group');
				ul.attr('style', 'height: 30em; scroll: both; overflow: auto;');
			
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
				panelbody0.append(ul);

			} catch(err) {
				panelbody0.append('Something went wrong!');
			}
		});

		panel0.append(panelbody0);
		$('#drugresults0').html(panel0);

	}
	if (indexd > 1) {

		var query = 'PREFIX owl:  <http://www.w3.org/2002/07/owl#>' + 
					'PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ' +
					'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>' +
					'PREFIX : <http://huiqingao.com/ontology/interactingDrugs.ttl#>' +
					' ' +
					'SELECT DISTINCT ?label ?drug WHERE {' +
					'{<' + diseases[1][0] +'> :possibleDrug ?drug .}' +
					'?drug rdfs:label ?label.' +
					'}' +
					'ORDER BY ?label';

		var endpoint = 'http://localhost:5820/interdrugs/query';
		var format = 'JSON';
		var reasoning = 'yes';

		var panel1 = $("<div></div>");
		panel1.addClass("panel");
		panel1.addClass("panel-primary");

		var panelhead1 = $("<div></div>");
		panelhead1.addClass("panel-heading");
		panelhead1.append("<h3 class='panel-title'>" + diseases[1][1] + "</h3>");
		panel1.append(panelhead1);

		var panelbody1 = $("<div></div>");
		panelbody1.addClass("panel-body");

		$.get('/sparql',data={'endpoint': endpoint, 'query': query, 'format': format, 'reasoning': reasoning}, function(json){
			console.log(json);
			
			try {

				var ul = $('<ul></ul>');
				ul.addClass('list-group');
				ul.attr('style', 'height: 30em; scroll: both; overflow: auto;');
			
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
				panelbody1.append(ul);

			} catch(err) {
				panelbody1.append('Something went wrong!');
			}
		});
		panel1.append(panelbody1);
		$('#drugresults1').html(panel1);
	}	
	if (indexd > 2) {

		var query = 'PREFIX owl:  <http://www.w3.org/2002/07/owl#>' + 
					'PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ' +
					'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>' +
					'PREFIX : <http://huiqingao.com/ontology/interactingDrugs.ttl#>' +
					' ' +
					'SELECT DISTINCT ?label ?drug WHERE {' +
					'{<' + diseases[2][0] +'> :possibleDrug ?drug .}' +
					'?drug rdfs:label ?label.' +
					'}' +
					'ORDER BY ?label';

		var endpoint = 'http://localhost:5820/interdrugs/query';
		var format = 'JSON';
		var reasoning = 'yes';

		var panel2 = $("<div></div>");
		panel2.addClass("panel");
		panel2.addClass("panel-primary");

		var panelhead2 = $("<div></div>");
		panelhead2.addClass("panel-heading");
		panelhead2.append("<h3 class='panel-title'>" + diseases[2][1] + "</h3>");
		panel2.append(panelhead2);

		var panelbody2 = $("<div></div>");
		panelbody2.addClass("panel-body");

		$.get('/sparql',data={'endpoint': endpoint, 'query': query, 'format': format, 'reasoning': reasoning}, function(json){
			console.log(json);
			
			try {

				var ul = $('<ul></ul>');
				ul.addClass('list-group');
				ul.attr('style', 'height: 30em; scroll: both; overflow: auto;');
			
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
				panelbody2.append(ul);

			} catch(err) {
				panelbody2.append('Something went wrong!');
			}
		});
		panel2.append(panelbody2);
		$('#drugresults2').html(panel2);
	}

/////////////////

});
		// Interacting drugs
			
$('#button3').on('click',function(e){	

	var endpoint = 'http://localhost:5820/interdrugs/query';
	var format = 'JSON';
	var reasoning = 'yes';

	var query3 = 'PREFIX owl:  <http://www.w3.org/2002/07/owl#>' + 
					  'PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ' +
					  'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>' +
					  'PREFIX : <http://huiqingao.com/ontology/interactingDrugs.ttl#>' +
					  ' ' +
					  'SELECT DISTINCT ?label1 ?drug1 ?label2 ?drug2 WHERE {' +
	    			  '{<' + diseases[0][0] + '> :possibleDrug ?drug1 .}';

    for(var i = 1; i < indexd; i++){
    		query3 += 'UNION' +
   	  				'{<' + diseases[i][0] + '> :possibleDrug ?drug1 .}';
	}

    query3 += '{<' + diseases[0][0] +'> :possibleDrug ?drug2 .}';

    for(var i = 1; i < indexd; i++){
    		query3 += 'UNION' +
   	  				'{<' + diseases[i][0] + '> :possibleDrug ?drug2 .}';
	}

    query3 += '?drug1 rdfs:label ?label1;' +
    		  '       :interactsWith ?drug2.' +
    		  '?drug2 rdfs:label ?label2.' +
			  '}' +
			  'ORDER BY ?label1';

	$.get('/sparql',data={'endpoint': endpoint, 'query': query3, 'format': format, 'reasoning': reasoning}, function(json){
		console.log(json);

		$.each(json.results.bindings, function(index,result){
			$('[href="' + result['drug1']['value'] + '"]').parent("li").css('background-color', 'khaki');
			$('[href="' + result['drug2']['value'] + '"]').parent("li").css('background-color', 'khaki');
		});
/*		try {

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
	*/
	
	});

});

// Highlighting interacting drugs on mouseover

$(document).on('mouseenter', '.dosomething', function(){
    // what you want to happen when mouseover and mouseout 
    // occurs on elements that match '.dosomething'
});
