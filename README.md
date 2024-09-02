Build

docker build --platform linux/amd64 -t remote-compiler:test .

Run

docker run --platform linux/amd64 -p 9000:8080 remote-compiler:test
