var find = document.getElementById('find'),
	replace = document.getElementById('replace'),
	passedCount = document.getElementById('passed-count'),
	testElements = document.getElementById('tests').getElementsByTagName('dt'),
	permalink = document.getElementById('permalink'),
	cases = [];

// Loop over the list of test cases and put them in an array
for (var i = 0, count = testElements.length; i < count; i++) {
	var element = testElements[i];
	cases[i] = {
		input: element.textContent,
		output: element.nextSibling.textContent
	};

	// Add the "it should've been X" element to each test case
	element.parentNode.insertBefore(document.createElement('dd'), 
										element.nextSibling.nextSibling);
};

// For validating and live-testing of the regex
find.addEventListener('keyup', function(e){
	validateRegex(false);
});
find.addEventListener('blur', function(e){
	validateRegex(true);
});

if (replace){
	replace.addEventListener('keyup', function(e){
		validateRegex(true);
	});
}

// Allow the URL to contain regex and replace values
var urlParts = location.search.replace('?', '').split(/[\&\=]/);
for (var i = 0, count = urlParts.length; i < count; i+=2){
	if (urlParts[i] == 'find' && find)
		find.value = decodeURIComponent(urlParts[i+1]);
	if (urlParts[i] == 'replace' && replace)
		replace.value = decodeURIComponent(urlParts[i+1]);
}

if (find.value)
	validateRegex(true);

function validateRegex(warnUser){
	var regex = find.value,
		url = location.origin + location.pathname;
	console.log(location);
	url += '?find=' + encodeURIComponent(find.value);
	if (replace)
		url += '&replace=' + encodeURIComponent(replace.value);
	permalink.setAttribute('href', url);

	if (regex == ''){
		find.className = '';
		return false;
	}

	// Validating regex using regex... That's meta.
	if (regex = /^\/(.*)\/([a-z]*)$/.exec(regex)){
		try {
			regex = new RegExp(regex[1], regex[2]);
		} catch (error){
			if (warnUser)
				find.className = 'invalid';
			return false;
		}

		// Valid regex!
		find.className = '';

		var passes = 0;
		for (var i = 0, count = cases.length; i < count; i++){
			var test = cases[i],
				element = testElements[i],
				nextElement = element.nextSibling;
			if (replace){
				var output = test.input.replace(regex, replace.value);
				element.nextSibling.nextSibling.textContent = output;
				if (output == test.output){
					nextElement.className = element.className = 'passed';
					passes++;
				} else {
					nextElement.className = element.className = 'failed';
				}
			} else {
				// Untested
				if (regex.test(test.input).toString == test.output){
					nextElement.className = element.className = 'passed';
					passes++;
				} else {
					nextElement.className = element.className = 'failed';
				}
			}
		}

		// Let the user know how many tests they passed
		passedCount.textContent = passes.toString();

		return true;
	} else {
		if (warnUser)
			find.className = 'invalid';
		return false;
	}
}