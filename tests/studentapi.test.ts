import {  test, request, APIRequestContext, expect } from '@playwright/test';

let apiContext: APIRequestContext;

test.beforeAll('Setup api context', async () => {
    apiContext = await request.newContext({
        baseURL: 'https://test-379574553568.us-central1.run.app',
        extraHTTPHeaders: {
            'api_key': 'nyttlosen',
            'Content-type': 'application/json'
        }
    })
})

const testList = [
    {age: "100", name: "Vera", grade: "A"},
    {age: "5", name: "Јелена", grade: "A"},
    {age: "15", name: "Jovana", grade: "B"},
    {age: "25", name: "Ćirjaković", grade: "C"},
    {age: "75", name: "Robert", grade: "D"}
]

testList.forEach(({age, name, grade}) => {
    test(`Create student ${name} using API with params`, async () => {
        const student = {
            age: age,
            grade: grade,
            name: name
        }
        console.log(age, name, grade)
        // Create new student using POST
        const response = await apiContext.post("/student", {data: student});
        const responseJson = await response.json()   
        const studentId = responseJson.student_id;
        // GET newly created student by ID
    
        const responseGet = await apiContext.get(`/student/${studentId}`)
        const responseGetJson = await responseGet.json();
    
        //Verify student that is created has the expected age
        expect(responseGetJson.age, 'Age should be equal').toBe(student.age)
        expect(responseGetJson.name, 'Name should be equal').toBe(student.name)
        expect(responseGetJson.grade, 'Grade should be equal').toBe(student.grade)
    })
})


// Create new student using POST
test('Update existing student using API', async () => {
     // Create a new student first
     const student = {
        "name": "John Doe",
        "age": 20,
        "grade": "A"
    }
    // Create new student using POST
    const response = await apiContext.post("/student", {data: student});
    const responseJson = await response.json()   
    const studentId = responseJson.student_id;
    // Update the student's details
    const updatedStudent = {
        "name": "Jovana Hurra",
        "age": 35,
        "grade": "A"
    };
    const updateResponse = await apiContext.put(`/student/${studentId}`);
    //expect(updateResponse.status()).toBe(200); // Verify status code for successful update

    const updateResponseJson = await updateResponse.json();
    expect(updateResponseJson.name, 'Name should be equal').toBe(updatedStudent.name);
    expect(updateResponseJson.age,'Age should be equal').toBe(updatedStudent.age);
    expect(updateResponseJson.grade, 'Grade should be equal').toBe(updatedStudent.grade);
    
})