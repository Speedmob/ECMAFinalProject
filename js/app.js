import { ApiService } from './api.js';
import { UiService } from './ui.js';
import { Student, Course, Instructor, Employee } from './models.js';

class App {
    constructor() {
        this.api = new ApiService();
        this.ui = new UiService();
        
        this.currentEntity = 'students';
        this.page = 1;
        this.limit = 5;
        this.search = '';
        this.sort = '';
        this.order = 'asc';
        
        this.configs = {
            students: { class: Student, fields: ['name', 'email', 'enrollmentDate'] },
            courses: { class: Course, fields: ['title', 'code', 'credits'] },
            instructors: { class: Instructor, fields: ['name', 'department'] },
            employees: { class: Employee, fields: ['name', 'position', 'salary'] }
        };

        this.init();
    }

    init() {
        document.getElementById('limit-select').onchange = (e) => {
            this.limit = parseInt(e.target.value);
            this.page = 1;
            this.loadData();
        };

        document.getElementById('search-input').oninput = (e) => {
            this.search = e.target.value;
            this.page = 1;
            this.loadData();
        };

        document.getElementById('add-btn').onclick = () => this.openAddModal();
        document.getElementById('close-modal').onclick = () => this.ui.closeModal();

        this.switchTab('students');
    }

    switchTab(entity) {
        this.currentEntity = entity;
        this.page = 1;
        this.search = '';
        this.sort = '';
        document.getElementById('search-input').value = '';
        this.ui.renderTabs(entity, (e) => this.switchTab(e));
        this.loadData();
    }

    async loadData() {
        const { data, total } = await this.api.getAll(
            this.currentEntity, 
            this.page, 
            this.limit, 
            this.search, 
            this.sort, 
            this.order
        );
        
        const fields = ['id', ...this.configs[this.currentEntity].fields];
        
        this.ui.renderHeader(fields, (col) => this.handleSort(col));
        this.ui.renderData(data, fields, (item) => this.openEditModal(item), (id) => this.handleDelete(id));
        this.ui.renderPagination(total, this.page, this.limit, (newPage) => {
            this.page = newPage;
            this.loadData();
        });
    }

    handleSort(column) {
        if (this.sort === column) {
            this.order = this.order === 'asc' ? 'desc' : 'asc';
        } else {
            this.sort = column;
            this.order = 'asc';
        }
        this.loadData();
    }

    openAddModal() {
        const config = this.configs[this.currentEntity];
        this.ui.showModal(config.fields, null, async (formData) => {
            const newObj = new config.class(...Object.values(formData));
            await this.api.create(this.currentEntity, formData);
            this.loadData();
        });
    }

    openEditModal(item) {
        const config = this.configs[this.currentEntity];
        this.ui.showModal(config.fields, item, async (formData) => {
            await this.api.update(this.currentEntity, item.id, formData);
            this.loadData();
        });
    }

    async handleDelete(id) {
        if (confirm('Are you sure you want to delete this record?')) {
            await this.api.delete(this.currentEntity, id);
            this.loadData();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => new App());