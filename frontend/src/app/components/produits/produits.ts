import { Component, inject, signal, Signal } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-produits',
  imports: [],
  templateUrl: './produits.html',
  styleUrl: './produits.css',
})
export class Produits {
  private productService = inject(ProductService);
  products = signal<Product[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: () => {
        console.log(`Erreur`);
        this.loading.set(false);
      },
    });
  }
}
