var find = document.getElementById('find'),
	replace = document.getElementById('replace'),
	passedCount = document.getElementById('passed-count'),
	testElements = document.getElementById('tests').getElementsByTagName('dt'),
	permalink = document.getElementById('permalink'),
	cases = [],
	element, i, urlParts;

// Loop over the list of test cases and put them in an array
for (i = 0; i < testElements.length; i++) {
	element = testElements[i];
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
urlParts = location.search.replace('?', '').split(/[\&\=]/);
for (i = 0; i < urlParts.length; i += 2){
	if (urlParts[i] == 'find' && find) {
		find.value = decodeURIComponent(urlParts[i + 1]);
	}
	if (urlParts[i] == 'replace' && replace) {
		replace.value = decodeURIComponent(urlParts[i + 1]);
	}
}

if (find.value) {
	validateRegex(true);
}

function validateRegex(warnUser) {
	var regex = find.value,
		url = location.origin + location.pathname,
		passes = 0,
		element, i, newClass, output, test;

	url += '?find=' + encodeURIComponent(find.value);
	if (replace) {
		url += '&replace=' + encodeURIComponent(replace.value);
	}
	permalink.setAttribute('href', url);

	if (regex === '') {
		find.className = '';
		return false;
	}

	// Validating regex using regex... that's meta.
	if (regex = /^\/(.*)\/([a-z]*)$/.exec(regex)) {
		try {
			regex = new RegExp(regex[1], regex[2]);
		} catch (error) {
			if (warnUser) {
				find.className = 'invalid';
			}
			return false;
		}

		// Valid regex!
		find.className = '';

		for (i = 0; i < cases.length; i++) {
			test = cases[i];
			element = testElements[i];

			if (replace) {
				output = test.input.replace(regex, replace.value);
				element.nextSibling.nextSibling.textContent = output;
				if (output === test.output) {
					newClass = 'passed';
					passes++;
				} else {
					newClass = 'failed showfail';
				}
			} else {
				if (regex.test(test.input) === (test.output === 'match')) {
					newClass = 'passed';
					passes++;
				} else {
					newClass = 'failed';
				}
			}
			
			element.nextSibling.className = element.className = newClass;
		}

		// Let the user know how many tests they passed
		passedCount.textContent = passes;

		return true;
	} else if (warnUser) {
		find.className = 'invalid';
	}
	
	return false;
}
