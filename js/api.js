export class ApiService {
    constructor(baseUrl = 'http://localhost:3000') {
        this.baseUrl = baseUrl;
    }

    async request(endpoint, method = 'GET', data = null) {
        const config = {
            method,
            headers: { 'Content-Type': 'application/json' }
        };
        if (data) config.body = JSON.stringify(data);

        try {
            const response = await fetch(`${this.baseUrl}/${endpoint}`, config);
            if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
            
            const totalCount = response.headers.get('X-Total-Count');
            const jsonData = await response.json();
            
            return { data: jsonData, total: totalCount ? parseInt(totalCount) : jsonData.length };
        } catch (error) {
            console.error(error); //
            alert("Operation failed. Is json-server running?");
            throw error;
        }
    }

    getAll(entity, page = 1, limit = 10, search = '', sort = '', order = 'asc') {
        let query = `?_page=${page}&_limit=${limit}`; 
        if (search) query += `&q=${search}`; 
        if (sort) query += `&_sort=${sort}&_order=${order}`; 
        
        return this.request(`${entity}${query}`);
    }

    create(entity, data) {
        return this.request(entity, 'POST', data); 
    }

    update(entity, id, data) {
        return this.request(`${entity}/${id}`, 'PUT', data); 
    }

    delete(entity, id) {
        return this.request(`${entity}/${id}`, 'DELETE'); 
    }
}