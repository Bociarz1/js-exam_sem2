import { Pipe, PipeTransform } from '@angular/core';
import {ISquareState} from "../interfaces/square.interface";
import {SquareUtil} from "../utils/square.util";

@Pipe({
  name: 'checkedState',
  standalone: true,
  pure: true
})
export class ChangeStatePipe implements PipeTransform {

  transform(coordinates: [number,number], squares: ISquareState[]): boolean {
    const [y,x] = coordinates || []
    const indexOfSquare = SquareUtil.getIndexOfSquare(y,x,squares)
    if (indexOfSquare === -1) {
      return false
    } else {
      return squares[indexOfSquare].checked ?? false
    }
  }

}
