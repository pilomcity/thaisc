jQuery(document).ready(function($) {
	if ( $( ".wpcf7-form" ).length ) {
		cf7_formulas();
		$("body").on("change",".wpcf7 input,.wpcf7 select",function(e){
			cf7_formulas();
		})
		$(".cf7-hide").closest('p').css('display', 'none');
		function cf7_formulas(){
		   var total = 0;
	       var match;
	       var reg =[]; 
	       $("form.wpcf7-form input").each(function () { 
	       		if( $(this).attr("type") == "checkbox" || $(this).attr("type") == "radio"  ) {
	       			var name = $(this).attr("name").replace("[]", "");
	       			reg.push(name);
	       		}else{
	       			reg.push($(this).attr("name"));
	       		}
	       		
	       })
	       $("form.wpcf7-form select").each(function () { 
	       		reg.push($(this).attr("name"));
	       })
	       
	       reg = remove_duplicates_ctf7(reg);
	       var field_regexp = new RegExp( '('+reg.join("|")+')');
	       $k = 0;
	       $( ".ctf7-total" ).each(function( index ) {
	       		var eq = $(this).data('formulas');
				var test = eq;
				eq = '(' + eq + ')';
				while ( match = field_regexp.exec( eq ) ){
					var type = $("input[name="+match[0]+"]").attr("type");
					if( type === undefined ) {
						var type = $("input[name='"+match[0]+"[]']").attr("type");
					}
					if( type =="checkbox" ){
						var vl = 0;
						$("input[name='"+match[0]+"[]']:checked").each(function () {
								 vl += new Number($(this).val());
						});
						
					}else if( type == "radio"){
						var vl = $("input[name='"+match[0]+"']:checked").val();

					}else if( type === undefined ){
						var vl = $("select[name="+match[0]+"]").val();	
					}else{
						var vl = $("input[name="+match[0]+"]").val();
					}
					if(!$.isNumeric(vl)){
						vl = 0;
					}
					test = test.replace( match[0], vl );
					eq = eq.replace( match[0], vl ); 
				}
				try{
					var r = eval( eq ); // Evaluate the final equation
					total = r;
				}
				catch(e)
				{
					alert( "Error:" + eq );
				}
				
				
				
				if( $k == 0 ){
					$(this).val(total);
				$(this).parent().find('.cf7-calculated-name').html(total);
				}else{
					total = "(Pro Version)";
					$(this).val(total);
					$(this).parent().find('.cf7-calculated-name').html(total);
				}
				$k++;
	       });

			
		}
	}
	function cf7_format (number) {
		var enable = $("#cf7-calculator-enable").val();
		if( enable == "yes" ){
			  var decimals = $("#cf7-calculator-decimals").val();
			  var decPoint = $("#cf7-calculator-separator").val();
			  var thousandsSep = $("#cf7-calculator-thousand").val();

			  number = (number + '').replace(/[^0-9+\-Ee.]/g, '')
			  var n = !isFinite(+number) ? 0 : +number
			  var prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
			  var sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep
			  var dec = (typeof decPoint === 'undefined') ? '.' : decPoint
			  var s = ''

			  var toFixedFix = function (n, prec) {
			    var k = Math.pow(10, prec)
			    return '' + (Math.round(n * k) / k)
			      .toFixed(prec)
			  }

			  // @todo: for IE parseFloat(0.55).toFixed(0) = 0;
			  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
			  if (s[0].length > 3) {
			    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
			  }
			  if ((s[1] || '').length < prec) {
			    s[1] = s[1] || ''
			    s[1] += new Array(prec - s[1].length + 1).join('0')
			  }
		  return cf7_currency_custom(s.join(dec));
		}else{
			return cf7_currency_custom(number);
		}
	}
	function cf7_currency_custom(str){
		var currency = $("#cf7-calculator-currency").val();
		if(currency == ""){
			return str;
		}else{
			var type = $("#cf7-calculator-currency_position").val();
			if( type == "left_space"){
				return  currency + " " + str;
			}else if( type == "right"){
				return   str + currency;	
			}else if( type == "right_space") {
				return str + " " + currency ;
			}else{
				return  currency +  str;
			}
		}
	}
	function remove_duplicates_ctf7(arr) {
	    var obj = {};
	    var ret_arr = [];
	    for (var i = 0; i < arr.length; i++) {
	        obj[arr[i]] = true;
	    }
	    for (var key in obj) {
	    	if("_wpcf7" == key || "_wpcf7_version" == key  || "_wpcf7_locale" == key  || "_wpcf7_unit_tag" == key || "_wpnonce" == key || "undefined" == key  || "_wpcf7_container_post" == key || "_wpcf7_nonce" == key  ){

	    	}else {
	    		ret_arr.push(key);
	    	}
	    }
	    return ret_arr;
	}
});