import {ChangeDetectionStrategy, Component} from '@angular/core';
import {SquareComponent} from "../square/square.component";
import {ISquareState} from "../../interfaces/square.interface";
import {GolService} from "../../services/gol.service";
import {ChangeStatePipe} from "../../pipes/change-state.pipe";

@Component({
  selector: 'gol-grid',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SquareComponent,
    ChangeStatePipe
  ],
  template: `
      @for (row of Array(100); track row ; let y = $index) {
        <div class="gol__row">
          @for (square of Array(100); track square; let x = $index) {
            <gol-square [status]="golService.status()" [checked]="[y,x] | changeState : golService.futureSquaresStates()" [coordinates]="[y,x]" (squareStateEmitter)="handleSquareState($event)">
            </gol-square>
          }
        </div>
      }
  `,
  styles: [`
    .gol__row {
      line-height: calc(100vh / 100);
      height: calc(100vh / 100);
    }
  `]
})
export class GridComponent {
  protected readonly Array: ArrayConstructor = Array;
  constructor(protected readonly golService: GolService) {
  }
  protected handleSquareState(squareState: ISquareState) {
    const {y, x, checked} = squareState || {}
    this.golService.squaresStates[`y-${y} x-${x}`] = squareState
  }
}
