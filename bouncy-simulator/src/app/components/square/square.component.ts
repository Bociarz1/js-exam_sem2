import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {SquareTypeEnum} from "../../enums/square-type.enum";
import {GameStatusEnum} from "../../enums/game-status.enum";
import {NgClass} from "@angular/common";

@Component({
  selector: 'bs-square',
  standalone: true,
  imports: [
    NgClass
  ],
  template: `
    <div
      class="bs__square"
      [class]="'bs__square--'+fieldType"
      [ngClass]="{'direction':status === GameStatusEnum.PREPARING_DIRECTION,
      'ball':status === GameStatusEnum.PREPARING_BALL,
      'obstacle':status === GameStatusEnum.PREPARING_OBSTACLES
      }"
    >
      {{fieldType}}
    </div>`,
  styles: [`
    :host {
      display: inline-block;
      border: 1px solid black;
      width: calc(100vh / 25);
      height: calc(100vh / 25);
    }

    .bs__square {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
    .bs__square--Y {
      color: white;
      background-color: grey;
    }

    .bs__square--X {
      color: white;
      background-color: black;
    }

    .bs__square--0 {
      background-color: white;
    }

    .bs__square--1 {
      background-color: chartreuse;
    }
    .direction:hover {
      background-color: darkgreen;
    }
    .ball:hover {
      background-color: chartreuse;
    }
    .obstacle:hover {
      background-color: grey;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SquareComponent {
  @Input() fieldType!: SquareTypeEnum;
  @Input() status!: GameStatusEnum;
  protected readonly GameStatusEnum = GameStatusEnum;
}
