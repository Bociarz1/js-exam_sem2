import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {GolService} from "../../services/gol.service";
import {GolStatus} from "../../enums/game-status.enum";

@Component({
  selector: 'gol-panel',
  standalone: true,
  imports: [],
  template: `
    @if(golService.status() === GolStatus.PREPARING) {
      <button (click)="handleStartGameBtn()">START game</button>
    } @else {
      <button (click)="handleStopGameBtn()">STOP game</button>
    }
  `,
  styles: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelComponent {
  protected readonly GolStatus = GolStatus;
  protected readonly golService = inject(GolService);
protected handleStartGameBtn(): void {
  this.golService.startGame()
}
  protected handleStopGameBtn(): void {
    this.golService.stopGame()
  }
}
