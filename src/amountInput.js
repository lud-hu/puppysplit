// Currency input UX: type digits and they fill in from the back, e.g.
// "1" -> 0,01   "12" -> 0,12   "1234" -> 12,34. The "€" is shown next to
// the field (not inside the value) so backspace deletes a digit naturally.
(function () {
  function format(rawValue) {
    var digits = String(rawValue).replace(/\D/g, "").slice(0, 11);
    if (digits === "") return { display: "", value: "" };
    var cents = parseInt(digits, 10);
    var euros = Math.floor(cents / 100);
    var rem = String(cents % 100).padStart(2, "0");
    return { display: euros.toLocaleString("de-DE") + "," + rem, value: euros + "." + rem };
  }

  function bind(input) {
    if (input.dataset.amountBound) return;
    input.dataset.amountBound = "1";

    var wrapper = input.closest("[data-amount-wrapper]");
    var hidden = wrapper && wrapper.querySelector("input[data-amount-value]");

    function update() {
      var r = format(input.value);
      input.value = r.display; // re-rendering moves the caret to the end (the point of this UX)
      if (hidden) hidden.value = r.value;
    }

    input.addEventListener("input", update);
  }

  function init(root) {
    (root || document).querySelectorAll("input[data-amount-input]").forEach(bind);
  }

  document.addEventListener("DOMContentLoaded", function () { init(document); });
  document.addEventListener("htmx:afterSwap", function (e) { init(e.target); });
  init(document);
})();
