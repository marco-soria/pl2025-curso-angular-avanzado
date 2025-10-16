import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment';
import { Category } from '@shared/models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);

  getAll() {
    return this.http.get<Category[]>(`${environment.apiUrl}/api/v1/categories`);
  }

  async getAllPromise(): Promise<Category[]> {
    try {
      const response = await fetch(`${environment.apiUrl}/api/v1/categories`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Valid category names that should be allowed
      const validCategories = [
        'clothes',
        'electronics',
        'furniture',
        'shoes',
        'miscellaneous',
        'miscellaneou', // API has this typo
        'others',
      ];

      // Ensure we're returning an array of categories
      if (Array.isArray(data)) {
        return data.filter((item: any) => {
          // Basic validation
          if (!item || !item.id || !item.name || !item.slug) {
            return false;
          }

          // Filter out categories with invalid names (likely corrupted data)
          const nameLower = item.name.toLowerCase();
          const slugLower = item.slug.toLowerCase();

          // Check if it's a valid category or matches valid patterns
          const isValidCategory = validCategories.some(
            valid => slugLower === valid || nameLower === valid
          );

          // Exclude entries that look like product names
          const hasLongNumbers = /\d{4,}/.test(item.name); // Contains 4+ consecutive digits
          const isTooLong = item.name.length > 30;

          return isValidCategory && !hasLongNumbers && !isTooLong;
        });
      }
      return [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Re-throw the error so the resource can catch it
      throw new Error(
        'Failed to load categories. Please check your connection.'
      );
    }
  }
}
