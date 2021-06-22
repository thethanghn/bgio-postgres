"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresStore = void 0;
const internal_1 = require("boardgame.io/internal");
const sequelize_1 = require("sequelize");
const match_1 = require("./entities/match");
class PostgresStore extends internal_1.Async {
    constructor(uriOrOptions, extraOptions) {
        super();
        if (typeof uriOrOptions === "string") {
            this._sequelize = new sequelize_1.Sequelize(uriOrOptions, extraOptions || {});
        }
        else {
            this._sequelize = new sequelize_1.Sequelize({ dialect: "postgres", ...uriOrOptions });
        }
        match_1.Match.init(match_1.matchAttributes, {
            sequelize: this._sequelize,
            tableName: "Games",
        });
        this._sequelize.authenticate();
    }
    get sequelize() {
        return this._sequelize;
    }
    async connect() {
        await this._sequelize.sync();
    }
    async createMatch(id, { initialState, metadata: { gameName, players, setupData, gameover, nextMatchID, unlisted, }, }) {
        await match_1.Match.create({
            id,
            gameName,
            players,
            setupData,
            gameover,
            nextMatchID,
            unlisted,
            initialState,
            state: initialState,
            log: [],
        });
    }
    createGame(matchID, opts) {
        return this.createMatch(matchID, opts);
    }
    async setState(id, state, deltalog) {
        await this._sequelize.transaction(async (transaction) => {
            var _a;
            const match = await match_1.Match.findByPk(id, {
                transaction,
            });
            const previousState = match === null || match === void 0 ? void 0 : match.state;
            if (!previousState || previousState._stateID < state._stateID) {
                await match_1.Match.upsert({
                    id,
                    state,
                    log: [...((_a = match === null || match === void 0 ? void 0 : match.log) !== null && _a !== void 0 ? _a : []), ...(deltalog !== null && deltalog !== void 0 ? deltalog : [])],
                }, { transaction });
            }
        });
    }
    async setMetadata(id, { gameName, players, setupData, gameover, nextMatchID, unlisted, createdAt, updatedAt, }) {
        await match_1.Match.upsert({
            id,
            gameName,
            players,
            setupData,
            gameover,
            nextMatchID,
            unlisted,
            createdAt: createdAt ? new Date(createdAt) : undefined,
            updatedAt: updatedAt ? new Date(updatedAt) : undefined,
        });
    }
    async fetch(matchID, { state, log, metadata, initialState }) {
        const result = {};
        const match = await match_1.Match.findByPk(matchID);
        if (!match) {
            return result;
        }
        if (metadata) {
            result.metadata = {
                gameName: match.gameName,
                players: match.players || [],
                setupData: match.setupData,
                gameover: match.gameover,
                nextMatchID: match.nextRoomID,
                unlisted: match.unlisted,
                createdAt: match.createdAt.getTime(),
                updatedAt: match.updatedAt.getTime(),
            };
        }
        if (initialState) {
            result.initialState = match.initialState;
        }
        if (state) {
            result.state = match.state;
        }
        if (log) {
            result.log = match.log;
        }
        return result;
    }
    async wipe(id) {
        await match_1.Match.destroy({ where: { id } });
    }
    async listMatches(opts) {
        var _a, _b, _c, _d;
        const where = {
            [sequelize_1.Op.and]: [
                (opts === null || opts === void 0 ? void 0 : opts.gameName) && { gameName: opts.gameName },
                ((_a = opts === null || opts === void 0 ? void 0 : opts.where) === null || _a === void 0 ? void 0 : _a.isGameover) === true && { gameover: { [sequelize_1.Op.ne]: null } },
                ((_b = opts === null || opts === void 0 ? void 0 : opts.where) === null || _b === void 0 ? void 0 : _b.isGameover) === false && { gameover: { [sequelize_1.Op.is]: null } },
                ((_c = opts === null || opts === void 0 ? void 0 : opts.where) === null || _c === void 0 ? void 0 : _c.updatedBefore) !== undefined && {
                    updatedAt: { [sequelize_1.Op.lt]: opts.where.updatedBefore },
                },
                ((_d = opts === null || opts === void 0 ? void 0 : opts.where) === null || _d === void 0 ? void 0 : _d.updatedAfter) !== undefined && {
                    updatedAt: { [sequelize_1.Op.gt]: opts.where.updatedAfter },
                },
            ],
        };
        const matches = await match_1.Match.findAll({
            attributes: ["id"],
            where,
        });
        return matches.map((match) => match.id);
    }
    listGames(opts) {
        return this.listMatches(opts);
    }
}
exports.PostgresStore = PostgresStore;
