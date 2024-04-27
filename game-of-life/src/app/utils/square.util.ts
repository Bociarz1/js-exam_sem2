import {ISquareState} from "../interfaces/square.interface";
import {ArrayUtils} from "./array.utils";

export class SquareUtil {
  static getIndexOfSquare(y:number,x:number,squares:ISquareState[]): number {
    return squares.findIndex((square: ISquareState) => y === square.y && x === square.x)
  }
  static getCoordinatesAround(y: number,x: number, checkedSquares: ISquareState[]):ISquareState[] {
    const checkedSquaresWithoutCheckedKey: ISquareState[] = checkedSquares.map(item => ({y:item.y,x:item.x}))
    const coordinatesAround: ISquareState[] = [
      { y: y, x: x - 1 },
      { y: y - 1, x: x - 1},
      { y: y + 1, x: x - 1 },
      { y: y, x: x + 1 },
      { y: y - 1, x: x + 1 },
      { y: y + 1, x: x + 1 },
      { y: y - 1, x: x },
      { y: y + 1, x: x },
    ]
    return coordinatesAround.map((item: ISquareState) => {
      return {...item, checked: ArrayUtils.contains(item,checkedSquaresWithoutCheckedKey)}
    })
  }
  static getCheckedAround(aroundSquaresCoordinates: ISquareState[]): ISquareState[] {
    return aroundSquaresCoordinates.filter((square: ISquareState) => square.checked)
  }
  static getUncheckedAround(aroundSquaresCoordinates: ISquareState[]): ISquareState[] {
    return aroundSquaresCoordinates.filter((square: ISquareState) => !square.checked)
  }
}
