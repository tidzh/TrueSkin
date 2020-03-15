"use strict";

let ageVal,
  ageNumber,
  age,
  ageResult = document.querySelector("#age"),
  timer;

class Counter {
  constructor(start, end) {
    this.startPosition = start;
    this.endPosition = end;
  }

  getValue() {
    ageResult.textContent = this.startPosition;
  }

  updateValue() {
    let startPosition = this.startPosition,
      endPosition = this.endPosition;

    let timerId = setTimeout(function tick() {
      startPosition++;
      ageResult.textContent = startPosition;
      timerId = setTimeout(tick, 300);
      if (startPosition === endPosition) {
        clearTimeout(timerId);
        $("#pulse-text")
          .show()
          .addClass("pulse");
      }
    }, 300);
  }
}

function badBrowser() {
  $("#section-2").slideUp("500", function() {
    $("#bad-browser").slideDown("500");
  });
}

function isVisible(tag) {
  let t = $(tag);
  let w = $(window);
  let wt = w.scrollTop();
  let tt = t.offset().top;
  let tb = tt + t.height();
  return tb <= wt + w.height() && tt >= wt;
}

function signal(value) {
  let b = $("#pulse-text");
  if (!b.prop("shown") && isVisible(b)) {
    b.prop("shown", true);
    timer.updateValue();
  }
}

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function convertPersent(value) {
  return value * 10 + "%";
}

window.addEventListener("load", function() {
  // if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
  //     $('#section-1').hide();
  //     badBrowser();
  // }

  if (window.orientation == undefined) {
    let desctopDetect = document.querySelector("#section-1");
    // mobileText = document.querySelector('#mobile-text');

    desctopDetect.classList.add("device");
    // mobileText.classList.add('d-none');
  } else {
    let stubSection = document.querySelector("#stub");
    // desctopText = document.querySelector('#desctop-text');

    stubSection.classList.add("d-none");
    // desctopText.classList.add('d-none');
  }

  let ballChange = document.querySelector("#ball-change"),
    progressBar = document.querySelector(".progress-bar__percent"),
    ballChangeNewValue = getRandomArbitrary(1, 6);

  ballChange.innerHTML = ballChangeNewValue;
  progressBar.style.width = convertPersent(ballChangeNewValue);

  $('input[type="number"]').each(function() {
    let that = $(this);

    that.on("keyup", function() {
      if (/\d*/.test(that.val())) {
        ageVal = that.val().slice(0, 2);
        that.val(ageVal);
        if (that.val().length >= parseInt(that.attr("maxlength"), 10)) {
        }
      }
      age = that.val();
      if (age.length === 2) {
        ageNumber = Number(age);
        timer = new Counter(
          ageNumber,
          getRandomArbitrary(ageNumber + 8, ageNumber + 12)
        );
        timer.getValue();
        //Переходим ко второму слайду, если заполнен возраст
        $("#go-slide-2").click(function() {
          $("#age-text").remove();
          $("#section-1").slideUp("500", function() {
            $("#section-2").slideDown("500");
          });
        });
      }
    });
  });

  $("#go-slide-2").click(function() {
    $("#age-text").show();
  });
  $("#go-slide-4").click(function() {
    $("#section-3").slideUp("500", function() {
      $("#section-4").slideDown("500");
    });
  });

  $("#form input").keyup(function() {
    let inputField = $(this);
    if (inputField.val().length !== 0) {
      inputField.addClass("form__input_active");
      inputField.parent().addClass("form__item_active");
    } else {
      inputField.removeClass("form__input_active");
      inputField.parent().removeClass("form__item_active");
    }
  });
  
  // Set constraints for the video stream
  let track = null,
    goPhoto = document.querySelector("#go-photo");

  // Define constants
  const camera = document.querySelector("#camera"),
    cameraOutput = document.querySelector("#camera-output"),
    cameraSensor = document.querySelector("#camera__sensor"),
    cameraTrigger = document.querySelector("#camera__trigger"),
    roller = document.querySelector(".lds-roller"),
    cameraView = document.querySelector("#camera__view");

  function cameraStart() {
    // Older browsers might not implement mediaDevices at all, so we set an empty object first
    if (navigator.mediaDevices === undefined) {
      navigator.mediaDevices = {};
    }

    // Some browsers partially implement mediaDevices. We can't just assign an object
    // with getUserMedia as it would overwrite existing properties.
    // Here, we will just add the getUserMedia property if it's missing.
    if (navigator.mediaDevices.getUserMedia === undefined) {
      navigator.mediaDevices.getUserMedia = function(constraints) {
        // First get ahold of the legacy getUserMedia, if present
        let getUserMedia =
          navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        // Some browsers just don't implement it - return a rejected promise with an error
        // to keep a consistent interface
        if (!getUserMedia) {
          return Promise.reject(
            new Error("getUserMedia is not implemented in this browser")
          );
        }

        // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
        return new Promise(function(resolve, reject) {
          getUserMedia.call(navigator, constraints, resolve, reject);
        });
      };
    }

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user" }, audio: false })
      .then(function(stream) {
        if ("srcObject" in cameraView) {
          track = stream.getTracks()[0];
          cameraView.srcObject = stream;
          $("#section-2").slideUp("500", function() {
            $("#camera").slideDown("500");
          });
        } else {
          // Avoid using this in new browsers, as it is going away.
          cameraView.src = window.URL.createObjectURL(stream);
        }
      })
      .catch(function(error) {
        badBrowser();
        console.error("Oops. Something is broken.", error);
      });
  }

  // Take a picture when cameraTrigger is tapped
  cameraTrigger.addEventListener("click", function() {
    camera.classList.add("camera_wait");
    roller.classList.add("d-inline-block");
    setTimeout(function() {
      roller.classList.remove("d-inline-block");
      camera.classList.remove("camera_wait");
      cameraSensor.width = cameraView.videoWidth;
      cameraSensor.height = cameraView.videoHeight;
      cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
      cameraOutput.src = cameraSensor.toDataURL("image/webp");
      $("#camera").slideUp("500", function() {
        track.stop(); // Останавливаем камеру
        $("#section-3").slideDown("500");
        signal();
        $(window).scroll(signal);
        slider.redrawSlider();
      });
    }, 2000);
  });
  goPhoto.addEventListener("click", cameraStart, false);
});
