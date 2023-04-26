import re
import sys
import os

def mixed_case(name):
    words = []
    cur = ""
    for c in name:
        if(c == '_'):
            if(len(cur) > 0):
                words.append(cur)
                cur = ""
            continue
        if(len(cur) == 0):
            cur += c
        elif(c.isupper()):
            if(len(cur) > 1):
                if(cur[1].islower() or cur[0].islower()):
                    words.append(cur)
                    cur = c
                else:
                    cur += c
            else:
                cur += c
        else:
            if(len(cur) > 1):
                if(cur[1].isupper()):
                    words.append(cur[0:-1])
                    cur = cur[-1] + c
                else:
                    cur += c
            else:
                cur += c
    if(len(cur) > 0):
        words.append(cur)
    words = [word.lower() for word in words]
    words = [word if index == 0 else word.capitalize() for index, word in enumerate(words)]

    ans = ''.join(words)
    if(name[0] == '_' or name[-1] == '_'):
        ans = 'cur' + ans.capitalize()
    return ans

globalPath = ''

def convert_solidity_file(file_path):
    global globalPath
    with open(file_path, 'r') as f:
        content = f.read()
    
    paths = []
    paths.append(os.getcwd() + '/contracts')
    paths.append(os.getcwd() + '/test')
    paths.append(os.getcwd() + '/scripts')
    paths.append(os.getcwd() + '/config')

    event_names = re.findall(r'event\s+(\w+)', content)
    # print(event_names)
    for event_name in event_names:
        replaceBy = event_name
        # capitalize first char of replaceBy

        if(replaceBy[0] >= 'a' and replaceBy[0] <= 'z'):
            replaceBy = replaceBy[0].upper() + replaceBy[1:]
        for path in paths:
            for root, dirs, files in os.walk(path):
                for file in files:
                    file_path = os.path.join(root, file)
                    if(file_path.endswith('.sol') or file_path.endswith('.js') or file_path.endswith('.ts')):
                        with open(file_path, 'r') as fi:
                            content = fi.read()
                        content = re.sub(r'\b' + f'{event_name}' + r'\b', replaceBy, content)
                        with open(file_path, 'w') as fi:
                            fi.write(content)
    
    # with open(file_path, 'w') as f:
    #     f.write(content)

def run_script_on_all_files():
    path = os.getcwd() + '/contracts' # path to the contracts folder
    print(path)
    global globalPath
    globalPath = path
    for root, dirs, files in os.walk(path):
        for file in files:
            file_path = os.path.join(root, file)
            if(file_path.endswith('.sol')):
                print(file_path)
                convert_solidity_file(file_path)


if __name__ == '__main__':
    run_script_on_all_files()