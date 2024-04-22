import { Pipe, PipeTransform } from '@angular/core';
import {ISquareState} from "../interfaces/square.interface";

@Pipe({
  name: 'changeState',
  standalone: true,
  pure: true
})
export class ChangeStatePipe implements PipeTransform {

  transform(coordinates: [number,number], futureSquaresBehaviour: ISquareState[]): boolean | undefined {
    const [y,x] = coordinates || []
    const square = futureSquaresBehaviour.find((item: ISquareState) => item.y === y && item.x === x)
    return square?.futureChecked;
  }

}
