var holder = document.getElementById("preview-tile");

holder.ondragover = function () {
  return false;
};
holder.ondragend = function () {
  return false;
};
holder.ondrop = function (e) {
  e.preventDefault();
  var file = e.dataTransfer.files[0];
  saveImage(file);
  return false;
};

function dndFileSelected() {
  var file = document.getElementById("icon-file").files[0];
  if (file) {
    saveImage(file);
  }
}

function saveImage(file) {
  if ( $("#img_url").is(':visible') === false ) {
    return false;
  }

  if ( file.size >  1024 * 1024 ) {
    alert("The image you chose is too big! Keep it under 1MB.");
    document.getElementById("icon-file").reset();
    document.getElementById("icon-file").focus();
    return false;
  }

  var reader = new FileReader();
  reader.onload = function (event) {
    var extension = file.name;
    extension = extension.split(".");
    extension = extension.pop();
    fs.root.getFile($(".ui-2#editor").attr("active-edit-id") + "." + extension, {create: true}, function(fileEntry) {
      fileEntry.createWriter(function(fileWriter) {
        fileWriter.onwriteend = function(e) {
          $("#img_url").val(fileEntry.toURL());
          holder.style.background = "url(" + fileEntry.toURL() + ") no-repeat center";
          $("#img_url").change();
        };
        fileWriter.write(dataURItoBlob(event.target.result));
      }, errorHandler);
    }, errorHandler);
  };
  reader.readAsDataURL(file);
}

function dataURItoBlob(dataURI) {
  var byteString = atob(dataURI.split(",")[1]);
  var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  var bb = new window.WebKitBlobBuilder();
  bb.append(ab);
  return bb.getBlob(mimeString);
}

function errorHandler(e) {
  var msg = "";

  switch ( e.code ) {
    case FileError.QUOTA_EXCEEDED_ERR:
    msg = "QUOTA_EXCEEDED_ERR";
    break;
    case FileError.NOT_FOUND_ERR:
    msg = "NOT_FOUND_ERR";
    break;
    case FileError.SECURITY_ERR:
    msg = "SECURITY_ERR";
    break;
    case FileError.INVALID_MODIFICATION_ERR:
    msg = "INVALID_MODIFICATION_ERR";
    break;
    case FileError.INVALID_STATE_ERR:
    msg = "INVALID_STATE_ERR";
    break;
    default:
    msg = "Unknown Error";
    break;
  };

  console.error("filesystem" + msg);
}

function initFS() {
  window.webkitRequestFileSystem(window.PERSISTENT, 1024 * 1024, function(filesystem) {
    fs = filesystem;
  }, errorHandler);
}
if (window.webkitRequestFileSystem) {
  initFS();
}