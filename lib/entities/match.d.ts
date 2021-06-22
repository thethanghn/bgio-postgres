import { Model, ModelAttributes } from "sequelize";
import { State, LogEntry, Server } from "boardgame.io";
export declare class Match extends Model {
    id: string;
    gameName: string;
    players: {
        [id: number]: Server.PlayerMetadata;
    };
    setupData: unknown | undefined;
    gameover: unknown | undefined;
    nextRoomID: string | undefined;
    unlisted: boolean | undefined;
    state: State;
    initialState: State;
    log: LogEntry[];
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export declare const matchAttributes: ModelAttributes;
