IMAGE_BASE=localhost/etcd-env-adapter
IMAGE=${IMAGE_BASE}:latest

build:
	docker build -t ${IMAGE} -f Dockerfile.dev .

run: build
	docker run -it --rm \
		-p 8080:8080 \
		-p 8081:2379 \
		-e PORT=8080 \
		-e ETCD_URI=http://localhost:2379 \
		${IMAGE}

shell: build
	docker run -it --rm ${IMAGE} bash

exec:
	docker exec -it $$(docker ps | grep ${IMAGE_BASE} | cut -d ' ' -f 1) /bin/bash

