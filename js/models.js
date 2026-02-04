export class Student {
    constructor(name, email, enrollmentDate, id = null) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.enrollmentDate = enrollmentDate;
    }
}

export class Course {
    constructor(title, code, credits, id = null) {
        this.id = id;
        this.title = title;
        this.code = code;
        this.credits = credits;
    }
}

export class Instructor {
    constructor(name, department, id = null) {
        this.id = id;
        this.name = name;
        this.department = department;
    }
}

export class Employee {
    constructor(name, position, salary, id = null) {
        this.id = id;
        this.name = name;
        this.position = position;
        this.salary = salary;
    }
}