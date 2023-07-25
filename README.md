# DataTable
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Description

DataTable is an advanced and lightweight data table developed using vanilla JavaScript. It provides a robust and feature-rich solution for efficiently displaying, sorting, filtering, and manipulating large datasets. Whether you need to showcase simple data or manage complex datasets, DataTable has got you covered.

## Key Features

- Lightweight and efficient.
- Fully customizable and responsive design.
- Sorting data by multiple columns.
- Pagination support for better data organization.
- Searching and filtering data.
- Smart rendering for improved performance with large datasets.
- Support for various data formats (JSON, CSV, etc.).
- Easily extendable and customizable through plugins and extensions.

## Demo

To see DataTable in action, check out our [live demo](https://tools.jahidh.com/datatable#datatable_examples).

## Installation

You can start using it with CDN

```html
<link href="https://cdn.jsdelivr.net/gh/jahiidh/datatable/datatable.min.css" rel="stylesheet"/>
```

```html
<script src="https://cdn.jsdelivr.net/gh/jahiidh/datatable/datatable.min.js"></script>
```

```html
<table id="example" style="display: none">
  <thead>
    <tr>
      <th>Name</th>
      <th>Age</th>
      <th>Email</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>John Doe</td>
      <td>25</td>
      <td>john@example.com</td>
    </tr>
    ....
  </tbody>
</table>
```

```javascript
new DataTable("#example", {
  themeClass: "default",
  limit: [10, 20, 50, 100],
  current_limit: 10,
  pagination: true,
});
```

If you have any sugestion or complain, you can let me know from [here]('https://jahidh.com/contact')

Enjoy using it. Have a good day.
