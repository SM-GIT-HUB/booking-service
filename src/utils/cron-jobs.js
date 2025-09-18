const cron = require('node-cron')
const { Logger } = require('../config')
const { BookingService } = require('../services')

const bookingService = new BookingService();

function scheduleCrons()
{
    cron.schedule(`*/5 * * * *`, async() => {
        const res = await bookingService.cancelOldBookings();
        console.log(`Cron runs, total changes: ${res}`);
    })
}

module.exports = scheduleCrons