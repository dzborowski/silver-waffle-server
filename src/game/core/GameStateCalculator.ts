import {GameService} from "./GameService";
import {EntityManager} from "typeorm";
import {GameEntity} from "./data/GameEntity";
import {MoveEntity} from "./data/MoveEntity";
import {GameState} from "./GameState";

export class GameStateCalculator {
    protected gameId: string;
    protected manager: EntityManager;

    public constructor(gameId: string, manager: EntityManager) {
        this.gameId = gameId;
        this.manager = manager;
    }

    public async recalculateGameState(): Promise<void> {
        const game = await this.manager.findOneOrFail(GameEntity, this.gameId);
        const moves = await new GameService(this.gameId, this.manager).getChronologicallyCreatedMoves();
        const movesOnGrid = new Array(game.size ** 2).fill(null);
        const grid: MoveEntity[][] = [];

        moves.forEach((move: MoveEntity) => (movesOnGrid[move.position] = move));

        for (let i = 0; i < game.size ** 2; i += game.size) {
            grid.push(movesOnGrid.slice(i, i + game.size));
        }

        const rows = this.getRows(grid, game.size);
        const rowFilledByCreator = rows.find((row: MoveEntity[]) => {
            return row.every((move: MoveEntity) => move?.userId === game.creatorId);
        });
        const rowFilledByOponent = rows.find((row: MoveEntity[]) => {
            return row.every((move: MoveEntity) => move?.userId === game.oponentId);
        });

        if (rowFilledByCreator) {
            game.state = GameState.FINISHED;
            game.winnerId = game.creatorId;
        } else if (rowFilledByOponent) {
            game.state = GameState.FINISHED;
            game.winnerId = game.oponentId;
        } else {
            const allAvailableMovesAreDone = movesOnGrid.every((move: MoveEntity) => move);

            if (allAvailableMovesAreDone) {
                game.state = GameState.FINISHED;
            }
        }

        await this.manager.save(game);
    }

    protected getRows(grid: MoveEntity[][], size: number): MoveEntity[][] {
        return [
            ...this.getHorizontalRows(grid),
            ...this.getVerticalRows(grid, size),
            ...this.getDiagonalRows(grid, size),
        ];
    }

    protected getHorizontalRows(grid: MoveEntity[][]): MoveEntity[][] {
        return [...grid];
    }

    protected getVerticalRows(grid: MoveEntity[][], size: number): MoveEntity[][] {
        const rows: MoveEntity[][] = [];
        for (let i = 0; i < size; i++) {
            const row = [];
            for (let j = 0; j < size; j++) {
                row.push(grid[j][i]);
            }
            rows.push(row);
        }
        return rows;
    }

    protected getDiagonalRows(grid: MoveEntity[][], size: number): MoveEntity[][] {
        const firstDiagonal: MoveEntity[] = [];

        for (let i = 0; i < size; i++) {
            firstDiagonal.push(grid[i][i]);
        }

        const secondDiagonal: MoveEntity[] = [];

        for (let i = 0; i < size; i++) {
            secondDiagonal.push(grid[i][size - i - 1]);
        }

        return [firstDiagonal, secondDiagonal];
    }
}
