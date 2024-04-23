import {Injectable, signal, WritableSignal} from '@angular/core';
import {IBoard} from "../interfaces/board.interface";
import {GameStatusEnum} from "../enums/game-status.enum";
import {SquareTypeEnum} from "../enums/square-type.enum";
import {interval, Subscription} from "rxjs";
import {DirectionEnum} from "../enums/square-directions.enum";

@Injectable({
  providedIn: 'root'
})
export class BouncySimulatorService {
  public board: WritableSignal<IBoard[][]> = signal([
    ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
    ['X', '0', '0', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
    ['X', '0', '0', '0', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
    ['X', '0', '0', '0', '0', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
    ['X', '0', '0', '0', '0', '0', 'X', 'X', 'X', 'X', 'X', 'X'],
    ['X', '0', '0', '0', '0', '0', '0', 'X', 'X', 'X', 'X', 'X'],
    ['X', '0', '0', '0', '0', '0', '0', '0', 'X', 'X', 'X', 'X'],
    ['X', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'X'],
    ['X', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'X'],
    ['X', '0', '0', '0', 'X', '0', '0', '0', '0', '0', '0', 'X'],
    ['X', '0', '0', 'X', 'X', 'X', '0', '0', '0', '0', '0', 'X'],
    ['X', '0', '0', '0', 'X', '0', '0', '0', '0', '0', '0', 'X'],
    ['X', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'X'],
    ['X', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'X'],
    ['X', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'X'],
    ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
  ]);
  public status: WritableSignal<GameStatusEnum> = signal(GameStatusEnum.PREPARING_OBSTACLES);
  private ballPosition: [number, number] = [-1, -1];
  private ballDirection!: DirectionEnum

  private interval$!: Subscription;

  constructor() {
  }
  public addObstacle(y:number,x:number): void {
    if(this.board()[y][x] === SquareTypeEnum.BORDER) return;
    this.updateBoard(y,x,SquareTypeEnum.OBSTACLE)
  }
  public updateBoard(y: number, x: number, squareType: SquareTypeEnum): void {
    this.board.update(prevBoard => {
      const newBoard = [...prevBoard]
      newBoard[y][x] = squareType;
      return newBoard
    })
  }

  public setInitialBallPosition(y: number, x: number): void {
    const square: SquareTypeEnum = this.board()[y][x] as SquareTypeEnum
    const isValidPosition = square === SquareTypeEnum.FREE_FIELD
    if (isValidPosition) {
      this.updateBoard(y,x, SquareTypeEnum.BALL);
      this.ballPosition = [y, x]
      this.status.set(GameStatusEnum.PREPARING_DIRECTION)
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
      this.detectDirection(this.ballPosition, [y,x]);
      this.status.set(GameStatusEnum.PLAYING);
      this.startBounce();
    } else {
      return
    }
  }

  private detectDirection(ballPosition:[number,number],ballDirection:[number,number]): void {
    const [yBallPosition,xBallPosition] = ballPosition;
    const [yBallDirection,xBallDirection] = ballDirection;
    let direction!: DirectionEnum;

    if (yBallDirection - yBallPosition > 0) {
      direction = DirectionEnum.DOWN;
    } else if (yBallDirection - yBallPosition < 0) {
      direction = DirectionEnum.UP;
    }

    if (xBallDirection - xBallPosition > 0) {
      if (direction === DirectionEnum.UP) {
        direction = DirectionEnum.UP_RIGHT;
      } else if (direction === DirectionEnum.DOWN) {
        direction = DirectionEnum.DOWN_RIGHT;
      } else {
        direction = DirectionEnum.RIGHT;
      }
    } else if (xBallDirection - xBallPosition < 0) {
      if (direction === DirectionEnum.UP) {
        direction = DirectionEnum.UP_LEFT;
      } else if (direction === DirectionEnum.DOWN) {
        direction = DirectionEnum.DOWN_LEFT;
      } else {
        direction = DirectionEnum.LEFT;
      }
    }

    if (direction !== undefined) {
      this.ballDirection = direction;
    }

  }
  public getSquaresAround(yCoordinates:number, xCoordinates:number): SquareTypeEnum[] {
    const up = this.board()[yCoordinates - 1][xCoordinates] as SquareTypeEnum
    const upRight = this.board()[yCoordinates - 1][xCoordinates + 1] as SquareTypeEnum
    const right = this.board()[yCoordinates][xCoordinates + 1] as SquareTypeEnum
    const downRight = this.board()[yCoordinates + 1][xCoordinates + 1] as SquareTypeEnum
    const down = this.board()[yCoordinates + 1][xCoordinates]as SquareTypeEnum
    const downLeft = this.board()[yCoordinates + 1][xCoordinates - 1] as SquareTypeEnum
    const left = this.board()[yCoordinates][xCoordinates - 1] as SquareTypeEnum
    const upLeft = this.board()[yCoordinates - 1][xCoordinates - 1] as SquareTypeEnum
    return [up, upRight, right, downRight, down, downLeft, left, upLeft];
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

  private startBounce(): void {
    this.interval$ = interval(1000).subscribe(() => {
      this.checkBallDirection();
      this.moveBall()
    })
  }
  private checkBallDirection(): void {
    const [y,x] = this.ballPosition
    const squaresAround: SquareTypeEnum[] = this.getSquaresAround(y,x)

    const isBorderUp: boolean = squaresAround[DirectionEnum.UP] === SquareTypeEnum.BORDER
    const isBorderUpRight: boolean = squaresAround[DirectionEnum.UP_RIGHT] === SquareTypeEnum.BORDER
    const isBorderRight: boolean = squaresAround[DirectionEnum.RIGHT] === SquareTypeEnum.BORDER
    const isBorderDownLeft: boolean = squaresAround[DirectionEnum.DOWN_LEFT] === SquareTypeEnum.BORDER
    const isBorderDown: boolean = squaresAround[DirectionEnum.DOWN] === SquareTypeEnum.BORDER
    const isBorderDownRight: boolean = squaresAround[DirectionEnum.DOWN_RIGHT] === SquareTypeEnum.BORDER
    const isBorderLeft: boolean = squaresAround[DirectionEnum.LEFT] === SquareTypeEnum.BORDER
    const isBorderUpLeft: boolean = squaresAround[DirectionEnum.UP_LEFT] === SquareTypeEnum.BORDER

    const isObstacleUp = squaresAround[DirectionEnum.UP] === SquareTypeEnum.OBSTACLE;
    const isObstacleUpRight = squaresAround[DirectionEnum.UP_RIGHT] === SquareTypeEnum.OBSTACLE;
    const isObstacleRight = squaresAround[DirectionEnum.RIGHT] === SquareTypeEnum.OBSTACLE;
    const isObstacleDownRight = squaresAround[DirectionEnum.DOWN_RIGHT] === SquareTypeEnum.OBSTACLE;
    const isObstacleDown = squaresAround[DirectionEnum.DOWN] === SquareTypeEnum.OBSTACLE;
    const isObstacleDownLeft = squaresAround[DirectionEnum.DOWN_LEFT] === SquareTypeEnum.OBSTACLE;
    const isObstacleLeft = squaresAround[DirectionEnum.LEFT] === SquareTypeEnum.OBSTACLE;
    const isObstacleUpLeft = squaresAround[DirectionEnum.UP_LEFT] === SquareTypeEnum.OBSTACLE;


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
    private setRandomDirection(currentDirection: DirectionEnum): void {
    let directions: DirectionEnum[] = [];
      const randomUpDirections: DirectionEnum[] = [DirectionEnum.DOWN_LEFT, DirectionEnum.DOWN_RIGHT];
      const randomLeftDirections: DirectionEnum[] = [DirectionEnum.UP_RIGHT, DirectionEnum.DOWN_RIGHT];
      const randomRightDirections: DirectionEnum[] = [DirectionEnum.UP_LEFT, DirectionEnum.DOWN_LEFT];
      const randomDownDirections: DirectionEnum[] = [DirectionEnum.UP_LEFT, DirectionEnum.UP_RIGHT];

      const randomUpRightDirections: DirectionEnum[] = [DirectionEnum.LEFT, DirectionEnum.DOWN];
      const randomDownRightDirections: DirectionEnum[] = [DirectionEnum.LEFT, DirectionEnum.UP];
      const randomDownLeftDirections: DirectionEnum[] = [DirectionEnum.UP, DirectionEnum.RIGHT];
      const randomUpLeftDirections: DirectionEnum[] = [DirectionEnum.RIGHT, DirectionEnum.DOWN];

      switch(currentDirection) {
        case DirectionEnum.UP:
          this.destroyObstacle(DirectionEnum.UP)
          directions = randomUpDirections;
          break;
        case DirectionEnum.UP_RIGHT:
          this.destroyObstacle(DirectionEnum.UP_RIGHT)
          directions = randomUpRightDirections;
          break;
        case DirectionEnum.RIGHT:
          this.destroyObstacle(DirectionEnum.RIGHT)
          directions = randomRightDirections;
          break;
        case DirectionEnum.DOWN_RIGHT:
          this.destroyObstacle(DirectionEnum.DOWN_RIGHT)
          directions = randomDownRightDirections;
          break;
        case DirectionEnum.DOWN:
          this.destroyObstacle(DirectionEnum.DOWN)
          directions = randomDownDirections;
          break;
        case DirectionEnum.DOWN_LEFT:
          this.destroyObstacle(DirectionEnum.DOWN_LEFT)
          directions = randomDownLeftDirections;
          break;
        case DirectionEnum.LEFT:
          this.destroyObstacle(DirectionEnum.LEFT)
          directions = randomLeftDirections;
          break;
        case DirectionEnum.UP_LEFT:
          this.destroyObstacle(DirectionEnum.UP_LEFT)
          directions = randomUpLeftDirections;
          break;
        default:
          break;
      }

      const randomIndex: number = Math.floor(Math.random() * directions.length);
      this.ballDirection = directions[randomIndex];
    }
  private destroyObstacle(directionOfObstacle: DirectionEnum): void {
  const [yBallPosition,xBallPosition] = this.ballPosition || [];
  let obstaclePosition: [number,number] = [-1,-1]
    switch(directionOfObstacle) {
      case DirectionEnum.UP:
        obstaclePosition = [yBallPosition - 1, xBallPosition];
        break;
      case DirectionEnum.UP_RIGHT:
        obstaclePosition = [yBallPosition - 1, xBallPosition + 1];
        break;
      case DirectionEnum.RIGHT:
        obstaclePosition = [yBallPosition, xBallPosition + 1];
        break;
      case DirectionEnum.DOWN_RIGHT:
        obstaclePosition = [yBallPosition + 1, xBallPosition + 1];
        break;
      case DirectionEnum.DOWN:
        obstaclePosition = [yBallPosition + 1, xBallPosition];
        break;
      case DirectionEnum.DOWN_LEFT:
        obstaclePosition = [yBallPosition + 1, xBallPosition - 1];
        break;
      case DirectionEnum.LEFT:
        obstaclePosition = [yBallPosition, xBallPosition - 1];
        break;
      case DirectionEnum.UP_LEFT:
        obstaclePosition = [yBallPosition - 1, xBallPosition - 1];
        break;
      default:
        break;
    }
    this.updateBoard(obstaclePosition[0],obstaclePosition[1],SquareTypeEnum.FREE_FIELD)
  }
}
