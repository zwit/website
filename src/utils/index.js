export function hashCode(str) { // java String#hashCode
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
       hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}

export function intToRGB(i){
    var c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
}

var ModelViewer = require('metamask-logo');

export function setMetamaskLogo(width, height, metamaskFound, selectedAddress, id) {
  // To render with fixed dimensions:
  var viewer = ModelViewer({

    // Dictates whether width & height are px or multiplied
    pxNotRatio: true,
    width,
    height,
    // pxNotRatio: false,
    // width: 0.9,
    // height: 0.9,

    // To make the face follow the mouse.
    followMouse: false,

    // head should slowly drift (overrides lookAt)
    slowDrift: false,
  })

  // add viewer to DOM
  var container = document.getElementById(id);
  container.appendChild(viewer.container);

  if (metamaskFound) {
    if (!selectedAddress) {
      // look at something on the page
      viewer.lookAt({
        x: 100,
        y: 100,
      });

      // enable mouse follow
      viewer.setFollowMouse(true);
    }

    // deallocate nicely
    viewer.stopAnimation();
  }
}

export const KWEI = 1000;
export const MWEI = 1000000;
export const GWEI = 1000000000;
export const TWEI = 1000000000000;
export const PWEI = 1000000000000000;
export const EWEI = 1000000000000000000;

export function getValueIn(value, metric) {
  return value / metric;
}

export function getNetwork(networkId) {
  switch (networkId) {
    case '1':
      return 'MAINNET';
    case '2':
      return 'MORDEN';
    case '3':
      return 'ROPSTEN';
    case '4':
      return 'RINKEBY';
    case '42':
      return 'KOVAN';
    default:
      return 'UNKNOWN';
  }
}