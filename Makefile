MAP_URL = "http://maps.google.com/maps/ms?ie=UTF8&hl=en&msa=0&msid=108326935329561862806.00047ac545e3e3f11376f&vps=1&jsv=215d&output=kml"

all: index.manifest

index.manifest: *.html *.py images/* scripts/* styles/* content/* content/maps/* content/maps/google/*
	python build-maps.py content/maps/google/index-map.txt images
	python build.py

cont:
	run-when-changed make *
	# run-when-changed available at: http://gist.github.com/240922

tail:
	tail -f /var/log/apache2/access_log /var/log/apache2/error_log

clean:
	rm index.manifest
	rm content/maps/google/*.html
	rm content/maps/google/index.txt
	rm images/gmap-*.png

upload:
	rsync \
		--progress \
		--recursive \
		--perms \
		--owner \
		--group \
		--times \
		--rsh ssh \
		--exclude '.*' \
		. \
		"pmuellr@muellerware.org:/home/pmuellr/web/public/travel/2010-fall-cinci"

help:
	@echo "make [nothing] - same as 'make all'"
	@echo "make all       - build main program"
	@echo "make cont      - build continuous (main)"
	@echo "make tail      - continuous tail of apache logs"
	@echo "make clean     - remove cruft"
