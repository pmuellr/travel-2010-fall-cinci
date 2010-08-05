#!/usr/bin/env python

# http://code.google.com/apis/maps/documentation/staticmaps/

import os
import re
import sys
import urllib
import xml.dom.minidom

#--------------------------------------------------------------------------
PROGRAM   = os.path.basename(sys.argv[0])

#--------------------------------------------------------------------------
def log(message=None):
    if not message:
        print
    else:
        print "%s: %s" % (PROGRAM, message)

#--------------------------------------------------------------------------
def error(message):
    log(message)
    sys.exit()
    
#--------------------------------------------------------------------------
class MapSet:

    #--------------------------------------------------------------------------
    @staticmethod
    def read(iFileName):
        iFile = open(iFileName)
        lines = iFile.readlines()
        iFile.close()

        mapSet      = None
        map         = None
        mapName     = None
        placesTable = None
        
        for line in lines:
            origLine = line
            line = line.strip()
            if line.startswith("#"): continue
            
            words = line.split()
            if len(words) <= 1: continue
            
            directive  = words[0]
            arg        = words[1]
            args       = words[1:]
            argsString = " ".join(args)
            
            if   directive == "url":
                if mapSet: error("only one url allowed")
                mapSet = MapSet(arg)
                placesTable = mapSet.placesTable
                
            elif directive == "map":
                if not mapSet: error("no url set")
                map = Map(argsString)
                mapSet.maps.append(map)

            elif directive == "place":
                if not map: error("no map set")

                mapPlace = placesTable.get(argsString)
                map.places.append(mapPlace)
                
            else:
                error("unable to process line '%s'" % origLine)
                
        if not mapSet:
            error("no url set")
            
        return mapSet
    
    #--------------------------------------------------------------------------
    def __init__(self, url):
        self.url         = url
        self.maps        = []
        self.placesTable = PlacesTable(url)

#--------------------------------------------------------------------------
class MapPlace:

    #--------------------------------------------------------------------------
    def __init__(self, name, coord):
        self.name   = name
        self.coord  = coord

#--------------------------------------------------------------------------
class Map:
    
    #--------------------------------------------------------------------------
    def __init__(self, name, places=None):
        if not places: places = []
        
        self.id     = "-".join(name.split())
        self.name   = name
        self.places = places
        
#--------------------------------------------------------------------------
class PlacesTable:
    
    #--------------------------------------------------------------------------
    def __init__(self, url):
        self.map = {}
        
        print "retrieving Google Map"
        iFile = urllib.urlopen(url)
        contents = iFile.read()
        iFile.close()
        
        doc = xml.dom.minidom.parseString(contents)
        
        placemarkDOMs = doc.getElementsByTagName("Placemark")
        
        for placemarkDOM in placemarkDOMs:
            name         = placemarkDOM.getElementsByTagName("name")
            coordinates  = placemarkDOM.getElementsByTagName("coordinates")
            extendedData = placemarkDOM.getElementsByTagName("ExtendedData")
            
            if extendedData: continue

            if not name:        error("no name for placemark")
            if not coordinates: error("no coordinates for placemark %s" % name)
        
            name        = self._getNodeText(name[0])
            coordinates = self._getNodeText(coordinates[0])
            
            coordinates = coordinates.split(",")[0:2]
            coordinates = "%s,%s" % (coordinates[1], coordinates[0])
            
            place = MapPlace(name, coordinates)
            self.map[name] = place
        
    #--------------------------------------------------------------------------
    def get(self, name):
        if name not in self.map: error("name not found in Google map: '%s'" % name)
        
        return self.map[name]
        
    #--------------------------------------------------------------------------
    def _getNodeText(self, node):
        if node.nodeType == xml.dom.Node.TEXT_NODE:          return node.nodeValue
        if node.nodeType == xml.dom.Node.CDATA_SECTION_NODE: return node.nodeValue

        if node.nodeType != xml.dom.Node.ELEMENT_NODE: return ""

        text = ""
        for node in node.childNodes:
            text += self._getNodeText(node)

        return text


#--------------------------------------------------------------------------
        
#--------------------------------------------------------------------------
if len(sys.argv) < 3:
    error("parameters: inputFile outDir")
    
iFileName     = sys.argv[1]
oFilePath     = sys.argv[2]
oDirImageName = sys.argv[2]

mapSet      = MapSet.read(iFileName)

indexTxt = ""

for map in mapSet.maps:
    print "processing map %s" % (map.name)

    indexTxt += "html: gmap-%s.html %s\n" % (map.id, map.name)
    
    htmlFileName = os.path.join(oFilePath, "gmap-%s.html" % map.id)
    imgFileName  = os.path.join(oDirImageName, "gmap-%s.png" % map.id)

    html = "<img style='clear:both' class='map-image' src='gmap-%s.png' height='640' width='640'>\n" % map.id
    html += "<ul class='map-legend'>\n"
    
    url = "http://maps.google.com/maps/api/staticmap?size=640x640&maptype=roadmap&sensor=false"
    
    for i in range(len(map.places)):
        place  = map.places[i]
        marker = chr(i + ord("A"))
        
        html += "<li class='map-legend-item'><span class='map-marker-id'>%s</span> <span class='map-marker-text'>%s</span>\n" % (marker, place.name)
        url  += "&markers=color:red|label:" + marker + "|" + place.coord
    
    html += "</ul>\n"

    if os.path.exists(htmlFileName):
        origFile = open(htmlFileName)
        origFileContents = origFile.read()
        origFile.close()
        
        if html == origFileContents: 
            print "   no change:  %s" % imgFileName
            continue
        
    print "   retrieving: %s" % imgFileName
    urllib.urlretrieve(url, imgFileName)
        
    oFile = open(htmlFileName, "w")
    oFile.write(html)
    oFile.close()    

oFile = open(os.path.join(oFilePath, "index.txt"), "w")
oFile.write(indexTxt)
oFile.close()

if not True:
    print "mapSet: "
    print "   url: '%s'" % mapSet.url
    print

    for map in mapSet.maps:
        print "map id:%s name:%s" % (map.id, map.name)
        print "   places:"
    
        for place in map.places:
            print "   %s - %s - %s" % (str(place.marker), str(place.coord), place.name)
        
        print
        