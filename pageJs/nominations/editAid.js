function initEditAid(){
	var oldSEMFunc = nomCtrl.showEditModal;
	nomCtrl.showEditModal = function(){
		oldSEMFunc();
		var modalElem = document.getElementById('nom-edit-container');
		var textFields = modalElem.getElementsByTagName("textarea");
		console.log(textFields);
		for (var i = 0; i < textFields.length; i++){
			var textField = textFields[i];
			console.log(textField.value);
			var infoElem = document.createElement("span");
			var l = '?';
			if (i === 0){
				//Desc
				l = nomCtrl.editObj.description.length;
			}else{
				l = nomCtrl.editObj.supportingStatement.length;
			}
			infoElem.innerText = "(" + l + " Characters)";
			infoElem.style = "margin-left: 1rem;";
			var title = textField.parentElement.children[0];
			title.appendChild(infoElem);

			textField.oninput = function(e){
				var l = e.path[0].value.length;
				e.path[1].children[0].children[0].innerText = "(" + l + " Characters)";
			};
		}
	}
}

document.addEventListener("WFPNomCtrlHooked", initEditAid);