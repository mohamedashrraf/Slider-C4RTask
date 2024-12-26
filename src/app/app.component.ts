import { Component } from '@angular/core';
import { SliderComponent } from "./core/components/slider/slider.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SliderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'slider';
}
