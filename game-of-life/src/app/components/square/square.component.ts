import {ChangeDetectionStrategy, Component, Input,} from '@angular/core';
import {NgClass} from "@angular/common";
import {GolStatus} from "../../enums/game-status.enum";


@Component({
  selector: 'gol-square',
  standalone: true,
  imports: [
    NgClass
  ],
  template: `
    <div class="gol__square" [ngClass]="{'gol__square--checked': checked, 'gol__square--preparing': status === GolStatus.PREPARING}"></div>`,
  styles: [`
    :host {
      display: inline-block;
      width: calc(100vh / 100);
      height: calc(100vh / 100);
    }

    .gol__square {
      width: 100%;
      height: 100%;
      cursor: pointer;
    }

    .gol__square--checked  {
      background-color: green;
    }
    .gol__square--preparing:hover  {
      background-color: green;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SquareComponent {
  @Input()  status: GolStatus = GolStatus.PREPARING;
  @Input()  checked: boolean = false;
  @Input()  y: number = -1;
  @Input()  x: number = -1;
  protected  GolStatus = GolStatus;
}
