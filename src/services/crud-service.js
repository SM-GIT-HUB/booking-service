const { StatusCodes } = require("http-status-codes")
const AppError = require("../utils/errors/app-error")

class CrudService {
    constructor(modelName, repository)
    {
        this.modelName = modelName;
        this.repository = repository;
    }

    async create(data)
    {
        try {
            const response = await this.repository.create(data);
            return response;
        }
        catch(err) {
            if (err.name.includes("Sequelize"))
            {
                let explanation = [];

                if (err.errors)
                {
                    err.errors.forEach((e) => {
                        explanation.push(e.message);
                    })
                }

                if (err.parent) {
                    explanation.push(err.parent);
                }
                
                throw new AppError(explanation, StatusCodes.BAD_REQUEST);
            }

            throw new AppError(`Cannot create a new ${this.modelName} Object: ${err.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async getAll()
    {
        try {
            const responses = await this.repository.getAll();
            return responses;
        }
        catch(err) {
            throw new AppError(`Cannot fetch data of all ${this.modelName}s: ${err.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async get(id)
    {
        try {
            const response = await this.repository.get(id);
            return response;
        }
        catch(err) {
            if (err.statusCode == StatusCodes.NOT_FOUND) {
                throw new AppError(`The ${this.modelName} you requested is not present`, err.statusCode);
            }

            throw new AppError(`Cannot fetch data of ${this.modelName}: ${err.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async update(id, data)
    {
        try {
            const response = await this.repository.update(id, data);
            return response;
        }
        catch(err) {
            if (err.name.includes("Sequelize"))
            {
                let explanation = [];
                
                if (err.errors)
                {
                    err.errors.forEach((e) => {
                        explanation.push(e.message);
                    })
                }
                
                if (err.parent) {
                    explanation.push(err.parent);
                }
                
                throw new AppError(explanation, StatusCodes.BAD_REQUEST);
            }

            if (err.statusCode == StatusCodes.NOT_FOUND) {
                throw new AppError(`The ${this.modelName} you requested to update is not present`, err.statusCode);
            }

            throw new AppError(`Cannot update data of ${this.modelName}: ${err.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async delete(id)
    {
        try {
            const response = await this.repository.destroy(id);
            return response;
        }
        catch(err) {
            if (err.statusCode == StatusCodes.NOT_FOUND) {
                throw new AppError(`The ${this.modelName} you requested to delete is not present`, err.statusCode);
            }

            throw new AppError(`Cannot delete ${this.modelName}: ${err.message}`, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}


module.exports = CrudService