// This extension will save and restore the user selection to/from local storage
htmx.defineExtension("debtorSelectionPersistor", {
  onEvent: function (name, evt) {
    if (name === "htmx:afterProcessNode") {
      // Restore user if present in local storage
      const userId = localStorage.getItem("puppy1");
      if (userId) {
        evt.target.value = userId;
      }

      // Save user on selection to local storage
      evt.target.addEventListener("change", (event) => {
        const puppyId = window.location.href
          .split("/puppies/")[1]
          .split("/")[0];
        localStorage.setItem("puppy" + puppyId, event.target.value);
      });
    }
  },
});
