import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  resource,
  signal,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { RouterLinkWithHref } from '@angular/router';
import { ProductComponent } from '@products/components/product/product.component';
import { catchError, of, switchMap, tap } from 'rxjs';

import { Product } from '@shared/models/product.model';
import { CartService } from '@shared/services/cart.service';
import { CategoryService } from '@shared/services/category.service';
import { ProductService } from '@shared/services/product.service';

@Component({
  selector: 'app-list',
  imports: [CommonModule, ProductComponent, RouterLinkWithHref],
  templateUrl: './list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ListComponent {
  private cartService = inject(CartService);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  readonly slug = input<string>();

  $products = signal<Product[]>([]);
  $productsError = signal<string | null>(null);

  categoriesResource = resource({
    loader: () => this.categoryService.getAllPromise(),
  });

  constructor() {
    // Subscribe to slug changes and fetch products
    toObservable(this.slug)
      .pipe(
        switchMap(slug =>
          this.productService.getProducts({ category_slug: slug }).pipe(
            catchError(error => {
              this.$productsError.set(
                'Error loading products. Please check your connection and try again.'
              );
              console.error('Error fetching products:', error);
              return of([]);
            })
          )
        ),
        tap(products => {
          this.$products.set(products);
          this.$productsError.set(null);
        })
      )
      .subscribe();
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  resetCategories() {
    this.categoriesResource.set([]);
  }

  reloadCategories() {
    this.categoriesResource.reload();
  }

  reloadProducts() {
    const slug = this.slug();
    this.productService
      .getProducts({ category_slug: slug })
      .pipe(
        catchError(error => {
          this.$productsError.set(
            'Error loading products. Please check your connection and try again.'
          );
          console.error('Error fetching products:', error);
          return of([]);
        })
      )
      .subscribe(products => {
        this.$products.set(products);
        this.$productsError.set(null);
      });
  }
}
