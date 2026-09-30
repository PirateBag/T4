export const formatDate = (date) => {
    const [year, month, day] = date.toISOString().split('T')[0].split('-');
    return `${year}-${month}${day}`;
};