import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  resource,
  signal,
} from '@angular/core';
import { environment } from '@env/environment';

@Component({
  selector: 'app-locations',
  imports: [],
  templateUrl: './locations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LocationsComponent {
  $origin = signal('');

  constructor() {
    afterNextRender(() => {
      navigator.geolocation.getCurrentPosition(position => {
        console.log(position);
        const origin = `${position.coords.latitude},${position.coords.longitude}`;
        this.$origin.set(origin);
      });
    });
  }

  locationRs = resource({
    loader: async () => {
      const url = new URL(`${environment.apiUrl}/api/v1/locations`);
      const origin = this.$origin();

      if (origin) {
        url.searchParams.set('origin', origin);
      }

      const response = await fetch(url.toString());
      return response.json();
    },
  });
}
