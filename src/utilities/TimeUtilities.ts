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
      "hours" +
      padZero(minutes) +
      " " +
      "minutes" +
      padZero(seconds) +
      " " +
      "seconds";
  } else if (minutes != 0) {
    time =
      minutes + " " + "minutes" + "\n" + padZero(seconds) + " " + "seconds";
  } else {
    time = seconds + " " + "seconds";
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
