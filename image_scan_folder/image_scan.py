import sys, json
import fileinput
from nudenet import NudeClassifier

# for line in fileinput.input():
#     input +=line
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