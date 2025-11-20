$(document).ready(function () {
  // Range Wert anzeigen
  $("#input-range").on("input", function () {
    $("#range-value").text(this.value);
  });

  // Parsley Validierung
  $("#test_form")
    .parsley()
    .on("field:validated", function () {
      var ok = $(".parsley-error").length === 0;
      $(".bs-callout-info").toggleClass("hidden", !ok);
      $(".bs-callout-warning").toggleClass("hidden", ok);
    })
    .on("form:submit", function () {
      alert("Formular ist gültig");
      return false;
    });

  // Custom Validator für Dateitypen
  window.Parsley.addValidator("fileextension", {
    validateString: function (value, requirement, parsleyInstance) {
      if (!value) return false; // Required field
      var allowed = requirement
        .split(",")
        .map((ext) => ext.trim().toLowerCase());
      var file = parsleyInstance.$element[0].files[0];
      if (!file) return false;
      var ext = file.name.split(".").pop().toLowerCase();
      return allowed.includes(ext);
    },
    requirementType: "string",
    messages: {
      de: "Nur PDF, JPG oder PNG Dateien sind erlaubt",
    },
  });

  // Custom Validator für Dateigröße
  window.Parsley.addValidator("maxFileSize", {
    validateString: function (value, maxSize, parsleyInstance) {
      if (!value) return false; // Required field
      var files = parsleyInstance.$element[0].files;
      if (files.length === 0) return false;
      return files[0].size / 1024 <= maxSize;
    },
    requirementType: "integer",
    messages: {
      de: "Die Datei ist zu groß. Maximal 2MB erlaubt.",
    },
  });
  // Telephone

  window.Parsley.addValidator("phone", {
    validateString: function (value) {
      return /^[0-9]+$/.test(value);
    },
    messages: {
      de: "Bitte geben Sie nur Zahlen ein",
    },
  });
});
