import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product } from '../models/product';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);

  private products: Product[] = [
    { id: 1, name: 'iPhone 16', price: 999, category: 'Téléphone' },
    { id: 2, name: 'Samsung Galaxy S25', price: 899, category: 'Téléphone' },
    { id: 3, name: 'MacBook Air', price: 1299, category: 'Ordinateur' },
    { id: 4, name: 'Dell XPS', price: 1199, category: 'Ordinateur' },
    { id: 5, name: 'iPad Air', price: 699, category: 'Tablette' },
    { id: 6, name: 'Galaxy Tab', price: 599, category: 'Tablette' },
  ];

  getProducts(): Observable<Product[]> {
    return of(this.products);
  }

  searchProducts(search: string): Observable<Product[]> {
    const result = this.products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase()),
    );

    return of(result);
  }
}
