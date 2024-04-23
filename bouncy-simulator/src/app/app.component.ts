import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {GridComponent} from "./components/grid/grid.component";
import {PanelComponent} from "./components/panel/panel.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, GridComponent, PanelComponent],
  template: `
      <div class="bs">
      <bs-grid/>
      <bs-panel/>
    </div>
  `,
  styles: [`
    .bs {
      display: grid;
      grid-template-columns: calc(12*(100vh / 25)) 1fr;
      height: 100vh;
      width: 100%;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AppComponent {
}
