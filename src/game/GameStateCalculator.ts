export class GameStateCalculator {
    protected gameId: string;

    public constructor(gameId: string) {
        this.gameId = gameId;
    }

    public async recalculateGameState(): Promise<void> {}
}
