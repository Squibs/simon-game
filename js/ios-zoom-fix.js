/* *********************************************************************************
    iOS DOUBLE TAP TO ZOOM FIX
      - prevents iOS from zooming in when pressing a button multiple times in a row
   ********************************************************************************* */
// fix for iOS double tap zooms; prevents zoom in when pressing a button multiple times in a row
(function () {
  // stores timestamp of the last time screen was touched
  let lastTouch = 0;

  // resets lastTouch timestamp
  function resetPreventZoom() {
    lastTouch = 0;
  }

  // prevents the screen from zooming based on time, movement, or number of fingers
  function preventZoom(event) {
    const time = event.timeStamp;
    const time2 = lastTouch || time;
    const timeDifference = time - time2;
    const fingers = event.touches.length;

    lastTouch = time;

    // if enough time has elapsed or multiple fingers touch the screen
    if (!timeDifference || timeDifference >= 300 || fingers > 1) {
      return;
    }

    resetPreventZoom();
    event.preventDefault();
    event.target.click();
  }

  document.addEventListener('touchstart', preventZoom, false);
  document.addEventListener('touchmove', resetPreventZoom, false);
}());
