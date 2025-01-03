import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Slider } from '../models/slider';


@Injectable({
  providedIn: 'root'
})
export class SliderService {
  private apiUrl = environment.apiKey;
  http = inject(HttpClient)

  getSliderData(): Observable<Slider[]> {
    return this.http.get<Slider[]>(`${this.apiUrl}sliders`); 
  }
}
