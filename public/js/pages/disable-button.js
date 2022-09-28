$(document).ready(function () {
    var is_manager = $('.is-manager').val();
  
    if (is_manager) {
      $(':button').prop('disabled', true);
      $('.user-dropdown :button').prop('disabled', false);
      $(':input').attr('readonly', 'readonly');
    }
}