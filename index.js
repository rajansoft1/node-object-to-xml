var sanitizer = require('sanitizer')
	, map = require('dank-map')
	;

module.exports = function objectToXML(obj, namespace, depth) {

    var xml = [];
	depth = depth || 0;
    //if(Array.isArray(obj)){
    //    console.log(obj)
    //    for(var i =0; i< obj.length; i++){
    //        if(typeof(obj[i]) == "object"){
    //            console.log(obj[i], namespace, depth)
    //            objectToXML(obj[i], namespace, depth)
    //        }
    //        else{
    //            console.log(obj[i])
    //            objectToXML(new Object(obj[i].toString(), ''), namespace, depth)
    //        }
    //    }
    //}
	map(obj, function (key, value) {
		var attributes = '';
		
		if (value && (value.hasOwnProperty('@') || value.hasOwnProperty('#'))) {
			attributes = map(value['@'], function (key, value) {
				if (value && value.constructor.name == 'Date') {
					return key + '="' + fixupDate(value) + '"';
				}
				else if (value || value === 0) {
					return key + '="' + sanitizer.escape(value) + '"';
				}
			}, true).join(' ');
			
			value = value['#'];
		}
            if(Array.isArray(value)){
                for (var x = 0; x < depth; x++) {
                    xml.push('  ');
                }

                xml.push('<' + ((namespace) ? namespace + ':' : '') + key + ((attributes) ? ' ' + attributes : '') + '>')
                for(var i =0 ;i< value.length; i++) {


                    if (value[i] && value[i].constructor.name == 'Date') {
                        xml.push(fixupDate(value));
                    }
                    else if (typeof (value[i]) == 'object') {
                        xml.push('\n');
                        xml.push(objectToXML(value[i], namespace, depth + 1));

                        for (var x = 0; x < depth; x++) {
                            xml.push('  ');
                        }
                    }
                    else {
                        if (value[i] && typeof(value[i]) == 'string') {
                            //avoid sanitizing CDATA sections.
                            if (value[i].substr(0, 9) !== '<![CDATA[' && value[i].substr(-3) !== ']]>') {
                                value[i] = sanitizer.escape(value);
                            }
                        }

                        xml.push(value[i]);
                    }
                }
                xml.push('</' + ((namespace) ? namespace + ':' : '') +(key.split ?  key.split(/\ /)[0] : key) + '>\n')

            }
		  else if (value === null || value === undefined) {
			for (var x = 0; x < depth; x++) {
				xml.push('  ');
			}
		
			xml.push('<' + ((namespace) ? namespace + ':' : '') + key + ((attributes) ? ' ' + attributes : ''))
			
			//check to see if key is a ?something?
			if (/^\?.*\?$/.test(key)) {
				xml.push('>\n');
			}
			else {
				xml.push(' />\n');
			}
		}
		else {
			for (var x = 0; x < depth; x++) {
				xml.push('  ');
			}
			
			xml.push('<' + ((namespace) ? namespace + ':' : '') + key + ((attributes) ? ' ' + attributes : '') + '>')
			
			if (value && value.constructor.name == 'Date') {
				xml.push(fixupDate(value));
			}
			else if (typeof (value) == 'object') {
				xml.push('\n');
				xml.push(objectToXML(value, namespace, depth + 1));
				
				for (var x = 0; x < depth; x++) {
					xml.push('  ');
				}
			}
			else {
				if (value && typeof(value) == 'string') {
					//avoid sanitizing CDATA sections.
					if (value.substr(0,9) !== '<![CDATA[' && value.substr(-3) !== ']]>') {
						value = sanitizer.escape(value);
					}
				}
				
				xml.push(value);
			}

			console.log("key", key)
             xml.push('</' + ((namespace) ? namespace + ':' : '') +(key.split ?  key.split(/\ /)[0] : key) + '>\n')
		}
	});
	
	return xml.join('');
}

function fixupDate(date) {
	var newDate = new Date(date).toISOString();
	//strip off the milisecconds and the Z
	return newDate.substr(0, newDate.length -5);
}
