var ObjectToXML = require('../');

exports["basic test"] = function (test) {
	var str = ObjectToXML({
		a : {
			b : {
				c : {
					 //d : [{aa: 1}, {ab:2}, {ac:3}]
					 d : [1,2,3,4,5,6]
				}
			}
			, e : {
				"@" : {
					foo : "bar"
				}
				, "#" : {
					"#" : "asdf"
				}
			}
			, f : {
				"@" : {
					prop : "value"
				}
				, "#" : "value"
			}
		}
		, g : "<![CDATA[ test & data ]]>"
		, h : "<!asdf&"
		, i : {
			"@" : {
				numeric : 42
			}
		}
		, j : {
			"@" : {
				numeric : 42
			}
			, "#" : "value"
		}
	});

	var expect = ''
		+ '<a>\n'
		+ '  <b>\n'
		+ '    <c>\n'
		+ '      <d>asdf</d>\n'
		+ '    </c>\n'
		+ '  </b>\n'
		+ '  <e foo="bar">\n'
		+ '    <#>asdf</#>\n'
		+ '  </e>\n'
		+ '  <f prop="value">value</f>\n'
		+ '</a>\n'
		+ '<g><![CDATA[ test & data ]]></g>\n'
		+ '<h>&lt;!asdf&amp;</h>\n'
		+ '<i numeric="42" />\n'
		+ '<j numeric="42">value</j>\n'
		;
	console.log(str)
	test.equal(expect, str);
	test.done();
}
