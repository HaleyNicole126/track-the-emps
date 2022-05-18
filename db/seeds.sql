INSERT INTO department (name)
VALUES
    ('Management'),
    ('HR'),
    ('PR'),
    ('Sales'),
    ('Marketing');

INSERT INTO role (title, salary, department_id)
VALUES  
    ('General Manager', 100000, 1),
    ('Assistant Manager', 75000, 1),
    ('Hiring Manager', 75000, 2),
    ('PR coordinator', 60000, 3),
    ('Saleperson', 50000, 4),
    ('Social Media Director', 50000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Loreen', 'Democritus', 1, NULL),
    ('Margit', 'Pia', 2, 1),
    ('Amlaib', 'Aamir', 2, 1),
    ('Pavla', 'Oline', 3, 1),
    ('Rustam', 'Rina', 4, 1),
    ('Olaug', 'Radha', 5, 2),
    ('Catrine', 'Gotzone', 5, 2),
    ('Fusun', 'Sunil', 6, 2);