import { LogEntry, Server, State, StorageAPI } from "boardgame.io";
import { Async } from "boardgame.io/internal";
import { Sequelize, Options } from "sequelize";
export declare class PostgresStore extends Async {
    private _sequelize;
    constructor(uri: string, options?: Options);
    constructor(options: Options);
    get sequelize(): Sequelize;
    connect(): Promise<void>;
    createMatch(id: string, { initialState, metadata: { gameName, players, setupData, gameover, nextMatchID, unlisted, }, }: StorageAPI.CreateMatchOpts): Promise<void>;
    createGame(matchID: string, opts: StorageAPI.CreateGameOpts): Promise<void>;
    setState(id: string, state: State, deltalog?: LogEntry[]): Promise<void>;
    setMetadata(id: string, { gameName, players, setupData, gameover, nextMatchID, unlisted, createdAt, updatedAt, }: Server.MatchData): Promise<void>;
    fetch<O extends StorageAPI.FetchOpts>(matchID: string, { state, log, metadata, initialState }: O): Promise<StorageAPI.FetchResult<O>>;
    wipe(id: string): Promise<void>;
    listMatches(opts?: StorageAPI.ListMatchesOpts): Promise<string[]>;
    listGames(opts?: StorageAPI.ListGamesOpts): Promise<string[]>;
}
