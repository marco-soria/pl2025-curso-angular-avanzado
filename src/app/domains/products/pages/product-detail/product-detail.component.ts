import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { environment } from '@env/environment';
import { RelatedComponent } from '@products/components/related/related.component';
import { Product } from '@shared/models/product.model';
import { CartService } from '@shared/services/cart.service';
import { MetaTagsService } from '@shared/services/meta-tags.service';
import { ProductService } from '@shared/services/product.service';
import { switchMap, tap } from 'rxjs';
@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, NgOptimizedImage, RelatedComponent],
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductDetailComponent {
  readonly slug = input.required<string>();
  $product = signal<Product | null>(null);

  $cover = linkedSignal({
    source: this.$product,
    computation: (product, previousValue) => {
      if (product && product.images.length > 0) {
        return product.images[0];
      }
      return previousValue?.value;
    },
  });
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private metaTagsService = inject(MetaTagsService);

  constructor() {
    // Subscribe to slug changes and fetch product
    toObservable(this.slug)
      .pipe(
        switchMap(slug => this.productService.getOneBySlug(slug)),
        tap(product => {
          this.$product.set(product);
          if (product) {
            this.metaTagsService.updateMetaTags({
              title: product.title,
              description: product.description,
              image: product.images[0],
              url: `${environment.domain}/product/${product.slug}`,
            });
          }
        })
      )
      .subscribe();
  }

  changeCover(newImg: string) {
    this.$cover.set(newImg);
  }

  addToCart() {
    const product = this.$product();
    if (product) {
      this.cartService.addToCart(product);
    }
  }
}
