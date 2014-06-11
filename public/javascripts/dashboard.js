var beaconsHash = {};

$(function() {
  $('.clickableRow').click(function() {
    $('#showBeacon').modal();
    $('#show_beacon_uuid').text(this.children[0].textContent);
    $('#show_beacon_major_id').text(this.children[1].textContent);
    $('#show_beacon_minor_id').text(this.children[2].textContent);
    $('#show_beacon_content').text(this.children[3].textContent);

    $('#uuid_update > input').val(this.children[0].textContent);
    $('#major_id_update > input').val(this.children[1].textContent);
    $('#minor_id_update > input').val(this.children[2].textContent);
    $('#content_update > textarea').text(this.children[3].textContent);
    var action = 'beacons/'+this.id;
    $('#updateBeaconForm').attr('action',action);
    $('#updateBeacon').click(function (){
      $('#updateBeaconModal').modal();
    });
  });
});

function enableAddButton() {
  if ($('#uuid').attr("class") == 'input-group has-error' || $('#uuid').attr("class") == 'input-group' ||
      $('#minor_id').attr("class") == 'input-group has-error' || $('#minor_id').attr("class") == 'input-group' ||
      $('#major_id').attr("class") == 'input-group has-error' || $('#major_id').attr("class") == 'input-group') {
    $('#addNewBeaconButton').prop('disabled', true);
  } else {
    $('#addNewBeaconButton').prop('disabled', false);
  }
}


$(document).ready(function() {
  //$('#newBeaconForm').validator()

  $('#uuid > input').keyup(function(){
    var text = this.value;
    var patt = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
    if (patt.test(text) && text.length>0) {
      $('#uuid').attr('class', 'input-group has-success');
    } else if (text.length>0) {
      $('#uuid').attr('class', 'input-group has-error');
    } else {
      $('#uuid').attr('class', 'input-group');
    }

    enableAddButton();
  });

  $('#minor_id > input').keyup(function(){
    var text = this.value;
    var number = parseInt(text);
    if (number>0 && number<=65535 && text.length>0) {
      $('#minor_id').attr('class', 'input-group has-success');
    } else if (isNaN(number) || text.length>0) {
      $('#minor_id').attr('class', 'input-group has-error');
    } else {
      $('#minor_id').attr('class', 'input-group');
    }

    enableAddButton();
  });

  $('#major_id > input').keyup(function(){
    var text = this.value;
    var number = parseInt(text);
    if (number>0 && number<=65535 && text.length>0) {
      $('#major_id').attr('class', 'input-group has-success');
    } else if (isNaN(number) || text.length>0) {
      $('#major_id').attr('class', 'input-group has-error');
    } else {
      $('#major_id').attr('class', 'input-group');
    }

    enableAddButton();
  });


  $('#newBeaconForm-').bootstrapValidator({
    fields: {
      uuid: {
        validators: {
          regexp: {
            regexp: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
            message: 'The UUID can only consist of alphabetical, number and underscore'
          },
          notEmpty: {
            message: 'The UUID is required and cannot be empty'
          }
        }
      },
      minor_id: {
        validators: {
          notEmpty: {
            message: 'The Minor ID is required and cannot be empty'
          },
          integer: {
            message: 'The value is not an integer'
          },
          between: {
            min: 0,
            max: 65535,
            message: 'The Minor ID must be between 0 and 65535'
          }
        }
      },
      major_id: {
        validators: {
          notEmpty: {
            message: 'The Major ID is required and cannot be empty'
          },
          integer: {
            message: 'The value is not an integer'
          },
          between: {
            min: 0,
            max: 65535,
            message: 'The Major ID must be between 0 and 65535'
          }
        }
      }
    }
  });
});
