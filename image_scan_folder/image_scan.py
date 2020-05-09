import sys
from nudenet import NudeClassifier

classifier = NudeClassifier()

#classifier.classify(sys.argv[1])

#need to import tensorflow

#use python shell module so we can include packages
print("Output from Python")
print("print:" + sys.argv[0])
#print(classifier.classify(sys.argv[1]))
#print("image is : " + {'path_to_nude_image': {'safe': 5.8822202e-08, 'unsafe': 1.0}})