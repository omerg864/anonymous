

const dateToString = (date, type=undefined) => {
    return date.toLocaleDateString(type, {
        year: "numeric",
        month: "numeric",
        day: "numeric",
    });

};

export {dateToString};