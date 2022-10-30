function dateToUnix(date, trueDate = false) {
    if (!trueDate) return Math.floor(new Date(date).getTime() / 1000)
    return Math.floor(date.getTime() / 1000)
}

function getJobFormattedNextDate(job) {
    const dateOptions = {
        weekday: 'short',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    }
    return job.nextDate().toJSDate().toLocaleDateString('pt-br', dateOptions)
}

module.exports = {
    dateToUnix,
    getJobFormattedNextDate,
}
