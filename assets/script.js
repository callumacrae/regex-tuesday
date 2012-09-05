var find = $('#find'),
    replace = $('#replace');

find.addEventListener('keyup', function () {
	dealWithRegex(false);
}, true);
find.addEventListener('blur', function () {
	dealWithRegex(true);
}, true);

if (replace) {
	replace.addEventListener('keyup', function () {
		dealWithRegex(true);
	}, true);
}


var items = $$('#tests li');
items = Array.prototype.slice.call(items);
items.forEach(function (item) {
	var text = unescape(item.innerHTML).split(' -> ');
	
	item.dataset.input = text[0];
	item.dataset.output = text[1];

	if (replace) {
		item.innerHTML += '<br />Actual output: <span></span>';
	}
});


function dealWithRegex(displayInvalid) {
	var regex = find.value,
		passes = 0;

	if (!regex) {
		$('.invalid').style.display = 'none';
		return;
	}

	if ((regex = /^\/(.+)\/([a-z]*)$/.exec(regex))) {
		try {
			regex = new RegExp(regex[1], regex[2]);
		} catch (e) {
			if (displayInvalid) {
				$('.invalid').style.display = 'block';
			}
			return;
		}

		// We now know that the regex is valid
		$('.invalid').style.display = 'none';

		if (replace) {
			items.forEach(function (item) {
				var input = item.dataset.input,
					output = item.dataset.output,
					replaceWith = replace.value,
					final = input.replace(regex, replaceWith);

				$('span', item).innerHTML = escape(final);
				if (final === output) {
					item.className = 'pass';
					passes++;
				} else {
					item.className = 'fail';
				}
			});
		} else {
			items.forEach(function (item) {
				var input = item.dataset.input,
					match = item.dataset.output === 'match';

				if (regex.test(input) === match) {
					item.className = 'pass';
					passes++;
				} else {
					item.className = 'fail';
				}
			});
		}

		$('#passes').innerHTML = items.length + ' tests, ' + passes + ' passes.';
	} else if (displayInvalid) {
		$('.invalid').style.display = 'block';
	}
}

function $(selector, context) {
	return (context || document).querySelector(selector);
}
function $$(selector, context) {
	return (context || document).querySelectorAll(selector);
}

function escape(text) {
	return text.replace(/&/g, '&amp;').replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}

function unescape(text) {
	return text.replace(/&lt;/g, '<').replace(/&gt;/g, '>')
		.replace(/&amp;/, '&');
}

window.onload = function() {
	dealWithRegex(true);
}
