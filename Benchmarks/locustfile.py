from locust import HttpUser, task, between

class ApiUser(HttpUser):
    wait_time = between(1, 2)
    host = "http://localhost:8000"

    @task(1)
    def get_friends(self):
        token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU4Mzg3ODYzLCJpYXQiOjE3NTgzODc1NjMsImp0aSI6IjYwMmFiMjVhNDg2OTQ2MjBhNjYyMmEwMDE1YjE3Y2RjIiwidXNlcl9pZCI6NDksInVzZXJuYW1lIjoidGVzdF91c2VyIn0.xGGgJ2FFoAo0YY67T16-3pqu3Joa9mCzdD7nvT2sdro"
        self.client.get("/users/friends/", headers={"Content-Type": "application/json", "Authorization": f"Bearer {token}"})
