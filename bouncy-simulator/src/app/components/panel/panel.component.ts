import {ChangeDetectionStrategy, Component} from '@angular/core';
import {BouncySimulatorService} from "../../services/bouncy-simulator.service";
import {GameStatusEnum} from "../../enums/game-status.enum";

@Component({
  selector: 'bs-panel',
  standalone: true,
  imports: [],
  template: `
    @switch (bouncySimulatorService.status()) {
      @case (GameStatusEnum.PREPARING_OBSTACLES) {
        <h1>choose obstacles locations</h1>
        <button (click)="finishLocateObstacle()">finish obstacle location</button>
      }
      @case (GameStatusEnum.PREPARING_BALL) {
        <h1>choose ball location</h1>
      }
      @case (GameStatusEnum.PREPARING_DIRECTION) {
        <h1>choose ball start direction</h1>
      }
      @case (GameStatusEnum.PLAYING) {
        <h1>Playing...</h1>
        <button (click)="restartGame()">Restart Game</button>
      }
    }
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PanelComponent {
  protected readonly GameStatusEnum = GameStatusEnum;
 constructor(protected readonly bouncySimulatorService: BouncySimulatorService) {
 }
  protected finishLocateObstacle(): void {
   this.bouncySimulatorService.setStatus(GameStatusEnum.PREPARING_BALL)
  }
  protected restartGame(): void {
   this.bouncySimulatorService.restartGame();
  }
}
