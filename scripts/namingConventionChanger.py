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

    # function_names = re.findall(r'function\s+(\w+)', content)
    # # print(function_names)
    # for function_name in function_names:
    #     if(function_name[0] != '_'):
    #         replaceBy = mixed_case(function_name)
    #         for path in paths:
    #             for root, dirs, files in os.walk(path):
    #                 for file in files:
    #                     file_path = os.path.join(root, file)
    #                     if(file_path.endswith('.sol') or file_path.endswith('.js') or file_path.endswith('.ts')):
    #                         with open(file_path, 'r') as fi:
    #                             content = fi.read()
    #                         content = re.sub(r'\b' + f'{function_name}' + r'\b', replaceBy, content)
    #                         with open(file_path, 'w') as fi:
    #                             fi.write(content)

    # variable_names = re.findall(r'(\b(uint|uint8|uint32|uint24|int|int128|int256|address|address \[\]|bool|string|memory|storage|uint256|uint256 \[\]|uint160|bytes|bytes4|bytes32|bytes8|VaultActionData|Wallet|VestingStruct|DiamondStorage|ThresholdData|Poll|StakeInfo|DonationsReceived|DaoSetup|Balance|Withdraw|YieldVault|PairInfo|DonationMatchData|AllianceMember|Profile|Duration|MerkleRootResponse|ContributorInfo|dist_schedule|StakingState|FacetAddressAndPosition|DetailsResponse|BalanceInfo|BuildDonationMessage|Strategy|TokenInfo|UpdateFeeRequest|Pair|MessageInfo|Expiration|DonationMatch|DonationDetailsResponse|EndowmentEntry|GenericBalance|InstantiateRequest|Member|VaultAddRequest|Transaction|EndowmentId|AccountStrategies|VoterInfo|SettingsController|DurationData|CurveType|StateResponseMessage|EndowmentDetailsResponse|QueryConfigResponse|Delegate|Deposit|CurveTypeData|UpdateConfigMessage|Point|AssetInfo|DepositMsg|BeneficiaryData|ConfigResponse|Facet|LockedBalance|UpdateEndowmentDetailsRequest|Beneficiary|UpdateEndowmentSettingsRequest|SplitDetails|DaoToken|ExecuteData|OneOffVaults|InstantiateMsg|createUniswapPoolERC20Args|AcceptedTokens|data|Cw20CoinVerified|ClaimConfig|CollectParams|CreateMsg|StrategyComponent|SettingsPermission|ProfileResponse|DecreaseLiquidityParams|claimInfo|Cw20ReceiveMsg|Ibc|AllowanceData|EndowmentBalanceResponse|Campaign|SocialMedialUrls|AssetBase|MintParams|RebalanceDetails|UpdateProfileRequest|UpdateEndowmentStatusRequest|DepositRequest|ExpirationData|UpdateEndowmentFeeRequest|InstantiateMessage|StakerInfo|_State|CreateEndowmentRequest|FacetFunctionSelectors|IncreaseLiquidityParams|Coin|CharityApplicationProposal|AllianceMemberResponse|StakerInfoResponse|Threshold|ListResponse|createUniswapPoolArgs|EndowmentFee|EndowmentState|Endowment|should|FacetCut|State|Config|DonationMessages|Asset|Categories|UpdateConfigRequest|MinterData|IndexFund|TokenManager|DaoTokenData|UpdateEndowmentControllerRequest|EndowmentListResponse|NetworkInfo|StateResponse)\b)\s+(\w+)', content)
    variable_names = re.findall(r'\b(uint|uint8|uint32|uint24|int|int128|int256|address|address \[\]|bool|string|memory|storage|uint256|uint256 \[\]|uint160|bytes|bytes4|bytes32|bytes8|VaultActionData|Wallet|VestingStruct|DiamondStorage|ThresholdData|Poll|StakeInfo|DonationsReceived|DaoSetup|Balance|Withdraw|YieldVault|PairInfo|DonationMatchData|AllianceMember|Profile|Duration|MerkleRootResponse|ContributorInfo|dist_schedule|StakingState|FacetAddressAndPosition|DetailsResponse|BalanceInfo|BuildDonationMessage|Strategy|TokenInfo|UpdateFeeRequest|Pair|MessageInfo|Expiration|DonationMatch|DonationDetailsResponse|EndowmentEntry|GenericBalance|InstantiateRequest|Member|VaultAddRequest|Transaction|EndowmentId|AccountStrategies|VoterInfo|SettingsController|DurationData|CurveType|StateResponseMessage|EndowmentDetailsResponse|QueryConfigResponse|Delegate|Deposit|CurveTypeData|UpdateConfigMessage|Point|AssetInfo|DepositMsg|BeneficiaryData|ConfigResponse|Facet|LockedBalance|UpdateEndowmentDetailsRequest|Beneficiary|UpdateEndowmentSettingsRequest|SplitDetails|DaoToken|ExecuteData|OneOffVaults|InstantiateMsg|createUniswapPoolERC20Args|AcceptedTokens|data|Cw20CoinVerified|ClaimConfig|CollectParams|CreateMsg|StrategyComponent|SettingsPermission|ProfileResponse|DecreaseLiquidityParams|claimInfo|Cw20ReceiveMsg|Ibc|AllowanceData|EndowmentBalanceResponse|Campaign|SocialMedialUrls|AssetBase|MintParams|RebalanceDetails|UpdateProfileRequest|UpdateEndowmentStatusRequest|DepositRequest|ExpirationData|UpdateEndowmentFeeRequest|InstantiateMessage|StakerInfo|_State|CreateEndowmentRequest|FacetFunctionSelectors|IncreaseLiquidityParams|Coin|CharityApplicationProposal|AllianceMemberResponse|StakerInfoResponse|Threshold|ListResponse|createUniswapPoolArgs|EndowmentFee|EndowmentState|Endowment|should|FacetCut|State|Config|DonationMessages|Asset|Categories|UpdateConfigRequest|MinterData|IndexFund|TokenManager|DaoTokenData|UpdateEndowmentControllerRequest|EndowmentListResponse|NetworkInfo|StateResponse)\b\s+(\w+)', content)
    variable_names = re.findall(r'\b(memory)\b\s+(\w+)', content)
    print(variable_names)
    # for variable_name in variable_names:
    #     # print(variable_name)
    #     replaceBy = mixed_case(variable_name[1])
    #     if('_' in variable_name[1]):
    #         print(variable_name[1], replaceBy)
    #         for path in paths:
    #             for root, dirs, files in os.walk(path):
    #                 for file in files:
    #                     file_path = os.path.join(root, file)
    #                     if(file_path.endswith('.sol') or file_path.endswith('.js') or file_path.endswith('.ts')):
    #                         with open(file_path, 'r') as fi:
    #                             content = fi.read()
    #                         content = re.sub(r'\b' + f'{variable_name[1]}' + r'\b', replaceBy, content)
    #                         with open(file_path, 'w') as fi:
    #                             fi.write(content)

setOfStructs = set()
def add_all_structs(file_path):
    with open(file_path, 'r') as f:
        content = f.read()
    
    struct_names = re.findall(r'(\b(struct)\b)\s+(\w+)', content)
    for struct_name in struct_names:
        setOfStructs.add(struct_name[2])

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


def run_script_on_all_files_struct():
    path = os.getcwd() + '/contracts' # path to the contracts folder
    print(path)
    global globalPath
    globalPath = path
    for root, dirs, files in os.walk(path):
        for file in files:
            file_path = os.path.join(root, file)
            if(file_path.endswith('.sol')):
                print(file_path)
                add_all_structs(file_path)

    # iterate over setOfStructs
    arr = []
    for struct in setOfStructs:
        print(struct, end='|')

if __name__ == '__main__':
    run_script_on_all_files()