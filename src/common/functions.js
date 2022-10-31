/**
 * Created by minhphan on 9/7/2017.
 */
export const convertMS = (msec) => {
    let year, month, day, hour, minute, seconds;
    seconds = Math.floor(msec / 1000);
    minute = Math.floor(seconds / 60);
    hour = Math.floor(minute / 60);
    day = Math.floor(hour / 24);
    // month = Math.floor(day / 30);
    // month = month % 12;
    // year = Math.floor(month / 12);
    return {
        second: seconds % 60,
        minute: minute % 60,
        hour: hour % 24,
        day: day,
    }
};