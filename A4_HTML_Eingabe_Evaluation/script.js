$(document).ready(function () {
  $("#test-form")
    .parsley()
    .on("field:validated", function () {
      var ok = $(".parsley-error").length === 0;
      console.log("Formular validiert - Fehler:", $(".parsley-error").length);
    })
    .on("form:submit", function () {
      console.log("=== FORMULAR DATEN ===");
      console.log("Text:", $("#text1").val());
      console.log("Email:", $("#email1").val());

      var radioValue = $('input[name="group1"]:checked').val();
      console.log("Radio:", radioValue);

      var checkboxes = [];
      $('input[name="hobbies"]:checked').each(function () {
        checkboxes.push($(this).val());
      });
      console.log("Checkboxes:", checkboxes);

      console.log("Alle Input-Werte:");
      $("input, select, textarea").each(function () {
        if (
          $(this).attr("type") !== "submit" &&
          $(this).attr("type") !== "reset"
        ) {
          console.log($(this).attr("type") + ":", $(this).val());
        }
      });

      console.log("Formular ist gültig und würde abgeschickt werden");
      return false; // Formular nicht wirklich abschicken
    });
});
