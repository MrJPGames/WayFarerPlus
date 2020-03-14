(function() {
  const saveNomination = () => {
    if (nSubCtrl.reviewType !== "NEW") {
      console.log("Not a new review. Skipping the save.");
      return;
    }

    const {
      title,
      description,
      imageUrl,
      lat,
      lng,
      statement,
      supportingImageUrl
    } = nSubCtrl.pageData;
    const toSave = {
      title,
      description,
      imageUrl,
      lat,
      lng,
      statement,
      supportingImageUrl,
      ts: +new Date()
    };

    let currentItemsText = localStorage.getItem("wfpSaved") || "[]";
    if (!currentItemsText) {
      localStorage.setItem();
    }
    const currentItems = JSON.parse(currentItemsText);
    const lastItem = currentItems.length
      ? currentItems[currentItems.length - 1]
      : null;
    const isSameNomination = lastItem && lastItem.imageUrl === imageUrl;
    if (isSameNomination) {
      // update the result
      currentItems[currentItems.length - 1] = toSave;
    } else {
      // push the new result
      currentItems.push(toSave);
    }
    localStorage.setItem("wfpSaved", JSON.stringify(currentItems));
  };

  const showEvaluated = () => {
    const profileStats = document.getElementById("profile-stats");
    profileStats.insertAdjacentHTML(
      "beforeend",
      `
        <div>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Username</th>
                    </tr>
                </thead>
            <tbody>
                <tr>
                    <th scope="row">1</th>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                </tr>
                <tr>
                    <th scope="row">2</th>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                </tr>
                <tr>
                    <th scope="row">3</th>
                    <td>Larry</td>
                    <td>the Bird</td>
                    <td>@twitter</td>
                </tr>
             </tbody>
        </table>
    </div>`
    );
  };

  document.addEventListener("WFPAllRevHooked", saveNomination);
  document.addEventListener("WFPPCtrlHooked", showEvaluated);
})();
