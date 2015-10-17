
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

$('#inputdisease').bind('input', function() {
	var input = $(this).val();

	var query = 'PREFIX owl:  <http://www.w3.org/2002/07/owl#>' + 
				  'PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ' +
				  'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>' +
				  'PREFIX : <http://huiqingao.com/ontology/interactingDrugs.ttl#>' +
				  ' ' +
				  'SELECT ?disease ?label WHERE {' +
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
				ul.append(li);
			
			});
			
			$('#linktarget1').html(ul);

		} catch(err) {
			$('#linktarget1').html('Something went wrong!');
		}
		

		
	});
	
});
$('#button2').on('click',function(e){
	var input = $('#inputdrugs').val();

	var query = 'PREFIX owl:  <http://www.w3.org/2002/07/owl#>' + 
				  'PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ' +
				  'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>' +
				  'PREFIX : <http://huiqingao.com/ontology/interactingDrugs.ttl#>' +
				  ' ' +
				  'SELECT ?drug WHERE {' +
    			  '<' + input +'> :possibleDrug ?drug .' +
				  '}';
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
	
});
