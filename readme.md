### Description

This is test application built on Node.js with the help of Express framework, which consists of two tasks. 

##### JSON template for converter:
If you would like to set new units in converter (first link) you have to upload JSON file. In `unit` you have to write the name of unit and in `toCm` you have to write how many centimeters the entered value is equal to. The downloaded file is temporarily saved in the **uploads** directory. 
- First example:
`[
  {
    "unit": "mm",
    "toCm": 0.1
  },
  {
    "unit": "km",
    "toCm": 100000
  }
]
`
- Second example:
`[
  {
    "unit": "yd",
    "toCm": 91.44
  }
]
`

##### Rectangle sorting algorithm is descibed in "/testApp/utils/rectangleSorter/rectangleSorter.js"
