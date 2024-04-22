export interface ISquareState {
  y:number,
  x:number,
  checked?: boolean
  checkedAround?: number
  futureChecked?: boolean
}

export interface ISquaresStates {
  [key:string]: ISquareState
}

