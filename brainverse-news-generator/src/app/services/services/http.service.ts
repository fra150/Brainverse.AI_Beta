import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root', // Available throughout the app
})
export class HttpService {
  private baseUrl = 'http://127.0.0.1:8000'; // Replace with your API base URL


  private mockData = {
    articles: [
      {
        contentType: 'text',
        socialMediaType: 'linkedIn',
        contentMetadata: {
          title: "AI's Role in Shaping Future Workplaces",
          description: 'A comprehensive look at how artificial intelligence is redefining productivity and collaboration in professional settings.',
          format: 'text',
          url: 'https://via.placeholder.com/300x200.png?text=AI+Workplaces',
          summary:
            'Discover how AI is revolutionizing modern workplaces by enhancing productivity, streamlining communication, and fostering innovation.',
        },
      },
      {
        contentType: 'image',
        socialMediaType: 'instagram',
        contentMetadata: {
          title: 'Sustainability in Tech',
          description: 'An image highlighting eco-friendly innovations in the tech industry.',
          format: 'image',
          url: 'https://via.placeholder.com/300x200.png?text=Sustainable+Tech',
          summary: 'Explore how technology is paving the way for a greener and more sustainable future.',
        },
      },
      {
        contentType: 'video',
        socialMediaType: 'youtube',
        contentMetadata: {
          title: 'The Power of Cloud Computing',
          description: 'A video exploring the benefits of cloud technology for businesses.',
          format: 'video',
          url: 'https://via.placeholder.com/400x300.mp4?text=Cloud+Computing',
          summary: 'Learn how cloud computing is driving efficiency, scalability, and innovation across industries.',
        },
      },
      {
        contentType: 'meme',
        socialMediaType: 'instagram',
        contentMetadata: {
          title: 'Tech Humor: AI Edition',
          description: 'A lighthearted meme about the rise of artificial intelligence.',
          format: 'text',
          url: 'https://via.placeholder.com/300x200.png?text=AI+Meme',
          summary: "When AI understands your coffee order better than your barista—embrace the future!",
        },
      },
      {
        contentType: 'text',
        socialMediaType: 'twitter',
        contentMetadata: {
          title: 'Cloud Insights in 280 Characters',
          description: 'A tweet summarizing the potential of cloud solutions.',
          format: 'text',
          url: 'https://via.placeholder.com/300x200.png?text=Cloud+Tweet',
          summary: 'Cloud computing: the unsung hero of seamless operations and digital transformation. #TechInsights #Cloud',
        },
      },
    ],
  };


  constructor(private http: HttpClient) {}

  /**
   * POST data to the server
   * @param endpoint API endpoint
   * @param body Data to send
   * @param options Optional headers or params
   */
  postData(endpoint: string, body: any, options?: any): Observable<any> {
    const url = `${this.baseUrl}/${endpoint}`;
    return this.http.post(url, body, options);
    // return of(this.mockData);
  }

  /**
   * GET data from the server
   * @param endpoint API endpoint
   * @param params Query parameters (optional)
   * @param options Optional headers or params
   */
  getData(endpoint: string, params?: HttpParams, options?: any): Observable<any> {
    const url = `${this.baseUrl}/${endpoint}`;
    return this.http.get(url, { params, ...options });
  }

  /**
   * PUT data to the server
   * @param endpoint API endpoint
   * @param body Data to update
   * @param options Optional headers or params
   */
  putData(endpoint: string, body: any, options?: any): Observable<any> {
    const url = `${this.baseUrl}/${endpoint}`;
    return this.http.put(url, body, options);
  }

  /**
   * DELETE data from the server
   * @param endpoint API endpoint
   * @param options Optional headers or params
   */
  deleteData(endpoint: string, options?: any): Observable<any> {
    const url = `${this.baseUrl}/${endpoint}`;
    return this.http.delete(url, options);
  }
}
