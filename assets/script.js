var find = $('#find'),
    replace = $('#replace');

find.addEventListener('keyup', function () {
	dealWithRegex(false);
});
find.addEventListener('blur', function () {
	dealWithRegex(true);
});

replace.addEventListener('keyup', function () {
	dealWithRegex(true);
});


var items = $$('#tests li');
items = Array.prototype.slice.call(items);
items.forEach(function (item) {
	var html = item.innerHTML.split(' -&gt; ');
	
	item.dataset.input = html[0];
	item.dataset.output = html[1].split(/<br(?: \/)?>/)[0];
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

		items.forEach(function (item) {
			var input = item.dataset.input,
				output = item.dataset.output,
				replaceWith = replace.value,
				final;

			// Escape replaceWith
			replaceWith = replaceWith.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;').replace(/>/g, '&gt;');

			final = input.replace(regex, replaceWith);
			
			$('span', item).innerHTML = final;
			if (final === output) {
				item.className = 'pass';
				passes++;
			} else {
				item.className = 'fail';
			}
		});

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
