"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchAttributes = exports.Match = void 0;
const sequelize_1 = require("sequelize");
class Match extends sequelize_1.Model {
}
exports.Match = Match;
exports.matchAttributes = {
    id: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        primaryKey: true,
    },
    gameName: {
        type: sequelize_1.DataTypes.STRING,
    },
    players: {
        type: sequelize_1.DataTypes.JSON,
    },
    setupData: {
        type: sequelize_1.DataTypes.JSON,
    },
    gameover: {
        type: sequelize_1.DataTypes.JSON,
    },
    nextRoomID: {
        type: sequelize_1.DataTypes.STRING,
    },
    unlisted: {
        type: sequelize_1.DataTypes.BOOLEAN,
    },
    state: {
        type: sequelize_1.DataTypes.JSON,
    },
    initialState: {
        type: sequelize_1.DataTypes.JSON,
    },
    log: {
        type: sequelize_1.DataTypes.JSON,
    },
};
