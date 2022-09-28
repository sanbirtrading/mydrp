$(document).ready(function () {
  $('.copy').click(function (event) {
    var text_to_copy = $(event.target).text();
    if (!navigator.clipboard) {
      // use old commandExec() way
      document.execCommand('copy');
    } else {
      navigator.clipboard
        .writeText(text_to_copy)
        .then(function () {
          alert('Text copied to clipboard!'); // success
        })
        .catch(function () {
          alert('Text not copied to clipboard!'); // error
        });
    }
  });
});
