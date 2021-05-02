import {GameService} from "./GameService";
import {getManager} from "typeorm";
import {GameEntity} from "./data/GameEntity";
import {MoveEntity} from "./data/MoveEntity";
import {GameState} from "./GameState";

export class GameStateCalculator {
    protected gameId: string;

    public constructor(gameId: string) {
        this.gameId = gameId;
    }

    public async recalculateGameState(): Promise<void> {
        const manager = getManager();
        const game = await manager.findOneOrFail(GameEntity, this.gameId, {
            relations: ["creator", "oponent"],
        });
        const moves = await new GameService(this.gameId).getChronologicallyCreatedMoves();
        const movesOnGrid = new Array(game.size ** 2).fill(null);
        const grid: MoveEntity[][] = [];

        moves.forEach((move: MoveEntity) => (movesOnGrid[move.position] = move));

        for (let i = 0; i < game.size ** 2; i += game.size) {
            grid.push(movesOnGrid.slice(i, i + game.size));
        }

        const rows = this.getRows(grid, game.size);
        const rowFilledByCreator = rows.find((row: MoveEntity[]) => {
            return row.every((move: MoveEntity) => move?.user.id === game.creator.id);
        });
        const rowFilledByOponent = rows.find((row: MoveEntity[]) => {
            return row.every((move: MoveEntity) => move?.user.id === game.oponent.id);
        });

        if (rowFilledByCreator) {
            game.state = GameState.FINISHED;
            game.winner = game.creator;
        } else if (rowFilledByOponent) {
            game.state = GameState.FINISHED;
            game.winner = game.oponent;
        } else {
            const allAvailableMovesAreDone = movesOnGrid.every((move: MoveEntity) => move);

            if (allAvailableMovesAreDone) {
                game.state = GameState.FINISHED;
            }
        }

        await manager.save(game);
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