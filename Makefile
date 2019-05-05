DIR := ${CURDIR}

ifndef TAG
override TAG = latest
endif


################################
# Building Images
################################
# Build Application Base Docker Image
buildbase:
	@echo Start Building App Base Image\n
	docker build -f Dockerfile.base -t yazilimvip/syncify-base:$(TAG) .

# Build Application Docker Image
buildapp:
	@echo Start Building App Base Image\n
	docker build -f Dockerfile -t maemresen/syncify:$(TAG) .


################################
# Running Container
################################
# To run app temprarily
run: buildapp
	docker run -p 3000:3000 -it --rm maemresen/syncify:$(TAG)

# To build and run app temprarily
brun: buildbase run

