const axios = require("axios")
const { StatusCodes } = require("http-status-codes")

const db = require("../models")
const { ServerConfig } = require("../config")
const CrudService = require("./crud-service")
const AppError = require("../utils/errors/app-error")
const { BookingRepository } = require("../repositories")

const bookingRepository = new BookingRepository();

class BookingService extends CrudService {
    constructor()
    {
        super('Booking', bookingRepository);
    }

    async createBooking(data)
    {
        const trn = await db.sequelize.transaction();

        try {
            const response = await axios.get(`${ServerConfig.FLIGHT_SERVICE_URL}/api/v1/flights/${data.flightId}`);
            const flight = response.data?.data;

            if (flight.totalSeats < data.numberOfSeats) {
                throw new AppError("Not enough seats available", StatusCodes.BAD_REQUEST);
            }

            const billingAmount = data.numberOfSeats * flight.price;
            const bookingPayload = { ...data, totalCost: billingAmount };

            const booking = await bookingRepository.createBooking(bookingPayload, trn);
            await axios.patch(`${ServerConfig.FLIGHT_SERVICE_URL}/api/v1/flights/${data.flightId}/seats`, {
                seatss: data.numberOfSeats,
                dec: 1
            })
            
            await trn.commit();
            return booking;
        }
        catch(err) {
            await trn.rollback();
            if (err instanceof AppError) {
                throw err;
            }

            throw new AppError(err.message, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

module.exports = BookingService