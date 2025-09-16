const { Booking } = require('../models')
const CrudRepository = require("./crud-repository")

class BookingRepository extends CrudRepository {
    constructor()
    {
        super(Booking);
    }

    async createBooking(data, trn)
    {
        const response = await Booking.create(data, { transaction: trn });
        return response;
    }
}

module.exports = BookingRepository