

const dateToString = (date, type=undefined) => {
    return date.toLocaleDateString(type, {
        year: "numeric",
        month: "numeric",
        day: "numeric",
    });

};

const timeToString = (date) => {
    return date.toLocaleTimeString("en-GB");
}

export {dateToString, timeToString};