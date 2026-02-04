export class UiService {
    constructor() {
        this.tableHead = document.querySelector('#data-table thead tr');
        this.tableBody = document.querySelector('#data-table tbody');
        this.paginationInfo = document.getElementById('pagination-info');
        this.paginationControls = document.getElementById('pagination-controls');
        this.modal = document.getElementById('entry-modal');
        this.form = document.getElementById('data-form');
    }

    renderTabs(activeTab, onSwitch) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.entity === activeTab);
            btn.onclick = () => onSwitch(btn.dataset.entity);
        });
    }

    renderHeader(fields, onSort) {
        this.tableHead.innerHTML = '';
        fields.forEach(field => {
            if (field === 'id') return;
            const th = document.createElement('th');
            th.innerHTML = `${field.charAt(0).toUpperCase() + field.slice(1)} <span class="sort-icon">⇅</span>`;
            th.style.cursor = 'pointer';
            th.onclick = () => onSort(field);
            this.tableHead.appendChild(th);
        });
        this.tableHead.innerHTML += `<th>Edit</th><th>Delete</th>`;
    }

    renderData(data, fields, onEdit, onDelete) {
        this.tableBody.innerHTML = '';
        if (data.length === 0) {
            this.tableBody.innerHTML = '<tr><td colspan="100%">No records found</td></tr>';
            return;
        }

        data.forEach(item => {
            const tr = document.createElement('tr');
            
            fields.forEach(field => {
                if (field === 'id') return;
                const td = document.createElement('td');
                td.textContent = item[field];
                tr.appendChild(td);
            });

            const editTd = document.createElement('td');
            const editBtn = document.createElement('button');
            editBtn.className = 'btn-action btn-edit';
            editBtn.textContent = 'Edit';
            editBtn.onclick = () => onEdit(item);
            editTd.appendChild(editBtn);

            const deleteTd = document.createElement('td');
            const delBtn = document.createElement('button');
            delBtn.className = 'btn-action btn-delete';
            delBtn.textContent = 'Delete';
            delBtn.onclick = () => onDelete(item.id);
            deleteTd.appendChild(delBtn);

            tr.appendChild(editTd);
            tr.appendChild(deleteTd);
            this.tableBody.appendChild(tr);
        });
    }

    renderPagination(total, page, limit, onPageChange) {
        const start = (page - 1) * limit + 1;
        const end = Math.min(start + limit - 1, total);
        this.paginationInfo.textContent = `Showing ${total === 0 ? 0 : start} to ${end} of ${total} entries`;

        const totalPages = Math.ceil(total / limit);
        let html = `<button ${page === 1 ? 'disabled' : ''} data-page="${page - 1}">Previous</button>`;
        
        for (let i = 1; i <= totalPages; i++) {
            html += `<button class="${i === page ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }

        html += `<button ${page === totalPages || total === 0 ? 'disabled' : ''} data-page="${page + 1}">Next</button>`;
        
        this.paginationControls.innerHTML = html;
        this.paginationControls.querySelectorAll('button').forEach(btn => {
            btn.onclick = () => {
                if(!btn.disabled) onPageChange(parseInt(btn.dataset.page));
            };
        });
    }

    showModal(fields, data = null, onSave) {
        this.form.innerHTML = '';
        fields.forEach(field => {
            if (field === 'id') return;
            const group = document.createElement('div');
            group.className = 'form-group';
            group.innerHTML = `
                <label>${field.toUpperCase()}</label>
                <input type="${field.includes('email') ? 'email' : 'text'}" 
                       name="${field}" 
                       value="${data ? data[field] : ''}" required>
            `;
            this.form.appendChild(group);
        });

        const saveBtn = document.createElement('button');
        saveBtn.type = 'submit';
        saveBtn.className = 'btn-primary';
        saveBtn.textContent = 'Save';
        this.form.appendChild(saveBtn);

        this.form.onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(this.form);
            const result = Object.fromEntries(formData.entries());
            onSave(result);
            this.closeModal();
        };

        this.modal.style.display = 'flex';
    }

    closeModal() {
        this.modal.style.display = 'none';
    }
}