import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {SquareComponent} from "../square/square.component";
import {GolService} from "../../services/gol.service";
import {ChangeStatePipe} from "../../pipes/change-state.pipe";
import {GolStatus} from "../../enums/game-status.enum";

@Component({
  selector: 'gol-grid',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SquareComponent,
    ChangeStatePipe
  ],
  template: `
    @for (row of Array(100); track row; let y = $index) {
      <div class="gol__row">
        @for (square of Array(100); track square; let x = $index) {
          <gol-square
            [status]="golService.status()"
            [checked]="[y,x] | checkedState : golService.squaresStates()"
            [y]="y"
            [x]="x"
            (click)="handleSquareClick(y,x)">
          </gol-square>
        }
      </div>
    }
  `,
  styles: [`
    :host {
      border: 1px solid black;
    }
    .gol__row {
      line-height: calc(100vh / 100);
      height: calc(100vh / 100);
    }
  `]
})
export class GridComponent {
  protected readonly Array: ArrayConstructor = Array;
  protected readonly golService = inject(GolService);
  protected handleSquareClick(y:number,x:number): void {
    if(this.golService.status() !== GolStatus.PREPARING) return
    this.golService.changeSquareState({y,x});
  }
}
