require('dotenv/config')

const PORT = process.env.PORT;
const FLIGHT_SERVICE_URL = process.env.FLIGHT_SERVICE_URL;

module.exports = {
    PORT,
    FLIGHT_SERVICE_URL
}