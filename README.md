# E-Commerce-Back-End
An application demonstrating the use of MySQL in creating a backend database for an e-commerce website.

## Video Walk-Through
[Video Link](https://drive.google.com/file/d/1JfGEJBf8MbRqLoM_Lj6ALBlx5rqlRqpU/view?usp=sharing)
<br/><br/>
## Challenge Description | User Story
### **AS A manager** at an internet retail company
I WANT a back end for my e-commerce website that uses the latest technologies,  
SO THAT my company can compete with other e-commerce companies.  

### **Acceptance Criteria**

GIVEN a functional Express.js API  
WHEN I add my database name, MySQL username, and MySQL password to an environment variable file,  
THEN I am able to connect to a database using Sequelize.  
WHEN I enter schema and seed commands,  
THEN a development database is created and is seeded with test data.  
WHEN I enter the command to invoke the application,  
THEN my server is started and the Sequelize models are synced to the MySQL database.  
WHEN I open API GET routes in Insomnia Core for categories, products, or tags,  
THEN the data for each of these routes is displayed in a formatted JSON.  
WHEN I test API POST, PUT, and DELETE routes in Insomnia Core,  
THEN I am able to successfully create, update, and delete data in my database.  
<br/>

## Installation

All required packages are downloaded by running 'npm i' in the application's root directory. *To make our Api calls for GET, PUT, POST, and DELETE requests, we used Insomnia.*

After installing the dependencies, start MySQL in your CLI and run the schema.sql file:
    `mysql -u -root -p`
    Enter your password...
    `SOURCE db/schema.sql;`
    Quit mysql
    `quit`

Then configure your config/connection.js file so that Sequelize can connect to your mySql database. Create a .env file in the application's root directory with the following:
    `DB_NAME='ecommerce_db'`
    `DB_PW='your mysql password'`
    `DB_USER='your mysql username'`

Seed your database with the command:
    `npm run seed`

To run the application, enter the command:
    `npm start`
You will now be able to view and edit your database via API calls in Insomnia.
<br><br>

## Usage Instructions

You can perform the following HTTP requests in Insomnia to use the application:
    Categories:
    - All categories (GET): http://localhost:3001/api/categories
    - Category by id (GET): http://localhost:3001/api/categories/id
    - Update category by id (PUT): http://localhost:3001/api/categories/id
    - Create new category (POST): http://localhost:3001/api/categories
    - Delete category by id (DELETE): http://localhost:3001/api/categories/id
    - Use the following JSON format when updating or creating a category:
        - `{"category_name": "Equipment"}`

    Products:
    - All products (GET): http://localhost:3001/api/products
    - Product by id (GET): http://localhost:3001/api/products/id
    - Update product by id (PUT): http://localhost:3001/api/products/id
    - Create new product (POST): http://localhost:3001/api/products
    - Delete product by id (DELETE): http://localhost:3001/api/products/id
    - Use the following JSON format when updating or creating a product:
        - `{
	        "product_name": "ProductName",
	        "price": 33.00,
	        "stock": 13,
	        "category_id": 1,
	        "tag_id": [3]
            }`

    Tags:
    - All tags (GET): http://localhost:3001/api/tags
    - Tag by id (GET): http://localhost:3001/api/tags/id
    - Update tag by id (PUT): http://localhost:3001/api/tags/id
    - Create new tag (POST): http://localhost:3001/api/tags
    - Delete tag by id (DELETE): http://localhost:3001/api/tags/id
    - Use the following JSON format when updating or creating a tag:
        - `{
            "tag_name": "Butterfly",
            "productIds": [4]
            }`
