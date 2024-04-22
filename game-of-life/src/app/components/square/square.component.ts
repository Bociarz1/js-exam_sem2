import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output,} from '@angular/core';
import {NgClass} from "@angular/common";
import {ISquareState} from "../../interfaces/square.interface";
import {GolStatus} from "../../enums/game-status.enum";


@Component({
  selector: 'gol-square',
  standalone: true,
  imports: [
    NgClass
  ],
  template: `
    <div class="gol__square" [ngClass]="{'gol__square--checked': checkedState}" (click)="changeSquareChecked(!checkedState,gameStatus === GolStatus.PLAYING)"></div>`,
  styles: [`
    :host {
      display: inline-block;
      border: 1px solid black;
      width: calc(100vh / 100);
      height: calc(100vh / 100);
    }

    .gol__square {
      width: 100%;
      height: 100%;
      cursor: pointer;
    }

    .gol__square--checked {
      background-color: green;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SquareComponent {
  protected checkedState: boolean = false
  protected gameStatus: GolStatus = GolStatus.PREPARING
  @Input() set status(value: GolStatus) {
    if(value === GolStatus.PREPARING && this.gameStatus === GolStatus.PLAYING) {
      this.changeSquareChecked(false);
    }
    this.gameStatus = value;
  };

  @Input() set checked(value: boolean | undefined) {
    if(value === undefined) return;
    this.changeSquareChecked(value ?? false);

  }
  @Input() set coordinates(value: [number, number]) {
    const [y, x] = value;
    this.x = x;
    this.y = y;
  }
  @Output() squareStateEmitter: EventEmitter<ISquareState> = new EventEmitter<ISquareState>();
  protected x!: number;
  protected y!: number;
  protected changeSquareChecked(value: boolean, isChangeBlocked: boolean = false ): void {
    if(isChangeBlocked) return;
    this.checkedState = value
    this.squareStateEmitter.emit({y:this.y, x:this.x,checked: value})
  }

  protected readonly GolStatus = GolStatus;
}
