import moment from "moment";

const THRESHOLD = 3 * 24 * 60 * 60 * 1000;

export function prettyDate(ts) {
  if (Date.now() - ts < THRESHOLD) {
    return moment(ts).fromNow();
  }
  return moment(ts).calendar().toLowerCase();
}

export function toDateTime(ts) {
  return moment(ts).format();
}

export function toFullDate(ts) {
  return moment(ts).format("LLLL");
}
