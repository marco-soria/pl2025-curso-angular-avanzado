import {
  byTestId,
  createRoutingFactory,
  Spectator,
} from '@ngneat/spectator/jest';

import { generateFakeProduct } from '@shared/models/product.mock';
import { ProductComponent } from './product.component';

describe('ProductComponent', () => {
  let spectator: Spectator<ProductComponent>;

  const createComponent = createRoutingFactory({
    component: ProductComponent,
  });

  const mockProduct = generateFakeProduct();

  beforeEach(() => {
    spectator = createComponent({
      detectChanges: false,
    });
    spectator.setInput('product', mockProduct);
  });

  it('should create', () => {
    spectator.detectChanges();
    expect(spectator.component).toBeTruthy();
  });

  it('should display product title', () => {
    spectator.detectChanges();

    const element = spectator.query(byTestId('product-title'));
    expect(element).toHaveText(mockProduct.title);
  });

  //AAA

  it('should emit a product when the button is clicked', () => {
    //Arrange
    const emitSpy = jest.spyOn(spectator.component.addToCart, 'emit');

    //Act
    spectator.detectChanges();
    spectator.click(byTestId('add-to-cart-button'));

    //Assert
    expect(emitSpy).toHaveBeenCalledWith(mockProduct);
  });
});
