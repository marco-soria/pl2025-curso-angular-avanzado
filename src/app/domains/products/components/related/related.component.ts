import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ProductComponent } from '@products/components/product/product.component';
import { ProductService } from '@shared/services/product.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-related',
  imports: [ProductComponent, AsyncPipe],
  templateUrl: './related.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RelatedComponent {
  productService = inject(ProductService);
  $slug = input.required<string>({ alias: 'slug' });

  relatedProducts$ = toObservable(this.$slug).pipe(
    switchMap(slug => this.productService.getRelatedProducts(slug))
  );
}
