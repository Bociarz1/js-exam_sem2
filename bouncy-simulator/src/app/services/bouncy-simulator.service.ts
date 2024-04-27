import {computed, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {GameStatusEnum} from "../enums/game-status.enum";
import {SquareTypeEnum} from "../enums/square-type.enum";
import {interval, Subscription} from "rxjs";
import {DirectionEnum} from "../enums/square-directions.enum";
import {getInitialBoard} from "../consts/board.const";
import {IBoard, ICoordinates} from "../interfaces/board.interface";
import {BoardUtil} from "../utils/board.util";

@Injectable({
  providedIn: 'root'
})
export class BouncySimulatorService {
  private _board: WritableSignal<SquareTypeEnum[][]> = signal(getInitialBoard());
  public readonly board: Signal<SquareTypeEnum[][]> = computed(() => this._board());

  private _status: WritableSignal<GameStatusEnum> = signal(GameStatusEnum.PREPARING_OBSTACLES);
  public readonly status: Signal<GameStatusEnum> = computed(() => this._status());

  private _ballPosition: ICoordinates = [-1, -1];
  private get ballPosition() {
    return this._ballPosition
  }
  private set ballPosition(newBallPosition: ICoordinates) {
    this._ballPosition = newBallPosition;
  }

  private _ballDirection!: DirectionEnum
  private get ballDirection() {
    return this._ballDirection
  }
  private set ballDirection(newBallDirection: DirectionEnum) {
    this._ballDirection = newBallDirection;
  }

  private _interval$!: Subscription;

  constructor() {
  }
  public setStatus(newStatus: GameStatusEnum): void {
    this._status.set(newStatus)
  }

  public updateBoard(y: number, x: number, squareType: SquareTypeEnum): void {
    this._board.update((prevBoard: IBoard) => {
      const newBoard: IBoard = [...prevBoard]
      newBoard[y][x] = squareType;
      return newBoard
    })
  }
  private restartBoard(): void {
    this._board.set(getInitialBoard());
  }
  public restartGame(): void {
    this._interval$.unsubscribe();
    this.restartBoard();
    this.setStatus(GameStatusEnum.PREPARING_OBSTACLES)
  }
  private startBounce(): void {
    this._interval$ = interval(1000).subscribe(() => {
      this.calculateNewBallDirection();
      this.moveBall()
    })
  }
  public addObstacle(y:number,x:number): void {
    if(this.board()[y][x] === SquareTypeEnum.BORDER) return;
    this.updateBoard(y,x,SquareTypeEnum.OBSTACLE)
  }

  private setRandomDirection(currentDirection: DirectionEnum): void {
    const randomDirections: DirectionEnum[] = BoardUtil.setRandomDirections(currentDirection)
    this.destroyObstacle(currentDirection);
    const randomIndex: number = Math.floor(Math.random() * randomDirections.length);
    this.ballDirection = randomDirections[randomIndex];
  }
  private destroyObstacle(directionOfObstacle: DirectionEnum): void {
    const obstaclePosition: ICoordinates = BoardUtil.getObstaclePosition(this.ballPosition,directionOfObstacle)
    this.updateBoard(obstaclePosition[0],obstaclePosition[1],SquareTypeEnum.FREE_FIELD)
  }

  public setInitialBallPosition(y: number, x: number): void {
    const square: SquareTypeEnum = this.board()[y][x]
    const isValidPosition: boolean = square === SquareTypeEnum.FREE_FIELD
    if (isValidPosition) {
      this.updateBoard(y,x, SquareTypeEnum.BALL);
      this.ballPosition = [y, x]
      this.setStatus(GameStatusEnum.PREPARING_DIRECTION)
    } else {
      return
    }
  }

  public setInitialBallDirection(y: number, x: number): void {
    const square: SquareTypeEnum = this.board()[y][x] as SquareTypeEnum
    const [yBallPosition, xBallPosition] = this.ballPosition;

    const isValidYPosition: boolean = yBallPosition + 1 === y || yBallPosition - 1 === y || yBallPosition === y
    const isValidXPosition: boolean = xBallPosition + 1 === x || xBallPosition - 1 === x || xBallPosition === x
    const isValidFieldType: boolean = square === SquareTypeEnum.FREE_FIELD

    if (isValidFieldType && isValidYPosition && isValidXPosition) {
      this.ballDirection = BoardUtil.detectDirection(this.ballPosition,[y,x])
      this.setStatus(GameStatusEnum.PLAYING);
      this.startBounce();
    } else {
      return
    }
  }

  public moveBall(): void {
      const [yBallPosition, xBallPosition] = this.ballPosition;
      this.updateBoard(yBallPosition,xBallPosition, SquareTypeEnum.FREE_FIELD);

      switch(this.ballDirection) {
        case DirectionEnum.UP:
          this.ballPosition = [yBallPosition - 1, xBallPosition];
          break;
        case DirectionEnum.UP_RIGHT:
          this.ballPosition = [yBallPosition - 1, xBallPosition + 1];
          break;
        case DirectionEnum.RIGHT:
          this.ballPosition = [yBallPosition, xBallPosition + 1];
          break;
        case DirectionEnum.DOWN_RIGHT:
          this.ballPosition = [yBallPosition + 1, xBallPosition + 1];
          break;
        case DirectionEnum.DOWN:
          this.ballPosition = [yBallPosition + 1, xBallPosition];
          break;
        case DirectionEnum.DOWN_LEFT:
          this.ballPosition = [yBallPosition + 1, xBallPosition - 1];
          break;
        case DirectionEnum.LEFT:
          this.ballPosition = [yBallPosition, xBallPosition - 1];
          break;
        case DirectionEnum.UP_LEFT:
          this.ballPosition = [yBallPosition - 1, xBallPosition - 1];
          break;
        default:
          break;
      }
    this.updateBoard(this.ballPosition[0],this.ballPosition[1], SquareTypeEnum.BALL);
  }

  private calculateNewBallDirection(): void {
    const [y,x] = this.ballPosition || []
    const squaresAround: SquareTypeEnum[] = BoardUtil.getSquaresAround(this.board(),y,x)

    const isBorderUp: boolean = squaresAround[DirectionEnum.UP] === SquareTypeEnum.BORDER
    const isBorderUpRight: boolean = squaresAround[DirectionEnum.UP_RIGHT] === SquareTypeEnum.BORDER
    const isBorderRight: boolean = squaresAround[DirectionEnum.RIGHT] === SquareTypeEnum.BORDER
    const isBorderDownLeft: boolean = squaresAround[DirectionEnum.DOWN_LEFT] === SquareTypeEnum.BORDER
    const isBorderDown: boolean = squaresAround[DirectionEnum.DOWN] === SquareTypeEnum.BORDER
    const isBorderDownRight: boolean = squaresAround[DirectionEnum.DOWN_RIGHT] === SquareTypeEnum.BORDER
    const isBorderLeft: boolean = squaresAround[DirectionEnum.LEFT] === SquareTypeEnum.BORDER
    const isBorderUpLeft: boolean = squaresAround[DirectionEnum.UP_LEFT] === SquareTypeEnum.BORDER

    const isObstacleUp: boolean = squaresAround[DirectionEnum.UP] === SquareTypeEnum.OBSTACLE;
    const isObstacleUpRight: boolean = squaresAround[DirectionEnum.UP_RIGHT] === SquareTypeEnum.OBSTACLE;
    const isObstacleRight: boolean = squaresAround[DirectionEnum.RIGHT] === SquareTypeEnum.OBSTACLE;
    const isObstacleDownRight: boolean = squaresAround[DirectionEnum.DOWN_RIGHT] === SquareTypeEnum.OBSTACLE;
    const isObstacleDown: boolean = squaresAround[DirectionEnum.DOWN] === SquareTypeEnum.OBSTACLE;
    const isObstacleDownLeft: boolean = squaresAround[DirectionEnum.DOWN_LEFT] === SquareTypeEnum.OBSTACLE;
    const isObstacleLeft: boolean = squaresAround[DirectionEnum.LEFT] === SquareTypeEnum.OBSTACLE;
    const isObstacleUpLeft: boolean = squaresAround[DirectionEnum.UP_LEFT] === SquareTypeEnum.OBSTACLE;

    switch(this.ballDirection) {
      case DirectionEnum.UP:
        isBorderUp ? this.ballDirection = DirectionEnum.DOWN : null
        isObstacleUp ? this.setRandomDirection(DirectionEnum.UP) : null
        break;
      case DirectionEnum.UP_RIGHT:
        isBorderRight ? this.ballDirection = DirectionEnum.UP_LEFT : null
        isBorderUp ? this.ballDirection = DirectionEnum.DOWN_RIGHT : null
        isBorderRight && isBorderUp ? this.ballDirection = DirectionEnum.DOWN_LEFT : null
        isBorderUpRight && !isBorderRight && !isBorderUp ? this.ballDirection = DirectionEnum.DOWN_LEFT : null
        isObstacleUpRight ? this.setRandomDirection(DirectionEnum.UP_RIGHT) : null
        isObstacleUp ? this.setRandomDirection(DirectionEnum.UP) : null
        isObstacleRight ? this.setRandomDirection(DirectionEnum.RIGHT) : null
        break;
      case DirectionEnum.RIGHT:
        isBorderRight ? this.ballDirection = DirectionEnum.LEFT : null
        isObstacleLeft ? this.setRandomDirection(DirectionEnum.LEFT) : null
        break;
      case DirectionEnum.DOWN_RIGHT:
        isBorderRight ? this.ballDirection = DirectionEnum.DOWN_LEFT : null
        isBorderDown ? this.ballDirection = DirectionEnum.UP_RIGHT : null
        isBorderRight && isBorderDown ? this.ballDirection = DirectionEnum.UP_LEFT : null
        isBorderDownRight && !isBorderDown && !isBorderRight ? this.ballDirection = DirectionEnum.UP_LEFT : null
        isObstacleDownRight ? this.setRandomDirection(DirectionEnum.DOWN_RIGHT) : null
        isObstacleDown ? this.setRandomDirection(DirectionEnum.DOWN) : null
        isObstacleRight ? this.setRandomDirection(DirectionEnum.RIGHT) : null
        break;
      case DirectionEnum.DOWN:
        isBorderDown ? this.ballDirection = DirectionEnum.UP : null
        isObstacleDown ? this.setRandomDirection(DirectionEnum.DOWN) : null
        break;
      case DirectionEnum.DOWN_LEFT:
        isBorderDown ? this.ballDirection = DirectionEnum.UP_LEFT : null
        isBorderLeft ? this.ballDirection = DirectionEnum.DOWN_RIGHT : null
        isBorderDown && isBorderLeft ? this.ballDirection = DirectionEnum.UP_RIGHT : null
        isBorderDownLeft &&  !isBorderDown && !isBorderLeft ? this.ballDirection = DirectionEnum.UP_RIGHT : null
        isObstacleDownLeft ? this.setRandomDirection(DirectionEnum.DOWN_LEFT) : null
        isObstacleDown ? this.setRandomDirection(DirectionEnum.DOWN) : null
        isObstacleLeft ? this.setRandomDirection(DirectionEnum.LEFT) : null
        break;
      case DirectionEnum.LEFT:
        isBorderLeft ? this.ballDirection = DirectionEnum.RIGHT : null
        isObstacleLeft ? this.setRandomDirection(DirectionEnum.LEFT) : null
        break;
      case DirectionEnum.UP_LEFT:
        isBorderUp ? this.ballDirection = DirectionEnum.DOWN_LEFT : null
        isBorderLeft? this.ballDirection = DirectionEnum.UP_RIGHT: null
        isBorderUp && isBorderLeft ? this.ballDirection = DirectionEnum.DOWN_RIGHT : null
        isBorderUpLeft && !isBorderUp && !isBorderLeft ? this.ballDirection = DirectionEnum.DOWN_RIGHT : null
        isObstacleUpLeft ? this.setRandomDirection(DirectionEnum.UP_LEFT) : null
        isObstacleUp ? this.setRandomDirection(DirectionEnum.UP) : null
        isObstacleLeft ? this.setRandomDirection(DirectionEnum.LEFT) : null
        break;
      default:
        break;
    }
  }
}
