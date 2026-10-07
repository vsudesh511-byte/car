# CarVerse Hub

Build a simple and modern static website called CarVerse – Car Showcase & Comparison.

This is a college final-year project, so keep everything simple, clean, beginner-friendly, and easy to demonstrate.

1. Technology

Use:

React

Vite

TypeScript or JavaScript

Tailwind CSS

Important:

No backend

No database

No external API

Use static/sample car data

Use LocalStorage to save admin changes

2. Website Sections

Create these pages:

User Side

Home

Cars

Car Details

Compare Cars

About

Contact

Admin Side

Admin Login

Admin Dashboard

Manage Cars

Add Car

Edit Car

3. Home Page

Create an attractive homepage with:

CarVerse logo

Navigation bar

Hero section

Heading: "Find Your Perfect Car"

Short description

"Explore Cars" button

"Compare Cars" button

Featured Cars section

Popular Brands section

Footer

Use good-quality car images.

4. Cars Page

Display around 10–12 sample cars in attractive cards.

Each card should show:

Car image

Car name

Brand

Price

Fuel type

Transmission

View Details button

Add to Compare button

Add:

Search bar

Brand filter

Price filter

Fuel type filter

Transmission filter

The search and filters should actually work.

5. Car Details Page

When the user selects a car, show:

Large car image

Car name

Brand

Price

Mileage

Fuel type

Transmission

Engine

Seating capacity

Horsepower

Main features

Add to Compare button

Keep the design simple and easy to understand.

6. Compare Cars

Allow the user to select 2 or 3 cars.

Create a comparison table showing:

SpecificationCar 1Car 2Car 3PriceMileageFuel TypeTransmissionEngineSeatingHorsepower

Add a Remove button for each selected car.

7. Admin Login

Create a separate Admin Login page.

Use simple demo credentials:

Username: admin
Password: admin123

Show these credentials on the login page because this is a college project.

After successful login, redirect to the Admin Dashboard.

Do not create a complicated authentication system.

8. Admin Dashboard

Create a simple dashboard showing:

Total Cars

Total Brands

Recently Added Cars

Also provide navigation to:

Dashboard

Manage Cars

Add Car

Logout

Keep the dashboard clean and simple.

9. Manage Cars

Create an Admin page called Manage Cars.

Display all cars in a table.

Columns:

Image

Car Name

Brand

Price

Fuel Type

Transmission

Actions

Actions:

Edit

Admin can edit the car information.

Delete

Admin can delete a car.

Before deleting, show a confirmation message:

"Are you sure you want to delete this car?"

10. Add Car

Create an Add Car form.

Fields:

Car Name

Brand

Price

Mileage

Fuel Type

Transmission

Engine

Seating Capacity

Horsepower

Description

Car Image URL

Add an Add Car button.

After adding the car:

Show a success message

Add the car to the car list

Make it immediately visible on the Cars page

11. Edit Car

Admin should be able to click Edit and modify:

Car Name

Brand

Price

Mileage

Fuel Type

Transmission

Engine

Seating Capacity

Horsepower

Description

Image URL

After saving:

Show success message

Update the car everywhere on the website

12. LocalStorage

Since there is no backend or database:

Use LocalStorage to store:

Car data

Added cars

Edited cars

Deleted cars

Comparison selections if necessary

When the website is refreshed, admin changes should remain.

If there is no saved data in LocalStorage, load the default 10–12 sample cars.

13. Sample Cars

Add around 10–12 cars from different brands.

For example:

BMW 3 Series

Mercedes-Benz C-Class

Audi A4

Toyota Fortuner

Honda City

Hyundai Creta

Tata Nexon

Mahindra XUV700

Kia Seltos

Volkswagen Virtus

Tata Harrier

Mahindra Thar

Use realistic sample specifications.

14. Contact Page

Create a simple contact form:

Name

Email

Subject

Message

Submit button

Because this is a static website, the form does not need to send an actual email.

After submission, show:

"Thank you! Your message has been submitted successfully."

15. About Page

Add a simple explanation:

CarVerse is a car showcase and comparison platform that helps users explore different cars, view their specifications, and compare multiple cars in one place.

Mention that the project provides:

Car browsing

Car comparison

Search and filters

Admin car management

16. Design

Use a modern automotive design.

Requirements:

Clean UI

Professional appearance

Responsive design

Modern car cards

Rounded corners

Smooth hover effects

Simple animations

Good spacing

Attractive typography

Mobile-friendly navigation

Light/Dark mode if easy to implement

Do not make the design unnecessarily complicated.

17. Important Project Rules

This is a static college project.

Therefore:

Do NOT create a backend.

Do NOT create a database.

Do NOT use MongoDB.

Do NOT use Express.

Do NOT use complicated authentication.

Do NOT require paid APIs.

Use LocalStorage for admin data management.

Keep the code simple and understandable.

The Admin Panel should actually work with the frontend.

For example:

Admin adds car → car appears on Cars page.

Admin edits car → updated information appears everywhere.

Admin deletes car → car disappears from Cars page.

18. Final Testing

Before completing the project, test all functionality:

User

Home page works

Navigation works

Search works

Filters work

Car details work

Compare cars works

Contact form works

Admin

Admin login works

Dashboard works

Add car works

Edit car works

Delete car works

LocalStorage works

Logout works

Make sure there are no broken buttons, routes, images, or console errors.

The final website should look like a professional but simple final-year college project and should be easy for a student to explain during a viva.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4712e3c1-f8d8-485b-bec6-20c2aab23423).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
