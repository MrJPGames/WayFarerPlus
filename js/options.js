function setOption(option_name, value) {
  var obj= {};
  obj[option_name] = value;

	chrome.storage.local.set(obj, function() {
	    console.log('[Wayfarer+] Setting \"' + option_name + '\" set to \"' + value + '\"');
	});
}