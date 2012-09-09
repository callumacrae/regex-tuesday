var dates = document.getElementsByTagName('date'),
	i;

// Prettify the dates
for (i = dates.length - 1; i >= 0; i--) {
	var date = dates[i].textContent.split('/'),
	    diff;

	date = new Date(date[2], date[1] - 1, date[0]);
	diff = Math.floor((Date.now() - date.getTime()) / 86400000);

	if (diff === 0) {
		dates[i].textContent = 'Today';
	} else if (diff === 1) {
		dates[i].textContent = 'Yesterday';
	} else if (diff <= 7) {
		dates[i].textContent = diff + ' days ago';
	} else if (diff < 31) {
		dates[i].textContent = Math.ceil(diff / 7) + ' weeks ago';
	}
};
