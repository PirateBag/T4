// Returns a random positive integer from min (default 100000) up to min + range - 1

export const minimuimRandomId = 100000;
export const randomId = (min = minimuimRandomId, range = 1000000) => {
    return Math.floor(Math.random() * range) + min;
};
