import {request, test as setup} from '@playwright/test'

setup('Clean up database', async () => {
    const apiContext = await request.newContext({
        baseURL: 'https://test-379574553568.us-central1.run.app',
        extraHTTPHeaders: {
          'api_key': 'jovanafixture',
          'content-type': 'application/json',
        },
      });
      await apiContext.delete('/student_delete_all')
})