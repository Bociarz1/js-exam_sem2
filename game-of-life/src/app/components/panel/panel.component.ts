import {ChangeDetectionStrategy, Component} from '@angular/core';
import {GolService} from "../../services/gol.service";
import {GolStatus} from "../../enums/game-status.enum";

@Component({
  selector: 'gol-panel',
  standalone: true,
  imports: [],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelComponent {
  protected readonly GolStatus = GolStatus;
constructor(protected readonly golService: GolService) {
}
protected handleStartGameBtn(): void {
  this.golService.startGame()
}
  protected handleStopGameBtn(): void {
    this.golService.stopGame()
  }
}
