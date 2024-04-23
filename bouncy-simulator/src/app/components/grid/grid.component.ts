import {ChangeDetectionStrategy, Component} from '@angular/core';
import {SquareComponent} from "../square/square.component";
import {BouncySimulatorService} from "../../services/bouncy-simulator.service";
import {GameStatusEnum} from "../../enums/game-status.enum";

@Component({
  selector: 'bs-grid',
  standalone: true,
  imports: [
    SquareComponent
  ],
  template: `
    @for (row of bouncySimulatorService.board(); track row ; let y = $index) {
      <div class="bs__row">
        @for (square of bouncySimulatorService.board()[y]; track square; let x = $index) {
          <bs-square [fieldType]="square" [status]="bouncySimulatorService.status()" (click)="handleSquareClick(y,x)"></bs-square>
        }
      </div>
    }
  `,
  styles: [`
    .bs__row {
      line-height: calc(100vh / 25);
      height: calc(100vh / 25);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent {
  constructor(protected readonly bouncySimulatorService: BouncySimulatorService) {
  }
  protected handleSquareClick(y:number, x:number): void {
    console.log(this.bouncySimulatorService.status())
    switch (this.bouncySimulatorService.status()) {
      case GameStatusEnum.PREPARING_OBSTACLES:
        this.bouncySimulatorService.addObstacle(y,x);
        break;
      case GameStatusEnum.PREPARING_BALL:
        this.bouncySimulatorService.setInitialBallPosition(y,x);
        break;
      case GameStatusEnum.PREPARING_DIRECTION:
        this.bouncySimulatorService.setInitialBallDirection(y,x)
        break;
      default:
        return;
        break;
    }
  }
}
