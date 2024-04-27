import {computed, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {GolStatus} from "../enums/game-status.enum";
import { ISquareState} from "../interfaces/square.interface";
import {ArrayUtils} from "../utils/array.utils";
import {interval, Subject, Subscription, takeUntil} from "rxjs";
import {SquareUtil} from "../utils/square.util";

@Injectable({
  providedIn: 'root'
})
export class GolService {
  private _status: WritableSignal<GolStatus> = signal(GolStatus.PREPARING);
  public readonly status: Signal<GolStatus> = computed(() => this._status())

  private _squaresStates : WritableSignal<ISquareState[]> = signal([]);
  public readonly squaresStates : Signal<ISquareState[]> = computed(() => this._squaresStates());

  private interval$: Subscription = new Subscription();

  public changeSquareState(squareState: ISquareState):void {
    const {y,x} = squareState || {}
    const squareIndex: number = SquareUtil.getIndexOfSquare(y,x,this.squaresStates());

    if(squareIndex === -1) {
      this._squaresStates.update((prev:ISquareState[]) => [...prev, {...squareState, checked: true}])
    } else {
      this._squaresStates.update((prev:ISquareState[]) => {
        prev[squareIndex] = {...squareState, checked: !prev[squareIndex].checked}
        const isUnChecked: boolean = !prev[squareIndex].checked
        isUnChecked ? prev.splice(squareIndex,1) : null;
        return prev
      })
    }
  }
  public startGame(): void {
    this._status.set(GolStatus.PLAYING);
    this.interval$ = interval(500).subscribe(() => {
      this.startOneCycle()
    })
  }
  public stopGame(): void {
    this.interval$.unsubscribe();
    this._status.set(GolStatus.PREPARING);
    this._squaresStates.set([])

  }
  private setSquaresStates(checkedSquares: ISquareState[]): ISquareState[][] {
    const checkedSquaresStates: ISquareState[] = []
    const uncheckedSquaresStatesAroundChecked: ISquareState[][] = []

    checkedSquares.forEach((square: ISquareState) => {
      const {y,x} = square || {};
      const coordinatesAround: ISquareState[] = SquareUtil.getCoordinatesAround(y,x, checkedSquares)

      checkedSquaresStates.push({...square, checkedAround: SquareUtil.getCheckedAround(coordinatesAround).length});
      uncheckedSquaresStatesAroundChecked.push(SquareUtil.getUncheckedAround(coordinatesAround))
    })
      const matchingElements:{value: ISquareState; amount: number}[] = ArrayUtils.countMatchingElements(uncheckedSquaresStatesAroundChecked);
      const uncheckedSquaresStates: ISquareState[] = matchingElements.map((item: {value: ISquareState; amount: number}) => {
        return {...item.value, checkedAround: item.amount}
      })
      return [checkedSquaresStates,uncheckedSquaresStates];
  }
  private startOneCycle(): void {
    const checkedSquares: ISquareState[] = this.squaresStates().filter((squareState: ISquareState): boolean => !!squareState.checked);

    const [checkedSquaresStates, uncheckedSquaresStates] = this.setSquaresStates(checkedSquares);
    const updatingSquares: ISquareState[] = [...checkedSquaresStates,...uncheckedSquaresStates]
    this.futureSquaresBehaviour(updatingSquares)
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
       return {...item, checked: isAlive}
    })

    unCheckedSquareBehaviour = unCheckedSquareBehaviour
      .filter((item: ISquareState):boolean => item.checkedAround === 3)
      .map((item: ISquareState) => ({...item, checked: true}))

    this._squaresStates.set([...checkedSquareBehaviour,...unCheckedSquareBehaviour])
  }
}
