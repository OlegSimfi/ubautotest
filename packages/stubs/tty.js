/**
* MPV - Fake implementation of nodejs tty
* Always return `false` to isatty() call
* @module tty
*/ 
exports.isatty = function(fd) {
  return false;
};