DIR := ${CURDIR}

ifndef VERSION
override VERSION = latest
endif

fndef REGISTRY
override REGISTRY = yazilimvip
endif

ifndef APPNAME
override APPNAME = p2g-console
endif


################################
# Building Images
################################
# Build Application Base Docker Image
buildbase:
	@echo Start Building App Base Image\n
	docker build -f Dockerfile.base -t $(REGISTRY)/$(APPNAME)-base:$(VERSION) .

# Build Application Docker Image
buildapp:
	@echo Start Building App Base Image\n
	docker build -f Dockerfile.app -t $(REGISTRY)/$(APPNAME)-nodejs:$(VERSION) .


################################
# Running Container
################################
# To run app temprarily
run: buildapp
	docker run -p 3000:3000 -it --rm $(REGISTRY)/$(APPNAME)-nodejs:$(VERSION)

# To build and run app temprarily
brun: buildbase run


################################
# Push
################################

pushbase:
	docker push $(REGISTRY)/$(APPNAME)-base:$(VERSION)

pushapp:
	docker push $(REGISTRY)/$(APPNAME)-nodejs:$(VERSION)

bpushbase: buildbase pushbase

bpushapp: buildapp pushapp
