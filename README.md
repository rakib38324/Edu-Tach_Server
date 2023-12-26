# Welcome to Course Management-- Assignment

Welcome to a robust and meticulously crafted TypeScript-Express-Mongoose Course Project! This comprehensive backend system is designed to manage an online course platform, leveraging the power of TypeScript for strong typing, Express.js for seamless routing, and Mongoose as the Object Data Modeling (ODM) library for MongoDB.
# Technology Stack:
1. Programming Language: TypeScript
2. Web Framework: Express.js
3. Object Data Modeling (ODM) and Validation Library: Mongoose for MongoDB and Zod Validation.

# Model
1. Category 
2. Course
3. Review
## Video Instruction
==> https://drive.google.com/file/d/13R6onPSG9DCzGzHBV2IzFenZ_is4cYHU/view
## It is Live link_Vercel: https://edutechwithauth.vercel.app

# 1. For Local host: 
1. At first clone the code.
2. Go to the terminal and: npm i
3. Add a .env file and give the information:
    1. NODE_ENV= development 
    2. PORT=5000
    3. DATBASE_URL=mongodb+srv://databaseName:password@************************
    4. BCRYPT_SALT_ROUND=12
4. npm run start:dev
   
## Please follow the API instructions for the local host
## link: http://localhost:5000/
1. Endpoint: POST /api/course : __Create a Course
2. Endpoint: GET /api/courses : __Get all Courses and also you have access to filter the data
3. Endpoint: POST /api/categories : __You Create Category
4. Endpoint: GET /api/categories :__Get all Categories
5. Endpoint: POST /api/reviews:__Create a Review
6. Endpoint: PUT /api/courses/:courseId: __Update Data Dynamically
7. Endpoint: GET /api/courses/:courseId/reviews:__Finf the Course with Review
8. Endpoint: GET /api/course/best:__Find the best Course from the best rating

# 2. Please follow the API instructions for the live link
## It is Live link_Vercel: https://edutech-gamma.vercel.app/


# 1. Create Category
## Endpoint:
```
/api/categories
```
## Method: 
```
POST
```
## body
```
{
    "name": "Programming"
}
```
# 2. Get All Category
## Endpoint:
```
/api/categories
```
## Method: 
```
GET
```

# 3. Create a Course
## Endpoint:
```
/api/course
```
## Method: 
```
POST
```
## Request Body:
```
{
    "title": "Sample Course",
    "instructor": "Jane Doe",
    "categoryId": "123456789012345678901234",
    "price": 49.99,
    "tags": [
        {
            "name": "Programming",
            "isDeleted": false
        },
        {
            "name": "Web Development",
            "isDeleted": false
        }
    ],
    "startDate": "2023-01-15",
    "endDate":"2023-03-14",
    "language": "English",
    "provider": "Tech Academy",
    "details": {
        "level": "Intermediate",
        "description": "Detailed description of the course"
    }
}
```
# 4. Find All Courses
## Endpoint:
```
/api/course
```
## Method: 
```
GET
```
## Get all Courses and also you have access to filter the data
```
1. page: (Optional) Specifies the page number for paginated results. Default is 1. Example: ?page=2

2. limit: (Optional) Sets the number of items per page. Default is a predefined limit. Example: ?limit=10

3. sortBy: (Optional) Specifies the field by which the results should be sorted. Only applicable to the following fields: title, price, startDate, endDate, language, durationInWeeks. Example: ?sortBy=startDate

4. sortOrder: (Optional) Determines the sorting order, either 'asc' (ascending) or 'desc' (descending). Example: ?sortOrder=desc

5. minPrice, maxPrice: (Optional) Filters results by a price range. Example: ?minPrice=20.00&maxPrice=50.00

6. tags: (Optional) Filters results by the name of a specific tag. Example: ?tags=Programming

7. startDate, endDate: (Optional) Filters results by a date range. Example: ?startDate=2023-01-01&endDate=2023-12-31

8. language: (Optional) Filters results by the language of the course. Example: ?language=English

9. provider: (Optional) Filters results by the course provider. Example: ?provider=Tech Academy

10. durationInWeeks: (Optional) Filters results by the duration of the course in weeks. Example: ?durationInWeeks=8

11. level: (Optional) Filters results by the difficulty level of the course. Example: ?level=Intermediate
```

# 5. Create Review
## Endpoint:
```
/api/reviews
```
## Method: 
```
POST
```
## body
```
{
    "courseId": "123456789012345678901234",
    "rating": 4,
    "review": "Great course!"
}
```

# 6. Update Review
## Endpoint:
```
/api/courses/:courseId
```
## Method: 
```
PUT
```
## body
```
{
    "title": "Updated Title",
    "instructor": "New Instructor",
    "categoryId": "123456789012345678901234",
    "price": 59.99,
    "tags": [
        {
            "name": "Programming",
            "isDeleted": true
        },
        {
            "name": "Web Development",
            "isDeleted": false
        }
    ],
    "startDate": "2023-02-01",
    "endDate":"2023-03-14",
    "language": "Spanish",
    "provider": "Code Masters",
    "durationInWeeks": 6,
    "details": {
        "level": "Intermediate",
        "description": "Detailed description of the course"
    }
}
```

# 7. Get Course by ID with Reviews**
## Endpoint:
```
/api/courses/:courseId/reviews
```
## Method: 
```
GET
```

# 8. Get the Best Course Based on Average Review (Rating)
## Endpoint:
```
/api/course/best
```
## Method: 
```
GET
```

## Models:
## 1. Course Model:
# Fields:
1. _id (Object ID): A distinctive identifier generated by MongoDB.
2. title (String): A unique title of the course.
3. instructor (String): The instructor of the course.
4. categoryId (Object ID): A reference to the category collection.
5.price (Number): The price of the course.
6. tags(Array of Object): The "tags" field is an array of objects, each having a "name" (string) and "isDeleted" (boolean) property.
7. startDate (String): The start date of the course.
8. endDate (String): The end date of the course.
9. language (String): The language in which the course is conducted.
10. provider (String): The provider of the course.
11. durationInWeeks (Integer): This represents the course's overall duration in weeks, calculated by applying the ceil function to the numeric value derived from the start and end dates. The resulting number is rounded up to the nearest integer, ensuring that the duration is expressed solely as an integer with no allowance for floating-point numbers.
details (Object):
12. level (string): e.g., Beginner, Intermediate, Advanced.
13. description (string): Detailed description of the course
## 2. Category Model:
# Fields:
1. _id (Object ID): A distinctive identifier generated by MongoDB.
2. name (String): A unique name of the category.
## 3. Review Model:
# Fields:
1. _id (Object ID): A distinctive identifier generated by MongoDB.
2. courseId (Object ID): A reference to the course collection.
3. rating (Number): Rating, which falls within the range of 1 to 5.
4. review (String): The comment or review text provided by the user.


## Thank you so much
