#!/bin/sh

# turn logging on
set -x;
# Shuttle `tasks/index.ts` file to temp file before cleaning/compiling starts
mv -n ./tasks/index.ts ./tasks/temp_index.ts && touch ./tasks/index.ts;
# Clean if necessary
if [ "$1" == "clean" ]; then
    hardhat clean;
fi
# Compile all contracts
hardhat compile;
compile_result=$?;
# Shuttle `tasks/index.ts` file from temp file to orig location after cleaning/compiling ends
# Run regardless of above line's failure or sucesss
mv ./tasks/temp_index.ts ./tasks/index.ts;
# turn logging off
set +x;
# force the script to fail if the compilation step failed
if [ $compile_result -eq 1 ]; then
    exit 1;
fi
