
function compareTimeWithDiff(time1, time2, diff)
{
    const t1 = new Date(time1);
    const t2 = new Date(time2);

    return (t2.getTime() < t1.getTime() + diff * 60 * 1000);
}

module.exports = {
    compareTimeWithDiff
}