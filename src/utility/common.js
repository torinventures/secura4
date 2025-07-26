// Common functions go here

const subtractTime = (time1, time2) => {
    const [hours1, minutes1] = time1.split(':');
    const [hours2, minutes2] = time2.split(':');

    const date1 = new Date();
    date1.setHours(hours1);
    date1.setMinutes(minutes1);

    const date2 = new Date();
    date2.setHours(hours2);
    date2.setMinutes(minutes2);

    const timeDiff = date1.getTime() - date2.getTime();

    const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutesDiff = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hoursDiff.toString().padStart(2, '0')}:${minutesDiff.toString().padStart(2, '0')}`;
};

const compareTimes = (time1, time2) => {
    const [hours1, minutes1] = time1.split(':');
    const [hours2, minutes2] = time2.split(':');

    if (parseInt(hours1, 10) > parseInt(hours2, 10)) {
        return 1;
    } if (parseInt(hours1, 10) < parseInt(hours2, 10)) {
        return -1;
    }
    if (parseInt(minutes1, 10) > parseInt(minutes2, 10)) {
        return 1;
    } if (parseInt(minutes1, 10) < parseInt(minutes2, 10)) {
        return -1;
    }
    return 0;
};

module.exports = {
    subtractTime,
    compareTimes,
};
