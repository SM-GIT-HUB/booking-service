const { Booking } = require('../models')
const CrudRepository = require("./crud-repository")
const { StatusCodes } = require('http-status-codes')
const AppError = require('../utils/errors/app-error')

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

    async update(id, data, trn)
    {
        const response = await this.model.update(data, {
            where: {
                id: id
            },
            transaction: trn
        })

        if (response[0] == 0) {
            throw new AppError("Not able to find the resource", StatusCodes.NOT_FOUND);
        }

        return response;
    }
}

module.exports = BookingRepository