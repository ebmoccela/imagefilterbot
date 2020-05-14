import sys, json
from nudenet import NudeClassifier

classifier = NudeClassifier()

def read_in():
    lines = sys.stdin.readlines()
    return json.loads(lines[0])



def main():
    lines = read_in()
    url = "".join(lines)
    if url.endswith('/n'):
        url = url[:-2]
    classifier.classify(url)
    print(classifier.classify(url))
    #constanprint({'path_to_nude_image': {'safe': , 'unsafe': }})

if __name__ == '__main__':
    main()
#classifier = NudeClassifier()

#classifier.classify(sys.argv[1])

#need to import tensorflow

#use python shell module so we can include packages
# print("Output from Python")
# print("print:" + sys.argv[0])
#print(classifier.classify(sys.argv[1]))
#print("image is : " + {'path_to_nude_image': {'safe': 5.8822202e-08, 'unsafe': 1.0}})