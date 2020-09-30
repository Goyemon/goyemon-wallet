"use strict";

export function secondsToTime(sec) {
  let time = "";
  const hours = (sec / 3600) | 0;
  const minutes = ((sec % 3600) / 60) | 0;
  const seconds = sec % 60;

  if (hours != 0) {
    time =
      hours +
      " " +
      "h" +
      padZero(minutes) +
      " " +
      "min" +
      padZero(seconds) +
      " " +
      "sec";
  } else if (minutes != 0) {
    time = minutes + " " + "min" + "\n" + padZero(seconds) + " " + "sec";
  } else {
    time = seconds + " " + "sec";
  }

  return time;

  function padZero(v) {
    if (v < 10) {
      return "0" + v;
    } else {
      return v;
    }
  }
}
