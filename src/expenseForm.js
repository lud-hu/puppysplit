(() => {
  const form = document.getElementById("add-expense-form");
  const participants = form.querySelector("#usersCheckboxList");
  const checkboxes = [...participants.querySelectorAll('input[type="checkbox"]')];
  const error = form.querySelector("#expense-form-error");

  function update() {
    const specific = form.elements.splitSetting.value === "notBetweenAll";
    participants.disabled = !specific;
    checkboxes[0]?.setCustomValidity(
      specific && !checkboxes.some((checkbox) => checkbox.checked)
        ? "Choose at least one person to share this expense."
        : "",
    );
    error.textContent = "";
  }

  form.addEventListener("change", update);
  form.addEventListener("reset", () => queueMicrotask(update));
  form.addEventListener("htmx:afterRequest", (event) => {
    if (!event.detail.successful) {
      error.textContent = "Could not add expense. Check the amount, title, payer and selected people, then try again.";
      return;
    }
    form.reset();
    const puppyId = window.location.pathname.split("/puppies/")[1].split("/")[0];
    restoreUser(puppyId, form.elements.payerId);
    form.querySelector("#amount").focus();
  });
  update();
})();
