

const dateToString = (date) => {
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
    });

};

export {dateToString};