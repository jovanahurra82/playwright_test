import { test, expect } from '../tests/fixtures.ts'; // Import your custom fixture


// Test data
const testList = [
    { age: "100", name: "Vera", grade: "A" },
    { age: "5", name: "Јелена", grade: "A" },
    { age: "15", name: "Jovana", grade: "B" },
    { age: "25", name: "Ćirjaković", grade: "C" },
    { age: "75", name: "Robert", grade: "D" }
  ];
  
  testList.forEach(({ age, name, grade }) => {
    test(`Create student ${name} using API with parameterization`, async ({ apiContext }) => {
      // Define the student object
      const student = { age, name, grade };
  
      // POST request to create the student
      const response = await apiContext.post('/student', { data: student });
      expect(response.ok()).toBeTruthy();
  
      const responseJson = await response.json();
      const studentId = responseJson.student_id;
  
      // GET request to retrieve the newly created student
      const responseGet = await apiContext.get(`/student/${studentId}`);
      expect(responseGet.ok()).toBeTruthy();
  
      const responseGetJson = await responseGet.json();
  
      // Validate that the student data matches the input
      expect(responseGetJson.age).toBe(student.age);
      expect(responseGetJson.name).toBe(student.name);
      expect(responseGetJson.grade).toBe(student.grade);
    });
  });
  