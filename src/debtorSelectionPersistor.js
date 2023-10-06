// This extension will save and restore the user selection to/from local storage
htmx.defineExtension("debtorSelectionPersistor", {
  onEvent: function (name, evt) {
    if (name === "htmx:afterProcessNode") {
      const puppyId = window.location.href.split("/puppies/")[1].split("/")[0];

      restoreUser(puppyId, evt.target);

      // Save user on selection to local storage
      evt.target.addEventListener("change", (event) => {
        localStorage.setItem("puppy" + puppyId, event.target.value);
      });
    }
  },
});

/**
 * Restore user if present in local storage.
 * @param {*} puppyId The id of the puppy to restore the user for.
 * @param {*} target The select element to restore the user into.
 */
function restoreUser(puppyId, target) {
  const userId = localStorage.getItem("puppy" + puppyId);
  if (userId) {
    target.value = userId;
  }
}
