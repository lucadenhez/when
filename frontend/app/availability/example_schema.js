const example_schema = {
  "availableDays": [
    {
      "day": "10-18-2025",
      "people": [
        {
          "firstName": "Luca",
          "lastName": "Denhez",
          "availabileTimes": [
            "0715-1230",
            "1545-2400"
          ]
        }
      ]
    },
    {
      "day": "10-19-2025",
      "people": [
        {
          "firstName": "Luca",
          "lastName": "Denhez",
          "availabileTimes": [
            "0715-1230",
            "1545-1700",
            "0000-"
          ]
        }
      ]
    }
  ]
};

const event = {
  "schema": example_schema,
  "numPeople": 5,
  "eventData": {
    
  }
}

export default example_schema;
