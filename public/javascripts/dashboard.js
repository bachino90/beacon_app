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
    $('#addNewBeaconButton').prop('disabled', false);
  } else {
    $('#addNewBeaconButton').prop('disabled', false);
  }
}


$(document).ready(function() {
  //$('#newBeaconForm').validator()

  $('#updateClient').click(function (){
    $('#updateClientModal').modal();
  });
  $('#updateClientUUID').click(function (){
    $('#updateClientUUIDModal').modal();
  });
  $('#updateClientMajorID').click(function (){
    $('#updateClientMajorIDModal').modal();
  });
  $('#updateClientMinorID').click(function (){
    $('#updateClientMinorIDModal').modal();
  });

  $('#newBeaconUUIDSelect').change(function () {
    $('#completeNewBeaconForm').text("");
    if (this.value != "0") {
      var url = "/clients/"+this.selectedOptions[0].id+"/storesareas";
      $('form#newBeaconForm').attr("action","/clients/"+this.selectedOptions[0].id+"/beacons");
      $.get(url,function(data) {
        var storeText = "";
        var areaText = "";
        for (var i=0; i<data.response.stores.length; i++) {
          var store = data.response.stores[i];
          storeText = storeText + "<option value='"+store.major_id+"'>"+store.store_name+"</option>";
        }
        for (var j=0; j<data.response.areas.length; j++) {
          var area = data.response.areas[j];
          areaText = areaText + "<option value='"+area.minor_id+"'>"+area.area_name+"</option>";
        }
        $('#completeNewBeaconForm').text("");
        $('#completeNewBeaconForm').append("<div class='col-md-6' style='margin-bottom:20px'>"+
          "<label for='disabledTextInput'>Major ID - Local</label>"+
          "<select name='major_id' class='form-control' id='majorIDSelect'>"+storeText+
          "</select></div>"+
        "<div class='col-md-6' style='margin-bottom:20px'>"+
          "<label for='disabledTextInput'>Minor ID - Area</label>"+
          "<select name='minor_id' class='form-control' id='minorIDSelect'>"+areaText+
          "</select></div>"+
        "<div class='col-md-12' style='margin-bottom:20px'>"+
          "<div class='input-group' id='content' style='margin-bottom:0px'>"+
            "<span class='input-group-addon'>Content</span>"+
            "<textarea class='form-control' rows='3' name='content'></textarea>"+
          "</div></div>"+
        "<div class='col-md-12'>"+
          "<input type='submit' class='btn btn-primary btn-block' value='Add new Beacon' id='addNewBeaconButton'/>"+
        "</div>");
      }, "json");
    }
  });

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
