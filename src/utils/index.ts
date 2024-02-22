export default class Utils {
    constructor(){}

    public async handleRequest<T>(url: string, method: string, token: string, body?: object): Promise<T> {

        const headers = new Headers()
        headers.append('Authorization', `Bearer ${token}`)
        headers.append('Content-Type', 'application/json')
        headers.append('Access-Control-Allow-Origin', 'http://localhost:5173');
        headers.append('Access-Control-Allow-Credentials', 'true');

        const requestOptions: RequestInit = {
          method,
          headers: headers
        };
    
        if (body) {
          requestOptions.body = JSON.stringify(body);
        }
    
        const response = await fetch(url, requestOptions);
    
        if (!response.ok) {
          const errorBody = await response.json();
          throw errorBody;
        }
    
        return response.json();
      }
}