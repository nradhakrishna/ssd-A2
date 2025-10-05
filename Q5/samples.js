// Sample database schemas for demonstration

const sampleSchemas = {
    ecommerce: {
        database: "E-commerce Platform",
        tables: [
            {
                name: "users",
                description: "Customer and admin accounts",
                columns: [
                    {
                        name: "id",
                        type: "INT",
                        nullable: false,
                        primaryKey: true,
                        description: "Unique user identifier"
                    },
                    {
                        name: "email",
                        type: "VARCHAR(255)",
                        nullable: false,
                        description: "User email address (unique)"
                    },
                    {
                        name: "password",
                        type: "VARCHAR(255)",
                        nullable: false,
                        description: "Hashed password"
                    },
                    {
                        name: "first_name",
                        type: "VARCHAR(100)",
                        nullable: false,
                        description: "User first name"
                    },
                    {
                        name: "last_name",
                        type: "VARCHAR(100)",
                        nullable: false,
                        description: "User last name"
                    },
                    {
                        name: "created_at",
                        type: "TIMESTAMP",
                        nullable: false,
                        description: "Account creation timestamp"
                    }
                ]
            },
            {
                name: "products",
                description: "Product catalog",
                columns: [
                    {
                        name: "id",
                        type: "INT",
                        nullable: false,
                        primaryKey: true,
                        description: "Unique product identifier"
                    },
                    {
                        name: "name",
                        type: "VARCHAR(255)",
                        nullable: false,
                        description: "Product name"
                    },
                    {
                        name: "description",
                        type: "TEXT",
                        nullable: true,
                        description: "Product description"
                    },
                    {
                        name: "price",
                        type: "DECIMAL(10,2)",
                        nullable: false,
                        description: "Product price"
                    },
                    {
                        name: "stock_quantity",
                        type: "INT",
                        nullable: false,
                        description: "Available stock quantity"
                    },
                    {
                        name: "category_id",
                        type: "INT",
                        nullable: true,
                        foreignKey: true,
                        description: "Reference to category"
                    }
                ]
            },
            {
                name: "categories",
                description: "Product categories",
                columns: [
                    {
                        name: "id",
                        type: "INT",
                        nullable: false,
                        primaryKey: true,
                        description: "Unique category identifier"
                    },
                    {
                        name: "name",
                        type: "VARCHAR(100)",
                        nullable: false,
                        description: "Category name"
                    },
                    {
                        name: "parent_id",
                        type: "INT",
                        nullable: true,
                        foreignKey: true,
                        description: "Parent category (for subcategories)"
                    }
                ]
            },
            {
                name: "orders",
                description: "Customer orders",
                columns: [
                    {
                        name: "id",
                        type: "INT",
                        nullable: false,
                        primaryKey: true,
                        description: "Unique order identifier"
                    },
                    {
                        name: "user_id",
                        type: "INT",
                        nullable: false,
                        foreignKey: true,
                        description: "Customer who placed the order"
                    },
                    {
                        name: "order_date",
                        type: "TIMESTAMP",
                        nullable: false,
                        description: "Order creation timestamp"
                    },
                    {
                        name: "status",
                        type: "VARCHAR(50)",
                        nullable: false,
                        description: "Order status (pending, shipped, delivered)"
                    },
                    {
                        name: "total_amount",
                        type: "DECIMAL(10,2)",
                        nullable: false,
                        description: "Total order amount"
                    }
                ]
            },
            {
                name: "order_items",
                description: "Items in each order",
                columns: [
                    {
                        name: "id",
                        type: "INT",
                        nullable: false,
                        primaryKey: true,
                        description: "Unique order item identifier"
                    },
                    {
                        name: "order_id",
                        type: "INT",
                        nullable: false,
                        foreignKey: true,
                        description: "Reference to order"
                    },
                    {
                        name: "product_id",
                        type: "INT",
                        nullable: false,
                        foreignKey: true,
                        description: "Reference to product"
                    },
                    {
                        name: "quantity",
                        type: "INT",
                        nullable: false,
                        description: "Quantity ordered"
                    },
                    {
                        name: "price",
                        type: "DECIMAL(10,2)",
                        nullable: false,
                        description: "Price at time of order"
                    }
                ]
            }
        ],
        relationships: [
            {
                from: "orders",
                to: "users",
                fromColumn: "user_id",
                toColumn: "id",
                type: "many-to-one"
            },
            {
                from: "order_items",
                to: "orders",
                fromColumn: "order_id",
                toColumn: "id",
                type: "many-to-one"
            },
            {
                from: "order_items",
                to: "products",
                fromColumn: "product_id",
                toColumn: "id",
                type: "many-to-one"
            },
            {
                from: "products",
                to: "categories",
                fromColumn: "category_id",
                toColumn: "id",
                type: "many-to-one"
            },
            {
                from: "categories",
                to: "categories",
                fromColumn: "parent_id",
                toColumn: "id",
                type: "many-to-one"
            }
        ]
    },

    blog: {
        database: "Blog Platform",
        tables: [
            {
                name: "authors",
                description: "Blog authors",
                columns: [
                    {
                        name: "id",
                        type: "INT",
                        nullable: false,
                        primaryKey: true,
                        description: "Unique author identifier"
                    },
                    {
                        name: "username",
                        type: "VARCHAR(100)",
                        nullable: false,
                        description: "Author username (unique)"
                    },
                    {
                        name: "email",
                        type: "VARCHAR(255)",
                        nullable: false,
                        description: "Author email"
                    },
                    {
                        name: "bio",
                        type: "TEXT",
                        nullable: true,
                        description: "Author biography"
                    }
                ]
            },
            {
                name: "posts",
                description: "Blog posts",
                columns: [
                    {
                        name: "id",
                        type: "INT",
                        nullable: false,
                        primaryKey: true,
                        description: "Unique post identifier"
                    },
                    {
                        name: "author_id",
                        type: "INT",
                        nullable: false,
                        foreignKey: true,
                        description: "Post author"
                    },
                    {
                        name: "title",
                        type: "VARCHAR(255)",
                        nullable: false,
                        description: "Post title"
                    },
                    {
                        name: "content",
                        type: "TEXT",
                        nullable: false,
                        description: "Post content"
                    },
                    {
                        name: "published_at",
                        type: "TIMESTAMP",
                        nullable: true,
                        description: "Publication timestamp"
                    },
                    {
                        name: "status",
                        type: "VARCHAR(20)",
                        nullable: false,
                        description: "Post status (draft, published)"
                    }
                ]
            },
            {
                name: "comments",
                description: "Comments on blog posts",
                columns: [
                    {
                        name: "id",
                        type: "INT",
                        nullable: false,
                        primaryKey: true,
                        description: "Unique comment identifier"
                    },
                    {
                        name: "post_id",
                        type: "INT",
                        nullable: false,
                        foreignKey: true,
                        description: "Post being commented on"
                    },
                    {
                        name: "author_name",
                        type: "VARCHAR(100)",
                        nullable: false,
                        description: "Comment author name"
                    },
                    {
                        name: "content",
                        type: "TEXT",
                        nullable: false,
                        description: "Comment content"
                    },
                    {
                        name: "created_at",
                        type: "TIMESTAMP",
                        nullable: false,
                        description: "Comment creation timestamp"
                    }
                ]
            },
            {
                name: "tags",
                description: "Post tags",
                columns: [
                    {
                        name: "id",
                        type: "INT",
                        nullable: false,
                        primaryKey: true,
                        description: "Unique tag identifier"
                    },
                    {
                        name: "name",
                        type: "VARCHAR(50)",
                        nullable: false,
                        description: "Tag name"
                    }
                ]
            },
            {
                name: "post_tags",
                description: "Many-to-many relationship between posts and tags",
                columns: [
                    {
                        name: "post_id",
                        type: "INT",
                        nullable: false,
                        foreignKey: true,
                        primaryKey: true,
                        description: "Reference to post"
                    },
                    {
                        name: "tag_id",
                        type: "INT",
                        nullable: false,
                        foreignKey: true,
                        primaryKey: true,
                        description: "Reference to tag"
                    }
                ]
            }
        ],
        relationships: [
            {
                from: "posts",
                to: "authors",
                fromColumn: "author_id",
                toColumn: "id",
                type: "many-to-one"
            },
            {
                from: "comments",
                to: "posts",
                fromColumn: "post_id",
                toColumn: "id",
                type: "many-to-one"
            },
            {
                from: "post_tags",
                to: "posts",
                fromColumn: "post_id",
                toColumn: "id",
                type: "many-to-one"
            },
            {
                from: "post_tags",
                to: "tags",
                fromColumn: "tag_id",
                toColumn: "id",
                type: "many-to-one"
            }
        ]
    },

    school: {
        database: "School Management System",
        tables: [
            {
                name: "students",
                description: "Student records",
                columns: [
                    {
                        name: "id",
                        type: "INT",
                        nullable: false,
                        primaryKey: true,
                        description: "Unique student identifier"
                    },
                    {
                        name: "first_name",
                        type: "VARCHAR(100)",
                        nullable: false,
                        description: "Student first name"
                    },
                    {
                        name: "last_name",
                        type: "VARCHAR(100)",
                        nullable: false,
                        description: "Student last name"
                    },
                    {
                        name: "date_of_birth",
                        type: "DATE",
                        nullable: false,
                        description: "Student date of birth"
                    },
                    {
                        name: "enrollment_date",
                        type: "DATE",
                        nullable: false,
                        description: "Enrollment date"
                    }
                ]
            },
            {
                name: "teachers",
                description: "Teacher records",
                columns: [
                    {
                        name: "id",
                        type: "INT",
                        nullable: false,
                        primaryKey: true,
                        description: "Unique teacher identifier"
                    },
                    {
                        name: "first_name",
                        type: "VARCHAR(100)",
                        nullable: false,
                        description: "Teacher first name"
                    },
                    {
                        name: "last_name",
                        type: "VARCHAR(100)",
                        nullable: false,
                        description: "Teacher last name"
                    },
                    {
                        name: "email",
                        type: "VARCHAR(255)",
                        nullable: false,
                        description: "Teacher email"
                    },
                    {
                        name: "specialization",
                        type: "VARCHAR(100)",
                        nullable: true,
                        description: "Teaching specialization"
                    }
                ]
            },
            {
                name: "courses",
                description: "Available courses",
                columns: [
                    {
                        name: "id",
                        type: "INT",
                        nullable: false,
                        primaryKey: true,
                        description: "Unique course identifier"
                    },
                    {
                        name: "course_code",
                        type: "VARCHAR(20)",
                        nullable: false,
                        description: "Course code (unique)"
                    },
                    {
                        name: "course_name",
                        type: "VARCHAR(255)",
                        nullable: false,
                        description: "Course name"
                    },
                    {
                        name: "credits",
                        type: "INT",
                        nullable: false,
                        description: "Course credit hours"
                    },
                    {
                        name: "teacher_id",
                        type: "INT",
                        nullable: true,
                        foreignKey: true,
                        description: "Assigned teacher"
                    }
                ]
            },
            {
                name: "enrollments",
                description: "Student course enrollments",
                columns: [
                    {
                        name: "id",
                        type: "INT",
                        nullable: false,
                        primaryKey: true,
                        description: "Unique enrollment identifier"
                    },
                    {
                        name: "student_id",
                        type: "INT",
                        nullable: false,
                        foreignKey: true,
                        description: "Enrolled student"
                    },
                    {
                        name: "course_id",
                        type: "INT",
                        nullable: false,
                        foreignKey: true,
                        description: "Enrolled course"
                    },
                    {
                        name: "enrollment_date",
                        type: "DATE",
                        nullable: false,
                        description: "Enrollment date"
                    },
                    {
                        name: "grade",
                        type: "VARCHAR(5)",
                        nullable: true,
                        description: "Final grade (A, B, C, D, F)"
                    }
                ]
            }
        ],
        relationships: [
            {
                from: "courses",
                to: "teachers",
                fromColumn: "teacher_id",
                toColumn: "id",
                type: "many-to-one"
            },
            {
                from: "enrollments",
                to: "students",
                fromColumn: "student_id",
                toColumn: "id",
                type: "many-to-one"
            },
            {
                from: "enrollments",
                to: "courses",
                fromColumn: "course_id",
                toColumn: "id",
                type: "many-to-one"
            }
        ]
    }
};



