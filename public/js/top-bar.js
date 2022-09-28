$(document).ready(function () {
  $('.notification-drop .item').on('click', function () {
    $(this).find('ul').toggle();

    console.log($(this).find('ul'));
  });
});
