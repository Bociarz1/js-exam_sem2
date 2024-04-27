import {DirectionEnum} from "../enums/square-directions.enum";
import {IBoard, ICoordinates} from "../interfaces/board.interface";
import {SquareTypeEnum} from "../enums/square-type.enum";

export class BoardUtil {
  static deepCopyArray(arr: Array<any>): Array<any> {
    return structuredClone(arr)
  }
  static getSquaresAround(board: IBoard, yCoordinates:number, xCoordinates:number): SquareTypeEnum[] {
    const up: SquareTypeEnum = board[yCoordinates - 1][xCoordinates]
    const upRight: SquareTypeEnum = board[yCoordinates - 1][xCoordinates + 1]
    const right: SquareTypeEnum = board[yCoordinates][xCoordinates + 1]
    const downRight: SquareTypeEnum = board[yCoordinates + 1][xCoordinates + 1]
    const down: SquareTypeEnum = board[yCoordinates + 1][xCoordinates]
    const downLeft: SquareTypeEnum = board[yCoordinates + 1][xCoordinates - 1]
    const left: SquareTypeEnum = board[yCoordinates][xCoordinates - 1]
    const upLeft: SquareTypeEnum = board[yCoordinates - 1][xCoordinates - 1]
    return [up, upRight, right, downRight, down, downLeft, left, upLeft];
  }
  static  detectDirection(ballPosition:ICoordinates,ballDirection:ICoordinates): DirectionEnum {
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
      return direction;
  }
  static getObstaclePosition(ballPosition: ICoordinates, directionOfObstacle: DirectionEnum): ICoordinates {
    const [yBallPosition,xBallPosition] = ballPosition || [];
    let obstaclePosition: ICoordinates = [-1,-1]
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
    return obstaclePosition
  }
 static setRandomDirections(currentDirection: DirectionEnum): DirectionEnum[] {
   let randomDirections: DirectionEnum[] = [];
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
       randomDirections = randomUpDirections;
       break;
     case DirectionEnum.UP_RIGHT:
       randomDirections = randomUpRightDirections;
       break;
     case DirectionEnum.RIGHT:
       randomDirections = randomRightDirections;
       break;
     case DirectionEnum.DOWN_RIGHT:
       randomDirections = randomDownRightDirections;
       break;
     case DirectionEnum.DOWN:
       randomDirections = randomDownDirections;
       break;
     case DirectionEnum.DOWN_LEFT:
       randomDirections = randomDownLeftDirections;
       break;
     case DirectionEnum.LEFT:
       randomDirections = randomLeftDirections;
       break;
     case DirectionEnum.UP_LEFT:
       randomDirections = randomUpLeftDirections;
       break;
     default:
       break;
   }
   return randomDirections;
 }
}
