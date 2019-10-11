function setOption(option_name, value) {
	var save = {};
	save[option_name] = value;

	chrome.storage.sync.set(save, function() {
	    console.log('Settings saved');
	});
}
function getOption(option_name) {
	/*chrome.storage.sync.get({
    	option_name
  	}, function(items) {
  		console.log(items);
  		console.log(items[option_name]);
    	return items[option_name];
  	});
  	*/
}
