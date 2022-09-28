$(document).ready(function () {
  $('.server-row').click(function () {
    //FINDING ELEMENTS OF ROWS AND STORING THEM IN VARIABLES
    var id = $(this).find('.id').text();
    var ip = $(this).find('.ip').text();
    var port = $(this).find('.port').text();
    var user = $(this).find('.user').text();
    var password = $(this).find('.password-row').text();
    var status = $(this).find('.status').children().hasClass('text-success');
    var payment = $(this).find('.payment-tr').text();
    var admin = $(this).find('.password-row').text();
    var cpu = $(this).find('.cpu').text();
    var ram = $(this).find('.ram').text();
    var adminPassword = $(this).find('.password-row-admin').text();
    var hardDisk = $(this).find('.hard-disk').text();
    var uniqueID = $(this).find('.unique-id').text();
    var p = '';
    // CREATING DATA TO SHOW ON MODEL
    p += `<form
        class="form-horizontal"
        action="/server/edit/${id}"
        id="add-machine"
        method="POST"
      >
        <div class="row">
          <div class="col-md-12">
            <div class="mb-4">`;
    p += `<div class="mb-4"><label class="form-label" for="ip">IP</label>
          <input
            type="text"
            class="form-control"
            id="ip"
            name="ip"
            value="${ip}"
            placeholder="Enter IP"
          /></div>`;
    p += `<div class="mb-4"><label class="form-label" for="port">Port</label>
          <input
            type="text"
            class="form-control"
            id="port"
            name="port"
            value="${port}"
            placeholder="Enter Port"
          /></div>`;
    p += `<div class="mb-4"><label class="form-label" for="password">Password</label>
          <input
            type="password"
            class="form-control"
            id="password"
            name="password"
            value="${password}"
            placeholder="Enter Password"
          /></div>`;
    if (status) {
      p += `<div class="mb-4 form-check form-switch"><label class="form-check-label" for="status">Status</label>
            <input class="form-check-input" name="status" type="checkbox" onclick="checkStatus();" id="status" value="${status}" checked>
          </div>`;
    } else {
      p += `<div class="mb-4 form-check form-switch"><label class="form-check-label" for="status">Status</label>
            <input class="form-check-input" name="status" type="checkbox" id="status" onclick="checkStatus();" value="${status}">
          </div>`;
    }

    p += `<div class="mb-4"><label class="form-label" for="ram">RAM</label>
          <input
            type="text"
            class="form-control"
            id="ram"
            name="ram"
            value="${ram}"
            placeholder="Enter RAM"
          /></div>`;
    p += `<div class="mb-4"><label class="form-label" for="cpu">CPU</label>
          <input
            type="text"
            class="form-control"
            id="cpu"
            name="cpu"
            value="${cpu}"
            placeholder="Enter CPU"
          /></div>`;
    p += `<div class="mb-4"><label class="form-label" for="hard-disk">Hard Disk</label>
          <input
            type="text"
            class="form-control"
            id="hard-disk"
            name="hard_disk"
            value="${hardDisk}"
            placeholder="Enter Hard Disk"
          /></div>`;
    p += `<div class="mb-4"><label class="form-label" for="admin-password">Admin Password</label>
          <input
            type="password"
            class="form-control"
            id="admin-password"
            name="admin_password"
            value="${adminPassword}"
            placeholder="Enter Admin Password"
          /></div>`;
    p += `<div class="mb-4"><label class="form-label" for="unique-id">Unique ID</label>
          <input
            type="text"
            class="form-control"
            id="unique-id"
            name="unique_id"
            value="${uniqueID}"
            placeholder="Enter Unique ID"
          /></div>`;
    p += `<div class="d-grid mt-4">
          <button
            class="btn btn-primary waves-effect waves-light"
            type="submit"
            name="action"
            value="add-machine"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  </form>`;

    // p +=
    //   "<p id='user' class='copy pointer' name='user'><strong>User: </strong>" +
    //   user +
    //   ' </p>';

    console.log(p);
    //CLEARING THE PREFILLED DATA
    $('#server-edit').empty();
    //WRITING THE DATA ON MODEL
    $('#server-edit').append(p);
    $('#server-edit-modal').modal('show');
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
function checkStatus() {
  $('#status').on('change', function () {
    if ($(this).is(':checked')) {
      $(this).attr('value', 'true');
    } else {
      $(this).attr('value', 'false');
    }
  });
}

$('#password-checkbox-admin').change(function () {
  if (this.checked) {
    $('.password-row-admin').removeClass('blur');
  } else {
    $('.password-row-admin').addClass('blur');
  }
});

function onChangePasswordCheck() {
  if (document.getElementById('password-checkbox-modal').checked) {
    $('.password-span').removeClass('blur');
  } else {
    $('.password-span').addClass('blur');
  }
}

function onChangeAdminPasswordCheck() {
  if (document.getElementById('password-checkbox-modal-admin').checked) {
    $('.password-span-admin').removeClass('blur');
  } else {
    $('.password-span-admin').addClass('blur');
  }
}
