$(document).ready(function () {
  $('.user-row').click(function () {
    //FINDING ELEMENTS OF ROWS AND STORING THEM IN VARIABLES
    var id = $(this).find('.id').val();
    var firstName = $(this).find('.first-name').val();
    var lastName = $(this).find('.last-name').val();
    var email = $(this).find('.email').val();
    // var password = $(this).find('.password-row').text();
    // console.log(password);
    // var status = $(this).find('.status').html();
    // var payment = $(this).find('.payment-tr').text();
    var p = '';
    // CREATING DATA TO SHOW ON MODEL
    p += `<form
      class="form-horizontal"
      action="/user/edit-user"
      id="add-user"
      method="POST"
    >
      <div class="row">
        <div class="col-md-12">
          <div class="mb-4"><input
          type="hidden"
          class="form-control"
          id="id"
          name="id"
          value="${id}"
        />`;

    p += `<div class="mb-4"><label class="form-label" for="first_name">First Name</label>
        <input
          type="text"
          class="form-control"
          id="first_name"
          name="first_name"
          value="${firstName}"
          placeholder="Enter First Name"
        /></div>`;
    p += `<div class="mb-4"><label class="form-label" for="first_name">First Name</label>
        <input
          type="text"
          class="form-control"
          id="last_name"
          name="last_name"
          value="${lastName}"
          placeholder="Enter Last Name"
        /></div>`;
    p += `<div class="mb-4"><label class="form-label" for="email">Email Name</label>
        <input
          type="email"
          class="form-control"
          id="email"
          name="email"
          value="${email}"
          placeholder="Enter Email"
        /></div>`;
    p += `<div class="mb-4"><label class="form-label" for="password">Password</label>
        <input
          type="password"
          class="form-control"
          id="password"
          name="password"
          value=""
          placeholder="Enter Password"
        /></div>`;
    p += `<div class="d-grid mt-4">
        <button
          class="btn btn-primary waves-effect waves-light"
          type="submit"
          name="action"
          value="add-server"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
</form>`;
    $('#user-edit').empty();
    //WRITING THE DATA ON MODEL
    $('#user-edit').append(p);
    $('#user-edit-modal').modal('show');
  });
});

$('#password-checkbox').change(function () {
  if (this.checked) {
    $('.password-row').removeClass('blur');
    $('.password-span').removeClass('blur');
  } else {
    $('.password-row').addClass('blur');
    $('.password-span').addClass('blur');
  }
});

function onChangePasswordCheck() {
  if (document.getElementById('password-checkbox-modal').checked) {
    $('.password-span').removeClass('blur');
  } else {
    $('.password-span').addClass('blur');
  }
}
