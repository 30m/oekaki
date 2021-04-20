let tools = {
  penFlag: true,
  eraserFlag: false,
  drawFlag: false,
  penColor: "black",
  penWidth: 5,
};

function modeChange(mode) {
  switch (mode) {
    case "pen":
      tools.penFlag = true;
      tools.eraserFlag = false;
      document.getElementById("canvas_pen").style.zIndex = 999;
      document.getElementById("canvas_photo").style.zIndex = 99;
      target = document.getElementById(mode);
      if (target != "btn btn-secondary") {
        target.className = "btn btn-primary";
        document.getElementById("eraser").className = "btn btn-secondary";
      }
      break;
    case "eraser":
      tools.penFlag = false;
      tools.eraserFlag = true;
      document.getElementById("canvas_pen").style.zIndex = 999;
      document.getElementById("canvas_photo").style.zIndex = 99;
      target = document.getElementById(mode);
      if (target != "btn btn-secondary") {
        target.className = "btn btn-primary";
        document.getElementById("pen").className = "btn btn-secondary";
      }
      break;
    case "pen_color":
      tools.penFlag = false;
      tools.eraserFlag = false;
      tools.penColor = colorDialog();
      break;

    default:
      tools.penFlag = false;
      tools.eraserFlag = false;
      document.getElementById("canvas_pen").style.zIndex = 999;
      document.getElementById("canvas_photo").style.zIndex = 99;
      target = document.getElementById(mode);
      if (target != "btn btn-secondary") {
        target.className = "btn btn-primary";
        document.getElementById("eraser").className = "btn btn-secondary";
      }
  }
}

function startDraw(e) {
  tools.drawFlag = true;
  gX = e.offsetX;
  gY = e.offsetY;
}

function Draw(e) {
  if (tools.drawFlag == true) {
    const penCanvas = document.getElementById("canvas_pen");
    const penCon = penCanvas.getContext("2d");

    var x = e.offsetX;
    var y = e.offsetY;

    if (tools.penFlag == true) {
      penCon.globalCompositeOperation = "source-over";
    } else if (tools.eraserFlag == true) {
      penCon.globalCompositeOperation = "destination-out";
    }
    penCon.lineWidth = tools.penWidth;
    penCon.strokeStyle = tools.penColor;
    penCon.lineCap = "round";
    penCon.lineJoin = "round";

    penCon.beginPath();
    penCon.moveTo(gX, gY);
    penCon.lineTo(x, y);
    penCon.stroke();
    penCon.closePath();

    gX = x;
    gY = y;
  }
}
function endDraw() {
  tools.drawFlag = false;
}

function colorDialog() {
  return "black";
}

window.onload = function () {
  var elem = document.getElementById("range");
  var target = document.getElementById("value");
  var rangeValue = function (elem, target) {
    return function (evt) {
      tools.penWidth = elem.value;
      target.innerHTML = elem.value;
    };
  };
  elem.addEventListener("input", rangeValue(elem, target));
  var toolTarget = document.getElementById("pen");
  if (toolTarget != "btn btn-secondary") {
    toolTarget.className = "btn btn-primary";
    document.getElementById("eraser").className = "btn btn-secondary";
  }

  const penCanvas = document.getElementById("canvas_pen");
  penCanvas.setAttribute("width", 1200);
  penCanvas.setAttribute("height", 600);
  penCanvas.style.zIndex = 999;

  const photoCanvas = document.getElementById("canvas_photo");
  photoCanvas.setAttribute("width", 1200);
  photoCanvas.setAttribute("height", 600);
  photoCanvas.style.zIndex = 99;

  const bgCanvas = document.getElementById("canvas_bg");
  bgCanvas.setAttribute("width", 1200);
  bgCanvas.setAttribute("height", 600);
  bgCanvas.style.zIndex = 1;

  const saveCanvas = document.getElementById("canvas_save");
  saveCanvas.setAttribute("width", 1200);
  saveCanvas.setAttribute("height", 600);
  saveCanvas.style.zIndex = 2;

  penCanvas.addEventListener("mousedown", startDraw, false);
  penCanvas.addEventListener("mousemove", Draw, false);
  penCanvas.addEventListener("mouseup", endDraw, false);
};

$(function () {
  $("#colorPicker").on("change", function (e) {
    var color = e.detail[0];
    $(this).val(color);
    tools.penColor = color;
  });
});
$(function () {
  $(".js-modal-open").on("click", function () {
    $(".js-modal").fadeIn();
    return false;
  });
  $(".js-modal-close").on("click", function () {
    $(".js-modal").fadeOut();
    return false;
  });
});

function loadFile(files) {
  console.log("loadFile");

  const photoCanvas = document.getElementById("canvas_photo");
  photoCanvas.setAttribute("width", 1200);
  photoCanvas.setAttribute("height", 600);

  const photoCon = photoCanvas.getContext("2d");
  var reader = new FileReader();
  reader.onload = function (event) {
    var image = new Image();
    image.onload = function () {
      if (
        photoCanvas.width < image.naturalWidth ||
        photoCanvas.height < image.naturalHeight
      ) {
        const scale = Math.floor(image.naturalWidth / photoCanvas.width) + 1;
        photoCanvas.width = image.naturalWidth / scale;
        photoCanvas.height = image.naturalHeight / scale;
        photoCon.drawImage(
          image,
          0,
          0,
          image.naturalWidth,
          image.naturalHeight,
          0,
          0,
          image.naturalWidth / scale,
          image.naturalHeight / scale
        );
      } else {
        photoCanvas.width = image.naturalWidth;
        photoCanvas.height = image.naturalHeight;
        photoCon.drawImage(image, 0, 0);
      }
    };
    image.src = event.target.result;
  };
  reader.readAsDataURL(files[0]);
}

$(function () {
  $("#save").on("click", function () {
    console.log("saveCanvas");
    const saveCanvas = document.getElementById("canvas_save");
    const saveCon = saveCanvas.getContext("2d");

    const penCanvas = document.getElementById("canvas_pen");
    const photoCanvas = document.getElementById("canvas_photo");
    const bgCanvas = document.getElementById("canvas_bg");
    const bgCon = document.getElementById("canvas_bg").getContext("2d");
    bgCon.fillStyle = "#ffffff";
    bgCon.fillRect(0, 0, saveCanvas.width, saveCanvas.height);

    saveCon.drawImage(bgCanvas, 0, 0);
    saveCon.drawImage(photoCanvas, 0, 0);
    saveCon.drawImage(penCanvas, 0, 0);

    link = document.getElementById("save");
    link.href = saveCanvas.toDataURL("image/jpeg");
    link.download = "image.jpg";
  });
});
