import { test, expect } from '../tests/newFixture.ts';

test('Verify the student created by the fixturelele', async ({ student, apiContext }) => {
  // Fetch the created student by ID
  const response = await apiContext.get(`/student/${student.id}`);
  const fetchedStudent = await response.json();
  console.log(student)
  console.log(fetchedStudent)

  // Validate the student's details
  expect(fetchedStudent.name).toBe(student.name);
  expect(fetchedStudent.age).toBe(student.age);
  expect(fetchedStudent.grade).toBe(student.grade);
});
