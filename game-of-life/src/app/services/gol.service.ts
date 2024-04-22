import {DestroyRef, Injectable, signal, WritableSignal} from '@angular/core';
import {GolStatus} from "../enums/game-status.enum";
import { ISquaresStates, ISquareState} from "../interfaces/square.interface";
import {ArrayUtils} from "../utils/array.utils";
import {interval, Subject, Subscription, takeUntil} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Injectable({
  providedIn: 'root'
})
export class GolService {
  public status: WritableSignal<GolStatus> = signal(GolStatus.PREPARING);
  public squaresStates: ISquaresStates = {}
  public futureSquaresStates : WritableSignal<ISquareState[]> = signal([]);
  private interval$: Subscription = new Subscription();
  constructor() { }


  public startGame(): void {
    this.status.set(GolStatus.PLAYING);
    this.interval$ = interval(500).subscribe(() => {
      console.log('interval')
      this.startOneCycle()
    })
  }
  public stopGame(): void {
    this.interval$.unsubscribe();
    this.status.set(GolStatus.PREPARING);
    this.squaresStates = {};
    this.futureSquaresStates.set([])

  }
  private setSquaresStates(checkedSquares: ISquareState[]): any {
    const checkedSquaresStates: ISquareState[] = []
    const uncheckedSquaresStatesAroundChecked: ISquareState[][] = []

    checkedSquares.forEach((square: ISquareState) => {
      const {y,x} = square || {};
      const coordinatesAround: ISquareState[] = this.getCoordinatesAround(y,x, checkedSquares)

      checkedSquaresStates.push({...square, checkedAround: this.getCheckedAround(coordinatesAround).length});
      uncheckedSquaresStatesAroundChecked.push(this.getUncheckedAround(coordinatesAround))
    })
      const matchingElements:{value: ISquareState; amount: number}[] = ArrayUtils.countMatchingElements(uncheckedSquaresStatesAroundChecked);
      const uncheckedSquaresStates: ISquareState[] = matchingElements.map((item: {value: ISquareState; amount: number}) => {
        return {...item.value, checkedAround: item.amount}
      })

      return [checkedSquaresStates,uncheckedSquaresStates];
  }
  private startOneCycle(): void {
    const checkedSquares: ISquareState[] = Object.values(this.squaresStates).filter((squareState: ISquareState): boolean => squareState.checked ?? false);

    const [checkedSquaresStates, uncheckedSquaresStates] = this.setSquaresStates(checkedSquares);
    const updatingSquares: ISquareState[] = [...checkedSquaresStates,...uncheckedSquaresStates]
    this.futureSquaresBehaviour(updatingSquares)
  }
  private getCoordinatesAround(y: number,x: number, checkedSquares: ISquareState[]):ISquareState[] {

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
  private getCheckedAround(aroundSquaresCoordinates: ISquareState[]): ISquareState[] {
    return aroundSquaresCoordinates.filter((square: ISquareState) => square.checked)
  }
  private getUncheckedAround(aroundSquaresCoordinates: ISquareState[]): ISquareState[] {
    return aroundSquaresCoordinates.filter((square: ISquareState) => !square.checked)
  }
  private futureSquaresBehaviour(updatingSquares: ISquareState[]) {
    let checkedSquareBehaviour: ISquareState[] = updatingSquares.filter((item:ISquareState) => item.checked)
    let unCheckedSquareBehaviour: ISquareState[] = updatingSquares.filter((item:ISquareState) => !item.checked)


    checkedSquareBehaviour = checkedSquareBehaviour
      .map((item:ISquareState) => {
      let isAlive: boolean = false
       if(item.checkedAround === 2 || item.checkedAround === 3) {
         isAlive = true
      }
       return {...item, futureChecked: isAlive}
    })

    unCheckedSquareBehaviour = unCheckedSquareBehaviour
      .filter((item: ISquareState):boolean => item.checkedAround === 3)
      .map((item: ISquareState) => ({...item, futureChecked: true}))

    this.futureSquaresStates.set([...checkedSquareBehaviour,...unCheckedSquareBehaviour])
  }

}
