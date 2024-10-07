import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private readonly apiUrl = 'http://localhost:5432'; // Replace with your API URL

  constructor(private http: HttpClient) {}

  // Example method to execute a database query
  executeQuery(query: string): Promise<any> {
    const url = `${this.apiUrl}/query`; // Replace with your backend API endpoint for executing queries
    return this.http.post<any>(url, { query }).toPromise();
  }
}
