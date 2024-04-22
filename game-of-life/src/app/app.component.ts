import {ChangeDetectionStrategy, Component} from '@angular/core';
import {GridComponent} from "./components/grid/grid.component";
import {PanelComponent} from "./components/panel/panel.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GridComponent, PanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="gol">
      <gol-grid/>
      <gol-panel/>
    </div>
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent {}
