const CrudService = require("./crud-service")
const { BookingRepository } = require("../repositories")

const bookingRepository = new BookingRepository();

class BookingService extends CrudService {
    constructor()
    {
        super('Booking', bookingRepository);
    }
}

module.exports = BookingService