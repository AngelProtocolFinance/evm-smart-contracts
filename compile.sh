#!/bin/sh

# turn logging on
set -x;
# Shuttle `tasks/index.ts` file to temp file before cleaning/compiling starts
mv -n ./tasks/index.ts ./tasks/temp_index.ts && touch ./tasks/index.ts;
# Clean if necessary.
if [ "$1" == "clean" ]; then
    hardhat clean;
fi
# Compile all contracts
hardhat compile;
# Shuttle `tasks/index.ts` file from temp file to orig location after cleaning/compiling ends
# Run regardless of above line's failure or sucesss
mv ./tasks/temp_index.ts ./tasks/index.ts;
# turn logging off
set +x;
